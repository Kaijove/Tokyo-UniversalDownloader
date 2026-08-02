/**
 * Typography scale. Each level pairs a Tailwind class string with its intent.
 * Use these constants (or the matching Tailwind classes) instead of ad-hoc
 * font sizing so text stays consistent across modules.
 */
export const typography = {
  display: 'text-4xl font-semibold tracking-tight leading-tight',
  title: 'text-2xl font-semibold tracking-tight leading-snug',
  subtitle: 'text-lg font-medium tracking-tight leading-snug',
  bodyLarge: 'text-base font-normal leading-relaxed',
  body: 'text-sm font-normal leading-normal',
  bodySmall: 'text-xs font-normal leading-normal',
  caption: 'text-xs font-normal tracking-wide text-content-tertiary',
  label: 'text-xs font-medium tracking-wide uppercase',
  button: 'text-sm font-medium tracking-tight',
  mono: 'font-mono text-xs tracking-tight',
} as const;

export type TypographyLevel = keyof typeof typography;
