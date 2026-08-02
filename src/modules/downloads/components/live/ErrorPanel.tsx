import { useState } from 'react';
import { AlertCircle, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { explainError } from '../../utils/explain-error';
import type { DownloadItem } from '../../types/download.types';

interface ErrorPanelProps {
  item: DownloadItem;
  onRetry: () => void;
}

/**
 * Human-readable failure panel: what happened, the likely reason, what to try,
 * and the raw provider message behind a disclosure. Replaces showing users a
 * bare yt-dlp error string.
 */
export function ErrorPanel({ item, onRetry }: ErrorPanelProps) {
  const [showTechnical, setShowTechnical] = useState(false);
  const raw = item.error ?? 'Unknown error';
  const explanation = explainError(raw);

  return (
    <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2.5">
      <div className="flex items-start gap-2">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-danger" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-content-primary">{explanation.summary}</p>
          {explanation.reason && (
            <p className="mt-0.5 text-xs text-content-secondary">{explanation.reason}</p>
          )}
          {explanation.suggestion && (
            <p className="mt-1 text-xs text-content-tertiary">{explanation.suggestion}</p>
          )}

          <div className="mt-2 flex items-center gap-2">
            {explanation.retryable && (
              <Button size="sm" variant="secondary" leftIcon={<RotateCcw size={13} />} onClick={onRetry}>
                Try again
              </Button>
            )}
            <button
              onClick={() => setShowTechnical((v) => !v)}
              aria-expanded={showTechnical}
              className="flex items-center gap-1 text-xs text-content-tertiary hover:text-content-secondary"
            >
              Technical details
              <ChevronDown
                size={12}
                className={cn('transition-transform duration-150', showTechnical && 'rotate-180')}
              />
            </button>
          </div>

          {showTechnical && (
            <pre className="mt-2 max-h-32 overflow-auto rounded bg-surface-elevated p-2 font-mono text-[11px] text-content-tertiary">
              {raw}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
