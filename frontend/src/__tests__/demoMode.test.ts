/**
 * Tests for Demo Mode feature flag.
 *
 * Covers:
 *  - isDemoMode() returns true when NEXT_PUBLIC_DEMO_MODE=true
 *  - isDemoMode() returns false when NEXT_PUBLIC_DEMO_MODE=false or unset
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// isDemoMode() unit tests (env-variable driven)
// ---------------------------------------------------------------------------

describe('isDemoMode()', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DEMO_MODE;

  afterEach(() => {
    // Restore original value after each test.
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_DEMO_MODE;
    } else {
      process.env.NEXT_PUBLIC_DEMO_MODE = originalEnv;
    }
  });

  it('returns true when NEXT_PUBLIC_DEMO_MODE is "true"', async () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
    // Re-import to pick up the changed env value.
    const { isDemoMode } = await import('@/config/demoMode');
    expect(isDemoMode()).toBe(true);
  });

  it('returns false when NEXT_PUBLIC_DEMO_MODE is "false"', async () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
    const { isDemoMode } = await import('@/config/demoMode');
    expect(isDemoMode()).toBe(false);
  });

  it('returns false when NEXT_PUBLIC_DEMO_MODE is not set', async () => {
    delete process.env.NEXT_PUBLIC_DEMO_MODE;
    const { isDemoMode } = await import('@/config/demoMode');
    expect(isDemoMode()).toBe(false);
  });

  it('returns false for any value other than "true"', async () => {
    for (const val of ['1', 'yes', 'TRUE', 'True', '']) {
      process.env.NEXT_PUBLIC_DEMO_MODE = val;
      const { isDemoMode } = await import('@/config/demoMode');
      expect(isDemoMode()).toBe(false);
    }
  });
});
