/** How serious an error is, used to decide UI treatment and retry policy. */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

/** Structured detail attached to every engine error. */
export interface AppErrorDetail {
  /** Human-readable summary safe to show the user. */
  message: string;
  /** Underlying cause, if any (original error or provider stderr). */
  cause?: unknown;
  /** Severity used for UI and retry decisions. */
  severity: ErrorSeverity;
  /** A concrete next step the user can take. */
  suggestion?: string;
  /** When the error was created (epoch ms). */
  timestamp: number;
}

/**
 * Base class for every error the engine raises. Carries structured detail so
 * the UI never has to parse raw strings. Never throw a bare `Error` in engine
 * code — extend this instead.
 */
export class AppError extends Error {
  readonly cause?: unknown;
  readonly severity: ErrorSeverity;
  readonly suggestion?: string;
  readonly timestamp: number;

  constructor(detail: AppErrorDetail) {
    super(detail.message);
    this.name = new.target.name;
    this.cause = detail.cause;
    this.severity = detail.severity;
    this.suggestion = detail.suggestion;
    this.timestamp = detail.timestamp;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /** Serialisable form for logging, history, or IPC. */
  toJSON(): AppErrorDetail & { name: string } {
    return {
      name: this.name,
      message: this.message,
      severity: this.severity,
      suggestion: this.suggestion,
      timestamp: this.timestamp,
    };
  }
}

/** Root of the download-related error branch. */
export class DownloadError extends AppError {}

type PartialDetail = Omit<AppErrorDetail, 'timestamp' | 'severity'> & {
  severity?: ErrorSeverity;
};

function build(defaults: { severity: ErrorSeverity; suggestion: string }) {
  return (detail: PartialDetail): AppErrorDetail => ({
    severity: detail.severity ?? defaults.severity,
    suggestion: detail.suggestion ?? defaults.suggestion,
    message: detail.message,
    cause: detail.cause,
    timestamp: Date.now(),
  });
}

/** The URL is malformed or empty. */
export class InvalidUrlError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(build({ severity: 'warning', suggestion: 'Check the URL and try again.' })(detail));
  }
}

/** No provider recognises this URL / platform. */
export class UnsupportedPlatformError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(
      build({
        severity: 'warning',
        suggestion: 'This site may not be supported.',
      })(detail),
    );
  }
}

/** The download provider (e.g. yt-dlp) failed or is missing. */
export class ProviderError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(
      build({
        severity: 'error',
        suggestion: 'Ensure yt-dlp is installed and up to date.',
      })(detail),
    );
  }
}

/** Metadata could not be resolved. */
export class MetadataError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(build({ severity: 'error', suggestion: 'Try again in a moment.' })(detail));
  }
}

/** A network-level failure. */
export class NetworkError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(build({ severity: 'error', suggestion: 'Check your connection.' })(detail));
  }
}

/** The operation exceeded its time budget. */
export class TimeoutError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(build({ severity: 'error', suggestion: 'The request timed out — retry.' })(detail));
  }
}

/** A filesystem operation failed (write, move, space). */
export class FileSystemError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(
      build({
        severity: 'error',
        suggestion: 'Check the output folder and free space.',
      })(detail),
    );
  }
}

/** FFmpeg post-processing failed. */
export class FFmpegError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(build({ severity: 'error', suggestion: 'Ensure ffmpeg is installed.' })(detail));
  }
}

/** The app lacks permission for a path or operation. */
export class PermissionError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(
      build({
        severity: 'error',
        suggestion: 'Grant access to the selected folder.',
      })(detail),
    );
  }
}

/** The site requires authentication (login or valid cookies). */
export class AuthenticationError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(
      build({
        severity: 'warning',
        suggestion: 'Provide cookies from a logged-in browser session.',
      })(detail),
    );
  }
}

/** The supplied cookie file or browser profile could not be used. */
export class CookieError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(
      build({
        severity: 'warning',
        suggestion: 'Check the cookie file path or pick another browser.',
      })(detail),
    );
  }
}

/** The requested subtitles are not available for this media. */
export class SubtitleError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(
      build({
        severity: 'info',
        suggestion: 'Try a different language or enable auto-generated captions.',
      })(detail),
    );
  }
}

/** There is not enough free space to complete the download. */
export class DiskSpaceError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(
      build({
        severity: 'error',
        suggestion: 'Free up space or choose another output folder.',
      })(detail),
    );
  }
}

/** A playlist could not be enumerated or partially failed. */
export class PlaylistError extends DownloadError {
  constructor(detail: PartialDetail) {
    super(
      build({
        severity: 'warning',
        suggestion: 'Some items may be private or removed.',
      })(detail),
    );
  }
}
