import { Search } from 'lucide-react';
import { Input, Select } from '@/shared/components/ui';
import {
  useDashboardStore,
  type DownloadFilter,
  type DownloadSort,
} from '../../stores/dashboard.store';

const FILTERS: { value: DownloadFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'downloading', label: 'Downloading' },
  { value: 'queued', label: 'Queued' },
  { value: 'paused', label: 'Paused' },
  { value: 'done', label: 'Completed' },
  { value: 'error', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'playlist', label: 'Playlist' },
];

const SORTS: { value: DownloadSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
];

/** Search field, status/type filter and sort control for the queue. */
export function QueueToolbar() {
  const { search, filter, sort, setSearch, setFilter, setSort } = useDashboardStore();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="min-w-48 flex-1">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search downloads…"
          aria-label="Search downloads"
          leftIcon={<Search size={16} />}
        />
      </div>
      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value as DownloadFilter)}
        aria-label="Filter downloads"
        className="w-40"
      >
        {FILTERS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </Select>
      <Select
        value={sort}
        onChange={(e) => setSort(e.target.value as DownloadSort)}
        aria-label="Sort downloads"
        className="w-32"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
