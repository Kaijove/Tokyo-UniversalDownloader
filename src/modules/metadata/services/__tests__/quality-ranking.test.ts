import { describe, it, expect } from 'vitest';
import type { MediaFormat } from '@/modules/downloads/types/download.types';
import { rankFormats, bestFormat } from '../quality-ranking';

function fmt(overrides: Partial<MediaFormat>): MediaFormat {
  return {
    formatId: 'x',
    ext: 'mp4',
    resolution: null,
    height: null,
    fps: null,
    vcodec: null,
    acodec: null,
    tbr: null,
    dynamicRange: null,
    filesizeBytes: null,
    note: null,
    hasVideo: true,
    hasAudio: true,
    ...overrides,
  };
}

describe('rankFormats', () => {
  it('ranks higher resolution first', () => {
    const ranked = rankFormats([
      fmt({ formatId: 'sd', height: 480 }),
      fmt({ formatId: 'hd', height: 1080 }),
      fmt({ formatId: 'mid', height: 720 }),
    ]);
    expect(ranked.map((f) => f.formatId)).toEqual(['hd', 'mid', 'sd']);
  });

  it('rewards HDR over SDR at equal resolution', () => {
    const ranked = rankFormats([
      fmt({ formatId: 'sdr', height: 1080 }),
      fmt({ formatId: 'hdr', height: 1080, dynamicRange: 'HDR' }),
    ]);
    expect(ranked[0].formatId).toBe('hdr');
    expect(ranked[0].isHdr).toBe(true);
  });

  it('classifies stream kinds', () => {
    const ranked = rankFormats([
      fmt({ formatId: 'v', hasVideo: true, hasAudio: false }),
      fmt({ formatId: 'a', hasVideo: false, hasAudio: true }),
      fmt({ formatId: 'm', hasVideo: true, hasAudio: true }),
    ]);
    const byId = Object.fromEntries(ranked.map((f) => [f.formatId, f.kind]));
    expect(byId).toEqual({ v: 'video-only', a: 'audio-only', m: 'merged' });
  });

  it('prefers a requested codec when asked', () => {
    const best = bestFormat(
      [
        fmt({ formatId: 'h264', height: 1080, vcodec: 'avc1.64' }),
        fmt({ formatId: 'av1', height: 1080, vcodec: 'av01.0' }),
      ],
      { preferHighFps: false, preferSmallSize: false, preferredCodec: 'av01' },
    );
    expect(best?.formatId).toBe('av1');
  });

  it('returns null when there are no formats', () => {
    expect(bestFormat([])).toBeNull();
  });
});
