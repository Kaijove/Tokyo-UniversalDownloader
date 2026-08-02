import { AlertTriangle, X } from 'lucide-react';
import type { RecoveryReport } from '../services/session-recovery';

interface CrashBannerProps {
  report: RecoveryReport;
  onDismiss: () => void;
}

/**
 * Explains that the previous session ended unexpectedly and that unfinished
 * downloads were restored. The restoration itself is handled by the existing
 * persistence layer — this only tells the user why their queue reappeared.
 */
export function CrashBanner({ report, onDismiss }: CrashBannerProps) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2.5"
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-content-primary">
          The app closed unexpectedly last time.
        </p>
        <p className="mt-0.5 text-xs text-content-secondary">
          {report.pendingDownloads > 0
            ? `${report.pendingDownloads} unfinished download${
                report.pendingDownloads === 1 ? '' : 's'
              } were restored to the queue.`
            : 'Your queue and settings were restored.'}
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-content-tertiary transition-colors hover:text-content-primary"
      >
        <X size={14} />
      </button>
    </div>
  );
}
