/**
 * Centralized Public vs Private Field Classification
 *
 * This is the single source of truth for which profile fields may be shared
 * publicly (on-chain), which must remain private (off-chain), and which are
 * strictly restricted and can never be made public.
 *
 * Used by:
 *  - Step 5 UI panels (dynamically generated — no hardcoded lists in the UI)
 *  - Commitment hash generation (pickPublicFields / getPrivateFields)
 *  - Tests that assert policy invariants
 *
 * Adding a new profile field
 * --------------------------
 * 1. Add it to FIELD_POLICY with the correct classification.
 * 2. If the field is not added, classifyField() will throw in development and
 *    test runs, preventing silent data leakage.
 *
 * Invariant guaranteed by assertNoRestrictedPublic():
 * No field may appear as both RESTRICTED_NEVER_PUBLIC and PUBLIC_ALLOWED.
 */

// ---------------------------------------------------------------------------
// Classification enum
// ---------------------------------------------------------------------------

export const FieldClassification = {
  /** Safe to include in on-chain commitment inputs and show in the public panel. */
  PUBLIC_ALLOWED: 'PUBLIC_ALLOWED',
  /** Must remain off-chain; may be included in private commitment inputs. */
  PRIVATE_ONLY: 'PRIVATE_ONLY',
  /** Strictly off-chain; must never be classified PUBLIC_ALLOWED. */
  RESTRICTED_NEVER_PUBLIC: 'RESTRICTED_NEVER_PUBLIC',
} as const;

export type FieldClassificationType =
  (typeof FieldClassification)[keyof typeof FieldClassification];

// ---------------------------------------------------------------------------
// Policy map — add every profile field here
// ---------------------------------------------------------------------------

export const FIELD_POLICY: Record<string, FieldClassificationType> = {
  // PUBLIC_ALLOWED ——— safe for on-chain references
  displayName: FieldClassification.PUBLIC_ALLOWED,
  skillTags: FieldClassification.PUBLIC_ALLOWED,
  publicBio: FieldClassification.PUBLIC_ALLOWED,
  experienceSummary: FieldClassification.PUBLIC_ALLOWED,
  extractedFromCV: FieldClassification.PUBLIC_ALLOWED, // boolean flag, not raw CV

  // PRIVATE_ONLY ——— kept in vault, included in private commitment inputs
  jurisdiction: FieldClassification.PRIVATE_ONLY,
  walletAddress: FieldClassification.PRIVATE_ONLY,
  walletConnected: FieldClassification.PRIVATE_ONLY,
  onboardingStatus: FieldClassification.PRIVATE_ONLY,
  profileVisibility: FieldClassification.PRIVATE_ONLY,
  profileVersions: FieldClassification.PRIVATE_ONLY,
  currentStep: FieldClassification.PRIVATE_ONLY,
  mintStatus: FieldClassification.PRIVATE_ONLY,
  tokenId: FieldClassification.PRIVATE_ONLY,
  verificationStatus: FieldClassification.PRIVATE_ONLY,
  lastCommitmentHash: FieldClassification.PRIVATE_ONLY,
  lastCommitmentSalt: FieldClassification.PRIVATE_ONLY,
  profileConfirmed: FieldClassification.PRIVATE_ONLY,

  // RESTRICTED_NEVER_PUBLIC ——— must never leave the vault
  email: FieldClassification.RESTRICTED_NEVER_PUBLIC,
  rawCV: FieldClassification.RESTRICTED_NEVER_PUBLIC,
  cvFileName: FieldClassification.RESTRICTED_NEVER_PUBLIC,
  documents: FieldClassification.RESTRICTED_NEVER_PUBLIC,
  nationalId: FieldClassification.RESTRICTED_NEVER_PUBLIC,
  taxId: FieldClassification.RESTRICTED_NEVER_PUBLIC,
  dateOfBirth: FieldClassification.RESTRICTED_NEVER_PUBLIC,
  consentsGiven: FieldClassification.RESTRICTED_NEVER_PUBLIC,
};

