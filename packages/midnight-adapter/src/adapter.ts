/**
 * Midnight Adapter Interface
 *
 * Defines the protocol boundary for Midnight integration
 * Implementations must be swappable (mock vs real Midnight SDK)
 */

import type {
  ProofGenerationRequest,
  ProofGenerationResult,
  ProofVerificationRequest,
  ProofVerificationResult,
  CommitmentGenerationRequest,
  CommitmentGenerationResult,
} from './types'

/**
 * IMidnightAdapter
 * Protocol boundary for all Midnight operations
 *
 * TODO: Implement real adapter when Midnight SDK stabilizes
 */
export interface IMidnightAdapter {
  /**
   * Generate a cryptographic commitment hash
   * @param request - Commitment generation request
   */
  generateCommitment(request: CommitmentGenerationRequest): Promise<CommitmentGenerationResult>

  /**
   * Generate a zero-knowledge proof
   * @param request - Proof generation request
   */
  generateProof(request: ProofGenerationRequest): Promise<ProofGenerationResult>

  /**
   * Verify a zero-knowledge proof
   * @param request - Proof verification request
   */
  verifyProof(request: ProofVerificationRequest): Promise<ProofVerificationResult>

  /**
   * Submit proof to Midnight network (optional, for persistence)
   * @param proofRef - Proof reference
   */
  submitProof(proofRef: string): Promise<string>

  /**
   * Check adapter connection status
   */
  isConnected(): Promise<boolean>
}
