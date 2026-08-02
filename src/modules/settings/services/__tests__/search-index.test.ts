import { describe, it, expect } from 'vitest';
import { searchSettings, matchingSections, SETTINGS_INDEX } from '../search-index';

describe('searchSettings', () => {
  it('returns everything for an empty query', () => {
    expect(searchSettings('')).toHaveLength(SETTINGS_INDEX.length);
    expect(searchSettings('   ')).toHaveLength(SETTINGS_INDEX.length);
  });

  it('finds proxy in the network section', () => {
    const results = searchSettings('proxy');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].section).toBe('network');
    expect(results[0].path).toBe('network.proxy');
  });

  it('finds subtitle settings by keyword', () => {
    const sections = matchingSections('subtitle');
    expect(sections).toContain('subtitles');
  });

  it('matches on keywords rather than only labels', () => {
    const results = searchSettings('srt');
    expect(results.some((r) => r.path === 'subtitles.download')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(searchSettings('PROXY')).toEqual(searchSettings('proxy'));
  });

  it('returns nothing for a nonsense query', () => {
    expect(searchSettings('zzzznotathing')).toHaveLength(0);
    expect(matchingSections('zzzznotathing')).toHaveLength(0);
  });

  it('finds codec choices by their common names', () => {
    expect(searchSettings('av1').some((r) => r.path === 'video.preferredCodec')).toBe(true);
    expect(searchSettings('h264').some((r) => r.path === 'video.preferredCodec')).toBe(true);
  });
});
