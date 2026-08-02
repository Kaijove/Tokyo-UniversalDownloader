import { invoke } from '@tauri-apps/api/core';
import { getVersion } from '@tauri-apps/api/app';
import { arch, platform, version as osVersion } from '@tauri-apps/plugin-os';

/** Version information reported by an external tool. */
export interface ToolVersion {
  /** The version string, or null when the tool could not be run. */
  version: string | null;
  /** Populated when the tool is missing or failed to report. */
  error: string | null;
}

/** A snapshot of environment and runtime information. */
export interface Diagnostics {
  appVersion: string;
  os: string;
  osVersion: string;
  architecture: string;
  ytDlp: ToolVersion;
  ffmpeg: ToolVersion;
}

/**
 * Collects real environment information for the diagnostics page.
 *
 * Tool versions come from the backend actually running `yt-dlp --version` and
 * `ffmpeg -version`; a missing tool reports an error rather than a fabricated
 * version, which is the whole point of the page.
 */
export async function collectDiagnostics(
  ytDlpPath: string,
  ffmpegPath: string,
): Promise<Diagnostics> {
  const [appVersion, ytDlp, ffmpeg] = await Promise.all([
    getVersion().catch(() => 'unknown'),
    probeToolVersion('yt_dlp_version', { path: ytDlpPath }),
    probeToolVersion('ffmpeg_version', { path: ffmpegPath }),
  ]);

  return {
    appVersion,
    os: platform(),
    osVersion: osVersion(),
    architecture: arch(),
    ytDlp,
    ffmpeg,
  };
}

/** Runs a backend version command, converting failure into a reported error. */
async function probeToolVersion(
  command: string,
  args: Record<string, string>,
): Promise<ToolVersion> {
  try {
    const version = await invoke<string>(command, args);
    return { version: version.trim(), error: null };
  } catch (error) {
    return { version: null, error: String(error) };
  }
}
