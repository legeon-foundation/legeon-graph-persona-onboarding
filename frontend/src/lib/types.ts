/**
 * Frontend-local type definitions for the Legeon Genesis Onboarding Wizard.
 *
 * These mirror packages/core types WITHOUT importing from them.
 * Field names match the Genesis Profile schema conventions exactly
 * (sap.domains, btp.pillars/runtimes/services, aiTransformationRoles, etc.)
 * to avoid drift from packages/core and future Gateway APIs.
 */

// ---------------------------------------------------------------------------
// Domain Enums (mirrored from packages/core)
// ---------------------------------------------------------------------------

export enum OnboardingStatus {
  DRAFT = 'DRAFT',
  WALLET_CONNECTED = 'WALLET_CONNECTED',
  CONSENT_CAPTURED = 'CONSENT_CAPTURED',
  PROFILE_COMPLETE = 'PROFILE_COMPLETE',
  CREDENTIALS_SUBMITTED = 'CREDENTIALS_SUBMITTED',
  COMPLIANCE_REVIEW = 'COMPLIANCE_REVIEW',
  READY_FOR_MATCHING = 'READY_FOR_MATCHING',
  BLOCKED = 'BLOCKED',
}

export enum ProfileDraftStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  DISCARDED = 'DISCARDED',
}

export enum CredentialType {
  RESUME = 'RESUME',
  CERTIFICATION = 'CERTIFICATION',
  RIGHT_TO_WORK = 'RIGHT_TO_WORK',
  TAX = 'TAX',
  OTHER = 'OTHER',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum SupportedWallet {
  NAMI = 'nami',
  ETERNL = 'eternl',
  FLINT = 'flint',
  TYPHON = 'typhoncip30',
  GERO = 'gerowallet',
  LACE = 'lace',
}

export enum ConsentType {
  DATA_PROCESSING = 'DATA_PROCESSING',
  CREDENTIAL_VERIFICATION = 'CREDENTIAL_VERIFICATION',
  PROFILE_PUBLICATION = 'PROFILE_PUBLICATION',
  AI_EXTRACTION = 'AI_EXTRACTION',
}

export enum ComplianceStatusType {
  PASS = 'PASS',
  FAIL = 'FAIL',
  REVIEW = 'REVIEW',
}

export enum ProofType {
  CREDENTIAL_COMMITMENT = 'CREDENTIAL_COMMITMENT',
  JURISDICTION_COMPLIANCE = 'JURISDICTION_COMPLIANCE',
  SKILL_ATTESTATION = 'SKILL_ATTESTATION',
  IDENTITY_LINK = 'IDENTITY_LINK',
}

export enum ProofVerificationResult {
  VALID = 'VALID',
  INVALID = 'INVALID',
  PENDING = 'PENDING',
}

export enum ProfileVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  VERIFIED_ONLY = 'VERIFIED_ONLY',
}

export enum ExternalPlatform {
  DISCORD = 'DISCORD',
}

export enum VerificationMethod {
  WALLET_SIGNATURE = 'WALLET_SIGNATURE',
  OAUTH = 'OAUTH',
}

// ---------------------------------------------------------------------------
// Wizard Step Enum
// ---------------------------------------------------------------------------

export enum WizardStep {
  LANDING = 0,
  WALLET_CONNECT = 1,
  UPLOAD_DOCS = 2,
  PROCESSING = 3,
  REVIEW_CONFIRM = 4,
  VERIFICATION_MINT = 5,
  DISCORD_SUCCESS = 6,
}

export interface StepMeta {
  step: WizardStep
  label: string
  shortLabel: string
}

// ---------------------------------------------------------------------------
// Wallet Types
// ---------------------------------------------------------------------------

export interface WalletInfo {
  id: SupportedWallet
  name: string
  icon: string
  installed: boolean
}

// ---------------------------------------------------------------------------
// Upload Types
// ---------------------------------------------------------------------------

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: CredentialType
  uploadedAt: Date
}

// ---------------------------------------------------------------------------
// Consent State
// ---------------------------------------------------------------------------

