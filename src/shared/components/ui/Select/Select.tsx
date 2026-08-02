import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Optional visible label rendered above the field. */
  label?: string;
  /** `<option>` / `<optgroup>` elements. */
  children: ReactNode;
}

/**
 * Styled wrapper around a native `<select>`, keeping full keyboard and
 * screen-reader behaviour while matching the design system. A chevron is
 * layered on top of the native control.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, id, children, ...props },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-content-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full appearance-none rounded-md border border-border bg-surface-secondary',
            'px-3 pr-9 h-9 text-xs text-content-secondary outline-none transition-colors',
            'hover:border-border-hover focus-visible:border-border-hover',
            'focus-visible:ring-2 focus-visible:ring-focus-ring/40',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary"
        />
      </div>
    </div>
  );
});
