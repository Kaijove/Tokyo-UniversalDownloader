import { isRetryable } from '@/modules/advanced';

/** A failure translated into something a person can act on. */
export interface ErrorExplanation {
  summary: string;
  reason: string | null;
  suggestion: string | null;
  retryable: boolean;
}

interface Rule {
  match: RegExp;
  summary: string;
  reason: string;
  suggestion: string;
}

/**
 * Patterns mapping raw provider output to human explanations. Ordered by
 * specificity — the first match wins, so put narrow patterns before broad ones.
 */
const RULES: Rule[] = [
  {
    match: /private video|sign in to confirm|members-only/i,
    summary: "This video isn't publicly available.",
    reason: 'The site requires an account with access to this content.',
    suggestion: 'If you have access, set a cookie source in Settings → Privacy.',
  },
  {
    match: /video unavailable|has been removed|no longer available/i,
    summary: 'This video is no longer available.',
    reason: 'It was removed or made private by the uploader.',
    suggestion: 'Check the link in a browser to confirm.',
  },
  {
    match: /not available in your country|not made this video available|geo.?restrict|blocked it in your country/i,
    summary: 'This content is blocked in your region.',
    reason: 'The site restricts it by geography.',
    suggestion: 'A proxy can be configured in Settings → Network.',
  },
  {
    match: /age.?restrict|confirm your age/i,
    summary: 'This content is age-restricted.',
    reason: 'The site requires a signed-in adult account.',
    suggestion: 'Set a cookie source in Settings → Privacy if you have access.',
  },
  {
    match: /http error 429|too many requests|rate.?limit/i,
    summary: 'The site is rate-limiting requests.',
    reason: 'Too many downloads were requested in a short time.',
    suggestion: 'Wait a few minutes, or lower simultaneous downloads in Settings.',
  },
  {
    match: /no space left|disk full/i,
    summary: 'There is not enough disk space.',
    reason: 'The output drive filled up during the download.',
    suggestion: 'Free up space or pick another folder.',
  },
  {
    match: /permission denied|access is denied|read-only file system/i,
    summary: "The output folder can't be written to.",
    reason: 'The app lacks permission for that location.',
    suggestion: 'Choose a folder inside your home directory.',
  },
  {
    match: /ffmpeg not found|ffprobe.*not found/i,
    summary: "Couldn't finish preparing the video.",
    reason: 'A tool the app needs to combine video and audio is missing.',
    suggestion: "Open How it works to see what's needed, or set the paths in Settings → Advanced.",
  },
  {
    match: /yt-dlp.*not found|no such file or directory.*yt-dlp|failed to launch/i,
    summary: "Couldn't start the download.",
    reason: 'A tool the app needs to download videos is missing.',
    suggestion: "Open How it works to see what's needed, or set the paths in Settings → Advanced.",
  },
  {
    match: /unsupported url|no video formats found|unable to extract/i,
    summary: "This link isn't supported.",
    reason: "The site isn't recognised, or the page has no downloadable media.",
    suggestion: 'Check the URL points directly at a media page.',
  },
  {
    match: /timed out|timeout|connection reset|network is unreachable|temporary failure/i,
    summary: 'The connection failed.',
    reason: 'The network dropped or the site did not respond in time.',
    suggestion: 'Check your connection and try again.',
  },
];

/**
 * Translates a raw provider error into a human explanation with a likely
 * cause and a next step. Falls back to a generic message with the retry hint
 * derived from the shared retry classifier, so behaviour stays consistent with
 * the automatic retry logic.
 */
export function explainError(raw: string): ErrorExplanation {
  for (const rule of RULES) {
    if (rule.match.test(raw)) {
      return {
        summary: rule.summary,
        reason: rule.reason,
        suggestion: rule.suggestion,
        retryable: isRetryable(raw),
      };
    }
  }

  return {
    summary: 'The download failed.',
    reason: null,
    suggestion: 'You can try again, or check the technical details below.',
    retryable: isRetryable(raw),
  };
}
