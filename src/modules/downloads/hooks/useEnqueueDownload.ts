import { useCallback } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { useSettingsStore } from '@/modules/settings';
import { useDownloadsStore } from '../stores/downloads.store';

/**
 * Returns a handler that resolves the output folder and enqueues an item.
 *
 * Uses the configured default folder when one is set and "always ask" is off;
 * otherwise it opens the folder picker. Does nothing if the picker is
 * dismissed. The queue coordinator takes over from there.
 */
export function useEnqueueDownload() {
  const enqueue = useDownloadsStore((s) => s.enqueue);

  const requestDownload = useCallback(
    async (id: string) => {
      const { defaultFolder, alwaysAsk } = useSettingsStore.getState().settings.downloads;

      if (!alwaysAsk && defaultFolder) {
        enqueue(id, defaultFolder);
        return;
      }

      const dir = await open({ directory: true, multiple: false });
      if (typeof dir === 'string') {
        enqueue(id, dir);
      }
    },
    [enqueue],
  );

  return { requestDownload };
}
