# Build & Packaging

How the app is built for production and which installers each platform produces.

## Table of contents

- [Building](#building)
- [Output formats](#output-formats)
- [Release profile](#release-profile)
- [Bundle configuration](#bundle-configuration)
- [Signing & notarisation](#signing--notarisation)

## Building

```bash
pnpm tauri build
```

This runs the frontend production build, compiles the Rust backend with the
release profile, and produces native installers for the platform you run it on.
Installers **cannot** be cross-compiled — build each platform on that platform
(or use the release CI workflow, which does exactly this across a matrix).

## Output formats

`bundle.targets` is set explicitly to:

| Platform | Formats |
| -------- | ------- |
| Windows | `nsis` (`-setup.exe`), `msi` |
| macOS | `app`, `dmg` |
| Linux | `deb`, `rpm`, `appimage` |

Tauri automatically selects the targets applicable to the current OS. Installer
names include the product name and version, e.g.
`Universal_Downloader_1.0.0_x64-setup.exe`.

## Release profile

The Rust release profile (in `src-tauri/Cargo.toml`) is tuned for a small,
fast, distributable binary:

| Setting | Value | Why |
| ------- | ----- | --- |
| `opt-level` | `"s"` | Optimise for size; no meaningful speed loss for an I/O-bound app |
| `lto` | `true` | Link-time optimisation across crates |
| `codegen-units` | `1` | Maximise optimisation |
| `strip` | `true` | Drop debug symbols |
| `panic` | `"abort"` | No unwinding machinery — smaller binary |
| `trim-paths` | `"all"` | Remove local filesystem paths from the binary |

This is the profile recommended by the Tauri documentation.

## Bundle configuration

Configured in `src-tauri/tauri.conf.json` under `bundle`:

- **Product metadata** — publisher, copyright, category, descriptions.
- **Windows** — NSIS `installMode: both` (user can choose per-user or
  per-machine); WebView2 via `downloadBootstrapper` (fetched if missing).
- **Linux** — deb/rpm/AppImage; the AppImage doesn't bundle the media
  framework (the app downloads media, it doesn't play it).
- **macOS** — `minimumSystemVersion: 10.15`.

## Signing & notarisation

The build is currently **unsigned**. The release workflow
(`.github/workflows/release.yml`) already references the secrets needed to sign,
but they are optional — without them, unsigned installers are produced.

To enable signing, add these repository secrets:

- **Windows / updater:** `TAURI_SIGNING_PRIVATE_KEY`, `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- **macOS notarisation:** `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`,
  `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`

See [desktop-integration.md](desktop-integration.md#updater) for the updater's
signing keys specifically.
