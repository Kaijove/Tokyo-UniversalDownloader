/** Informative capabilities a platform is generally known to support. */
export interface PlatformCapabilities {
  supportsAudio: boolean;
  supportsVideo: boolean;
  supportsPlaylist: boolean;
  supportsSubtitles: boolean;
  supportsCookies: boolean;
  supportsLive: boolean;
}

/** Descriptive metadata about a recognised platform. */
export interface Platform {
  /** Stable id, e.g. `'youtube'`. */
  id: string;
  /** Display name shown in the UI. */
  displayName: string;
  /** Lucide icon name used to render a glyph. */
  icon: string;
  /** Best-effort capability hints — informative only, not guarantees. */
  capabilities: PlatformCapabilities;
}
