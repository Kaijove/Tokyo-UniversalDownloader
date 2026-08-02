import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Elevation. `flat` has no shadow; `raised` adds a subtle one. */
  elevation?: 'flat' | 'raised';
}

/**
 * Surface container one step brighter than the background. Use for grouped
 * content such as list rows and panels.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, elevation = 'flat', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-white/10 bg-surface/40 backdrop-blur-xl transition-colors duration-150',
        elevation === 'raised' && 'shadow-md',
        className,
      )}
      {...props}
    />
  );
});
