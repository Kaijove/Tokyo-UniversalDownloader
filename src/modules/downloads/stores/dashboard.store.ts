import { create } from 'zustand';
import type { DownloadStatus } from '../types/download.types';

/** Filter applied to the visible download list. */
export type DownloadFilter =
  | 'all'
  | DownloadStatus
  | 'audio'
  | 'video'
  | 'playlist';

/** How the list is ordered. */
export type DownloadSort = 'newest' | 'oldest' | 'title' | 'status';

interface DashboardState {
  search: string;
  filter: DownloadFilter;
  sort: DownloadSort;
  selected: Set<string>;
  collapseCompleted: boolean;
  setSearch: (search: string) => void;
  setFilter: (filter: DownloadFilter) => void;
  setSort: (sort: DownloadSort) => void;
  toggleSelected: (id: string) => void;
  clearSelection: () => void;
  toggleCollapseCompleted: () => void;
}

/** UI-only state for the dashboard: search, filter, sort and selection. */
export const useDashboardStore = create<DashboardState>((set) => ({
  search: '',
  filter: 'all',
  sort: 'newest',
  selected: new Set(),
  collapseCompleted: false,
  setSearch: (search) => set({ search }),
  setFilter: (filter) => set({ filter }),
  setSort: (sort) => set({ sort }),
  toggleSelected: (id) =>
    set((state) => {
      const next = new Set(state.selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selected: next };
    }),
  clearSelection: () => set({ selected: new Set() }),
  toggleCollapseCompleted: () =>
    set((state) => ({ collapseCompleted: !state.collapseCompleted })),
}));
