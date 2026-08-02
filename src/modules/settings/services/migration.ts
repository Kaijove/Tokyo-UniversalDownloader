import type { Settings } from '../types/settings.types';
import { DEFAULT_SETTINGS, SETTINGS_VERSION } from '../constants/defaults';

/** Outcome of validating and migrating a stored or imported settings blob. */
export interface MigrationResult {
  settings: Settings;
  /** True when the input was usable (possibly after migration). */
  ok: boolean;
  /** Set when the input was rejected or partially recovered. */
  warning: string | null;
}

/** Type guard for a plain object. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Merges a stored section over its defaults, keeping only keys the current
 * schema knows about. Unknown keys are dropped; missing keys fall back to the
 * default, so an older or partial file never leaves holes.
 */
function mergeSection<T extends object>(defaults: T, stored: unknown): T {
  if (!isRecord(stored)) return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const value = stored[key as string];
    if (value === undefined) continue;
    if (typeof value === typeof defaults[key] || defaults[key] === null) {
      result[key] = value as T[keyof T];
    }
  }
  return result;
}

/**
 * Validates and migrates an arbitrary value into a complete `Settings` object.
 *
 * Never throws and never returns a partial document: unknown or corrupt input
 * falls back to defaults, and older versions are upgraded field by field. This
 * is the single entry point for both persisted settings and imported files.
 */
export function migrateSettings(input: unknown): MigrationResult {
  if (!isRecord(input)) {
    return {
      settings: DEFAULT_SETTINGS,
      ok: false,
      warning: 'Settings file is not a valid object; defaults were applied.',
    };
  }

  const storedVersion = typeof input.version === 'number' ? input.version : 0;

  const settings: Settings = {
    version: SETTINGS_VERSION,
    downloads: mergeSection(DEFAULT_SETTINGS.downloads, input.downloads),
    video: mergeSection(DEFAULT_SETTINGS.video, input.video),
    audio: mergeSection(DEFAULT_SETTINGS.audio, input.audio),
    subtitles: {
      ...mergeSection(DEFAULT_SETTINGS.subtitles, input.subtitles),
      languages: Array.isArray((input.subtitles as Record<string, unknown> | undefined)?.languages)
        ? ((input.subtitles as Record<string, unknown>).languages as string[]).filter(
            (l): l is string => typeof l === 'string',
          )
        : DEFAULT_SETTINGS.subtitles.languages,
    },
    appearance: mergeSection(DEFAULT_SETTINGS.appearance, input.appearance),
    notifications: mergeSection(DEFAULT_SETTINGS.notifications, input.notifications),
    performance: mergeSection(DEFAULT_SETTINGS.performance, input.performance),
    history: mergeSection(DEFAULT_SETTINGS.history, input.history),
    network: mergeSection(DEFAULT_SETTINGS.network, input.network),
    privacy: mergeSection(DEFAULT_SETTINGS.privacy, input.privacy),
    desktop: mergeSection(DEFAULT_SETTINGS.desktop, input.desktop),
    advanced: mergeSection(DEFAULT_SETTINGS.advanced, input.advanced),
  };

  const warning =
    storedVersion > SETTINGS_VERSION
      ? 'Settings came from a newer version; unknown options were ignored.'
      : null;

  return { settings, ok: true, warning };
}

/** Clamps numeric settings into sane ranges after any change. */
export function clampSettings(settings: Settings): Settings {
  return {
    ...settings,
    performance: {
      ...settings.performance,
      maxConcurrent: Math.min(10, Math.max(1, settings.performance.maxConcurrent)),
      metadataCacheTtlMinutes: Math.min(
        1440,
        Math.max(1, settings.performance.metadataCacheTtlMinutes),
      ),
    },
    history: {
      ...settings.history,
      maxEntries: Math.min(10_000, Math.max(10, settings.history.maxEntries)),
    },
    network: {
      ...settings.network,
      timeoutSeconds: Math.min(600, Math.max(5, settings.network.timeoutSeconds)),
      retryAttempts: Math.min(10, Math.max(0, settings.network.retryAttempts)),
      retryDelayMs: Math.min(60_000, Math.max(0, settings.network.retryDelayMs)),
    },
  };
}
