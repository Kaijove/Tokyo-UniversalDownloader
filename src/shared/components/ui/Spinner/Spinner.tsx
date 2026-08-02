import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { iconSize, type IconSize } from '@/design-system/tokens';

interface SpinnerProps {
  size?: IconSize;
  className?: string;
  label?: string;
}

/** Indeterminate loading spinner. Announces itself to assistive tech. */
export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={label}
      size={iconSize[size]}
      className={cn('animate-spin text-current', className)}
    />
  );
}
