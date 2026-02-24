import { generateMockHash } from './utils'
import {
  type WalletInfo,
  type ExtractionResult,
  type ComplianceGate,
  type VerificationGate,
  type NFTMintResult,
  type StepMeta,
  SupportedWallet,
  ComplianceStatusType,
  VerificationStatus,
  ConsentType,
  WizardStep,
} from './types'

// ---------------------------------------------------------------------------
// Wallet Data
// ---------------------------------------------------------------------------

export const WALLETS: WalletInfo[] = [
  { id: SupportedWallet.NAMI, name: 'Nami', icon: 'N', installed: true },
  { id: SupportedWallet.ETERNL, name: 'Eternl', icon: 'E', installed: true },
  { id: SupportedWallet.LACE, name: 'Lace', icon: 'L', installed: true },
  { id: SupportedWallet.FLINT, name: 'Flint', icon: 'F', installed: false },
  { id: SupportedWallet.TYPHON, name: 'Typhon', icon: 'T', installed: false },
  { id: SupportedWallet.GERO, name: 'GeroWallet', icon: 'G', installed: false },
]

export const MOCK_WALLET_ADDRESS =
  'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp'

// ---------------------------------------------------------------------------
// Jurisdictions
// ---------------------------------------------------------------------------

export const JURISDICTIONS = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'JP', name: 'Japan' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PL', name: 'Poland' },
  { code: 'ZA', name: 'South Africa' },
]

// ---------------------------------------------------------------------------
// Extraction Result — Genesis Profile field naming conventions
// ---------------------------------------------------------------------------

export const MOCK_EXTRACTION_RESULT: ExtractionResult = {
  extractedDisplayName: {
    key: 'extractedDisplayName',
    label: 'Display Name',
    value: 'Alexandra Chen',
    confidence: 0.95,
    source: 'CV Header',
    edited: false,
  },
  extractedBio: {
    key: 'extractedBio',
    label: 'Professional Bio',
    value:
      'Senior SAP FICO consultant with 12+ years of experience in global enterprise implementations. Led S/4HANA migrations for Fortune 500 clients across EMEA and APAC.',
    confidence: 0.82,
    source: 'CV Summary Section',
    edited: false,
  },
  extractedSkillTags: {
    key: 'extractedSkillTags',
    label: 'Skill Tags',
    value:
      'SAP FICO, SAP S/4HANA, Financial Planning, Controlling, Treasury Management, ABAP Basics, Fiori UX',
    confidence: 0.91,
    source: 'CV Skills Section',
    edited: false,
  },
  extractedExperienceSummary: {
    key: 'extractedExperienceSummary',
    label: 'Experience Summary',
    value:
      'Led SAP FICO implementation for 3 Fortune 500 companies. Managed teams of 8-15 consultants across 4 time zones. Delivered $2.3M in cost savings through process automation.',
    confidence: 0.78,
    source: 'CV Experience Section',
    edited: false,
  },
  sapDomains: {
    key: 'sapDomains',
    label: 'SAP Domains',
    value: 'FICO, CO, TR, S/4HANA Finance, Central Finance',
    confidence: 0.88,
    source: 'CV Skills + Experience Sections',
    edited: false,
  },
  btpExperience: {
    key: 'btpExperience',
    label: 'BTP Pillars / Runtimes / Services',
    value:
      'SAP BTP Cloud Foundry, SAP Build Work Zone, SAP Integration Suite, SAP Analytics Cloud',
    confidence: 0.72,
    source: 'CV Projects Section',
    edited: false,
  },
  aiTransformationRoles: {
    key: 'aiTransformationRoles',
    label: 'AI Transformation Roles',
    value: 'AI Change Lead, Process Mining Analyst',
    confidence: 0.65,
    source: 'CV Recent Roles Section',
    edited: false,
  },
}

// ---------------------------------------------------------------------------
// Verification Gates
// ---------------------------------------------------------------------------

export const MOCK_VERIFICATION_GATES: VerificationGate[] = [
  {
    id: 'vg-1',
    label: 'Credential Authenticity',
    status: VerificationStatus.PENDING,
    detail: 'Verifying uploaded documents against known issuers',
  },
  {
    id: 'vg-2',
    label: 'Identity Confirmation',
    status: VerificationStatus.PENDING,
    detail: 'Confirming wallet-linked identity matches credentials',
  },
  {
    id: 'vg-3',
    label: 'Proof Generation',
    status: VerificationStatus.PENDING,
    detail: 'Generating zero-knowledge proofs via Midnight',
  },
]

export const MOCK_VERIFICATION_GATES_VERIFIED: VerificationGate[] = [
  {
    id: 'vg-1',
    label: 'Credential Authenticity',
    status: VerificationStatus.APPROVED,
    detail: 'Documents verified against known issuers',
  },
  {
    id: 'vg-2',
    label: 'Identity Confirmation',
    status: VerificationStatus.APPROVED,
    detail: 'Wallet-linked identity confirmed',
  },
  {
    id: 'vg-3',
    label: 'Proof Generation',
    status: VerificationStatus.APPROVED,
    detail: 'Zero-knowledge proofs generated successfully',
  },
]

