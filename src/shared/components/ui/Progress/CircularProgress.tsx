import { cn } from '@/shared/utils/cn';

export interface CircularProgressProps {
  /** 0–100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/** Circular determinate progress indicator. */
export function CircularProgress({
  value,
  size = 36,
  strokeWidth = 3,
  className,
}: CircularProgressProps) {
  const pct = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('-rotate-90', className)}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        className="fill-none stroke-surface-elevated"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="fill-none stroke-primary transition-[stroke-dashoffset] duration-200 ease-out"
      />
    </svg>
  );
}
