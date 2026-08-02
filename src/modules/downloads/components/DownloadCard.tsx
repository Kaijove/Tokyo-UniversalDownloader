import { memo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ArrowDownToLine, FolderOpen, Check, Play } from 'lucide-react';
import { platformResolver } from '@/core/engine';
import { Button, Card, Skeleton, Progress } from '@/shared/components/ui';
import { humanDuration, humanBytes } from '@/modules/metadata';
import { cn } from '@/shared/utils/cn';
import { collapse, slideUp } from '@/design-system/motion/motion';
import type { DownloadItem } from '../types/download.types';
import { useDownloadsStore } from '../stores/downloads.store';
import { useDashboardStore } from '../stores/dashboard.store';
import { useDownloadActions } from '../hooks/useDownloadActions';
import { useEnqueueDownload } from '../hooks/useEnqueueDownload';
import { FormatSelect } from './FormatSelect';
import { Thumbnail } from './Thumbnail';
import { MetadataPreview } from './MetadataPreview';
import { StatusBadge } from './dashboard/StatusBadge';
import { CardActions } from './dashboard/CardActions';
import { PhaseIndicator } from './live/PhaseIndicator';
import { MediaBadges } from './live/MediaBadges';
import { DetailsPanel } from './live/DetailsPanel';
import { ErrorPanel } from './live/ErrorPanel';

interface DownloadCardProps {
  item: DownloadItem;
}

const PROGRESS_STATES = new Set(['downloading', 'paused']);

/**
 * A single download as a premium card: a large thumbnail, a clear title block,
 * and a state-aware right side (live progress, a satisfying completed state, or
 * a human error). Expandable for full technical detail. Memoised so only cards
 * whose item changed re-render. All logic is reused — this is composition only.
 */
