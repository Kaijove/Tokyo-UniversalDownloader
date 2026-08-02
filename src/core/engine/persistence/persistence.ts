import { load, type Store } from '@tauri-apps/plugin-store';

const STORE_FILE = 'engine.json';

let storePromise: Promise<Store> | null = null;

/** Lazily opens (and caches) the on-disk store file. */
async function getStore(): Promise<Store> {
  if (!storePromise) {
    storePromise = load(STORE_FILE, { autoSave: false });
  }
  return storePromise;
}

/**
 * Reads a persisted value by key, or `null` if absent. Never throws: on any
 * failure it resolves to `null` so callers can fall back to defaults.
 */
export async function loadPersisted<T>(key: string): Promise<T | null> {
  try {
    const store = await getStore();
    const value = await store.get<T>(key);
    return value ?? null;
  } catch {
    return null;
  }
}

/**
 * Writes a value under a key and flushes to disk. Best-effort: failures are
 * swallowed so persistence never breaks the app flow.
 */
export async function persist<T>(key: string, value: T): Promise<void> {
  try {
    const store = await getStore();
    await store.set(key, value);
    await store.save();
  } catch {
    // Persistence is best-effort; ignore write failures.
  }
}
