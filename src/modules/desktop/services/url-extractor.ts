import { sanitizeUrl } from '@/core/engine';

/** Matches http(s) URLs inside arbitrary text. */
const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;

/**
 * Extracts every usable URL from a blob of text, running each through the
 * engine's `sanitizeUrl` so tracking parameters are stripped and malformed
 * candidates are dropped. Duplicates are removed, order is preserved.
 *
 * Handles pasted text, dropped `.txt` files, `.m3u` playlists and browser
 * shortcut files (`.url` / `.desktop`), which all reduce to "find the links".
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_PATTERN);
  if (!matches) return [];

  const seen = new Set<string>();
  const urls: string[] = [];

  for (const raw of matches) {
    // Trailing punctuation is common when URLs are embedded in prose.
    const trimmed = raw.replace(/[),.;'"\]]+$/, '');
    try {
      const clean = sanitizeUrl(trimmed);
      if (!seen.has(clean)) {
        seen.add(clean);
        urls.push(clean);
      }
    } catch {
      // Not a usable URL — skip it rather than failing the whole extraction.
    }
  }

  return urls;
}

/** File extensions whose contents are worth scanning for URLs. */
const TEXTUAL_EXTENSIONS = ['.txt', '.m3u', '.m3u8', '.url', '.desktop'];

/**
 * Returns true when a dropped file is one we can read links out of. Media
 * files are deliberately excluded — this app downloads from URLs, it does not
 * import local media.
 */
export function isTextualDrop(path: string): boolean {
  const lower = path.toLowerCase();
  return TEXTUAL_EXTENSIONS.some((ext) => lower.endsWith(ext));
}
