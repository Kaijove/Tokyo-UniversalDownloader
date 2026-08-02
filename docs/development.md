# Development

Setting up a local development environment and the day-to-day workflow.

## Table of contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Scripts](#scripts)
- [Project layout](#project-layout)
- [Conventions](#conventions)
- [Testing](#testing)

## Prerequisites

- **Node.js 20+** and **pnpm 9+**
- **Rust** (stable) with the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)
- **yt-dlp** and **ffmpeg** on your PATH (see [installation.md](installation.md))

## Setup

```bash
pnpm install
pnpm tauri dev
```

`pnpm tauri dev` starts Vite and launches the desktop app with hot reload for
the frontend. Rust changes trigger a recompile.

## Scripts

| Script | What it does |
| ------ | ------------ |
| `pnpm dev` | Vite dev server only (no desktop shell) |
| `pnpm tauri dev` | Full desktop app in dev mode |
| `pnpm build` | Type-check + production frontend build |
| `pnpm tauri build` | Build installers for the current platform |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm lint` | ESLint (zero warnings allowed) |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting without writing |
| `pnpm test` | Vitest (watch mode) |
| `pnpm test:run` | Vitest once |
| `pnpm test:coverage` | Vitest with a coverage report |
| `pnpm check` | typecheck + lint + tests |
| `pnpm doctor` | check + production build |
| `pnpm clean` | Remove `dist` and `src-tauri/target` |

Run `pnpm check` before pushing; it mirrors what CI enforces.

## Project layout

See [architecture.md](architecture.md) for the full breakdown. In short:

- `src/` — the React/TypeScript frontend, organised into feature modules.
- `src-tauri/` — the Rust backend and Tauri configuration.
- `docs/` — this documentation.
- `.github/` — CI/CD workflows and Dependabot.

## Conventions

- **Business logic never lives in components.** It belongs to hooks, services,
  or stores. Components render and delegate.
- **One responsibility per hook.** A hook orchestrates a single concern.
- **Types are shared contracts.** Cross-module types live in a module's
  `types/` and are imported, not duplicated.
- **No dead toggles.** A setting or option is only added once it has a real effect.

See [CONTRIBUTING.md](../CONTRIBUTING.md) for commit and PR conventions.

## Testing

Tests are written with Vitest and colocated under `__tests__/` folders next to
the code they cover. Run the full suite with:

```bash
pnpm test:run
```

Cover pure logic (parsers, builders, stores, guards) with unit tests. Anything
that talks to Tauri is mocked at the module boundary — see existing tests under
`src/modules/**/__tests__/` for the pattern.
