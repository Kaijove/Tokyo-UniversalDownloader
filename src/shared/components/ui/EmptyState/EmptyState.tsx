import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Centered placeholder for empty lists. The icon sits in a soft glowing badge
 * and the whole thing fades up on mount, so an empty screen feels intentional
 * rather than broken.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className,
      )}
    >
      {icon && (
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary shadow-glow">
          {icon}
        </div>
      )}
      <p className="text-base font-medium text-content-primary">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-content-secondary">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
