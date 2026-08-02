import type { MediaInfo } from '@/modules/downloads/types/download.types';

/** Progress callback shape used by providers while downloading. */
export interface ProviderProgress {
  percent: number;
  speed: string | null;
  eta: string | null;
}

/** Options controlling a single download request. */
export interface DownloadOptions {
  id: string;
  url: string;
  /** yt-dlp arguments built from the user's advanced options. */
  extraArgs: string[];
  /** Output filename template. */
  outputTemplate: string;
  outputDir: string;
}

/**
 * Contract every download provider must satisfy. The engine depends only on
 * this interface — never on a concrete provider — so new backends can be added
 * without touching the controller.
 */
export interface DownloadProvider {
  /** Stable identifier, e.g. `'yt-dlp'`. */
  readonly id: string;

  /** Resolves metadata and available formats for a URL. */
  probe(url: string, binaryPath?: string): Promise<MediaInfo>;

  /**
   * Performs a download. Reports progress via `onProgress` and resolves when
   * the file is written. Rejects with an `AppError` subclass on failure.
   */
  download(options: DownloadOptions, onProgress: (p: ProviderProgress) => void): Promise<void>;
}
