import { create } from 'zustand';
import type { HistoryEntry } from './history.types';
import { engineBus } from '../events/event-bus';
import { loadPersisted, persist } from '../persistence/persistence';

const STORAGE_KEY = 'history';

interface HistoryState {
  entries: HistoryEntry[];
  /** Cap on stored entries; older ones are trimmed on insert. */
  maxEntries: number;
  /** Updates the retention limit and trims immediately. */
  setMaxEntries: (max: number) => void;
  /** Loads persisted history from disk. Call once at startup. */
  hydrate: () => Promise<void>;
  /** Records a new entry at the front and persists. */
  add: (entry: HistoryEntry) => void;
  /** Removes one entry by id and persists. */
  remove: (id: string) => void;
  /** Clears all history and persists. */
  clear: () => void;
  /** Case-insensitive search over title, uploader and URL. */
  search: (query: string) => HistoryEntry[];
}

/** Searchable, persisted history of finished downloads. */
export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: [],
  maxEntries: 500,
  setMaxEntries: (max) => {
    const entries = get().entries.slice(0, max);
    set({ maxEntries: max, entries });
    void persist(STORAGE_KEY, entries);
  },
  hydrate: async () => {
    const stored = await loadPersisted<HistoryEntry[]>(STORAGE_KEY);
    if (Array.isArray(stored)) set({ entries: stored });
  },
  add: (entry) => {
    const entries = [entry, ...get().entries].slice(0, get().maxEntries);
    set({ entries });
    void persist(STORAGE_KEY, entries);
    engineBus.emit('HistoryUpdated', { size: entries.length });
  },
  remove: (id) => {
    const entries = get().entries.filter((e) => e.id !== id);
    set({ entries });
    void persist(STORAGE_KEY, entries);
    engineBus.emit('HistoryUpdated', { size: entries.length });
  },
  clear: () => {
    set({ entries: [] });
    void persist(STORAGE_KEY, []);
    engineBus.emit('HistoryUpdated', { size: 0 });
  },
  search: (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return get().entries;
    return get().entries.filter((e) =>
      [e.title, e.uploader ?? '', e.url].some((field) => field.toLowerCase().includes(q)),
    );
  },
}));
