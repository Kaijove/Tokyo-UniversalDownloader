import { useMemo, useState } from 'react';
import { Search, Trash2, FileDown } from 'lucide-react';
import { Button, Card, EmptyState, Input, Select, useToast } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { useLogStore } from '../stores/log.store';
import { filterLogs, formatLogsForExport } from '../services/log-filter';
import type { LogFilter, LogLevel } from '../types/logging.types';

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: 'text-content-tertiary',
  info: 'text-content-secondary',
  warning: 'text-warning',
  error: 'text-danger',
};

/**
 * Searchable, filterable view of the structured application log, with export
 * to the clipboard and a clear action. Reads the in-memory log store; nothing
 * is recomputed here beyond the memoised filter.
 */
export function LogViewer() {
  const records = useLogStore((s) => s.records);
  const clear = useLogStore((s) => s.clear);
  const { toast } = useToast();

  const [filter, setFilter] = useState<LogFilter>({
    query: '',
    level: 'all',
    source: 'all',
  });

  const visible = useMemo(() => filterLogs(records, filter), [records, filter]);

  const handleExport = async () => {
    await navigator.clipboard.writeText(formatLogsForExport(visible));
    toast('Logs copied to clipboard', { tone: 'success' });
  };

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-content-secondary">
          Logs ({visible.length})
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<FileDown size={14} />}
            onClick={handleExport}
            disabled={visible.length === 0}
          >
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={14} />}
            onClick={clear}
            disabled={records.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="min-w-40 flex-1">
          <Input
            value={filter.query}
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            onClear={() => setFilter({ ...filter, query: '' })}
            placeholder="Search logs…"
            aria-label="Search logs"
            leftIcon={<Search size={16} />}
          />
        </div>
        <Select
          value={filter.level}
          onChange={(e) => setFilter({ ...filter, level: e.target.value as LogFilter['level'] })}
          aria-label="Filter by level"
          className="w-32"
        >
          <option value="all">All levels</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </Select>
        <Select
          value={filter.source}
          onChange={(e) => setFilter({ ...filter, source: e.target.value as LogFilter['source'] })}
          aria-label="Filter by source"
          className="w-32"
        >
          <option value="all">All sources</option>
          <option value="app">App</option>
          <option value="engine">Engine</option>
          <option value="download">Download</option>
          <option value="backend">Backend</option>
        </Select>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={records.length === 0 ? 'No log records yet' : 'No matching records'}
          description={
            records.length === 0
              ? 'Activity will appear here as you use the app.'
              : 'Try a different search or filter.'
          }
        />
      ) : (
        <div className="max-h-80 overflow-y-auto rounded-md border border-border">
          {visible.map((record) => (
            <div
              key={record.id}
              className="flex gap-2 border-b border-border/50 px-2.5 py-1.5 last:border-0"
            >
              <span className="shrink-0 font-mono text-[11px] text-content-tertiary">
                {new Date(record.timestamp).toLocaleTimeString()}
              </span>
              <span className="shrink-0 font-mono text-[11px] uppercase text-content-tertiary">
                {record.source}
              </span>
              <span className={cn('font-mono text-[11px] leading-relaxed', LEVEL_COLOR[record.level])}>
                {record.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
