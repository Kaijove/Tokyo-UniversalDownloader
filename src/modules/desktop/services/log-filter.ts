import type { LogFilter, LogRecord } from '../types/logging.types';

/**
 * Applies search, level and source filters to log records, returning a new
 * array. Search matches the message and the download id. Pure — safe inside a
 * memo.
 */
export function filterLogs(records: LogRecord[], filter: LogFilter): LogRecord[] {
  const query = filter.query.trim().toLowerCase();

  return records.filter((record) => {
    if (filter.level !== 'all' && record.level !== filter.level) return false;
    if (filter.source !== 'all' && record.source !== filter.source) return false;
    if (!query) return true;

    const haystack = `${record.message} ${record.downloadId ?? ''}`.toLowerCase();
    return haystack.includes(query);
  });
}

/**
 * Renders log records as plain text for export, one line per record with an
 * ISO timestamp so the output is diff-friendly and easy to share.
 */
export function formatLogsForExport(records: LogRecord[]): string {
  return records
    .map((record) => {
      const time = new Date(record.timestamp).toISOString();
      const scope = record.downloadId ? `${record.source}:${record.downloadId}` : record.source;
      return `${time} [${record.level.toUpperCase()}] [${scope}] ${record.message}`;
    })
    .join('\n');
}
