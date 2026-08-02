import { describe, it, expect } from 'vitest';
import { isRetryable, backoffDelay, nextRetry } from '../retry-manager';
import type { RetryOptions } from '../../types/options.types';

const RETRY: RetryOptions = { maxAttempts: 3, baseDelayMs: 1000 };

describe('isRetryable', () => {
  it('treats network-ish failures as transient', () => {
    expect(isRetryable('Connection reset by peer')).toBe(true);
    expect(isRetryable('The read operation timed out')).toBe(true);
    expect(isRetryable('HTTP Error 503: Service Unavailable')).toBe(true);
  });

  it('treats permanent failures as non-retryable', () => {
    expect(isRetryable('Private video. Sign in if you have access')).toBe(false);
    expect(isRetryable('Unsupported URL')).toBe(false);
    expect(isRetryable('No space left on device')).toBe(false);
  });
});

describe('backoffDelay', () => {
  it('grows exponentially', () => {
    expect(backoffDelay(1, RETRY)).toBe(1000);
    expect(backoffDelay(2, RETRY)).toBe(2000);
    expect(backoffDelay(3, RETRY)).toBe(4000);
  });
});

describe('nextRetry', () => {
  it('returns the base delay for the first retry of a transient error', () => {
    expect(nextRetry(0, 'connection lost', RETRY)).toBe(1000);
  });

  it('backs off further on later attempts', () => {
    expect(nextRetry(1, 'connection lost', RETRY)).toBe(2000);
  });

  it('stops once max attempts are reached', () => {
    expect(nextRetry(3, 'connection lost', RETRY)).toBeNull();
  });

  it('does not retry permanent failures', () => {
    expect(nextRetry(0, 'Private video', RETRY)).toBeNull();
  });

  it('never retries when max attempts is zero', () => {
    expect(nextRetry(0, 'timeout', { maxAttempts: 0, baseDelayMs: 1000 })).toBeNull();
  });
});