// ---------------------------------------------------------------------------
// Compliance Gates
// ---------------------------------------------------------------------------

export const MOCK_COMPLIANCE_GATES: ComplianceGate[] = [
  {
    id: 'cg-1',
    label: 'Jurisdiction Compliance',
    status: ComplianceStatusType.PASS,
    detail: 'Onboarding permitted in selected jurisdiction',
  },
  {
    id: 'cg-2',
    label: 'Credential Verification',
    status: ComplianceStatusType.PASS,
    detail: 'All submitted credentials have been verified',
  },
  {
    id: 'cg-3',
    label: 'Data Processing Consent',
    status: ComplianceStatusType.PASS,
    detail: 'Required consents recorded and valid',
  },
  {
    id: 'cg-4',
    label: 'Profile Completeness',
    status: ComplianceStatusType.PASS,
    detail: 'All required profile fields confirmed by consultant',
  },
]

// ---------------------------------------------------------------------------
// NFT Result
// ---------------------------------------------------------------------------

const mockCommitmentRefs = [
  'midnight://commitment/a3b8f2c1d4e5' + generateMockHash().slice(0, 24),
  'midnight://commitment/f7e9d0c3b2a1' + generateMockHash().slice(0, 24),
  'midnight://proof/c4d5e6f7a8b9' + generateMockHash().slice(0, 24),
]

export const MOCK_NFT_RESULT: NFTMintResult = {
  tokenId: 'legeon_profile_' + generateMockHash().slice(0, 16),
  policyId: generateMockHash().slice(0, 56),
  ownerWalletAddress: MOCK_WALLET_ADDRESS,
  metadataURI: 'ipfs://Qm' + generateMockHash().slice(0, 44),
  commitmentRefs: mockCommitmentRefs,
  skillTags: [
    'SAP FICO',
    'S/4HANA',
    'Financial Planning',
    'Controlling',
    'Treasury',
    'Fiori UX',
  ],
  mintedAt: new Date(),
  txHash: generateMockHash(),
}

// ---------------------------------------------------------------------------
// Processing Steps
// ---------------------------------------------------------------------------

export const PROCESSING_STEPS = [
  { label: 'Encrypting documents', duration: 1200 },
  { label: 'Extracting profile data via AI', duration: 2000 },
  { label: 'Generating cryptographic commitments', duration: 1500 },
  { label: 'Preparing verification artifacts', duration: 800 },
]

// ---------------------------------------------------------------------------
// Consent Descriptions
// ---------------------------------------------------------------------------

export const CONSENT_DESCRIPTIONS: Record<ConsentType, { label: string; description: string; required: boolean }> = {
  [ConsentType.DATA_PROCESSING]: {
    label: 'Data Processing',
    description:
      'I consent to the processing of my submitted documents for onboarding purposes. All data is encrypted and stored off-chain.',
    required: true,
  },
  [ConsentType.AI_EXTRACTION]: {
    label: 'AI-Assisted Extraction',
    description:
      'I consent to AI-assisted extraction of professional data from my CV. Extraction is assistive only \u2014 I will review all results before anything is saved.',
    required: true,
  },
  [ConsentType.CREDENTIAL_VERIFICATION]: {
    label: 'Credential Verification',
    description:
      'I consent to verification of my credentials via privacy-preserving proofs. Raw documents are never shared with clients or third parties.',
    required: true,
  },
  [ConsentType.PROFILE_PUBLICATION]: {
    label: 'Profile Publication',
    description:
      'I consent to publishing confirmed, non-sensitive profile fields (e.g. skills, roles, availability) for matching purposes. This does not include PII or documents.',
    required: false,
  },
}

// ---------------------------------------------------------------------------
// Step Metadata
// ---------------------------------------------------------------------------

export const STEP_META: StepMeta[] = [
  { step: WizardStep.LANDING, label: 'Welcome', shortLabel: 'Start' },
  { step: WizardStep.WALLET_CONNECT, label: 'Wallet', shortLabel: 'Wallet' },
  { step: WizardStep.UPLOAD_DOCS, label: 'Documents', shortLabel: 'Docs' },
  { step: WizardStep.PROCESSING, label: 'Processing', shortLabel: 'Process' },
  { step: WizardStep.REVIEW_CONFIRM, label: 'Review', shortLabel: 'Review' },
  { step: WizardStep.VERIFICATION_MINT, label: 'Verify & Mint', shortLabel: 'Mint' },
  { step: WizardStep.DISCORD_SUCCESS, label: 'Complete', shortLabel: 'Done' },
]
