import { useEffect, useRef } from 'react';
import { engineBus, platformResolver, useHistoryStore } from '@/core/engine';
import {
  buildDownloadArgs,
  resolveOutputTemplate,
  nextRetry,
  useOptionsStore,
} from '@/modules/advanced';
import { useSettingsStore } from '@/modules/settings';
import { downloadMedia } from '../services/downloads.service';
import { useDownloadsStore } from '../stores/downloads.store';
import type { DownloadItem } from '../types/download.types';

/**
 * Coordinates the download queue. Mount once near the app root: it watches
 * store items and, while fewer than the configured concurrency limit are
 * active, promotes `queued` items to `downloading` in order.
 *
 * Each download's yt-dlp arguments are built from its effective options.
 * Transient failures are retried automatically with exponential backoff; a
 * ref of in-flight ids guards against starting the same item twice.
 */
export function useDownloadQueue(): void {
  const items = useDownloadsStore((s) => s.items);
  const setDownloading = useDownloadsStore((s) => s.setDownloading);
  const setDone = useDownloadsStore((s) => s.setDone);
  const setError = useDownloadsStore((s) => s.setError);
  const enqueue = useDownloadsStore((s) => s.enqueue);
  const addHistory = useHistoryStore((s) => s.add);
  const maxConcurrent = useOptionsStore((s) => s.defaults.maxConcurrent);
  const inFlight = useRef<Set<string>>(new Set());
  const attempts = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const activeCount = items.filter((it) => it.status === 'downloading').length;
    let freeSlots = maxConcurrent - activeCount;
    if (freeSlots <= 0) return;

    const pending = items.filter(
      (it) => it.status === 'queued' && !inFlight.current.has(it.id),
    );

    for (const item of pending) {
      if (freeSlots <= 0) break;
      if (!item.outputDir) continue;

      freeSlots -= 1;
      inFlight.current.add(item.id);
      setDownloading(item.id);
      engineBus.emit('DownloadStarted', { id: item.id });

      const options = useOptionsStore.getState().optionsFor(item.id);
      const args = buildDownloadArgs({
        ...options,
        formatId: item.selectedFormatId ?? options.formatId,
      });
      const template = resolveOutputTemplate(options);

      const { advanced } = useSettingsStore.getState().settings;

      void downloadMedia(item.id, item.url, args, template, item.outputDir, {
        ytDlpPath: advanced.ytDlpPath,
        ffmpegPath: advanced.ffmpegPath,
      })
        .then((filePath) => {
          attempts.current.delete(item.id);
          setDone(item.id, filePath);
          if (useSettingsStore.getState().settings.history.enabled) {
            recordHistory(item, 'completed', addHistory);
          }
          engineBus.emit('DownloadCompleted', { id: item.id });
        })
        .catch((err) => {
          // A process killed on purpose (pause/cancel) already has its state
          // set by the action hook — don't overwrite it or retry.
          const current = useDownloadsStore
            .getState()
            .items.find((it) => it.id === item.id);
          if (current && (current.status === 'paused' || current.status === 'cancelled')) {
            return;
          }

          const message = err instanceof Error ? err.message : 'Download failed';
          const attempt = attempts.current.get(item.id) ?? 0;
          const delay = nextRetry(attempt, message, options.retry);

          if (delay !== null && item.outputDir) {
            attempts.current.set(item.id, attempt + 1);
            engineBus.emit('RetryStarted', { id: item.id, attempt: attempt + 1 });
            window.setTimeout(() => {
              // The item may have been cancelled, paused or removed during the
              // backoff wait — re-check before resurrecting it.
              const latest = useDownloadsStore
                .getState()
                .items.find((it) => it.id === item.id);
              if (!latest || latest.status === 'cancelled' || latest.status === 'paused') {
                attempts.current.delete(item.id);
                return;
              }
              enqueue(item.id, item.outputDir as string);
            }, delay);
            return;
          }

          attempts.current.delete(item.id);
          setError(item.id, message);
          if (useSettingsStore.getState().settings.history.enabled) {
            recordHistory(item, 'failed', addHistory);
          }
          engineBus.emit('DownloadFailed', {
            id: item.id,
            error: { message, severity: 'error', timestamp: Date.now() },
          });
        })
        .finally(() => inFlight.current.delete(item.id));
    }
  }, [items, maxConcurrent, setDownloading, setDone, setError, enqueue, addHistory]);
}

/** Writes a finished download to the history store. */
function recordHistory(
  item: DownloadItem,
  status: 'completed' | 'failed',
  add: ReturnType<typeof useHistoryStore.getState>['add'],
): void {
  if (!item.outputDir) return;
  add({
    id: item.id,
    url: item.url,
    title: item.info?.title ?? item.url,
    uploader: item.info?.uploader ?? null,
    platformId: platformResolver.resolve(item.url).id,
    formatId: item.selectedFormatId,
    outputDir: item.outputDir,
    completedAt: Date.now(),
    status,
  });
}
