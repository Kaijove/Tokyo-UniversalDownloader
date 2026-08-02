import { useMemo, useState } from 'react';
import { History, FolderOpen, Search } from 'lucide-react';
import { useHistoryStore } from '@/core/engine';
import { Button, EmptyState, Input } from '@/shared/components/ui';
import { openPath } from '../../services/downloads.service';

/**
 * Collapsible history panel embedded in the dashboard. Reuses the engine's
 * history store, shows a searchable list of finished downloads, and lets the
 * user open the output folder or clear history.
 */
export function HistoryPanel() {
  const entries = useHistoryStore((s) => s.entries);
  const clear = useHistoryStore((s) => s.clear);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) =>
      [e.title, e.uploader ?? '', e.url].some((f) => f.toLowerCase().includes(q)),
    );
  }, [entries, query]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-medium text-content-secondary">
          <History size={16} /> History
        </h2>
        {entries.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            Clear
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={<History size={28} />}
          title="No history yet"
          description="Completed downloads will appear here."
        />
      ) : (
        <>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search history…"
            aria-label="Search history"
            leftIcon={<Search size={16} />}
          />
          <div className="flex flex-col gap-1">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-surface-secondary"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-content-primary">{entry.title}</p>
                  <p className="truncate text-xs text-content-tertiary">
                    {[entry.uploader, new Date(entry.completedAt).toLocaleDateString()]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <button
                  onClick={() => void openPath(entry.outputDir)}
                  aria-label="Open folder"
                  className="opacity-0 transition-opacity group-hover:opacity-100 text-content-tertiary hover:text-content-primary"
                >
                  <FolderOpen size={16} />
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-4 text-center text-xs text-content-tertiary">
                No matching history.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
