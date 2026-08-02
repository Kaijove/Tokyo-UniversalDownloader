import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import { scaleIn } from '@/design-system/motion/motion';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}

/**
 * Lightweight tooltip shown on hover and keyboard focus. The trigger is
 * described by the tooltip via aria-describedby so screen readers announce it.
 */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const position =
    side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap',
              'rounded-md border border-border bg-surface-elevated px-2 py-1 text-xs text-content-primary shadow-md',
              position,
              className,
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
