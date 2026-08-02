import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { metadataCache } from '../metadata-cache';
import type { RichMetadata } from '../../types/metadata.types';

const sample = { title: 'Test' } as unknown as RichMetadata;

describe('metadataCache', () => {
  beforeEach(() => {
    metadataCache.clear();
    metadataCache.setTtlMinutes(10);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null on a miss', () => {
    expect(metadataCache.get('https://x.com')).toBeNull();
  });

  it('stores and retrieves a value', () => {
    metadataCache.set('https://x.com', sample);
    expect(metadataCache.get('https://x.com')).toBe(sample);
  });

  it('keys entries independently by URL', () => {
    metadataCache.set('https://a.com', sample);
    expect(metadataCache.get('https://b.com')).toBeNull();
  });

  it('expires entries after the TTL', () => {
    vi.useFakeTimers();
    metadataCache.setTtlMinutes(1);
    metadataCache.set('https://x.com', sample);
    expect(metadataCache.get('https://x.com')).toBe(sample);

    vi.advanceTimersByTime(61 * 1000);
    expect(metadataCache.get('https://x.com')).toBeNull();
  });

  it('invalidates a single URL', () => {
    metadataCache.set('https://a.com', sample);
    metadataCache.set('https://b.com', sample);
    metadataCache.invalidate('https://a.com');
    expect(metadataCache.get('https://a.com')).toBeNull();
    expect(metadataCache.get('https://b.com')).toBe(sample);
  });

  it('clears everything', () => {
    metadataCache.set('https://a.com', sample);
    metadataCache.set('https://b.com', sample);
    metadataCache.clear();
    expect(metadataCache.get('https://a.com')).toBeNull();
    expect(metadataCache.get('https://b.com')).toBeNull();
  });

  it('clamps a sub-minute TTL to at least one minute', () => {
    vi.useFakeTimers();
    metadataCache.setTtlMinutes(0);
    metadataCache.set('https://x.com', sample);
    // Still present just under a minute.
    vi.advanceTimersByTime(59 * 1000);
    expect(metadataCache.get('https://x.com')).toBe(sample);
  });
});
