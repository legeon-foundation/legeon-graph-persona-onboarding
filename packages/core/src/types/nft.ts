/**
 * ProfileNFT
 * On-chain pointer representing verified onboarding status
 *
 * CRITICAL PRIVACY RULES:
 * - NO PII
 * - NO CVs or credentials
 * - NO jurisdictional data
 * - Proof references ONLY
 * - Non-sensitive professional metadata only (e.g., skill tags)
 *
 * The ProfileNFT is NOT an identity container.
 * It is a cryptographic commitment to verified onboarding status.
 */
export interface ProfileNFT {
  tokenId: string
  ownerWalletAddress: string
  /** IPFS or Arweave URI to non-sensitive metadata JSON */
  metadataURI: string
  /** Array of commitment hashes and proof references */
  commitmentRefs: string[]
  mintedAt: Date
}
