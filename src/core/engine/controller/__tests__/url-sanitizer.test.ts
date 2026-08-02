import { describe, it, expect } from 'vitest';
import { sanitizeUrl } from '../url-sanitizer';
import { InvalidUrlError } from '../../errors/errors';

describe('sanitizeUrl', () => {
  it('trims surrounding whitespace', () => {
    expect(sanitizeUrl('  https://youtube.com/watch?v=abc  ')).toBe(
      'https://youtube.com/watch?v=abc',
    );
  });

  it('keeps meaningful query params like the video id', () => {
    const out = sanitizeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(out).toContain('v=dQw4w9WgXcQ');
  });

  it('strips tracking params but preserves the rest', () => {
    const out = sanitizeUrl(
      'https://youtube.com/watch?v=abc&utm_source=x&si=y&feature=share',
    );
    expect(out).toContain('v=abc');
    expect(out).not.toContain('utm_source');
    expect(out).not.toContain('si=');
    expect(out).not.toContain('feature=');
  });

  it('removes fbclid and gclid', () => {
    const out = sanitizeUrl('https://example.com/video?fbclid=1&gclid=2&id=42');
    expect(out).toContain('id=42');
    expect(out).not.toContain('fbclid');
    expect(out).not.toContain('gclid');
  });

  it('rejects an empty string', () => {
    expect(() => sanitizeUrl('')).toThrow(InvalidUrlError);
    expect(() => sanitizeUrl('   ')).toThrow(InvalidUrlError);
  });

  it('rejects a malformed URL', () => {
    expect(() => sanitizeUrl('not a url')).toThrow(InvalidUrlError);
  });

  it('rejects non-http(s) protocols', () => {
    expect(() => sanitizeUrl('ftp://example.com/file')).toThrow(InvalidUrlError);
    expect(() => sanitizeUrl('file:///etc/passwd')).toThrow(InvalidUrlError);
  });

  it('accepts both http and https', () => {
    expect(sanitizeUrl('http://example.com/')).toBe('http://example.com/');
    expect(sanitizeUrl('https://example.com/')).toBe('https://example.com/');
  });

  it('does not mutate its input', () => {
    const input = '  https://youtube.com/watch?v=abc&utm_source=x  ';
    const copy = input;
    sanitizeUrl(input);
    expect(input).toBe(copy);
  });
});
