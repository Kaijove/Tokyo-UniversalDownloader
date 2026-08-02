import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Spinner } from '../Spinner';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Icon rendered inside the field, before the text. */
  leftIcon?: ReactNode;
  /** Adornment rendered at the trailing edge (e.g. a submit button). */
  rightSlot?: ReactNode;
  /** Shows a spinner at the trailing edge. */
  loading?: boolean;
  /** Shows a clear button when there is a value; calls this on click. */
  onClear?: () => void;
  /** Error message; also sets aria-invalid and error styling. */
  error?: string;
}

/**
 * Text field with optional leading icon, clear button, loading spinner,
 * trailing slot and error state. Wraps a native input, so it forwards all
 * standard input props and its ref.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, leftIcon, rightSlot, loading, onClear, error, value, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hasValue = value !== undefined && value !== '';

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          'flex items-center gap-2 rounded-md border bg-surface px-3 h-9 transition-colors',
          'focus-within:border-border-hover focus-within:ring-2 focus-within:ring-focus-ring/40',
          error ? 'border-danger' : 'border-border',
        )}
      >
        {leftIcon && <span className="shrink-0 text-content-tertiary">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'flex-1 min-w-0 bg-transparent text-sm text-content-primary outline-none',
            'placeholder:text-content-tertiary',
            className,
          )}
          {...props}
        />
        {loading && <Spinner size="sm" className="text-content-tertiary" />}
        {!loading && onClear && hasValue && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear"
            className="shrink-0 text-content-tertiary hover:text-content-primary transition-colors"
          >
            <X size={16} />
          </button>
        )}
        {rightSlot && <span className="shrink-0">{rightSlot}</span>}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
