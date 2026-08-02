import type { Transition, Variants } from 'framer-motion';

/**
 * Motion duration scale (seconds). Keep interactions fast: most UI feedback
 * lands at 150ms, larger surfaces at 200-250ms. Nothing above 300ms.
 */
export const duration = {
  fast: 0.1,
  base: 0.15,
  medium: 0.2,
  slow: 0.25,
  slowest: 0.3,
} as const;

/**
 * Standard easing curves. `standard` is the default ease-out for most
 * transitions; `emphasized` gives larger surfaces a touch more character;
 * `exit` accelerates out. These are the only curves used in the app.
 */
export const easing = {
  standard: [0.2, 0, 0, 1],
  emphasized: [0.3, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
} as const;

/**
 * Spring presets for elements that benefit from physicality — pressable
 * controls and anything that should feel "picked up". Tuned to settle quickly
 * with no perceptible bounce, so they stay professional rather than playful.
 */
export const spring = {
  /** Snappy, near-critically damped — for taps and toggles. */
  snappy: { type: 'spring', stiffness: 500, damping: 32, mass: 0.7 },
  /** A little softer — for surfaces entering (popovers, cards). */
  gentle: { type: 'spring', stiffness: 320, damping: 30, mass: 0.9 },
} as const;

const base: Transition = { duration: duration.base, ease: easing.standard };

/** Fade in/out. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: base },
  exit: { opacity: 0, transition: { duration: duration.fast } },
};

/** Fade + rise, for list items and cards. */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: base },
  exit: { opacity: 0, scale: 0.98, transition: { duration: duration.fast } },
};

/** Scale in, for popovers and dropdowns anchored to a trigger. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: spring.gentle },
  exit: { opacity: 0, scale: 0.96, transition: { duration: duration.fast } },
};

/** Backdrop behind overlays and modals. */
export const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base } },
  exit: { opacity: 0, transition: { duration: duration.base } },
};

/** Modal / overlay panel entrance. */
export const modal: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: spring.gentle,
  },
  exit: { opacity: 0, scale: 0.98, y: 4, transition: { duration: duration.fast } },
};

/** Collapsible region (advanced options, log panels, details). */
export const collapse: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { duration: duration.medium, ease: easing.standard },
  },
  exit: { height: 0, opacity: 0, transition: { duration: duration.base, ease: easing.exit } },
};

/** Toast entrance from the edge. */
export const toast: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring.gentle,
  },
  exit: { opacity: 0, y: 8, transition: { duration: duration.base } },
};

/** Container that staggers its children on entrance. */
export const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
};

/** Tap feedback shared by pressable elements. */
export const press = { scale: 0.97 } as const;
