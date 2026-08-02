import { Copy } from 'lucide-react';
import { Tooltip } from '@/shared/components/ui';
import { humanBytes, humanDuration } from '@/modules/metadata';
import type { DownloadItem } from '../../types/download.types';
import { LiveLog } from './LiveLog';

interface DetailsPanelProps {
  item: DownloadItem;
  onCopyUrl: () => void;
  onCopyPath: () => void;
}

/** One label/value row in the details grid. */
function Row({ label, value, onCopy }: { label: string; value: string; onCopy?: () => void }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="shrink-0 text-xs text-content-tertiary">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate font-mono text-[11px] text-content-secondary">{value}</span>
        {onCopy && (
          <Tooltip content="Copy">
            <button
              onClick={onCopy}
              aria-label={`Copy ${label}`}
              className="shrink-0 text-content-tertiary transition-colors hover:text-content-primary"
            >
              <Copy size={12} />
            </button>
          </Tooltip>
        )}
      </span>
    </div>
  );
}

/**
 * Expanded detail view for a download: source, output, selected format and
 * stream information, plus the collapsible live log. Values are read from the
 * existing stores — nothing is recomputed here.
 */
export function DetailsPanel({ item, onCopyUrl, onCopyPath }: DetailsPanelProps) {
  const format = item.info?.formats.find((f) => f.formatId === item.selectedFormatId);

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-3">
      <div className="divide-y divide-border/60">
        <Row label="URL" value={item.url} onCopy={onCopyUrl} />
        {item.outputDir && (
          <Row label="Output folder" value={item.outputDir} onCopy={onCopyPath} />
        )}
        {item.info?.channel && <Row label="Channel" value={item.info.channel} />}
        {item.info?.durationSeconds !== null && item.info?.durationSeconds !== undefined && (
          <Row label="Duration" value={humanDuration(item.info.durationSeconds) ?? '—'} />
        )}
        {format && (
          <>
            <Row label="Format" value={`${format.formatId} · ${format.ext}`} />
            {format.vcodec && <Row label="Video codec" value={format.vcodec} />}
            {format.acodec && <Row label="Audio codec" value={format.acodec} />}
            {format.tbr && <Row label="Bitrate" value={`${Math.round(format.tbr)} kbps`} />}
            {format.filesizeBytes && (
              <Row label="Estimated size" value={humanBytes(format.filesizeBytes) ?? '—'} />
            )}
          </>
        )}
        {item.info?.subtitles && item.info.subtitles.length > 0 && (
          <Row
            label="Subtitles"
            value={item.info.subtitles
              .slice(0, 8)
              .map((s) => s.language)
              .join(', ')}
          />
        )}
      </div>

      <LiveLog id={item.id} />
    </div>
  );
}
