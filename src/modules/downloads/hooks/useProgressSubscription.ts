import { useEffect } from 'react';
import { onProgress } from '../services/downloads.service';
import { useDownloadsStore } from '../stores/downloads.store';

/**
 * Subscribes once to backend progress events and routes each update into the
 * store. Mount this a single time near the app root — not per download.
 */
export function useProgressSubscription(): void {
  const setProgress = useDownloadsStore((s) => s.setProgress);

  useEffect(() => {
    let active = true;
    const unlistenPromise = onProgress((update) => {
      if (!active) return;
      setProgress(
        update.id,
        update.percent,
        update.downloadedBytes,
        update.totalBytes,
        update.speed,
        update.eta,
      );
    });

    return () => {
      active = false;
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [setProgress]);
}
