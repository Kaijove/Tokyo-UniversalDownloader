/** Severity of a log record. */
export type LogLevel = 'debug' | 'info' | 'warning' | 'error';

/** Which part of the app produced a record. */
export type LogSource = 'app' | 'engine' | 'download' | 'backend';

/** One structured log record. */
export interface LogRecord {
  id: string;
  timestamp: number;
  level: LogLevel;
  source: LogSource;
  message: string;
  /** Optional download id when the record belongs to one. */
  downloadId?: string;
}

/** Active filters for the log viewer. */
export interface LogFilter {
  query: string;
  level: LogLevel | 'all';
  source: LogSource | 'all';
}
