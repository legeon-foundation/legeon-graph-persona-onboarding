/**
 * Tests for the centralized privacy policy.
 *
 * Covers:
 *  - RESTRICTED_NEVER_PUBLIC fields are never in PUBLIC_ALLOWED
 *  - assertNoRestrictedPublic() does not throw for a valid policy
 *  - classifyField() throws for unclassified fields in dev/test
 *  - pickPublicFields() returns only PUBLIC_ALLOWED fields
 *  - getPrivateFields() never includes PUBLIC_ALLOWED fields
 */

import { describe, it, expect, vi } from 'vitest';
import {
  FieldClassification,
  FIELD_POLICY,
  classifyField,
  getPublicAllowedFields,
  getPrivateFields,
  pickPublicFields,
  assertNoRestrictedPublic,
} from '@/lib/privacyPolicy';

// ---------------------------------------------------------------------------
// Policy invariants
// ---------------------------------------------------------------------------

describe('assertNoRestrictedPublic()', () => {
  it('does not throw for the production policy (no restricted field is public)', () => {
    expect(() => assertNoRestrictedPublic()).not.toThrow();
  });
});

describe('FIELD_POLICY invariants', () => {
  it('RESTRICTED_NEVER_PUBLIC fields are not in the public-allowed list', () => {
    const restricted = Object.entries(FIELD_POLICY)
      .filter(([, v]) => v === FieldClassification.RESTRICTED_NEVER_PUBLIC)
      .map(([k]) => k);

    const publicAllowed = getPublicAllowedFields();

    for (const field of restricted) {
      expect(publicAllowed).not.toContain(field);
    }
  });

  it('known sensitive fields are classified RESTRICTED_NEVER_PUBLIC', () => {
    const sensitiveFields = ['email', 'rawCV', 'nationalId', 'taxId', 'dateOfBirth', 'consentsGiven'];
    for (const field of sensitiveFields) {
      expect(FIELD_POLICY[field]).toBe(FieldClassification.RESTRICTED_NEVER_PUBLIC);
    }
  });

  it('profile display fields are classified PUBLIC_ALLOWED', () => {
    const publicFields = ['displayName', 'skillTags', 'publicBio', 'experienceSummary'];
    for (const field of publicFields) {
      expect(FIELD_POLICY[field]).toBe(FieldClassification.PUBLIC_ALLOWED);
    }
  });
});

// ---------------------------------------------------------------------------
// classifyField()
// ---------------------------------------------------------------------------

describe('classifyField()', () => {
  it('returns the correct classification for known fields', () => {
    expect(classifyField('displayName')).toBe(FieldClassification.PUBLIC_ALLOWED);
    expect(classifyField('jurisdiction')).toBe(FieldClassification.PRIVATE_ONLY);
    expect(classifyField('email')).toBe(FieldClassification.RESTRICTED_NEVER_PUBLIC);
  });

  it('throws in non-production environments for unclassified fields', () => {
    // NODE_ENV is 'test' in vitest, so the dev path is taken.
    expect(() => classifyField('__unknown_field_xyz__')).toThrow(
      /Unclassified field detected/,
    );
  });

  it('does NOT throw in production for unclassified fields (fails safe to PRIVATE_ONLY)', () => {
    const originalEnv = process.env.NODE_ENV;
    vi.stubEnv('NODE_ENV', 'production');

    let result: string | undefined;
    expect(() => {
      result = classifyField('__unknown_field_in_prod__');
    }).not.toThrow();
    expect(result).toBe(FieldClassification.PRIVATE_ONLY);

    vi.unstubAllEnvs();
  });
});

// ---------------------------------------------------------------------------
// pickPublicFields()
// ---------------------------------------------------------------------------

describe('pickPublicFields()', () => {
  it('returns only PUBLIC_ALLOWED fields from a mixed object', () => {
    const data = {
      displayName: 'Alice',
      publicBio: 'Bio here.',
      skillTags: ['SAP'],
      experienceSummary: 'Summary.',
      extractedFromCV: false,
      jurisdiction: 'UK',        // PRIVATE_ONLY — should be excluded
      email: 'alice@example.com', // RESTRICTED — should be excluded
    };

    const picked = pickPublicFields(data);

    // Public fields present
    expect(picked).toHaveProperty('displayName', 'Alice');
    expect(picked).toHaveProperty('publicBio', 'Bio here.');
    expect(picked).toHaveProperty('skillTags');
    expect(picked).toHaveProperty('experienceSummary');
    expect(picked).toHaveProperty('extractedFromCV');

    // Private / restricted fields absent
    expect(picked).not.toHaveProperty('jurisdiction');
    expect(picked).not.toHaveProperty('email');
  });

  it('returns an empty object when no public fields are present', () => {
    const data = { jurisdiction: 'UK', email: 'x@y.com' };
    const picked = pickPublicFields(data);
    expect(Object.keys(picked)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getPrivateFields()
// ---------------------------------------------------------------------------

describe('getPrivateFields()', () => {
  it('does not include any PUBLIC_ALLOWED field', () => {
    const publicAllowed = getPublicAllowedFields();
    const privateFields = getPrivateFields();

    for (const field of publicAllowed) {
      expect(privateFields).not.toContain(field);
    }
  });

  it('includes known private-only fields', () => {
    const privateFields = getPrivateFields();
    expect(privateFields).toContain('jurisdiction');
    expect(privateFields).toContain('walletAddress');
  });

  it('includes known restricted fields', () => {
    const privateFields = getPrivateFields();
    expect(privateFields).toContain('email');
    expect(privateFields).toContain('rawCV');
  });
});

// ---------------------------------------------------------------------------
// Policy mutation guard (tampering simulation)
// ---------------------------------------------------------------------------

describe('policy tamper guard', () => {
  it('assertNoRestrictedPublic throws if a restricted field is incorrectly added to PUBLIC_ALLOWED', () => {
    // Temporarily corrupt the policy to simulate a dev mistake.
    const originalClassification = FIELD_POLICY['email'];
    FIELD_POLICY['email'] = FieldClassification.PUBLIC_ALLOWED;

    expect(() => assertNoRestrictedPublic()).toThrow(/INVARIANT VIOLATION/);

    // Restore.
    FIELD_POLICY['email'] = originalClassification;
  });
});
