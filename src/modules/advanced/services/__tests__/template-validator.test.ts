import { describe, it, expect } from 'vitest';
import { validateTemplate } from '../template-validator';

describe('validateTemplate', () => {
  it('accepts the standard templates', () => {
    expect(validateTemplate('%(title)s.%(ext)s').valid).toBe(true);
    expect(validateTemplate('%(uploader)s/%(title)s.%(ext)s').valid).toBe(true);
    expect(
      validateTemplate('%(playlist)s/%(playlist_index)s - %(title)s.%(ext)s').valid,
    ).toBe(true);
  });

  it('rejects empty templates', () => {
    expect(validateTemplate('   ').valid).toBe(false);
  });

  it('rejects absolute paths', () => {
    expect(validateTemplate('/etc/%(title)s.%(ext)s').valid).toBe(false);
    expect(validateTemplate('C:/tmp/%(title)s.%(ext)s').valid).toBe(false);
  });

  it('rejects parent directory traversal', () => {
    expect(validateTemplate('../%(title)s.%(ext)s').valid).toBe(false);
    expect(validateTemplate('a/../../%(title)s.%(ext)s').valid).toBe(false);
  });

  it('rejects illegal filename characters', () => {
    expect(validateTemplate('%(title)s<bad>.%(ext)s').valid).toBe(false);
    expect(validateTemplate('%(title)s|pipe.%(ext)s').valid).toBe(false);
  });

  it('rejects unknown fields', () => {
    const result = validateTemplate('%(nonsense)s.%(ext)s');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('nonsense');
  });

  it('requires an extension placeholder', () => {
    const result = validateTemplate('%(title)s');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('%(ext)s');
  });
});
