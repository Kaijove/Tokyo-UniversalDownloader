import type { Platform, PlatformCapabilities } from './platform.types';

const FULL: PlatformCapabilities = {
  supportsAudio: true,
  supportsVideo: true,
  supportsPlaylist: true,
  supportsSubtitles: true,
  supportsCookies: true,
  supportsLive: true,
};

/** A generic fallback for any host not in the known table. */
const GENERIC: Platform = {
  id: 'generic',
  displayName: 'Web',
  icon: 'Globe',
  capabilities: {
    supportsAudio: true,
    supportsVideo: true,
    supportsPlaylist: false,
    supportsSubtitles: false,
    supportsCookies: false,
    supportsLive: false,
  },
};

/**
 * Known hosts keyed by a substring of their domain. This table is purely for
 * display and capability hints — it never gates or performs downloads, and the
 * provider still handles any site the underlying tool supports.
 */
const KNOWN: ReadonlyArray<{ match: string; platform: Platform }> = [
  { match: 'youtube.', platform: { id: 'youtube', displayName: 'YouTube', icon: 'Youtube', capabilities: FULL } },
  { match: 'youtu.be', platform: { id: 'youtube', displayName: 'YouTube', icon: 'Youtube', capabilities: FULL } },
  { match: 'vimeo.', platform: { id: 'vimeo', displayName: 'Vimeo', icon: 'Video', capabilities: { ...FULL, supportsLive: false } } },
  { match: 'twitch.', platform: { id: 'twitch', displayName: 'Twitch', icon: 'Twitch', capabilities: FULL } },
  { match: 'dailymotion.', platform: { id: 'dailymotion', displayName: 'Dailymotion', icon: 'Video', capabilities: { ...FULL, supportsLive: false } } },
  { match: 'soundcloud.', platform: { id: 'soundcloud', displayName: 'SoundCloud', icon: 'Music', capabilities: { supportsAudio: true, supportsVideo: false, supportsPlaylist: true, supportsSubtitles: false, supportsCookies: false, supportsLive: false } } },
];

/**
 * Identifies the platform behind a URL and exposes its display metadata and
 * capability hints. Falls back to a generic descriptor for unknown hosts.
 * Never performs network or download work.
 */
export class PlatformResolver {
  /** Returns the platform descriptor for a URL, or the generic fallback. */
  resolve(url: string): Platform {
    let host: string;
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch {
      return GENERIC;
    }

    for (const entry of KNOWN) {
      if (host.includes(entry.match)) return entry.platform;
    }
    return GENERIC;
  }
}

/** Shared resolver instance. */
export const platformResolver = new PlatformResolver();
