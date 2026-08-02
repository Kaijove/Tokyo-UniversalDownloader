import type { RetryOptions } from '../types/options.types';

/** Error categories that are worth retrying automatically. */
const TRANSIENT_PATTERNS = [
  'timed out',
  'timeout',
  'connection',
  'network',
  'temporary failure',
  'unable to download',
  'read error',
  'incomplete',
  '429',
  '500',
  '502',
  '503',
];

/**
 * Decides whether a failure looks transient and therefore worth retrying.
 * Permanent problems (private video, unsupported URL, disk full, auth) are not
 * retried, since repeating them only wastes time.
 */
export function isRetryable(message: string): boolean {
  const lower = message.toLowerCase();
  return TRANSIENT_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Returns the delay before a given attempt using exponential backoff.
 * Attempt 1 waits `baseDelayMs`, attempt 2 waits double, and so on.
 */
export function backoffDelay(attempt: number, options: RetryOptions): number {
  const exponent = Math.max(0, attempt - 1);
  return options.baseDelayMs * 2 ** exponent;
}

/**
 * Decides whether another attempt should be made for a failed download.
 * Returns the delay to wait, or `null` when no further retry is warranted.
 */
export function nextRetry(
  attempt: number,
  message: string,
  options: RetryOptions,
): number | null {
  if (attempt >= options.maxAttempts) return null;
  if (!isRetryable(message)) return null;
  return backoffDelay(attempt + 1, options);
}
