import { describe, it, expect } from 'vitest';
import { parseFormats } from '../format-parser';
import type { MediaFormat } from '@/modules/downloads/types/download.types';

function fmt(over: Partial<MediaFormat>): MediaFormat {
  return {
    formatId: 'x',
    ext: 'mp4',
    resolution: '1920x1080',
    height: 1080,
    fps: 30,
    vcodec: 'avc1',
    acodec: 'mp4a',
    tbr: 2500,
    dynamicRange: null,
    filesizeBytes: 1000,
    note: null,
    hasVideo: true,
    hasAudio: true,
    ...over,
  };
}

describe('parseFormats', () => {
  it('groups a merged format under merged', () => {
    const out = parseFormats([fmt({ formatId: 'm', hasVideo: true, hasAudio: true })]);
    expect(out.merged).toHaveLength(1);
    expect(out.videoOnly).toHaveLength(0);
    expect(out.audioOnly).toHaveLength(0);
  });

  it('groups a video-only format under videoOnly', () => {
    const out = parseFormats([fmt({ formatId: 'v', hasVideo: true, hasAudio: false })]);
    expect(out.videoOnly).toHaveLength(1);
    expect(out.merged).toHaveLength(0);
  });

  it('groups an audio-only format under audioOnly', () => {
    const out = parseFormats([
      fmt({ formatId: 'a', hasVideo: false, hasAudio: true, vcodec: null }),
    ]);
    expect(out.audioOnly).toHaveLength(1);
    expect(out.merged).toHaveLength(0);
  });

  it('splits a mixed list into the right buckets', () => {
    const out = parseFormats([
      fmt({ formatId: 'm', hasVideo: true, hasAudio: true }),
      fmt({ formatId: 'v', hasVideo: true, hasAudio: false }),
      fmt({ formatId: 'a', hasVideo: false, hasAudio: true, vcodec: null }),
    ]);
    expect(out.merged).toHaveLength(1);
    expect(out.videoOnly).toHaveLength(1);
    expect(out.audioOnly).toHaveLength(1);
  });

  it('ranks higher resolution first within a group', () => {
    const out = parseFormats([
      fmt({ formatId: 'low', height: 480, hasVideo: true, hasAudio: false }),
      fmt({ formatId: 'high', height: 2160, hasVideo: true, hasAudio: false }),
    ]);
    expect(out.videoOnly[0].formatId).toBe('high');
  });

  it('returns empty groups for an empty input', () => {
    const out = parseFormats([]);
    expect(out.merged).toHaveLength(0);
    expect(out.videoOnly).toHaveLength(0);
    expect(out.audioOnly).toHaveLength(0);
  });
});
