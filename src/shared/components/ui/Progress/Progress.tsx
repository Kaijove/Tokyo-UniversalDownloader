import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import { duration, easing } from '@/design-system/motion/motion';

export interface ProgressProps {
  /** 0–100. Values outside the range are clamped. */
  value: number;
  /** Thicker bar with a gradient fill, glow and a moving shimmer. */
  premium?: boolean;
  className?: string;
  'aria-label'?: string;
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/**
 * Linear determinate progress bar with an animated fill. In `premium` mode it
 * gets a pink→lavender gradient, a soft glow, and a travelling shimmer while
 * active — all transform/opacity based, so it stays cheap.
 */
export function Progress({
  value,
  premium = false,
  className,
  'aria-label': ariaLabel,
}: ProgressProps) {
  const pct = clamp(value);
  const reduce = useReducedMotion();
  const active = pct > 0 && pct < 100;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn(
        'w-full overflow-hidden rounded-full bg-surface-elevated',
        premium ? 'h-2' : 'h-1',
        className,
      )}
    >
      <motion.div
        className={cn(
          'relative h-full rounded-full',
          premium ? 'bg-gradient-to-r from-primary to-accent shadow-glow' : 'bg-primary',
        )}
        animate={{ width: `${pct}%` }}
        transition={{ duration: duration.medium, ease: easing.standard }}
      >
        {premium && active && !reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-y-0 right-0 w-16 rounded-full bg-gradient-to-r from-transparent to-white/40"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
    </div>
  );
}
