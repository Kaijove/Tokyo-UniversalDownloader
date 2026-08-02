import { describe, it, expect, vi, beforeEach } from 'vitest';

const loadPersisted = vi.fn<(key: string) => Promise<unknown>>();
const persist = vi.fn<(key: string, value: unknown) => Promise<void>>(() =>
  Promise.resolve(),
);

vi.mock('@/core/engine/persistence/persistence', () => ({
  loadPersisted: (key: string) => loadPersisted(key),
  persist: (key: string, value: unknown) => persist(key, value),
}));

import { loadQueue, saveQueue } from '../queue-persistence';
import type { DownloadItem } from '../../types/download.types';

function item(over: Partial<DownloadItem>): DownloadItem {
  return {
    id: 'x',
    url: 'https://example.com/v',
    status: 'queued',
    progress: 0,
    downloadedBytes: 0,
    totalBytes: 0,
    speed: null,
    eta: null,
    info: null,
    selectedFormatId: null,
    outputDir: '/out',
    filePath: null,
    error: null,
    ...over,
  } as DownloadItem;
}

describe('loadQueue', () => {
  beforeEach(() => loadPersisted.mockReset());

  it('returns [] when nothing is stored', async () => {
    loadPersisted.mockResolvedValueOnce(null);
    expect(await loadQueue()).toEqual([]);
  });

  it('returns [] when stored data is corrupted (not an array)', async () => {
    loadPersisted.mockResolvedValueOnce({ oops: true });
    expect(await loadQueue()).toEqual([]);
    loadPersisted.mockResolvedValueOnce('garbage');
    expect(await loadQueue()).toEqual([]);
  });

  it('drops finished downloads on restore', async () => {
    loadPersisted.mockResolvedValueOnce([
      item({ id: 'a', status: 'done' }),
      item({ id: 'b', status: 'queued' }),
    ]);
    const out = await loadQueue();
    expect(out.map((i) => i.id)).toEqual(['b']);
  });

  it('normalises interrupted downloads back to queued', async () => {
    loadPersisted.mockResolvedValueOnce([
      item({ id: 'c', status: 'downloading', progress: 42 }),
    ]);
    const [restored] = await loadQueue();
    expect(restored.status).toBe('queued');
    expect(restored.progress).toBe(0);
  });
});

describe('saveQueue', () => {
  beforeEach(() => persist.mockClear());

  it('persists under the queue key without finished items', async () => {
    await saveQueue([item({ id: 'a', status: 'done' }), item({ id: 'b', status: 'queued' })]);
    expect(persist).toHaveBeenCalledOnce();
    const [, value] = persist.mock.calls[0];
    expect((value as DownloadItem[]).map((i) => i.id)).toEqual(['b']);
  });
});
