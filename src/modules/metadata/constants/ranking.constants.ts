import type { RankingPreferences } from '../types/metadata.types';

/** Default ranking: best overall quality, HDR and modern codecs favoured. */
export const DEFAULT_RANKING: RankingPreferences = {
  preferHighFps: false,
  preferSmallSize: false,
  preferredCodec: null,
};

/** Codec preference order (higher index = more modern/efficient). */
export const CODEC_RANK: Record<string, number> = {
  'avc1': 1,
  'h264': 1,
  'vp9': 2,
  'vp09': 2,
  'av01': 3,
  'av1': 3,
};
