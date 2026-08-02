# Design System — Universal Downloader

Foundations + the components the app actually uses. Extend it component by
component as new UI needs appear — don't pre-build unused pieces.

## Layers

1. **Tokens** (`tokens/tokens.css`) — semantic CSS variables, the single source
   of truth for color, radius and shadow. Dark is default; `[data-theme="light"]`
   overrides. Components never reference raw hex values.
2. **Tailwind mapping** (`tailwind.config.js`) — exposes tokens as utilities
   (`bg-surface`, `text-content-primary`, `rounded-lg`, `shadow-md`, …).
3. **Scale tokens** (`tokens/typography.ts`, `tokens/icons.ts`) — importable
   typography and icon-size constants.
4. **Motion** (`motion/motion.ts`) — reusable Framer Motion presets and the
   duration/easing scales. Nothing animates longer than 300ms.

## Conventions

- Every component uses the `cn()` helper (`clsx` + `tailwind-merge`) for
  className composition.
- Variants use CVA (`*.variants.ts`) so styles stay declarative and typed.
- No `any`, no inline color styles, no hardcoded hex.
- Each component folder exports through its own `index.ts`; the UI barrel is
  `shared/components/ui/index.ts`.
- Accessibility is not optional: focus-visible rings, ARIA roles/labels,
  keyboard support, and `prefers-reduced-motion` (see `useReducedMotion` and
  the global CSS safety net).

## Components

Button, Input, Select, Card, Badge, Spinner, Progress + CircularProgress,
Tooltip, Dialog, EmptyState, Toast (via `ToastViewport` + `useToast`).

## Theming

`useTheme()` reads/sets `data-theme` on the document root and persists the
choice. Add a toggle anywhere and both themes work from the same tokens.
