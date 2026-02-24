/**
 * Shared onboarding state types used across the wizard, vault, and versioning.
 */

export interface ProfileVersion {
  version: number;
  createdAt: string;
  commitmentHash: string;
  supersedesVersion?: number;
}

export interface ProfileDraftState {
  displayName: string;
  publicBio: string;
  skillTags: string[];
  experienceSummary: string;
  extractedFromCV: boolean;
}

export interface ConsentState {
  dataProcessing: boolean;
  credentialVerification: boolean;
  aiExtraction: boolean;
}

export type VerificationStatus = 'idle' | 'submitted' | 'approved' | 'demo-approved';
export type MintStatus = 'idle' | 'minting' | 'minted';

export interface OnboardingState {
  currentStep: number; // 1–6

  // Step 1: Wallet
  walletAddress?: string;
  walletConnected: boolean;

  // Step 2: Documents & Jurisdiction
  jurisdiction: string;
  cvFileName?: string;

  // Step 3: Consent
  consentsGiven: ConsentState;

  // Step 4: Profile Draft
  profileDraft: ProfileDraftState;
  profileConfirmed: boolean;

  // Step 5: Verification
  verificationStatus: VerificationStatus;
  lastCommitmentHash?: string;
  lastCommitmentSalt?: string;

  // Step 6: Mint
  mintStatus: MintStatus;
  tokenId?: string;

  // Profile versioning — persisted locally with the rest of wizard state
  profileVersions: ProfileVersion[];
}

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  currentStep: 1,
  walletConnected: false,
  jurisdiction: '',
  consentsGiven: {
    dataProcessing: false,
    credentialVerification: false,
    aiExtraction: false,
  },
  profileDraft: {
    displayName: '',
    publicBio: '',
    skillTags: [],
    experienceSummary: '',
    extractedFromCV: false,
  },
  profileConfirmed: false,
  verificationStatus: 'idle',
  mintStatus: 'idle',
  profileVersions: [],
};