// ---------------------------------------------------------------------------
// Policy helpers
// ---------------------------------------------------------------------------

/**
 * Return the classification for a field.
 *
 * In development / test: throws if the field is not listed in FIELD_POLICY.
 * In production: unknown fields fall back to PRIVATE_ONLY (fail-safe).
 */
export function classifyField(fieldName: string): FieldClassificationType {
  const c = FIELD_POLICY[fieldName];
  if (c === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `[PrivacyPolicy] Unclassified field detected: "${fieldName}". ` +
          `Add it to FIELD_POLICY in privacyPolicy.ts before using it.`,
      );
    }
    // Production fail-safe: treat unknown as private.
    return FieldClassification.PRIVATE_ONLY;
  }
  return c;
}

/** All fields that may appear in public commitment inputs / on-chain panel. */
export function getPublicAllowedFields(): string[] {
  return Object.entries(FIELD_POLICY)
    .filter(([, v]) => v === FieldClassification.PUBLIC_ALLOWED)
    .map(([k]) => k);
}

/** All fields that must remain off-chain (PRIVATE_ONLY + RESTRICTED). */
export function getPrivateFields(): string[] {
  return Object.entries(FIELD_POLICY)
    .filter(([, v]) => v !== FieldClassification.PUBLIC_ALLOWED)
    .map(([k]) => k);
}

/**
 * Pick only PUBLIC_ALLOWED fields from a data object.
 * Used to build the public inputs for commitment / proof generation.
 */
export function pickPublicFields<T extends Record<string, unknown>>(data: T): Partial<T> {
  const publicKeys = getPublicAllowedFields();
  const result: Partial<T> = {};
  for (const key of publicKeys) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result[key as keyof T] = data[key as keyof T];
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Invariant assertion (used by tests)
// ---------------------------------------------------------------------------

/**
 * Immutable set of fields that must NEVER be classified PUBLIC_ALLOWED.
 * This list is checked independently of the mutable FIELD_POLICY so that a
 * policy tamper (e.g. accidentally classifying `email` as PUBLIC_ALLOWED)
 * is caught even after the mutation.
 */
export const FOREVER_RESTRICTED_FIELDS: readonly string[] = [
  'email',
  'rawCV',
  'cvFileName',
  'documents',
  'nationalId',
  'taxId',
  'dateOfBirth',
  'consentsGiven',
] as const;

/**
 * Assert that:
 *  1. No field in FOREVER_RESTRICTED_FIELDS is currently classified PUBLIC_ALLOWED.
 *  2. No field currently bearing RESTRICTED_NEVER_PUBLIC in FIELD_POLICY is also
 *     in the PUBLIC_ALLOWED list (catches cross-classification in dynamic policies).
 *
 * Throws immediately if either invariant is violated.
 * Call in tests and, optionally, at app startup to catch policy mistakes early.
 */
export function assertNoRestrictedPublic(): void {
  const publicAllowed = getPublicAllowedFields();

  // Check 1: hard-coded list of forever-restricted fields.
  for (const field of FOREVER_RESTRICTED_FIELDS) {
    if (publicAllowed.includes(field)) {
      throw new Error(
        `[PrivacyPolicy] INVARIANT VIOLATION: Field "${field}" is classified as ` +
          `RESTRICTED_NEVER_PUBLIC but also appears in PUBLIC_ALLOWED.`,
      );
    }
  }

  // Check 2: any field currently marked RESTRICTED must not also be PUBLIC.
  const restricted = Object.entries(FIELD_POLICY)
    .filter(([, v]) => v === FieldClassification.RESTRICTED_NEVER_PUBLIC)
    .map(([k]) => k);

  for (const field of restricted) {
    if (publicAllowed.includes(field)) {
      throw new Error(
        `[PrivacyPolicy] INVARIANT VIOLATION: Field "${field}" is classified as ` +
          `RESTRICTED_NEVER_PUBLIC but also appears in PUBLIC_ALLOWED.`,
      );
    }
  }
}
