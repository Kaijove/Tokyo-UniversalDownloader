import { useEffect } from 'react';
import { useToast } from '@/shared/components/ui';
import { engineBus } from '@/core/engine';
import { useSettingsStore } from '@/modules/settings';
import { useDownloadsStore } from '../stores/downloads.store';
import { notify } from '../services/notifications.service';

/**
 * Bridges engine events to user-facing toasts. Mount once at the app root.
 * Centralises all download notifications here rather than scattering toast
 * calls across hooks, so the set of notifications is easy to see and change.
 */
export function useEngineNotifications(): void {
  const { toast } = useToast();

  useEffect(() => {
    const titleFor = (id: string) => {
      const item = useDownloadsStore.getState().items.find((it) => it.id === id);
      return item?.info?.title ?? item?.url ?? 'Download';
    };

    const unsubscribers = [
      engineBus.on('DownloadCompleted', ({ id }) => {
        const title = titleFor(id);
        toast('Download complete', { description: title, tone: 'success' });
        if (useSettingsStore.getState().settings.notifications.onComplete) {
          void notify('Download complete', title);
        }
      }),
      engineBus.on('DownloadFailed', ({ id, error }) => {
        toast('Download failed', { description: error.message, tone: 'danger' });
        if (useSettingsStore.getState().settings.notifications.onFailure) {
          void notify('Download failed', `${titleFor(id)} — ${error.message}`);
        }
      }),
      engineBus.on('RetryStarted', () => toast('Retrying download', { tone: 'info' })),
      engineBus.on('DownloadCancelled', () => toast('Download cancelled')),
    ];
    return () => unsubscribers.forEach((off) => off());
  }, [toast]);
}
