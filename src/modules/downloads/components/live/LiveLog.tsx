import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { collapse } from '@/design-system/motion/motion';
import { ChevronDown, Terminal } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useLiveStore } from '../../stores/live.store';
import type { LogLevel } from '../../types/live.types';

interface LiveLogProps {
  id: string;
}

const LEVEL_COLOR: Record<LogLevel, string> = {
  info: 'text-content-tertiary',
  warning: 'text-warning',
  error: 'text-danger',
};

/**
 * Collapsible live log of provider output for one download. Lines come
 * straight from the backend; the store keeps a bounded buffer so a long
 * download can't grow memory without limit.
 */
export function LiveLog({ id }: LiveLogProps) {
  const [open, setOpen] = useState(false);
  const lines = useLiveStore((s) => s.logs[id]);

  if (!lines || lines.length === 0) return null;

  return (
    <div className="rounded-md border border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-2.5 py-1.5 text-xs text-content-secondary hover:text-content-primary"
      >
        <span className="flex items-center gap-1.5">
          <Terminal size={13} /> Log ({lines.length})
        </span>
        <ChevronDown
          size={13}
          className={cn('transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            variants={collapse}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="max-h-48 overflow-y-auto border-t border-border px-2.5 py-2">
              {lines.map((line, index) => (
                <p
                  key={`${line.timestamp}-${index}`}
                  className={cn('font-mono text-[11px] leading-relaxed', LEVEL_COLOR[line.level])}
                >
                  {line.message}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