export interface ConsentState {
  [ConsentType.DATA_PROCESSING]: boolean
  [ConsentType.CREDENTIAL_VERIFICATION]: boolean
  [ConsentType.PROFILE_PUBLICATION]: boolean
  [ConsentType.AI_EXTRACTION]: boolean
}

// ---------------------------------------------------------------------------
// Extraction Types — Genesis Profile field naming conventions
// ---------------------------------------------------------------------------

export interface ExtractionField {
  key: string
  label: string
  value: string
  confidence: number
  source: string
  edited: boolean
}

/**
 * ExtractionResult mirrors the Genesis Profile schema:
 * - extractedDisplayName, extractedBio, extractedSkillTags, extractedExperienceSummary
 *   from packages/core ProfileDraft
 * - Extended with SAP/BTP domain fields per Genesis Profile conventions
 */
export interface ExtractionResult {
  extractedDisplayName: ExtractionField
  extractedBio: ExtractionField
  extractedSkillTags: ExtractionField
  extractedExperienceSummary: ExtractionField
  /** SAP functional domains (e.g. FICO, MM, SD, PP, HCM) */
  sapDomains: ExtractionField
  /** BTP pillars / runtimes / services */
  btpExperience: ExtractionField
  /** AI Transformation roles (e.g. AI Change Lead, Prompt Engineer) */
  aiTransformationRoles: ExtractionField
}

// ---------------------------------------------------------------------------
// Compliance & Verification
// ---------------------------------------------------------------------------

export interface ComplianceGate {
  id: string
  label: string
  status: ComplianceStatusType
  detail: string
}

export interface VerificationGate {
  id: string
  label: string
  status: VerificationStatus
  detail: string
}

// ---------------------------------------------------------------------------
// NFT Types
// ---------------------------------------------------------------------------

export interface NFTMintResult {
  tokenId: string
  policyId: string
  ownerWalletAddress: string
  metadataURI: string
  commitmentRefs: string[]
  skillTags: string[]
  mintedAt: Date
  txHash: string
}

export interface OnChainData {
  commitmentHashes: string[]
  proofRefs: string[]
  skillTags: string[]
  policyId: string
}

export interface PrivateData {
  displayName: string
  bio: string
  rawCVRef: string
  jurisdiction: string
  sapDomains: string[]
  btpExperience: string[]
  aiTransformationRoles: string[]
  certifications: string[]
}

// ---------------------------------------------------------------------------
// Wizard State Machine
// ---------------------------------------------------------------------------

export interface WizardState {
  currentStep: WizardStep
  // Wallet
  walletAddress: string | null
  walletName: string | null
  // Upload & Consent
  jurisdiction: string
  consents: ConsentState
  uploadedFiles: UploadedFile[]
  // Extraction
  extractionResult: ExtractionResult | null
  // Profile Draft
  profileDraft: Record<string, string>
  profileDraftStatus: ProfileDraftStatus
  // Verification & Compliance
  verificationGates: VerificationGate[]
  complianceGates: ComplianceGate[]
  // NFT
  nftResult: NFTMintResult | null
  // Discord
  discordLinked: boolean
  discordUsername: string | null
  // Demo mode — set when user skips verification via "Continue (Demo Mode)"
  demoMode: boolean
}

export type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: WizardStep }
  | { type: 'SET_WALLET'; address: string; name: string }
  | { type: 'DISCONNECT_WALLET' }
  | { type: 'SET_JURISDICTION'; jurisdiction: string }
  | { type: 'TOGGLE_CONSENT'; consentType: ConsentType }
  | { type: 'UPLOAD_FILE'; file: UploadedFile }
  | { type: 'REMOVE_FILE'; fileId: string }
  | { type: 'SET_EXTRACTION'; result: ExtractionResult }
  | { type: 'UPDATE_DRAFT_FIELD'; key: string; value: string }
  | { type: 'CONFIRM_PROFILE' }
  | { type: 'SET_VERIFICATION'; gates: VerificationGate[] }
  | { type: 'SET_COMPLIANCE'; gates: ComplianceGate[] }
  | { type: 'SET_NFT'; result: NFTMintResult }
  | { type: 'LINK_DISCORD'; username: string }
  | { type: 'ENABLE_DEMO_MODE' }
