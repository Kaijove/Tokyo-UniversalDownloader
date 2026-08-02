import type { RankedFormat } from '@/modules/metadata';
import { humanBytes } from '@/modules/metadata';

/** Builds a readable label for a format option in the select. */
export function formatLabel(format: RankedFormat): string {
  const kind =
    format.kind === 'audio-only' ? 'audio' : (format.resolution ?? 'video');
  const parts = [kind, format.ext.toUpperCase()];
  if (format.fps && format.fps > 30) parts.push(`${Math.round(format.fps)}fps`);
  if (format.isHdr) parts.push('HDR');
  const size = humanBytes(format.filesizeBytes);
  if (size) parts.push(size);
  return parts.join(' · ');
}
