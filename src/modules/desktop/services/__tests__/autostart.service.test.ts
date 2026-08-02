import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the plugin before importing the service under test.
const enable = vi.fn(() => Promise.resolve());
const disable = vi.fn(() => Promise.resolve());
const isEnabled = vi.fn(() => Promise.resolve(false));

vi.mock('@tauri-apps/plugin-autostart', () => ({
  enable: () => enable(),
  disable: () => disable(),
  isEnabled: () => isEnabled(),
}));

import { applyAutostart } from '../autostart.service';

describe('applyAutostart', () => {
  beforeEach(() => {
    enable.mockClear();
    disable.mockClear();
    isEnabled.mockClear();
  });

  it('enables when desired on and currently off', async () => {
    isEnabled.mockResolvedValueOnce(false);
    await applyAutostart(true);
    expect(enable).toHaveBeenCalledOnce();
    expect(disable).not.toHaveBeenCalled();
  });

  it('disables when desired off and currently on', async () => {
    isEnabled.mockResolvedValueOnce(true);
    await applyAutostart(false);
    expect(disable).toHaveBeenCalledOnce();
    expect(enable).not.toHaveBeenCalled();
  });

  it('does nothing when already in the desired state', async () => {
    isEnabled.mockResolvedValueOnce(true);
    await applyAutostart(true);
    expect(enable).not.toHaveBeenCalled();
    expect(disable).not.toHaveBeenCalled();
  });

  it('never throws when the plugin fails', async () => {
    isEnabled.mockRejectedValueOnce(new Error('unsupported platform'));
    await expect(applyAutostart(true)).resolves.toBeUndefined();
  });
});
