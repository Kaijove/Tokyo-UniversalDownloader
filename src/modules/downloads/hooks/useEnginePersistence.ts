import { useEffect } from 'react';
import { useHistoryStore } from '@/core/engine';
import { useOptionsStore } from '@/modules/advanced';
import { useSettingsStore } from '@/modules/settings';
import { useDownloadsStore } from '../stores/downloads.store';
import { loadQueue, saveQueue } from '../services/queue-persistence';

/**
 * Bootstraps engine persistence: restores the saved queue and history on
 * mount, then persists the queue on every change. Mount once at the app root.
 */
export function useEnginePersistence(): void {
  const hydrate = useDownloadsStore((s) => s.hydrate);
  const hydrateHistory = useHistoryStore((s) => s.hydrate);
  const hydrateOptions = useOptionsStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);

  useEffect(() => {
    void loadQueue().then((items) => {
      if (items.length > 0) hydrate(items);
    });
    void hydrateHistory();
    void hydrateOptions();
    void hydrateSettings();
  }, [hydrate, hydrateHistory, hydrateOptions, hydrateSettings]);

  useEffect(() => {
    const unsubscribe = useDownloadsStore.subscribe((state) => {
      void saveQueue(state.items);
    });
    return unsubscribe;
  }, []);
}
