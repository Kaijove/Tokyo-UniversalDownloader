import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';
import { press, spring } from '@/design-system/motion/motion';
import { Spinner } from '../Spinner';
import { buttonVariants } from './Button.variants';

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'
>;

export interface ButtonProps extends NativeButtonProps, VariantProps<typeof buttonVariants> {
  /** Shows a spinner and blocks interaction without changing layout width. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leftIcon?: ReactNode;
}

/**
 * Primary interactive control. Supports six variants, five sizes, a loading
 * state, and an optional leading icon. Fully keyboard accessible.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, loading = false, leftIcon, disabled, children, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={disabled || loading ? undefined : press}
      transition={spring.snappy}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      {children}
    </motion.button>
  );
});
