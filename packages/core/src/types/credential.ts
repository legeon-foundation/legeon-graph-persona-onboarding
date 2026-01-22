/**
 * Credential Type Enumeration
 */
export enum CredentialType {
  RESUME = 'RESUME',
  CERTIFICATION = 'CERTIFICATION',
  RIGHT_TO_WORK = 'RIGHT_TO_WORK',
  TAX = 'TAX',
  OTHER = 'OTHER',
}

/**
 * Verification Status Enumeration
 */
export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * Credential
 * A submitted professional credential (CV, certification, etc.)
 *
 * Privacy Note: Raw credential data is encrypted off-chain
 * Only commitmentHash and metadata are stored
 */
export interface Credential {
  id: string
  consultantId: string
  credentialType: CredentialType
  issuer: string | null
  /** Reference to encrypted blob in secure storage (never raw data) */
  encryptedBlobRef: string
  /** Cryptographic commitment hash for zero-knowledge proofs */
  commitmentHash: string
  verificationStatus: VerificationStatus
  expiresAt: Date | null
  submittedAt: Date
}
