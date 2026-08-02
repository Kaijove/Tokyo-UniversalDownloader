import { loadPersisted, persist } from '@/core/engine/persistence/persistence';
import type { DownloadItem } from '../types/download.types';

const STORAGE_KEY = 'queue';

/** Items worth restoring after a restart: finished ones are dropped. */
function recoverable(items: DownloadItem[]): DownloadItem[] {
  return items
    .filter((it) => it.status !== 'done')
    .map((it) =>
      it.status === 'downloading'
        ? { ...it, status: 'queued' as const, progress: 0, speed: null, eta: null }
        : it,
    );
}

/** Persists the current queue to disk (best-effort). */
export async function saveQueue(items: DownloadItem[]): Promise<void> {
  await persist(STORAGE_KEY, recoverable(items));
}

/**
 * Loads the persisted queue, normalising any interrupted downloads back to
 * `queued` so the scheduler picks them up again. Returns an empty array when
 * nothing is stored.
 */
export async function loadQueue(): Promise<DownloadItem[]> {
  const stored = await loadPersisted<DownloadItem[]>(STORAGE_KEY);
  // Guard against corrupted or legacy data that isn't an array — otherwise
  // `recoverable` would throw on load and blank the app.
  if (!Array.isArray(stored)) return [];
  return recoverable(stored);
}
