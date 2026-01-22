/**
 * Verification Decision Enumeration
 */
export enum VerificationDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

/**
 * VerificationRecord
 * Human or automated verification action
 */
export interface VerificationRecord {
  id: string
  credentialId: string
  verifierUserId: string
  decision: VerificationDecision
  notes: string | null
  decidedAt: Date
}

/**
 * Proof Type Enumeration
 */
export enum ProofType {
  CREDENTIAL_COMMITMENT = 'CREDENTIAL_COMMITMENT',
  JURISDICTION_COMPLIANCE = 'JURISDICTION_COMPLIANCE',
  SKILL_ATTESTATION = 'SKILL_ATTESTATION',
  IDENTITY_LINK = 'IDENTITY_LINK',
}

/**
 * Proof Verification Result Enumeration
 */
export enum ProofVerificationResult {
  VALID = 'VALID',
  INVALID = 'INVALID',
  PENDING = 'PENDING',
}

/**
 * ProofArtifact
 * Cryptographic proof or attestation reference
 *
 * Privacy Note: Contains proof references, never raw data
 * Proofs are generated server-side via Midnight adapter
 */
export interface ProofArtifact {
  id: string
  relatedEntityType: string
  relatedEntityId: string
  proofType: ProofType
  /** Reference to proof stored in Midnight or off-chain storage */
  proofRef: string
  verificationResult: ProofVerificationResult
  generatedAt: Date
}
