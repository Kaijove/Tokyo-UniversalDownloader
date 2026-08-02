import { describe, it, expect } from 'vitest';
import { migrateSettings, clampSettings } from '../migration';
import { DEFAULT_SETTINGS, SETTINGS_VERSION } from '../../constants/defaults';

describe('migrateSettings', () => {
  it('falls back to defaults for non-object input', () => {
    for (const input of [null, undefined, 42, 'nope', []]) {
      const result = migrateSettings(input);
      expect(result.ok).toBe(false);
      expect(result.settings).toEqual(DEFAULT_SETTINGS);
    }
  });

  it('accepts a complete document unchanged', () => {
    const result = migrateSettings(DEFAULT_SETTINGS);
    expect(result.ok).toBe(true);
    expect(result.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('fills missing sections with defaults', () => {
    const result = migrateSettings({ version: 1, video: { container: 'mkv' } });
    expect(result.ok).toBe(true);
    expect(result.settings.video.container).toBe('mkv');
    expect(result.settings.network).toEqual(DEFAULT_SETTINGS.network);
  });

  it('drops unknown keys', () => {
    const result = migrateSettings({
      version: 1,
      audio: { format: 'flac', nonsense: true },
    });
    expect(result.settings.audio.format).toBe('flac');
    expect('nonsense' in result.settings.audio).toBe(false);
  });

  it('always stamps the current version', () => {
    const result = migrateSettings({ version: 0 });
    expect(result.settings.version).toBe(SETTINGS_VERSION);
  });

  it('warns when the document comes from a newer version', () => {
    const result = migrateSettings({ version: SETTINGS_VERSION + 5 });
    expect(result.ok).toBe(true);
    expect(result.warning).toContain('newer version');
  });

  it('recovers subtitle languages and rejects non-strings', () => {
    const result = migrateSettings({
      version: 1,
      subtitles: { languages: ['en', 3, 'ca'] },
    });
    expect(result.settings.subtitles.languages).toEqual(['en', 'ca']);
  });
});

describe('clampSettings', () => {
  it('clamps concurrency into range', () => {
    const high = clampSettings({
      ...DEFAULT_SETTINGS,
      performance: { ...DEFAULT_SETTINGS.performance, maxConcurrent: 99 },
    });
    expect(high.performance.maxConcurrent).toBe(10);

    const low = clampSettings({
      ...DEFAULT_SETTINGS,
      performance: { ...DEFAULT_SETTINGS.performance, maxConcurrent: 0 },
    });
    expect(low.performance.maxConcurrent).toBe(1);
  });

  it('clamps timeout and retries', () => {
    const result = clampSettings({
      ...DEFAULT_SETTINGS,
      network: {
        ...DEFAULT_SETTINGS.network,
        timeoutSeconds: 9999,
        retryAttempts: -3,
      },
    });
    expect(result.network.timeoutSeconds).toBe(600);
    expect(result.network.retryAttempts).toBe(0);
  });

  it('leaves valid values untouched', () => {
    expect(clampSettings(DEFAULT_SETTINGS)).toEqual(DEFAULT_SETTINGS);
  });
});
