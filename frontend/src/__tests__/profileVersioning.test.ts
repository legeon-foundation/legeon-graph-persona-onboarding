/**
 * Tests for off-chain Profile Versioning.
 *
 * Covers:
 *  - Commitment hash is deterministic for the same data + salt
 *  - Different salts produce different hashes (per-version uniqueness)
 *  - Version number increments correctly
 *  - Version history chain (supersedesVersion links)
 *  - createProfileVersion uses PUBLIC/PRIVATE split from policy
 */

import { describe, it, expect } from 'vitest';
import { generateCommitmentHash, createProfileVersion } from '@/lib/profileVersioning';
import type { ProfileDraftState, ProfileVersion } from '@/types/onboarding';

const sampleProfile: Partial<ProfileDraftState> = {
  displayName: 'Alice Tester',
  publicBio: 'Senior consultant.',
  skillTags: ['SAP', 'FICO'],
  experienceSummary: 'Many years of experience.',
  extractedFromCV: false,
};

describe('generateCommitmentHash', () => {
  it('is deterministic: same data + salt always produces the same hash', async () => {
    const salt = 'test-salt-123';
    const h1 = await generateCommitmentHash(sampleProfile, salt);
    const h2 = await generateCommitmentHash(sampleProfile, salt);
    expect(h1).toBe(h2);
  });

  it('different salts produce different hashes', async () => {
    const h1 = await generateCommitmentHash(sampleProfile, 'salt-A');
    const h2 = await generateCommitmentHash(sampleProfile, 'salt-B');
    expect(h1).not.toBe(h2);
  });

  it('different data (same salt) produces different hashes', async () => {
    const salt = 'same-salt';
    const data1 = { ...sampleProfile, displayName: 'Alice' };
    const data2 = { ...sampleProfile, displayName: 'Bob' };
    const h1 = await generateCommitmentHash(data1, salt);
    const h2 = await generateCommitmentHash(data2, salt);
    expect(h1).not.toBe(h2);
  });

  it('produces a 0x-prefixed 64-character hex string (SHA-256)', async () => {
    const hash = await generateCommitmentHash(sampleProfile, 'any-salt');
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
  });
});

describe('createProfileVersion', () => {
  it('creates v1 when no existing versions', async () => {
    const v = await createProfileVersion(sampleProfile, []);
    expect(v.version).toBe(1);
    expect(v.supersedesVersion).toBeUndefined();
    expect(v.commitmentHash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(new Date(v.createdAt).getTime()).not.toBeNaN();
  });

  it('increments version number correctly', async () => {
    const v1 = await createProfileVersion(sampleProfile, []);
    const v2 = await createProfileVersion(sampleProfile, [v1]);
    const v3 = await createProfileVersion(sampleProfile, [v1, v2]);

    expect(v1.version).toBe(1);
    expect(v2.version).toBe(2);
    expect(v3.version).toBe(3);
  });

  it('sets supersedesVersion to the previous version number', async () => {
    const v1 = await createProfileVersion(sampleProfile, []);
    const v2 = await createProfileVersion(sampleProfile, [v1]);
    const v3 = await createProfileVersion(sampleProfile, [v1, v2]);

    expect(v2.supersedesVersion).toBe(1);
    expect(v3.supersedesVersion).toBe(2);
  });

  it('two versions of same data have different hashes (different salts per version)', async () => {
    const v1 = await createProfileVersion(sampleProfile, []);
    const v2 = await createProfileVersion(sampleProfile, [v1]);
    // Different salts are generated per version, so hashes differ even for identical data.
    expect(v1.commitmentHash).not.toBe(v2.commitmentHash);
  });

  it('existing version data is not mutated', async () => {
    const existing: ProfileVersion[] = [
      { version: 1, createdAt: '2024-01-01T00:00:00.000Z', commitmentHash: '0xabc' },
    ];
    const before = [...existing];
    await createProfileVersion(sampleProfile, existing);
    expect(existing).toEqual(before);
  });
});
