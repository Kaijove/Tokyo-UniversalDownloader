import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { useDownloadsStore } from '@/modules/downloads/stores/downloads.store';
import { useDownloadActions } from '@/modules/downloads/hooks/useDownloadActions';
import { useSettingsStore } from '@/modules/settings';
import { openPath } from '@/modules/downloads/services/downloads.service';
import { log } from '../stores/log.store';

/** Actions the tray can request from the frontend. */
type TrayAction =
  | 'pause-all'
  | 'resume-all'
  | 'cancel-all'
  | 'open-folder'
  | 'history'
  | 'settings';

interface TrayBridgeOptions {
  onOpenSettings: () => void;
  onOpenHistory: () => void;
}

/**
 * Connects the native tray menu to the existing queue logic.
 *
 * Queue actions are handled here rather than in Rust because the queue, its
 * state machine and its concurrency rules already live in TypeScript —
 * reimplementing them in the tray would create a second source of truth.
 * Also keeps the tray tooltip in sync with real queue activity.
 */
export function useTrayBridge({ onOpenSettings, onOpenHistory }: TrayBridgeOptions): void {
  const items = useDownloadsStore((s) => s.items);
  const actions = useDownloadActions();

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let active = true;

    void listen<string>('tray://action', async (event) => {
      if (!active) return;
      const action = event.payload as TrayAction;
      const current = useDownloadsStore.getState().items;

      switch (action) {
        case 'pause-all':
          for (const item of current.filter((i) => i.status === 'downloading')) {
            await actions.pause(item);
          }
          log.info('app', 'Paused all downloads from the tray');
          break;
        case 'resume-all':
          for (const item of current.filter((i) => i.status === 'paused')) {
            actions.resume(item);
          }
          log.info('app', 'Resumed all downloads from the tray');
          break;
        case 'cancel-all':
          for (const item of current.filter(
            (i) => i.status === 'downloading' || i.status === 'queued',
          )) {
            await actions.cancel(item);
          }
          log.info('app', 'Cancelled all downloads from the tray');
          break;
        case 'open-folder': {
          const folder =
            useSettingsStore.getState().settings.downloads.defaultFolder ||
            current.find((i) => i.outputDir)?.outputDir;
          if (folder) await openPath(folder);
          break;
        }
        case 'history':
          onOpenHistory();
          break;
        case 'settings':
          onOpenSettings();
          break;
      }
    }).then((off) => {
      unlisten = off;
    });

    return () => {
      active = false;
      unlisten?.();
    };
  }, [actions, onOpenSettings, onOpenHistory]);

  // Keep the tray tooltip describing the real queue state. Compute the summary
  // outside the effect and depend on the string, so progress ticks (which don't
  // change the counts) don't fire an IPC call to the backend each time.
  const active = items.filter((i) => i.status === 'downloading').length;
  const queued = items.filter((i) => i.status === 'queued').length;
  const failed = items.filter((i) => i.status === 'error').length;
  const summary =
    active > 0
      ? `Universal Downloader — ${active} downloading, ${queued} queued`
      : failed > 0
        ? `Universal Downloader — ${failed} failed`
        : 'Universal Downloader — idle';

  useEffect(() => {
    void invoke('update_tray_status', { summary }).catch(() => {
      // The tray may not be available on every platform; not fatal.
    });
  }, [summary]);
}
