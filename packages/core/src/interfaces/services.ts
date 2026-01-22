/**
 * Service Interfaces
 * Define contracts for business logic layer
 *
 * NOTE: All implementations are backend-only
 * These services coordinate repositories, adapters, and business rules
 */

import type {
  User,
  ConsultantProfile,
  Credential,
  ProfileDraft,
  OnboardingStatus,
} from '../types'

/**
 * Wallet Connection Result
 */
export interface WalletConnectionResult {
  user: User
  isNewUser: boolean
}

/**
 * IWalletService
 * Handles CIP-30 wallet authentication
 * TODO: Implement in backend layer
 */
export interface IWalletService {
  /**
   * Authenticate or create user from wallet signature
   * @param walletAddress - Cardano wallet address
   * @param signature - Signed challenge message
   */
  authenticateWallet(walletAddress: string, signature: string): Promise<WalletConnectionResult>

  /**
   * Generate challenge message for wallet signing
   * @param walletAddress - Cardano wallet address
   */
  generateChallenge(walletAddress: string): Promise<string>

  // TODO: Add session management methods
}

/**
 * CV Extraction Result
 */
export interface CVExtractionResult {
  displayName?: string
  bio?: string
  skillTags: string[]
  experienceSummary?: string
}

/**
 * ICredentialService
 * Handles credential upload, encryption, and verification
 * TODO: Implement in backend layer
 */
export interface ICredentialService {
  /**
   * Upload and encrypt a credential
   * @param consultantId - Consultant user ID
   * @param file - Credential file (CV, certification, etc.)
   * @param credentialType - Type of credential
   */
  uploadCredential(
    consultantId: string,
    file: File | Buffer,
    credentialType: string
  ): Promise<Credential>

  /**
   * Extract structured data from CV (AI-assisted)
   * PRIVACY: This is assistive only, never authoritative
   * @param credentialId - Credential ID
   */
  extractCVData(credentialId: string): Promise<CVExtractionResult>

  /**
   * Request verification of a credential
   * @param credentialId - Credential ID
   */
  requestVerification(credentialId: string): Promise<void>

  // TODO: Add download, delete methods (with audit logging)
}

/**
 * IProfileService
 * Handles consultant profile management
 * TODO: Implement in backend layer
 */
export interface IProfileService {
  /**
   * Create draft profile from CV extraction
   * @param consultantId - Consultant user ID
   * @param credentialId - Source credential ID
   * @param extractedData - Data extracted from CV
   */
  createProfileDraft(
    consultantId: string,
    credentialId: string,
    extractedData: CVExtractionResult
  ): Promise<ProfileDraft>

  /**
   * Consultant confirms draft and promotes to official profile
   * CRITICAL: Only confirmed fields are promoted
   * @param draftId - Profile draft ID
   * @param confirmedFields - Fields confirmed by consultant
   */
  confirmProfileDraft(
    draftId: string,
    confirmedFields: Partial<ConsultantProfile>
  ): Promise<ConsultantProfile>

  /**
   * Update consultant profile
   * @param userId - User ID
   * @param updates - Profile updates
   */
  updateProfile(userId: string, updates: Partial<ConsultantProfile>): Promise<ConsultantProfile>

  /**
   * Get profile by user ID
   * @param userId - User ID
   */
  getProfile(userId: string): Promise<ConsultantProfile | null>

  // TODO: Add profile search, visibility methods
}

/**
 * IComplianceService
 * Handles jurisdiction-aware compliance evaluation
 * TODO: Implement in backend layer
 */
export interface IComplianceService {
  /**
   * Evaluate consultant compliance status
   * PRIVACY: Compliance is policy-driven, not hard-coded by country
   * @param consultantId - Consultant user ID
   */
  evaluateCompliance(consultantId: string): Promise<void>

  /**
   * Record consent
   * @param userId - User ID
   * @param consentType - Type of consent
   * @param jurisdiction - Jurisdiction code
   */
  recordConsent(userId: string, consentType: string, jurisdiction: string): Promise<void>

  /**
   * Check if consultant can proceed to next onboarding stage
   * @param consultantId - Consultant user ID
   * @param targetStatus - Target onboarding status
   */
  canProgress(consultantId: string, targetStatus: OnboardingStatus): Promise<boolean>

  // TODO: Add jurisdiction policy methods
}

/**
 * IProofService
 * Handles cryptographic proof generation and verification
 * TODO: Implement in backend layer (coordinates with Midnight adapter)
 */
export interface IProofService {
  /**
   * Generate commitment hash for credential
   * @param credentialId - Credential ID
   */
  generateCredentialCommitment(credentialId: string): Promise<string>

  /**
   * Generate proof artifact
   * @param entityType - Entity type (e.g., 'Credential', 'Profile')
   * @param entityId - Entity ID
   * @param proofType - Type of proof
   */
  generateProof(entityType: string, entityId: string, proofType: string): Promise<string>

  /**
   * Verify proof artifact
   * @param proofId - Proof artifact ID
   */
  verifyProof(proofId: string): Promise<boolean>

  // TODO: Add batch proof methods
}

/**
 * Mint NFT Request
 */
export interface MintNFTRequest {
  consultantId: string
  metadataURI: string
  commitmentRefs: string[]
}

/**
 * INFTService
 * Handles ProfileNFT minting on Cardano testnet
 * TODO: Implement in backend layer
 */
export interface INFTService {
  /**
   * Mint ProfileNFT for verified consultant
   * PRIVACY: NFT contains ONLY proof references, no PII
   * @param request - Mint request with metadata
   */
  mintProfileNFT(request: MintNFTRequest): Promise<string>

  /**
   * Check if consultant is eligible for NFT minting
   * @param consultantId - Consultant user ID
   */
  canMintNFT(consultantId: string): Promise<boolean>

  /**
   * Get NFT by wallet address
   * @param walletAddress - Cardano wallet address
   */
  getNFTByWallet(walletAddress: string): Promise<any>

  // TODO: Add metadata update methods
}

/**
 * IExternalIdentityService
 * Handles optional external identity linking (Discord)
 * TODO: Implement in backend layer
 */
export interface IExternalIdentityService {
  /**
   * Link Discord account (post-NFT only)
   * CONSTRAINT: Non-authoritative, optional
   * @param consultantId - Consultant user ID
   * @param discordUserId - Discord user ID
   * @param walletSignature - Signed challenge
   */
  linkDiscord(
    consultantId: string,
    discordUserId: string,
    walletSignature: string
  ): Promise<void>

  /**
   * Unlink external identity
   * @param consultantId - Consultant user ID
   * @param platform - External platform
   */
  unlinkIdentity(consultantId: string, platform: string): Promise<void>

  // TODO: Add verification methods
}
