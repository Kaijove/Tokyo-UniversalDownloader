import { describe, it, expect } from 'vitest';
import { humanBytes, humanCount, humanDuration, humanDate } from '../humanize';

describe('humanize', () => {
  it('formats bytes', () => {
    expect(humanBytes(0)).toBeNull();
    expect(humanBytes(512)).toBe('512 B');
    expect(humanBytes(1536)).toBe('1.5 KB');
    expect(humanBytes(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('rejects non-finite byte values', () => {
    expect(humanBytes(NaN)).toBeNull();
    expect(humanBytes(Infinity)).toBeNull();
    expect(humanBytes(-1)).toBeNull();
  });

  it('formats counts compactly', () => {
    expect(humanCount(999)).toBe('999');
    expect(humanCount(1500)).toBe('1.5K');
    expect(humanCount(2_400_000)).toBe('2.4M');
  });

  it('formats durations', () => {
    expect(humanDuration(65)).toBe('1:05');
    expect(humanDuration(3661)).toBe('1:01:01');
    expect(humanDuration(null)).toBeNull();
  });

  it('parses yt-dlp upload dates', () => {
    expect(humanDate('20240115')).not.toBeNull();
    expect(humanDate('bad')).toBeNull();
    expect(humanDate(null)).toBeNull();
  });
});
