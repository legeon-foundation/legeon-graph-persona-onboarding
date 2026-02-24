'use client';

import { isDemoMode, DEMO_BANNER_TEXT } from '@/config/demoMode';

interface DemoBannerProps {
  /**
   * Override the runtime flag — used in tests and Storybook.
   * Defaults to isDemoMode() at runtime.
   */
  isDemo?: boolean;
}

/**
 * Persistent banner shown at the top of every onboarding screen in demo mode.
 * Rendered as null when demo mode is off so it has zero DOM footprint.
 */
export function DemoBanner({ isDemo = isDemoMode() }: DemoBannerProps) {
  if (!isDemo) return null;

  return (
    <div
      data-testid="demo-banner"
      role="status"
      aria-label="Demo mode active"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: '#f59e0b',
        color: '#1c1917',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
      }}
    >
      ⚠️ {DEMO_BANNER_TEXT}
    </div>
  );
}
