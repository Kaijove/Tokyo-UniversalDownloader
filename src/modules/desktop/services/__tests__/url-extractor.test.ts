import { describe, it, expect } from 'vitest';
import { extractUrls, isTextualDrop } from '../url-extractor';

describe('extractUrls', () => {
  it('finds a bare URL', () => {
    expect(extractUrls('https://example.com/video')).toEqual(['https://example.com/video']);
  });

  it('finds URLs embedded in prose', () => {
    const urls = extractUrls('Check this out: https://example.com/a and https://example.com/b!');
    expect(urls).toHaveLength(2);
  });

  it('strips trailing punctuation', () => {
    expect(extractUrls('(https://example.com/x).')).toEqual(['https://example.com/x']);
  });

  it('removes duplicates while preserving order', () => {
    const urls = extractUrls('https://example.com/a https://example.com/b https://example.com/a');
    expect(urls).toEqual(['https://example.com/a', 'https://example.com/b']);
  });

  it('strips tracking parameters via the shared sanitizer', () => {
    const [url] = extractUrls('https://example.com/v?id=7&utm_source=news&fbclid=abc');
    expect(url).toContain('id=7');
    expect(url).not.toContain('utm_source');
    expect(url).not.toContain('fbclid');
  });

  it('ignores non-http schemes and plain text', () => {
    expect(extractUrls('ftp://example.com/file just some words')).toEqual([]);
    expect(extractUrls('no links here at all')).toEqual([]);
  });

  it('handles m3u playlist content', () => {
    const playlist = [
      '#EXTM3U',
      '#EXTINF:-1,First',
      'https://example.com/one',
      '#EXTINF:-1,Second',
      'https://example.com/two',
    ].join('\n');
    expect(extractUrls(playlist)).toEqual([
      'https://example.com/one',
      'https://example.com/two',
    ]);
  });

  it('returns an empty array for empty input', () => {
    expect(extractUrls('')).toEqual([]);
  });
});

describe('isTextualDrop', () => {
  it('accepts link-bearing file types', () => {
    for (const path of ['/a/list.txt', '/a/p.m3u', '/a/p.M3U8', '/a/s.url', '/a/s.desktop']) {
      expect(isTextualDrop(path)).toBe(true);
    }
  });

  it('rejects media and other files', () => {
    for (const path of ['/a/video.mp4', '/a/song.mp3', '/a/image.png', '/a/archive.zip']) {
      expect(isTextualDrop(path)).toBe(false);
    }
  });
});
