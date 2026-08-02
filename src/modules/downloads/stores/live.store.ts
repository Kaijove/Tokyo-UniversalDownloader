import { create } from 'zustand';
import type { DownloadPhase, LogEntry } from '../types/live.types';

/** How many log lines are kept per download before older ones are dropped. */
const MAX_LOG_LINES = 200;

interface LiveState {
  /** Current pipeline phase per download id. */
  phases: Record<string, DownloadPhase>;
  /** Live log lines per download id, oldest first. */
  logs: Record<string, LogEntry[]>;
  setPhase: (id: string, phase: DownloadPhase) => void;
  appendLog: (entry: LogEntry) => void;
  /** Drops the phase and logs for one download. */
  clear: (id: string) => void;
}

/**
 * Ephemeral live state for active downloads: the current pipeline phase and a
 * bounded log buffer. Not persisted — this is runtime detail, and keeping it
 * out of the download store avoids re-rendering cards on every log line.
 */
export const useLiveStore = create<LiveState>((set) => ({
  phases: {},
  logs: {},
  setPhase: (id, phase) =>
    set((state) => ({ phases: { ...state.phases, [id]: phase } })),
  appendLog: (entry) =>
    set((state) => {
      const existing = state.logs[entry.id] ?? [];
      const next = [...existing, entry].slice(-MAX_LOG_LINES);
      return { logs: { ...state.logs, [entry.id]: next } };
    }),
  clear: (id) =>
    set((state) => {
      const phases = { ...state.phases };
      const logs = { ...state.logs };
      delete phases[id];
      delete logs[id];
      return { phases, logs };
    }),
}));
