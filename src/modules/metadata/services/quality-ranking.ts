import type { MediaFormat } from '@/modules/downloads/types/download.types';
import type { RankedFormat, FormatKind, RankingPreferences } from '../types/metadata.types';
import { CODEC_RANK, DEFAULT_RANKING } from '../constants/ranking.constants';

/** Classifies a format by which streams it carries. */
function classify(format: MediaFormat): FormatKind {
  if (format.hasVideo && format.hasAudio) return 'merged';
  if (format.hasVideo) return 'video-only';
  return 'audio-only';
}

/** Returns a small codec bonus based on the known-codec ranking table. */
function codecBonus(vcodec: string | null, preferred: string | null): number {
  if (!vcodec) return 0;
  const lower = vcodec.toLowerCase();
  let bonus = 0;
  for (const [key, rank] of Object.entries(CODEC_RANK)) {
    if (lower.startsWith(key)) {
      bonus = rank;
      break;
    }
  }
  if (preferred && lower.includes(preferred.toLowerCase())) bonus += 10;
  return bonus;
}

/**
 * Computes a quality score for a single format. Resolution dominates, then
 * bitrate, with smaller bonuses for FPS, HDR and codec. Preferences can invert
 * the size contribution or boost a preferred codec.
 */
function scoreFormat(format: MediaFormat, prefs: RankingPreferences): number {
  const height = format.height ?? 0;
  const fps = format.fps ?? 0;
  const bitrate = format.tbr ?? 0;
  const isHdr = Boolean(format.dynamicRange);

  let score = height * 10;
  score += bitrate;
  score += codecBonus(format.vcodec, prefs.preferredCodec) * 50;
  if (isHdr) score += 200;
  if (prefs.preferHighFps) score += fps * 5;
  else if (fps > 30) score += 20;

  if (prefs.preferSmallSize && format.filesizeBytes) {
    score -= format.filesizeBytes / 1_000_000;
  }

  return Math.round(score);
}

/**
 * Enriches raw formats with a computed quality score and classification,
 * returning them sorted best-first. Pure — does not mutate its input.
 */
export function rankFormats(
  formats: MediaFormat[],
  prefs: RankingPreferences = DEFAULT_RANKING,
): RankedFormat[] {
  return formats
    .map((format) => ({
      formatId: format.formatId,
      ext: format.ext,
      kind: classify(format),
      resolution: format.resolution,
      height: format.height,
      fps: format.fps,
      vcodec: format.vcodec,
      acodec: format.acodec,
      tbr: format.tbr,
      isHdr: Boolean(format.dynamicRange),
      filesizeBytes: format.filesizeBytes,
      note: format.note,
      score: scoreFormat(format, prefs),
    }))
    .sort((a, b) => b.score - a.score);
}

/** Returns the single best format for the given preferences, or null. */
export function bestFormat(
  formats: MediaFormat[],
  prefs: RankingPreferences = DEFAULT_RANKING,
): RankedFormat | null {
  return rankFormats(formats, prefs)[0] ?? null;
}
