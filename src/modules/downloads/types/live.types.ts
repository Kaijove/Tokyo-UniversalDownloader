/**
 * Granular pipeline phases reported by the provider. These are derived from
 * real yt-dlp output, not guessed — a phase only appears once the backend has
 * actually seen the corresponding stage begin.
 */
export type DownloadPhase =
  | 'connecting'
  | 'preparing'
  | 'downloading'
  | 'merging'
  | 'extracting-audio'
  | 'embedding-metadata'
  | 'embedding-thumbnail'
  | 'embedding-subtitles'
  | 'converting'
  | 'finalizing';

/** A phase change received from the backend. */
export interface PhaseUpdate {
  id: string;
  phase: DownloadPhase;
  detail: string;
}

/** Severity of a live log line. */
export type LogLevel = 'info' | 'warning' | 'error';

/** One line in a download's live log. */
export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
}
