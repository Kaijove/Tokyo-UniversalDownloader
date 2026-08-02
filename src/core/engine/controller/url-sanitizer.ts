import { InvalidUrlError } from '../errors/errors';

/** Query parameters stripped as tracking noise before storing/using a URL. */
const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'si',
  'feature',
];

/**
 * Validates and normalises a URL: enforces http/https, removes tracking
 * parameters, and trims whitespace. Throws `InvalidUrlError` when the input is
 * not a usable URL. Never mutates its input.
 */
export function sanitizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new InvalidUrlError({ message: 'The URL is empty.' });
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch (cause) {
    throw new InvalidUrlError({ message: 'That does not look like a valid URL.', cause });
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new InvalidUrlError({ message: 'Only http and https links are supported.' });
  }

  for (const param of TRACKING_PARAMS) {
    url.searchParams.delete(param);
  }

  return url.toString();
}
