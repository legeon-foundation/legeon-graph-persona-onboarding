/**
 * Mock Midnight Adapter
 *
 * MANDATORY IMPLEMENTATION per CLAUDE.md
 * This mock will be replaced when Midnight SDK stabilizes
 *
 * Current Reality:
 * - No publicly stable Midnight SDK
 * - Mock allows end-to-end development without SDK dependency
 * - Mock must be swappable without changing domain logic
 */

import type { IMidnightAdapter } from './adapter'
import type {
  ProofGenerationRequest,
  ProofGenerationResult,
  ProofVerificationRequest,
  ProofVerificationResult,
  CommitmentGenerationRequest,
  CommitmentGenerationResult,
} from './types'

/**
 * MockMidnightAdapter
 * Simulates Midnight operations for development and testing
 */
export class MockMidnightAdapter implements IMidnightAdapter {
  private isConnectedFlag = true

  /**
   * Mock: Generate a cryptographic commitment hash
   * Real implementation: Use Midnight SDK commitment functions
   */
  async generateCommitment(
    request: CommitmentGenerationRequest
  ): Promise<CommitmentGenerationResult> {
    // TODO: Replace with real Midnight SDK call
    const salt = request.salt || this.generateRandomSalt()
    const dataString = JSON.stringify(request.data)
    const mockHash = this.mockHash(`${dataString}:${salt}`)

    return {
      commitmentHash: mockHash,
      salt,
    }
  }

  /**
   * Mock: Generate a zero-knowledge proof
   * Real implementation: Use Midnight SDK proof generation
   */
  async generateProof(request: ProofGenerationRequest): Promise<ProofGenerationResult> {
    // TODO: Replace with real Midnight SDK call
    const proofId = this.generateRandomId()
    const proofRef = `midnight://proof/${proofId}`

    return {
      proofId,
      proofRef,
      timestamp: new Date(),
    }
  }

  /**
   * Mock: Verify a zero-knowledge proof
   * Real implementation: Use Midnight SDK proof verification
   */
  async verifyProof(request: ProofVerificationRequest): Promise<ProofVerificationResult> {
    // TODO: Replace with real Midnight SDK call
    // Mock: Always return valid for development
    return {
      isValid: true,
      verifiedAt: new Date(),
      metadata: {
        mockVerification: true,
        proofRef: request.proofRef,
      },
    }
  }

  /**
   * Mock: Submit proof to Midnight network
   * Real implementation: Use Midnight SDK network submission
   */
  async submitProof(proofRef: string): Promise<string> {
    // TODO: Replace with real Midnight SDK call
    const txId = `midnight-tx-${this.generateRandomId()}`
    return txId
  }

  /**
   * Mock: Check adapter connection status
   * Real implementation: Check Midnight network connection
   */
  async isConnected(): Promise<boolean> {
    return this.isConnectedFlag
  }

  /**
   * Set connection status (for testing)
   */
  setConnected(connected: boolean): void {
    this.isConnectedFlag = connected
  }

  // Mock helper methods
  private generateRandomSalt(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  private generateRandomId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  private mockHash(input: string): string {
    // Simple mock hash (NOT cryptographically secure)
    // TODO: Replace with real cryptographic hash from Midnight SDK
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`
  }
}

/**
 * Factory function to create mock adapter instance
 */
export function createMockMidnightAdapter(): IMidnightAdapter {
  return new MockMidnightAdapter()
}
