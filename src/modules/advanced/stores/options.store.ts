import { create } from 'zustand';
import { loadPersisted, persist } from '@/core/engine/persistence/persistence';
import type { DownloadOptions } from '../types/options.types';
import { DEFAULT_OPTIONS } from '../constants/defaults';

const STORAGE_KEY = 'download-options';

interface OptionsState {
  /** Options applied to new downloads unless overridden per item. */
  defaults: DownloadOptions;
  /** Per-download overrides, keyed by download id. */
  overrides: Record<string, DownloadOptions>;
  /** Loads persisted defaults. Call once at startup. */
  hydrate: () => Promise<void>;
  /** Updates the global defaults and persists them. */
  setDefaults: (patch: Partial<DownloadOptions>) => void;
  /** Sets or replaces the options for one download. */
  setFor: (id: string, options: DownloadOptions) => void;
  /** Merges a partial change into one download's options. */
  patchFor: (id: string, patch: Partial<DownloadOptions>) => void;
  /** Returns the effective options for a download. */
  optionsFor: (id: string) => DownloadOptions;
  /** Drops the overrides for a download. */
  clearFor: (id: string) => void;
}

/** Holds global default options plus per-download overrides. */
export const useOptionsStore = create<OptionsState>((set, get) => ({
  defaults: DEFAULT_OPTIONS,
  overrides: {},
  hydrate: async () => {
    const stored = await loadPersisted<DownloadOptions>(STORAGE_KEY);
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
      set({ defaults: { ...DEFAULT_OPTIONS, ...stored } });
    }
  },
  setDefaults: (patch) => {
    const defaults = { ...get().defaults, ...patch };
    set({ defaults });
    void persist(STORAGE_KEY, defaults);
  },
  setFor: (id, options) =>
    set((state) => ({ overrides: { ...state.overrides, [id]: options } })),
  patchFor: (id, patch) =>
    set((state) => ({
      overrides: {
        ...state.overrides,
        [id]: { ...(state.overrides[id] ?? state.defaults), ...patch },
      },
    })),
  optionsFor: (id) => get().overrides[id] ?? get().defaults,
  clearFor: (id) =>
    set((state) => {
      const next = { ...state.overrides };
      delete next[id];
      return { overrides: next };
    }),
}));
