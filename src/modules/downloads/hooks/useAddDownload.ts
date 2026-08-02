import { useCallback, useState } from 'react';
import { AppError, sanitizeUrl } from '@/core/engine';
import { resolveMetadata } from '@/modules/metadata';
import { settingsToRankingPreferences, useSettingsStore } from '@/modules/settings';
import { useDownloadsStore } from '../stores/downloads.store';

/**
 * Handles submitting a new URL. Sanitises it, then resolves rich metadata
 * through the metadata service (cache + ranking + lifecycle events). The UI
 * never touches the provider directly. Moves the store entry to `ready` or
 * `error`, surfacing a structured message on failure.
 */
export function useAddDownload() {
  const [pending, setPending] = useState(false);
  const add = useDownloadsStore((s) => s.add);
  const setProbing = useDownloadsStore((s) => s.setProbing);
  const setReady = useDownloadsStore((s) => s.setReady);
  const setError = useDownloadsStore((s) => s.setError);

  const submit = useCallback(
    async (rawUrl: string) => {
      if (!rawUrl.trim()) return;

      let url: string;
      try {
        url = sanitizeUrl(rawUrl);
      } catch (err) {
        const id = add(rawUrl.trim());
        setError(id, err instanceof AppError ? err.message : 'Invalid URL');
        return;
      }

      const id = add(url);
      setProbing(id);
      setPending(true);

      try {
        const settings = useSettingsStore.getState().settings;
        const prefs = settingsToRankingPreferences(settings);
        const metadata = await resolveMetadata(url, id, prefs, settings.advanced.ytDlpPath);
        setReady(id, metadata);
      } catch (err) {
        const message =
          err instanceof AppError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Failed to resolve media';
        setError(id, message);
      } finally {
        setPending(false);
      }
    },
    [add, setProbing, setReady, setError],
  );

  return { submit, pending };
}
