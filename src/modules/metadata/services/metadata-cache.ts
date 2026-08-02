import type { RichMetadata } from '../types/metadata.types';

interface CacheEntry {
  value: RichMetadata;
  expiresAt: number;
}

/** Default lifetime for a cached entry (10 minutes). */
const DEFAULT_TTL_MS = 10 * 60 * 1000;

/**
 * In-memory metadata cache keyed by canonical URL, with time-based expiry.
 * Session-scoped: cleared when the app restarts. Keeps repeat pastes instant
 * and avoids duplicate probes without touching disk.
 */
class MetadataCache {
  private readonly entries = new Map<string, CacheEntry>();
  private ttlMs = DEFAULT_TTL_MS;

  /** Updates how long new entries stay fresh. */
  setTtlMinutes(minutes: number): void {
    this.ttlMs = Math.max(1, minutes) * 60 * 1000;
  }

  /** Returns a fresh entry, or `null` on miss or expiry. */
  get(url: string): RichMetadata | null {
    const entry = this.entries.get(url);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.entries.delete(url);
      return null;
    }
    return entry.value;
  }

  /** Stores a value with a fresh TTL. */
  set(url: string, value: RichMetadata): void {
    this.entries.set(url, { value, expiresAt: Date.now() + this.ttlMs });
  }

  /** Removes a single URL from the cache. */
  invalidate(url: string): void {
    this.entries.delete(url);
  }

  /** Clears the entire cache. */
  clear(): void {
    this.entries.clear();
  }
}

/** Shared session-scoped metadata cache. */
export const metadataCache = new MetadataCache();
