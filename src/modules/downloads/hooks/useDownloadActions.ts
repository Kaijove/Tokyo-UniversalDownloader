import { useCallback } from 'react';
import { engineBus } from '@/core/engine';
import { stopDownload, openPath } from '../services/downloads.service';
import { useDownloadsStore } from '../stores/downloads.store';
import type { DownloadItem } from '../types/download.types';

/**
 * Central hook exposing every card action, each wired to the engine. UI
 * components call these — they never talk to the provider or store transitions
 * directly. Pause and cancel kill the process; resume and retry re-enqueue so
 * the scheduler picks the item up again (yt-dlp `--continue` resumes partials).
 */
export function useDownloadActions() {
  const enqueue = useDownloadsStore((s) => s.enqueue);
  const setPaused = useDownloadsStore((s) => s.setPaused);
  const setCancelled = useDownloadsStore((s) => s.setCancelled);
  const remove = useDownloadsStore((s) => s.remove);

  const pause = useCallback(
    async (item: DownloadItem) => {
      // Mark the state before killing the process: the queue's catch handler
      // checks for `paused` to suppress an unwanted retry, and the kill causes
      // that catch to fire, so the flag must be set first to avoid a race.
      setPaused(item.id);
      engineBus.emit('DownloadPaused', { id: item.id });
      await stopDownload(item.id);
    },
    [setPaused],
  );

  const resume = useCallback(
    (item: DownloadItem) => {
      if (!item.outputDir) return;
      enqueue(item.id, item.outputDir);
      engineBus.emit('DownloadResumed', { id: item.id });
    },
    [enqueue],
  );

  const cancel = useCallback(
    async (item: DownloadItem) => {
      // Same ordering as pause: set the terminal state before the kill so the
      // queue doesn't see a bare process death and try to retry it.
      setCancelled(item.id);
      engineBus.emit('DownloadCancelled', { id: item.id });
      await stopDownload(item.id);
    },
    [setCancelled],
  );

  const retry = useCallback(
    (item: DownloadItem) => {
      if (!item.outputDir) return;
      enqueue(item.id, item.outputDir);
      engineBus.emit('RetryStarted', { id: item.id, attempt: 1 });
    },
    [enqueue],
  );

  const openFolder = useCallback(async (item: DownloadItem) => {
    if (item.outputDir) await openPath(item.outputDir);
  }, []);

  const openFile = useCallback(async (item: DownloadItem) => {
    if (item.filePath) await openPath(item.filePath);
    else if (item.outputDir) await openPath(item.outputDir);
  }, []);

  const copyUrl = useCallback((item: DownloadItem) => {
    void navigator.clipboard.writeText(item.url);
  }, []);

  const copyFilePath = useCallback((item: DownloadItem) => {
    if (item.filePath) void navigator.clipboard.writeText(item.filePath);
  }, []);

  return {
    pause,
    resume,
    cancel,
    retry,
    remove,
    openFolder,
    openFile,
    copyUrl,
    copyFilePath,
  };
}
