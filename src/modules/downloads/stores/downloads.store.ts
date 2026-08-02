import { create } from 'zustand';
import type { DownloadItem } from '../types/download.types';
import type { RichMetadata } from '@/modules/metadata';

interface DownloadsState {
  items: DownloadItem[];
  hydrate: (items: DownloadItem[]) => void;
  add: (url: string) => string;
  setProbing: (id: string) => void;
  setReady: (id: string, info: RichMetadata) => void;
  selectFormat: (id: string, formatId: string) => void;
  enqueue: (id: string, outputDir: string) => void;
  setDownloading: (id: string) => void;
  setProgress: (
    id: string,
    percent: number,
    downloadedBytes: number,
    totalBytes: number,
    speed: string | null,
    eta: string | null,
  ) => void;
  setPaused: (id: string) => void;
  setDone: (id: string, filePath?: string | null) => void;
  setCancelled: (id: string) => void;
  setError: (id: string, error: string) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
}

function patch(id: string, changes: Partial<DownloadItem>) {
  return (state: DownloadsState): Partial<DownloadsState> => ({
    items: state.items.map((it) => (it.id === id ? { ...it, ...changes } : it)),
  });
}

/** Central store holding all tracked downloads and their transitions. */
export const useDownloadsStore = create<DownloadsState>((set) => ({
  items: [],
  hydrate: (items) => set({ items }),
  add: (url) => {
    const id = crypto.randomUUID();
    set((state) => ({
      items: [
        {
          id,
          url,
          status: 'idle',
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
          createdAt: Date.now(),
        },
        ...state.items,
      ],
    }));
    return id;
  },
  setProbing: (id) => set(patch(id, { status: 'probing', error: null })),
  setReady: (id, info) =>
    set(
      patch(id, {
        status: 'ready',
        info,
        selectedFormatId: info.formats[0]?.formatId ?? null,
      }),
    ),
  selectFormat: (id, formatId) => set(patch(id, { selectedFormatId: formatId })),
  enqueue: (id, outputDir) => set(patch(id, { status: 'queued', outputDir, error: null })),
  setDownloading: (id) => set(patch(id, { status: 'downloading' })),
  setProgress: (id, percent, downloadedBytes, totalBytes, speed, eta) =>
    set(patch(id, { progress: percent, downloadedBytes, totalBytes, speed, eta })),
  setPaused: (id) => set(patch(id, { status: 'paused', speed: null, eta: null })),
  setDone: (id, filePath) =>
    set(patch(id, { status: 'done', progress: 100, speed: null, eta: null, filePath: filePath ?? null })),
  setCancelled: (id) =>
    set(patch(id, { status: 'cancelled', speed: null, eta: null })),
  setError: (id, error) => set(patch(id, { status: 'error', error, speed: null, eta: null })),
  remove: (id) => set((state) => ({ items: state.items.filter((it) => it.id !== id) })),
  removeMany: (ids) =>
    set((state) => ({ items: state.items.filter((it) => !ids.includes(it.id)) })),
}));
