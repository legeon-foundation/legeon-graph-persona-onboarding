/**
 * Off-chain Profile Versioning
 *
 * Each time a consultant confirms (or later edits) their profile, a new
 * ProfileVersion is created with a deterministic SHA-256 commitment hash
 * over the canonical profile data + a per-version salt.
 *
 * The hash is derived from fields classified PUBLIC_ALLOWED (the "public
 * inputs") and the remaining fields (the "private inputs"), keeping the full
 * content bound to a single short hash that can be referenced on-chain.
 *
 * Minting/activation status is independent of profile versions — creating a
 * new version never requires a re-mint.
 */

import type { ProfileDraftState, ProfileVersion } from '../types/onboarding';
import { pickPublicFields } from './privacyPolicy';

// ---------------------------------------------------------------------------
// Canonical JSON helpers
// ---------------------------------------------------------------------------

function sortedKeys(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce<Record<string, unknown>>((acc, k) => {
      acc[k] = obj[k];
      return acc;
    }, {});
}

// ---------------------------------------------------------------------------
// Commitment hash
// ---------------------------------------------------------------------------

/**
 * Generate a deterministic SHA-256 commitment hash.
 *
 * The hash covers:
 *  - publicInputs  — fields classified PUBLIC_ALLOWED (policy-driven)
 *  - privateInputs — all other profile fields (kept in vault, never on-chain)
 *  - salt          — per-version random value to prevent pre-image attacks
 *
 * Calling this function with the same data + salt always produces the same
 * hash (deterministic), but different salts always produce different hashes.
 */
export async function generateCommitmentHash(
  profileData: Partial<ProfileDraftState>,
  salt: string,
): Promise<string> {
  const dataRecord = profileData as Record<string, unknown>;
  const publicInputs = pickPublicFields(dataRecord);

  const privateInputs: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(dataRecord)) {
    if (!(k in publicInputs)) {
      privateInputs[k] = v;
    }
  }

  const canonical = JSON.stringify({
    public: sortedKeys(publicInputs),
    private: sortedKeys(privateInputs),
    salt,
  });

  const encoded = new TextEncoder().encode(canonical);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Version creation
// ---------------------------------------------------------------------------

/**
 * Create a new ProfileVersion from the current profile draft.
 * Call this when the consultant confirms the profile (v1) or saves edits (v2+).
 */
export async function createProfileVersion(
  profileData: Partial<ProfileDraftState>,
  existingVersions: ProfileVersion[],
): Promise<ProfileVersion> {
  const version = existingVersions.length + 1;

  // Per-version random salt — randomUUID is available in all modern browsers
  // and in Node 18+ / jsdom.
  const salt =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const commitmentHash = await generateCommitmentHash(profileData, salt);
  const supersedesVersion =
    existingVersions.length > 0
      ? existingVersions[existingVersions.length - 1].version
      : undefined;

  return {
    version,
    createdAt: new Date().toISOString(),
    commitmentHash,
    supersedesVersion,
  };
}
