/**
 * External Platform Enumeration
 */
export enum ExternalPlatform {
  DISCORD = 'DISCORD',
}

/**
 * Verification Method Enumeration
 */
export enum VerificationMethod {
  WALLET_SIGNATURE = 'WALLET_SIGNATURE',
  OAUTH = 'OAUTH',
}

/**
 * ExternalIdentityLink
 * Optional linkage to external platforms
 *
 * CRITICAL CONSTRAINTS:
 * - Optional
 * - Post-ProfileNFT ONLY
 * - Non-authoritative
 * - Discord identity must NOT be used for:
 *   - Authentication
 *   - Compliance
 *   - Verification decisions
 */
export interface ExternalIdentityLink {
  id: string
  consultantId: string
  platform: ExternalPlatform
  externalUserId: string
  verificationMethod: VerificationMethod
  linkedAt: Date
}
