import {
  Clock,
  Loader2,
  Download,
  Pause,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSearch,
  type LucideProps,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { Badge, type ToastTone } from '@/shared/components/ui';
import { spring } from '@/design-system/motion/motion';
import type { DownloadStatus } from '../../types/download.types';

type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface StatusMeta {
  label: string;
  tone: BadgeTone;
  icon: ComponentType<LucideProps>;
  spin?: boolean;
}

const STATUS_META: Record<DownloadStatus, StatusMeta> = {
  idle: { label: 'Idle', tone: 'neutral', icon: Clock },
  probing: { label: 'Analyzing', tone: 'primary', icon: FileSearch, spin: false },
  ready: { label: 'Ready', tone: 'info', icon: Download },
  queued: { label: 'Queued', tone: 'info', icon: Clock },
  downloading: { label: 'Downloading', tone: 'primary', icon: Loader2, spin: true },
  paused: { label: 'Paused', tone: 'warning', icon: Pause },
  done: { label: 'Completed', tone: 'success', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', tone: 'neutral', icon: XCircle },
  error: { label: 'Failed', tone: 'danger', icon: AlertCircle },
};

/**
 * Accessible status badge with a unique icon and colour per state. The icon
 * animates in on each state change — a small spring that makes reaching
 * "Completed" feel like a moment without being loud.
 */
export function StatusBadge({ status }: { status: DownloadStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <Badge tone={meta.tone} size="sm">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={spring.snappy}
          className="inline-flex"
        >
          <Icon size={12} className={meta.spin ? 'animate-spin' : undefined} />
        </motion.span>
      </AnimatePresence>
      {meta.label}
    </Badge>
  );
}

// Re-exported for callers that only need the tone mapping.
export type { ToastTone };
