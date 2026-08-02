import { cn } from '@/shared/utils/cn';

export interface SkeletonProps {
  className?: string;
}

/**
 * Placeholder block shown while content loads. Uses a slow, low-contrast pulse
 * so it reads as "loading" without drawing attention away from the rest of the
 * screen. Respects reduced-motion via the global stylesheet.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-surface-elevated', className)}
    />
  );
}
