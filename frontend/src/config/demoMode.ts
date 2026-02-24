/**
 * Demo Mode Feature Flag
 *
 * Controlled exclusively by the NEXT_PUBLIC_DEMO_MODE environment variable.
 * Set it in .env.local (or your deployment environment) and restart the dev
 * server — no code changes required.
 *
 *   NEXT_PUBLIC_DEMO_MODE=true   → demo mode ON
 *   NEXT_PUBLIC_DEMO_MODE=false  → demo mode OFF (default)
 *
 * When demo mode is ON:
 *  - A persistent banner is shown on every onboarding screen.
 *  - "Continue (Demo Mode)" shortcuts appear in Step 5 so verification can
 *    be bypassed for demonstration purposes.
 *
 * When demo mode is OFF:
 *  - The banner is hidden.
 *  - Demo-only buttons are absent.
 *  - Step 5 blocks continuation until real (or logically enforced mock)
 *    verification prerequisites are satisfied.
 */

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

export const DEMO_BANNER_TEXT =
  'Demo Mode: Verification & minting are simulated.';
