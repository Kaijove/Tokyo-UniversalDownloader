# Contributing

Thanks for your interest in contributing. This guide covers the project
structure, conventions, and how to get a change merged.

## Table of contents

- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Conventions](#conventions)
- [Commits](#commits)
- [Branching](#branching)
- [Pull requests](#pull-requests)
- [Testing & lint](#testing--lint)

## Getting started

See [docs/development.md](docs/development.md) for environment setup. In short:

```bash
pnpm install
pnpm tauri dev
```

## Project structure

```
src/            Frontend (React + TypeScript), organised into feature modules
src-tauri/      Rust backend and Tauri config
docs/           Documentation
.github/        CI/CD workflows and Dependabot
```

Each frontend module has `components/` (UI), `hooks/` (orchestration),
`services/` (side effects), `stores/` (state), and `types/` (contracts). See
[docs/architecture.md](docs/architecture.md) for the full picture.

## Conventions

- **Business logic never lives in components** — it belongs to hooks, services,
  or stores.
- **One responsibility per hook.**
- **Types are shared contracts** — import them, don't duplicate.
- **No dead toggles** — only add a control once it has a real effect.
- Comments explain *why*, not *what*. Don't comment the obvious.

## Commits

Use clear, imperative commit messages. A conventional-commits-style prefix is
encouraged and matches what Dependabot uses:

```
feat: add subtitle language selector
fix: prevent retry after cancel during backoff
docs: document the settings groups
ci: bump actions/checkout to v4
```

## Branching

- `main` is the stable branch; CI runs on every push and PR to it.
- Work on feature branches and open a PR into `main`.

## Pull requests

Before opening a PR:

```bash
pnpm check      # typecheck + lint + tests — must pass
```

In the PR description, explain what changed and why. Keep PRs focused; smaller
PRs are easier to review. CI (type-check, lint, tests, cargo check + clippy,
and a build) must be green.

## Testing & lint

- Add or update tests for logic you change. Tests live under `__tests__/`
  folders beside the code.
- `pnpm test:run` — run the suite once.
- `pnpm lint` — ESLint, zero warnings allowed.
- `pnpm typecheck` — TypeScript with no emit.

Anything that talks to Tauri is mocked at the module boundary; follow the
patterns in existing tests.