export const DownloadCard = memo(function DownloadCard({ item }: DownloadCardProps) {
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  const selectFormat = useDownloadsStore((s) => s.selectFormat);
  const selected = useDashboardStore((s) => s.selected.has(item.id));
  const toggleSelected = useDashboardStore((s) => s.toggleSelected);
  const actions = useDownloadActions();
  const { requestDownload } = useEnqueueDownload();

  const platform = platformResolver.resolve(item.url);
  const isActive = PROGRESS_STATES.has(item.status);
  const isDone = item.status === 'done';
  const isError = item.status === 'error';
  const isReady = item.status === 'ready' && !!item.info;
  const isProbing = item.status === 'probing';

  return (
    <motion.div variants={slideUp} exit="exit" layout>
      <Card
        className={cn(
          'group overflow-hidden p-0 transition-shadow duration-200 hover:shadow-lg',
          isDone && 'border-success/25',
          isError && 'border-danger/25',
        )}
      >
        <div className="flex gap-4 p-3.5">
          {/* Selection checkbox — appears on hover, for bulk actions. */}
          <input
            type="checkbox"
            checked={selected}
            onChange={() => toggleSelected(item.id)}
            aria-label="Select download"
            className={cn(
              'mt-1 h-4 w-4 shrink-0 accent-primary transition-opacity',
              selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            )}
          />

          {/* ── Thumbnail (hero of the card) ── */}
          <div className="relative shrink-0">
            {isProbing ? (
              <Skeleton className="h-[72px] w-32 rounded-lg" />
            ) : (
              <div className="overflow-hidden rounded-lg">
                <motion.div
                  whileHover={reduce ? undefined : { scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <Thumbnail
                    src={item.info?.thumbnail ?? null}
                    alt={item.info?.title ?? 'Download'}
                    durationLabel={humanDuration(item.info?.durationSeconds ?? null)}
                    className="h-[72px] w-32"
                  />
                </motion.div>
              </div>
            )}
          </div>

          {/* ── Info + state ── */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-0.5">
            {/* Title row */}
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-content-primary">
                  {item.info?.title ?? item.url}
                </p>
                <p className="mt-1 truncate text-[13px] text-content-secondary">
                  {platform.displayName}
                  {subtitleFor(item) && ` · ${subtitleFor(item)}`}
                </p>
              </div>

              {/* Right controls: status + actions + expand */}
              <div className="flex shrink-0 items-center gap-1">
                {!isActive && !isDone && <StatusBadge status={item.status} />}
                <div className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <CardActions item={item} />
                </div>
                <button
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  aria-label={expanded ? 'Hide details' : 'Show details'}
                  className="shrink-0 rounded-md p-1 text-content-tertiary transition-colors hover:bg-surface-secondary hover:text-content-primary"
                >
                  <ChevronDown
                    size={16}
                    className={cn('transition-transform duration-150', expanded && 'rotate-180')}
                  />
                </button>
              </div>
            </div>

            {/* State-specific bottom row */}
            {isActive && (
              <div className="flex flex-col gap-1.5">
                <Progress value={item.progress} premium aria-label="Download progress" />
                <div className="flex items-center justify-between text-xs text-content-tertiary">
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-content-secondary">
                      {Math.round(item.progress)}%
                    </span>
                    {item.status === 'downloading' && <PhaseIndicator id={item.id} />}
                    {item.status === 'paused' && <span>Paused</span>}
                  </span>
                  <span className="flex items-center gap-2 tabular-nums">
                    {item.speed && <span>{item.speed}</span>}
                    {item.eta && <span>{item.eta} left</span>}
                  </span>
                </div>
              </div>
            )}

            {isDone && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5 text-sm font-medium text-success">
                  <motion.span
                    initial={reduce ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className="grid h-5 w-5 place-items-center rounded-full bg-success/15"
                  >
                    <Check size={13} />
                  </motion.span>
                  Completat
                  {sizeLabel(item) && (
                    <span className="ml-1 font-normal text-content-tertiary">
                      · {sizeLabel(item)}
                    </span>
                  )}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<FolderOpen size={14} />}
                  onClick={() => actions.openFile(item)}
                >
                  Obrir
                </Button>
              </motion.div>
            )}

            {isReady && item.info && (
              <div className="flex flex-col gap-2">
                <MediaBadges info={item.info} selectedFormatId={item.selectedFormatId} />
                <div className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <FormatSelect
                      formats={item.info.formats}
                      value={item.selectedFormatId}
                      onChange={(formatId) => selectFormat(item.id, formatId)}
                    />
                  </div>
                  <Button
                    onClick={() => void requestDownload(item.id)}
                    leftIcon={<ArrowDownToLine size={16} />}
                    className="shrink-0 shadow-glow"
                  >
                    Download
                  </Button>
                </div>
              </div>
            )}

            {item.status === 'queued' && (
              <div className="flex items-center gap-2 text-xs text-content-tertiary">
                <Play size={12} />
                Esperant torn…
              </div>
            )}
          </div>
        </div>

        {/* Probing skeleton detail */}
        {isProbing && (
          <div className="px-3 pb-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        )}

        {/* Error, full width under the card */}
        {isError && (
          <div className="px-3 pb-3">
            <ErrorPanel item={item} onRetry={() => actions.retry(item)} />
          </div>
        )}

        {/* Ready metadata preview */}
        {isReady && item.info && (
          <div className="border-t border-border/50 px-3 py-2">
            <MetadataPreview info={item.info} />
          </div>
        )}

        {/* Expandable technical detail */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              variants={collapse}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden border-t border-border/50 px-3"
            >
              <DetailsPanel
                item={item}
                onCopyUrl={() => actions.copyUrl(item)}
                onCopyPath={() => actions.copyFilePath(item)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
});

/** Chooses the right subtitle text for the card given its status. */
function subtitleFor(item: DownloadItem): string {
  if (item.status === 'cancelled') return 'Cancelled';
  return formatLabel(item);
}

/** A short "MP4 · 1080p" style label from the selected format, when known. */
function formatLabel(item: DownloadItem): string {
  const fmt = item.info?.formats?.find((f) => f.formatId === item.selectedFormatId);
  if (!fmt) return item.info?.uploader ?? '';
  const bits = [fmt.ext?.toUpperCase(), fmt.resolution].filter(Boolean);
  return bits.join(' · ');
}

/** Total size label for a finished download, when known. */
function sizeLabel(item: DownloadItem): string | null {
  return humanBytes(item.totalBytes);
}
