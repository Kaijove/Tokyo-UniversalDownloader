import { create } from 'zustand';
import type { LogLevel, LogRecord, LogSource } from '../types/logging.types';

/** Upper bound on retained records; oldest are dropped first. */
const MAX_RECORDS = 2000;

interface LogState {
  records: LogRecord[];
  /** When false, `debug` records are discarded on arrival. */
  debugMode: boolean;
  append: (level: LogLevel, source: LogSource, message: string, downloadId?: string) => void;
  setDebugMode: (enabled: boolean) => void;
  clear: () => void;
}

/**
 * In-memory structured log. Deliberately not persisted: logs are a debugging
 * aid for the current session, and writing every line to disk would add I/O on
 * a hot path for little benefit. Export writes a snapshot when the user asks.
 */
export const useLogStore = create<LogState>((set, get) => ({
  records: [],
  debugMode: false,
  append: (level, source, message, downloadId) => {
    if (level === 'debug' && !get().debugMode) return;

    const record: LogRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      level,
      source,
      message,
      downloadId,
    };

    set((state) => ({ records: [...state.records, record].slice(-MAX_RECORDS) }));
  },
  setDebugMode: (enabled) => set({ debugMode: enabled }),
  clear: () => set({ records: [] }),
}));

/** Convenience wrapper so callers don't reach into the store directly. */
export const log = {
  debug: (source: LogSource, message: string, downloadId?: string) =>
    useLogStore.getState().append('debug', source, message, downloadId),
  info: (source: LogSource, message: string, downloadId?: string) =>
    useLogStore.getState().append('info', source, message, downloadId),
  warn: (source: LogSource, message: string, downloadId?: string) =>
    useLogStore.getState().append('warning', source, message, downloadId),
  error: (source: LogSource, message: string, downloadId?: string) =>
    useLogStore.getState().append('error', source, message, downloadId),
};
