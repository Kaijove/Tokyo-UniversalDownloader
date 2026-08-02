import { describe, it, expect } from 'vitest';
import { DEFAULT_OPTIONS } from '@/modules/advanced';
import { settingsToDownloadOptions, settingsToRankingPreferences } from '../apply-settings';
import { DEFAULT_SETTINGS } from '../../constants/defaults';

describe('settingsToDownloadOptions', () => {
  it('projects video and audio preferences', () => {
    const result = settingsToDownloadOptions(
      {
        ...DEFAULT_SETTINGS,
        video: { ...DEFAULT_SETTINGS.video, container: 'mkv', quality: 'best-compatible' },
        audio: { ...DEFAULT_SETTINGS.audio, format: 'flac', bitrateKbps: 320 },
      },
      DEFAULT_OPTIONS,
    );
    expect(result.videoContainer).toBe('mkv');
    expect(result.quality).toBe('best-compatible');
    expect(result.audioFormat).toBe('flac');
    expect(result.audioBitrateKbps).toBe(320);
  });

  it('maps empty strings to null for optional fields', () => {
    const result = settingsToDownloadOptions(DEFAULT_SETTINGS, DEFAULT_OPTIONS);
    expect(result.rateLimit).toBeNull();
    expect(result.outputTemplate).toBeNull();
    expect(result.cookies.cookieFile).toBeNull();
    expect(result.cookies.fromBrowser).toBeNull();
  });

  it('carries network retry policy into download options', () => {
    const result = settingsToDownloadOptions(
      {
        ...DEFAULT_SETTINGS,
        network: { ...DEFAULT_SETTINGS.network, retryAttempts: 5, retryDelayMs: 500 },
      },
      DEFAULT_OPTIONS,
    );
    expect(result.retry).toEqual({ maxAttempts: 5, baseDelayMs: 500 });
  });

  it('passes cookies through when configured', () => {
    const result = settingsToDownloadOptions(
      {
        ...DEFAULT_SETTINGS,
        privacy: { cookieBrowser: 'firefox', cookieFile: '' },
      },
      DEFAULT_OPTIONS,
    );
    expect(result.cookies.fromBrowser).toBe('firefox');
  });
});

describe('settingsToRankingPreferences', () => {
  it('carries codec and fps preferences', () => {
    const prefs = settingsToRankingPreferences({
      ...DEFAULT_SETTINGS,
      video: { ...DEFAULT_SETTINGS.video, preferredCodec: 'av01', preferHighFps: true },
    });
    expect(prefs.preferredCodec).toBe('av01');
    expect(prefs.preferHighFps).toBe(true);
  });
});
