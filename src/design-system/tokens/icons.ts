/**
 * Canonical icon sizes (px). Icons should never dominate the UI — default to
 * `md` (18) inside buttons and rows, `sm` (16) for dense inline glyphs.
 */
export const iconSize = {
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export type IconSize = keyof typeof iconSize;
