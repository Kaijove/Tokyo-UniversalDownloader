import type { MediaFormat } from '@/modules/downloads/types/download.types';
import type { RankedFormat, RankingPreferences } from '../types/metadata.types';
import { rankFormats } from './quality-ranking';
import { DEFAULT_RANKING } from '../constants/ranking.constants';

/** Formats grouped by kind, each group ranked best-first. */
export interface GroupedFormats {
  merged: RankedFormat[];
  videoOnly: RankedFormat[];
  audioOnly: RankedFormat[];
}

/**
 * Ranks and groups formats into merged / video-only / audio-only buckets for
 * the UI. Invalid formats (no streams) are already excluded upstream by the
 * provider. Pure and side-effect free.
 */
export function parseFormats(
  formats: MediaFormat[],
  prefs: RankingPreferences = DEFAULT_RANKING,
): GroupedFormats {
  const ranked = rankFormats(formats, prefs);
  return {
    merged: ranked.filter((f) => f.kind === 'merged'),
    videoOnly: ranked.filter((f) => f.kind === 'video-only'),
    audioOnly: ranked.filter((f) => f.kind === 'audio-only'),
  };
}
