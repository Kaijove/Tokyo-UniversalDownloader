import { useMemo } from 'react';
import { Select } from '@/shared/components/ui';
import { parseFormats, type RankedFormat } from '@/modules/metadata';
import { formatLabel } from '../utils/format.utils';

interface FormatSelectProps {
  formats: RankedFormat[];
  value: string | null;
  onChange: (formatId: string) => void;
}

interface Group {
  label: string;
  formats: RankedFormat[];
}

/** Dropdown for choosing which format to download, grouped and quality-ranked. */
export function FormatSelect({ formats, value, onChange }: FormatSelectProps) {
  const groups = useMemo<Group[]>(() => {
    const parsed = parseFormats(rawFromRanked(formats));
    return [
      { label: 'Video + Audio', formats: parsed.merged },
      { label: 'Video only', formats: parsed.videoOnly },
      { label: 'Audio only', formats: parsed.audioOnly },
    ].filter((g) => g.formats.length > 0);
  }, [formats]);

  if (formats.length === 0) return null;

  return (
    <Select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Download format"
    >
      {groups.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.formats.map((format) => (
            <option key={format.formatId} value={format.formatId}>
              {formatLabel(format)}
            </option>
          ))}
        </optgroup>
      ))}
    </Select>
  );
}

/**
 * The formats are already ranked; `parseFormats` re-groups them by kind while
 * preserving order. It expects raw formats, so we adapt the ranked shape back
 * to the minimal fields it reads.
 */
function rawFromRanked(formats: RankedFormat[]) {
  return formats.map((f) => ({
    formatId: f.formatId,
    ext: f.ext,
    resolution: f.resolution,
    height: f.height,
    fps: f.fps,
    vcodec: f.vcodec,
    acodec: f.acodec,
    tbr: f.tbr,
    dynamicRange: f.isHdr ? 'HDR' : null,
    filesizeBytes: f.filesizeBytes,
    note: f.note,
    hasVideo: f.kind !== 'audio-only',
    hasAudio: f.kind !== 'video-only',
  }));
}
