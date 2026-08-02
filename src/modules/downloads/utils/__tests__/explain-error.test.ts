import { describe, it, expect } from 'vitest';
import { explainError } from '../explain-error';

describe('explainError', () => {
  it('explains private videos without offering a retry', () => {
    const result = explainError('ERROR: Private video. Sign in if you have been granted access');
    expect(result.summary).toContain("isn't publicly available");
    expect(result.suggestion).toContain('cookie');
    expect(result.retryable).toBe(false);
  });

  it('explains removed videos', () => {
    const result = explainError('ERROR: Video unavailable. This video has been removed');
    expect(result.summary).toContain('no longer available');
  });

  it('explains geo restrictions and points at the proxy setting', () => {
    const result = explainError('The uploader has not made this video available in your country');
    expect(result.summary).toContain('blocked in your region');
    expect(result.suggestion).toContain('proxy');
  });

  it('explains rate limiting and marks it retryable', () => {
    const result = explainError('ERROR: HTTP Error 429: Too Many Requests');
    expect(result.summary).toContain('rate-limiting');
    expect(result.retryable).toBe(true);
  });

  it('explains disk space problems without retrying', () => {
    const result = explainError('OSError: [Errno 28] No space left on device');
    expect(result.summary).toContain('disk space');
    expect(result.retryable).toBe(false);
  });

  it('explains a missing ffmpeg and points at settings', () => {
    const result = explainError('ERROR: ffmpeg not found. Please install');
    expect(result.summary).toContain("Couldn't finish preparing");
    expect(result.suggestion).toContain('Settings');
  });

  it('explains a missing yt-dlp binary', () => {
    const result = explainError('Failed to launch yt-dlp: No such file or directory');
    expect(result.summary).toContain("Couldn't start the download");
  });

  it('explains unsupported links', () => {
    const result = explainError('ERROR: Unsupported URL: https://example.com/page');
    expect(result.summary).toContain("isn't supported");
  });

  it('explains network failures and marks them retryable', () => {
    const result = explainError('ERROR: The read operation timed out');
    expect(result.summary).toContain('connection failed');
    expect(result.retryable).toBe(true);
  });

  it('falls back to a generic explanation for unknown errors', () => {
    const result = explainError('something completely unexpected happened');
    expect(result.summary).toBe('The download failed.');
    expect(result.reason).toBeNull();
    expect(result.retryable).toBe(false);
  });

  it('prefers the more specific rule when several could match', () => {
    const result = explainError('ERROR: Private video. Connection to server established');
    expect(result.summary).toContain("isn't publicly available");
  });
});
