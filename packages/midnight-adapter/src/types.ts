/**
 * Midnight Adapter Types
 *
 * CRITICAL DESIGN CONSTRAINT:
 * - Midnight is treated as a protocol boundary, NOT a library dependency
 * - No direct Midnight SDK imports in domain or UI logic
 * - No assumed contract syntax
 * - Mock provider is mandatory until stable SDK is available
 */

/**
 * Proof Generation Request
 */
export interface ProofGenerationRequest {
  entityType: string
  entityId: string
  proofType: string
  data: Record<string, unknown>
}

/**
 * Proof Generation Result
 */
export interface ProofGenerationResult {
  proofId: string
  proofRef: string
  timestamp: Date
}

/**
 * Proof Verification Request
 */
export interface ProofVerificationRequest {
  proofRef: string
  expectedCommitment?: string
}

/**
 * Proof Verification Result
 */
export interface ProofVerificationResult {
  isValid: boolean
  verifiedAt: Date
  metadata?: Record<string, unknown>
}

/**
 * Commitment Generation Request
 */
export interface CommitmentGenerationRequest {
  data: Record<string, unknown>
  salt?: string
}

/**
 * Commitment Generation Result
 */
export interface CommitmentGenerationResult {
  commitmentHash: string
  salt: string
}
