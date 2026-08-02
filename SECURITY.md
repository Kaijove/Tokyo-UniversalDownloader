# Security Policy

## Supported versions

The project is pre-1.0 and under active development. Security fixes target the
latest version on `main`.

| Version | Supported |
| ------- | --------- |
| Latest `main` | ✅ |
| Older | ❌ |

## Reporting a vulnerability

Please report vulnerabilities **privately** — do not open a public issue for a
security problem.

Use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
("Report a vulnerability" under the repository's **Security** tab). Include:

- A description of the issue and its impact.
- Steps to reproduce.
- Affected version / commit.

You'll get an acknowledgement, and a fix will be prioritised based on severity.
Please allow reasonable time for a fix before any public disclosure.

## Security posture

Some context on how the app handles security-relevant areas:

- **Content Security Policy** — the webview runs under a restrictive CSP.
- **Least-privilege permissions** — the Tauri capability set grants only the
  permissions the app actually uses; unused ones have been removed.
- **No arbitrary command execution** — the backend runs only `yt-dlp` and
  `ffmpeg`, with validated arguments. Output paths are validated (must be
  absolute, no `..`).
- **Path handling** — the "open file/folder" command only opens validated
  paths, never arbitrary URLs.
- **Updater** — when enabled, updates are cryptographically signed and verified;
  this cannot be disabled. It is currently not configured (no endpoint/keys).

## Good practices for users

- Install `yt-dlp` and `ffmpeg` from official sources.
- Keep `yt-dlp` up to date — sites change, and updates keep downloads working.
- Be cautious with cookie import: it grants the app access to session cookies
  for the sites you download from.
