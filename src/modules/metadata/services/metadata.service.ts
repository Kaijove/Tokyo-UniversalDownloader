import { engineBus } from '@/core/engine';
import { probeMedia } from '@/modules/downloads/services/downloads.service';
import type { MediaInfo } from '@/modules/downloads/types/download.types';
import type { RichMetadata, RankingPreferences } from '../types/metadata.types';
import { rankFormats } from './quality-ranking';
import { metadataCache } from './metadata-cache';
import { DEFAULT_RANKING } from '../constants/ranking.constants';

/** Maps raw probe output into ranked, UI-ready rich metadata. */
function toRichMetadata(info: MediaInfo, prefs: RankingPreferences): RichMetadata {
  return {
    title: info.title,
    description: info.description,
    durationSeconds: info.durationSeconds,
    uploader: info.uploader,
    channel: info.channel,
    thumbnail: info.thumbnail,
    uploadDate: info.uploadDate,
    viewCount: info.viewCount,
    likeCount: info.likeCount,
    isLive: info.isLive,
    ageLimit: info.ageLimit,
    isPlaylist: info.isPlaylist,
    formats: rankFormats(info.formats, prefs),
    subtitles: info.subtitles,
    source: info.source,
  };
}

/**
 * Resolves rich, ranked metadata for a canonical URL. Serves from the
 * in-memory cache when fresh, otherwise probes the provider. Emits the
 * metadata lifecycle events (`MetadataLoading`, `CacheHit`/`CacheMiss`,
 * `MetadataLoaded`, `FormatsLoaded`, `MetadataError`). Rejects with the
 * underlying error on failure.
 *
 * `id` links emitted events to a specific download entry; pass the store id.
 */
export async function resolveMetadata(
  url: string,
  id: string,
  prefs: RankingPreferences = DEFAULT_RANKING,
  ytDlpPath = '',
): Promise<RichMetadata> {
  engineBus.emit('MetadataLoading', { url });

  const cached = metadataCache.get(url);
  if (cached) {
    engineBus.emit('CacheHit', { url });
    engineBus.emit('MetadataLoaded', { id, title: cached.title });
    engineBus.emit('FormatsLoaded', { id, count: cached.formats.length });
    return cached;
  }
  engineBus.emit('CacheMiss', { url });

  try {
    const info = await probeMedia(url, ytDlpPath);
    const rich = toRichMetadata(info, prefs);
    metadataCache.set(url, rich);

    engineBus.emit('MetadataLoaded', { id, title: rich.title });
    engineBus.emit('FormatsLoaded', { id, count: rich.formats.length });
    if (rich.thumbnail) engineBus.emit('ThumbnailLoaded', { url });

    return rich;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load metadata';
    engineBus.emit('MetadataError', { url, message });
    throw error;
  }
}
