import { cva } from 'class-variance-authority';

/**
 * Button style variants. The base handles layout, focus ring, transitions and
 * disabled state; `variant` and `size` compose on top.
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium tracking-tight rounded-md',
    'transition-colors duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-45',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
        secondary: 'bg-surface-elevated text-content-primary hover:bg-muted border border-border',
        ghost: 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary',
        outline: 'border border-border text-content-primary hover:border-border-hover hover:bg-surface-secondary',
        danger: 'bg-danger text-white hover:opacity-90 active:opacity-100',
        success: 'bg-success text-white hover:opacity-90 active:opacity-100',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-11 px-5 text-sm',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);
