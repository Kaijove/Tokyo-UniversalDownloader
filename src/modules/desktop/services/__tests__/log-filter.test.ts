import { describe, it, expect } from 'vitest';
import { filterLogs, formatLogsForExport } from '../log-filter';
import type { LogRecord } from '../../types/logging.types';

function record(overrides: Partial<LogRecord>): LogRecord {
  return {
    id: crypto.randomUUID(),
    timestamp: 1700000000000,
    level: 'info',
    source: 'app',
    message: 'something happened',
    ...overrides,
  };
}

describe('filterLogs', () => {
  const records = [
    record({ level: 'info', source: 'app', message: 'app started' }),
    record({ level: 'error', source: 'download', message: 'download failed', downloadId: 'abc' }),
    record({ level: 'warning', source: 'engine', message: 'retrying soon' }),
  ];

  it('returns everything with no filters', () => {
    expect(filterLogs(records, { query: '', level: 'all', source: 'all' })).toHaveLength(3);
  });

  it('filters by level', () => {
    const result = filterLogs(records, { query: '', level: 'error', source: 'all' });
    expect(result).toHaveLength(1);
    expect(result[0].message).toBe('download failed');
  });

  it('filters by source', () => {
    expect(filterLogs(records, { query: '', level: 'all', source: 'engine' })).toHaveLength(1);
  });

  it('searches the message', () => {
    expect(filterLogs(records, { query: 'retry', level: 'all', source: 'all' })).toHaveLength(1);
  });

  it('searches the download id', () => {
    expect(filterLogs(records, { query: 'abc', level: 'all', source: 'all' })).toHaveLength(1);
  });

  it('combines filters', () => {
    const result = filterLogs(records, { query: 'download', level: 'error', source: 'download' });
    expect(result).toHaveLength(1);
  });
});

describe('formatLogsForExport', () => {
  it('renders one line per record with level and source', () => {
    const output = formatLogsForExport([
      record({ level: 'error', source: 'download', message: 'boom', downloadId: 'xyz' }),
    ]);
    expect(output).toContain('[ERROR]');
    expect(output).toContain('download:xyz');
    expect(output).toContain('boom');
  });

  it('returns an empty string for no records', () => {
    expect(formatLogsForExport([])).toBe('');
  });
});
