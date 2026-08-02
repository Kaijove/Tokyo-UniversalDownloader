import { Badge } from '@/shared/components/ui';
import type { RankedFormat, RichMetadata } from '@/modules/metadata';

interface MediaBadgesProps {
  info: RichMetadata;
  selectedFormatId: string | null;
}

/**
 * Technical badges for the selected format: resolution, frame rate, HDR,
 * codecs and container, plus content flags. Every badge is derived from real
 * metadata and omitted when the value is unknown.
 */
export function MediaBadges({ info, selectedFormatId }: MediaBadgesProps) {
  const format: RankedFormat | undefined =
    info.formats.find((f) => f.formatId === selectedFormatId) ?? info.formats[0];

  const badges: { key: string; label: string; tone?: 'neutral' | 'info' | 'warning' }[] = [];

  if (format?.resolution) badges.push({ key: 'res', label: format.resolution });
  if (format?.fps && format.fps > 30) {
    badges.push({ key: 'fps', label: `${Math.round(format.fps)}fps` });
  }
  if (format?.isHdr) badges.push({ key: 'hdr', label: 'HDR', tone: 'info' });
  if (format?.vcodec) badges.push({ key: 'vcodec', label: shortCodec(format.vcodec) });
  if (format?.acodec) badges.push({ key: 'acodec', label: shortCodec(format.acodec) });
  if (format?.ext) badges.push({ key: 'ext', label: format.ext.toUpperCase() });
  if (info.subtitles.length > 0) {
    badges.push({ key: 'subs', label: `${info.subtitles.length} subs`, tone: 'info' });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <Badge key={b.key} tone={b.tone ?? 'neutral'} size="sm">
          {b.label}
        </Badge>
      ))}
    </div>
  );
}

/** Trims a codec string like `avc1.640028` down to `avc1`. */
function shortCodec(codec: string): string {
  return codec.split('.')[0].toUpperCase();
}
