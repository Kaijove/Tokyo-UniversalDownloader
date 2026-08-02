import type { DownloadItem } from '../types/download.types';
import type { DownloadFilter, DownloadSort } from '../stores/dashboard.store';

/** Returns true if an item matches the given filter. */
function matchesFilter(item: DownloadItem, filter: DownloadFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'audio':
      return item.info?.formats.some((f) => f.kind === 'audio-only') ?? false;
    case 'video':
      return item.info?.formats.some((f) => f.kind !== 'audio-only') ?? false;
    case 'playlist':
      return item.info?.isPlaylist ?? false;
    default:
      return item.status === filter;
  }
}

/** Returns true if an item matches the search query over title, uploader, URL. */
function matchesSearch(item: DownloadItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const fields = [item.info?.title ?? '', item.info?.uploader ?? '', item.url];
  return fields.some((field) => field.toLowerCase().includes(q));
}

const STATUS_ORDER: Record<string, number> = {
  downloading: 0,
  queued: 1,
  paused: 2,
  probing: 3,
  ready: 4,
  error: 5,
  cancelled: 6,
  done: 7,
  idle: 8,
};

/** Compares two items according to the chosen sort. */
function compare(a: DownloadItem, b: DownloadItem, sort: DownloadSort): number {
  switch (sort) {
    case 'newest':
      return b.createdAt - a.createdAt;
    case 'oldest':
      return a.createdAt - b.createdAt;
    case 'title':
      return (a.info?.title ?? a.url).localeCompare(b.info?.title ?? b.url);
    case 'status':
      return (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
  }
}

/**
 * Applies search, filter and sort to a list of items, returning a new array.
 * Pure — safe to call inside a memo.
 */
export function filterAndSort(
  items: DownloadItem[],
  search: string,
  filter: DownloadFilter,
  sort: DownloadSort,
): DownloadItem[] {
  return items
    .filter((it) => matchesFilter(it, filter) && matchesSearch(it, search))
    .sort((a, b) => compare(a, b, sort));
}
