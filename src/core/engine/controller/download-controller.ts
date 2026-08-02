import type { MediaInfo } from '@/modules/downloads/types/download.types';
import { AppError } from '../errors/errors';
import { EventBus } from '../events/event-bus';
import type { DownloadProvider } from '../providers/provider.types';
import { PlatformResolver } from '../platform/platform-resolver';
import type { Platform } from '../platform/platform.types';
import { sanitizeUrl } from './url-sanitizer';

/** Result of accepting a URL: its cleaned form, platform, and metadata. */
export interface AcceptedDownload {
  id: string;
  url: string;
  platform: Platform;
  info: MediaInfo;
}

/**
 * Coordinates the download lifecycle. It sanitises input, resolves the
 * platform, probes metadata through the provider, and dispatches typed events.
 * It never downloads directly — the provider does the work and the queue
 * schedules it. This keeps orchestration and execution cleanly separated.
 */
export class DownloadController {
  constructor(
    private readonly provider: DownloadProvider,
    private readonly bus: EventBus,
    private readonly resolver: PlatformResolver,
  ) {}

  /**
   * Accepts a raw URL: cleans it, identifies the platform, and probes
   * metadata. Emits `DownloadCreated`, `MetadataLoaded` and `FormatsLoaded`.
   * Rejects with an `AppError` subclass on any failure.
   */
  async accept(rawUrl: string, id: string): Promise<AcceptedDownload> {
    const url = sanitizeUrl(rawUrl);
    const platform = this.resolver.resolve(url);

    this.bus.emit('DownloadCreated', { id, url });

    try {
      const info = await this.provider.probe(url);
      this.bus.emit('MetadataLoaded', { id, title: info.title });
      this.bus.emit('FormatsLoaded', { id, count: info.formats.length });
      return { id, url, platform, info };
    } catch (error) {
      const detail = error instanceof AppError ? error.toJSON() : undefined;
      this.bus.emit('DownloadFailed', {
        id,
        error: detail ?? {
          message: 'Unknown error while reading media info.',
          severity: 'error',
          timestamp: Date.now(),
        },
      });
      throw error;
    }
  }
}
