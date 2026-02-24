/**
 * Tests for the DemoBanner React component.
 *
 * Covers:
 *  - Banner is rendered when isDemo=true
 *  - Banner is not rendered when isDemo=false
 *  - Banner text matches the configured constant
 *  - Banner has correct accessibility attributes
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DemoBanner } from '@/components/DemoBanner';
import { DEMO_BANNER_TEXT } from '@/config/demoMode';

describe('DemoBanner', () => {
  it('renders the banner when isDemo is true', () => {
    render(<DemoBanner isDemo={true} />);
    const banner = screen.getByTestId('demo-banner');
    expect(banner).toBeInTheDocument();
  });

  it('does not render when isDemo is false', () => {
    render(<DemoBanner isDemo={false} />);
    expect(screen.queryByTestId('demo-banner')).not.toBeInTheDocument();
  });

  it('does not render when isDemo is not provided (defaults to isDemoMode())', () => {
    // In the test environment NEXT_PUBLIC_DEMO_MODE is not set, so isDemoMode()
    // returns false and the banner should be absent.
    render(<DemoBanner />);
    expect(screen.queryByTestId('demo-banner')).not.toBeInTheDocument();
  });

  it('displays the correct banner text', () => {
    render(<DemoBanner isDemo={true} />);
    expect(screen.getByTestId('demo-banner')).toHaveTextContent(DEMO_BANNER_TEXT);
  });

  it('has role="status" for accessibility', () => {
    render(<DemoBanner isDemo={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('banner is sticky / always visible (has sticky positioning)', () => {
    render(<DemoBanner isDemo={true} />);
    const banner = screen.getByTestId('demo-banner');
    expect(banner).toHaveStyle({ position: 'sticky' });
  });
});
