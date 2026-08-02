import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { backdrop, modal } from '@/design-system/motion/motion';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';
import { HistoryPanel } from './HistoryPanel';

interface HistoryOverlayProps {
  onClose: () => void;
}

/**
 * History as a light overlay, matching the settings pattern and sharing its
 * motion (backdrop + modal spring) so the two feel identical. Reuses the
 * existing `HistoryPanel` unchanged.
 */
export function HistoryOverlay({ onClose }: HistoryOverlayProps) {
  useEscapeKey(onClose);
  return (
    <motion.div
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 p-6 pt-[10vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[70vh] w-[min(560px,92vw)] flex-col overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-2xl shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-content-primary">History</h2>
          <button
            onClick={onClose}
            aria-label="Close history"
            className="text-content-tertiary transition-colors hover:text-content-primary"
          >
            <X size={18} />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <HistoryPanel />
        </div>
      </motion.div>
    </motion.div>
  );
}
