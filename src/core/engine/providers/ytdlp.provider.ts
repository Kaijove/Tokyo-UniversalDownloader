import { probeMedia, downloadMedia, onProgress } from '@/modules/downloads/services/downloads.service';
import type { MediaInfo } from '@/modules/downloads/types/download.types';
import {
  InvalidUrlError,
  MetadataError,
  ProviderError,
} from '../errors/errors';
import type { DownloadOptions, DownloadProvider, ProviderProgress } from './provider.types';

/**
 * yt-dlp-backed provider. Bridges to the Rust commands via the downloads
 * service and normalises raw failures into structured engine errors. This is
 * the only place in the engine that knows yt-dlp exists.
 */
export class YtDlpProvider implements DownloadProvider {
  readonly id = 'yt-dlp';

  async probe(url: string, ytDlpPath = ''): Promise<MediaInfo> {
    if (!url.trim()) {
      throw new InvalidUrlError({ message: 'The URL is empty.' });
    }

    try {
      return await probeMedia(url, ytDlpPath);
    } catch (cause) {
      throw new MetadataError({
        message: 'Could not read media information for this link.',
        cause,
      });
    }
  }

  async download(
    options: DownloadOptions,
    onProgressUpdate: (p: ProviderProgress) => void,
  ): Promise<void> {
    const unlisten = await onProgress((update) => {
      if (update.id !== options.id) return;
      onProgressUpdate({ percent: update.percent, speed: update.speed, eta: update.eta });
    });

    try {
      await downloadMedia(
        options.id,
        options.url,
        options.extraArgs,
        options.outputTemplate,
        options.outputDir,
      );
    } catch (cause) {
      throw new ProviderError({
        message: 'The download could not be completed.',
        cause,
      });
    } finally {
      unlisten();
    }
  }
}
