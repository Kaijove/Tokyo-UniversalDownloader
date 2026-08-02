import { create } from 'zustand';
import { engineBus } from '@/core/engine';
import { loadPersisted, persist } from '@/core/engine/persistence/persistence';
import type { Settings, SettingsSection } from '../types/settings.types';
import { DEFAULT_SETTINGS } from '../constants/defaults';
import { clampSettings, migrateSettings } from '../services/migration';

const STORAGE_KEY = 'settings';

interface SettingsState {
  settings: Settings;
  /** True once the persisted settings have been read. */
  loaded: boolean;
  /** Loads and migrates persisted settings. Call once at startup. */
  hydrate: () => Promise<void>;
  /** Replaces one section, clamping and persisting the result. */
  updateSection: <S extends SettingsSection>(
    section: S,
    patch: Partial<Settings[S]>,
  ) => void;
  /** Restores one section to its factory defaults. */
  resetSection: (section: SettingsSection) => void;
  /** Restores every setting to its factory default. */
  resetAll: () => void;
  /** Serialises the current settings as pretty JSON for export. */
  exportJson: () => string;
  /** Validates, migrates and applies an imported settings document. */
  importJson: (json: string) => { ok: boolean; error: string | null };
}

/**
 * Central settings store. Every write is clamped, persisted and announced on
 * the event bus, so other modules can react without polling.
 */
export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  hydrate: async () => {
    const stored = await loadPersisted<unknown>(STORAGE_KEY);
    const { settings } = migrateSettings(stored ?? DEFAULT_SETTINGS);
    set({ settings: clampSettings(settings), loaded: true });
    engineBus.emit('SettingsLoaded', { version: settings.version });
  },
  updateSection: (section, patch) => {
    const current = get().settings;
    const next = clampSettings({
      ...current,
      [section]: { ...current[section], ...patch },
    });
    set({ settings: next });
    void persist(STORAGE_KEY, next);

    for (const key of Object.keys(patch)) {
      engineBus.emit('SettingChanged', { path: `${section}.${key}` });
    }
    if (section === 'appearance' && 'theme' in patch) {
      engineBus.emit('ThemeChanged', { theme: String(patch.theme) });
    }
    if (section === 'performance' && 'maxConcurrent' in patch) {
      engineBus.emit('PerformanceChanged', {
        maxConcurrent: next.performance.maxConcurrent,
      });
    }
  },
  resetSection: (section) => {
    const next = clampSettings({
      ...get().settings,
      [section]: DEFAULT_SETTINGS[section],
    });
    set({ settings: next });
    void persist(STORAGE_KEY, next);
    engineBus.emit('SettingsReset', { section });
  },
  resetAll: () => {
    set({ settings: DEFAULT_SETTINGS });
    void persist(STORAGE_KEY, DEFAULT_SETTINGS);
    engineBus.emit('SettingsReset', { section: null });
  },
  exportJson: () => {
    engineBus.emit('SettingsExported', {});
    return JSON.stringify(get().settings, null, 2);
  },
  importJson: (json) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return { ok: false, error: 'The file is not valid JSON.' };
    }

    const result = migrateSettings(parsed);
    if (!result.ok) {
      return { ok: false, error: result.warning };
    }

    const next = clampSettings(result.settings);
    set({ settings: next });
    void persist(STORAGE_KEY, next);
    engineBus.emit('SettingsImported', { version: next.version });
    return { ok: true, error: result.warning };
  },
}));
