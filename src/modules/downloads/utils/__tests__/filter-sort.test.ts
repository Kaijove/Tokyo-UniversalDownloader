import { describe, it, expect } from 'vitest';
import type { DownloadItem } from '../../types/download.types';
import type { RichMetadata, RankedFormat } from '@/modules/metadata';
import { filterAndSort } from '../filter-sort';

function fmt(kind: RankedFormat['kind']): RankedFormat {
  return {
    formatId: kind,
    ext: 'mp4',
    kind,
    resolution: null,
    height: null,
    fps: null,
    vcodec: null,
    acodec: null,
    tbr: null,
    isHdr: false,
    filesizeBytes: null,
    note: null,
    score: 0,
  };
}

function meta(overrides: Partial<RichMetadata> = {}): RichMetadata {
  return {
    title: 'Untitled',
    description: null,
    durationSeconds: null,
    uploader: null,
    channel: null,
    thumbnail: null,
    uploadDate: null,
    viewCount: null,
    likeCount: null,
    isLive: false,
    ageLimit: null,
    isPlaylist: false,
    formats: [],
    subtitles: [],
    source: 'https://example.com',
    ...overrides,
  };
}

function item(overrides: Partial<DownloadItem>): DownloadItem {
  return {
    id: crypto.randomUUID(),
    url: 'https://example.com/video',
    status: 'ready',
    progress: 0,
    downloadedBytes: 0,
    totalBytes: 0,
    speed: null,
    eta: null,
    info: null,
    selectedFormatId: null,
    outputDir: null,
    filePath: null,
    error: null,
    createdAt: 0,
    ...overrides,
  };
}

describe('filterAndSort', () => {
  it('filters by status', () => {
    const items = [
      item({ status: 'downloading' }),
      item({ status: 'done' }),
      item({ status: 'queued' }),
    ];
    const result = filterAndSort(items, '', 'done', 'newest');
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('done');
  });

  it('filters by audio type via formats', () => {
    const items = [
      item({ info: meta({ formats: [fmt('audio-only')] }) }),
      item({ info: meta({ formats: [fmt('merged')] }) }),
    ];
    expect(filterAndSort(items, '', 'audio', 'newest')).toHaveLength(1);
    expect(filterAndSort(items, '', 'video', 'newest')).toHaveLength(1);
  });

  it('filters playlists', () => {
    const items = [
      item({ info: meta({ isPlaylist: true }) }),
      item({ info: meta({ isPlaylist: false }) }),
    ];
    expect(filterAndSort(items, '', 'playlist', 'newest')).toHaveLength(1);
  });

  it('searches title, uploader and url', () => {
    const items = [
      item({ info: meta({ title: 'Cooking pasta' }) }),
      item({ info: meta({ title: 'Guitar lesson', uploader: 'MusicPro' }) }),
      item({ url: 'https://site.com/pasta-recipe', info: meta({ title: 'X' }) }),
    ];
    expect(filterAndSort(items, 'pasta', 'all', 'newest')).toHaveLength(2);
    expect(filterAndSort(items, 'musicpro', 'all', 'newest')).toHaveLength(1);
  });

  it('sorts by creation time', () => {
    const items = [
      item({ createdAt: 100, info: meta({ title: 'old' }) }),
      item({ createdAt: 300, info: meta({ title: 'new' }) }),
      item({ createdAt: 200, info: meta({ title: 'mid' }) }),
    ];
    expect(filterAndSort(items, '', 'all', 'newest').map((i) => i.info?.title)).toEqual([
      'new',
      'mid',
      'old',
    ]);
    expect(filterAndSort(items, '', 'all', 'oldest').map((i) => i.info?.title)).toEqual([
      'old',
      'mid',
      'new',
    ]);
  });

  it('sorts by title alphabetically', () => {
    const items = [
      item({ info: meta({ title: 'Banana' }) }),
      item({ info: meta({ title: 'Apple' }) }),
    ];
    expect(filterAndSort(items, '', 'all', 'title').map((i) => i.info?.title)).toEqual([
      'Apple',
      'Banana',
    ]);
  });

  it('returns everything under the all filter with empty search', () => {
    const items = [item({ status: 'done' }), item({ status: 'error' })];
    expect(filterAndSort(items, '', 'all', 'newest')).toHaveLength(2);
  });
});
