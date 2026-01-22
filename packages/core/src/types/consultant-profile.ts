/**
 * Onboarding Status Enumeration
 * Tracks consultant progress through the onboarding state machine
 *
 * Flow: DRAFT → WALLET_CONNECTED → CONSENT_CAPTURED → PROFILE_COMPLETE
 *       → CREDENTIALS_SUBMITTED → COMPLIANCE_REVIEW → READY_FOR_MATCHING
 *       (or BLOCKED at any stage)
 */
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

/**
 * Profile Visibility Enumeration
 */
export enum ProfileVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  VERIFIED_ONLY = 'VERIFIED_ONLY',
}

/**
 * ConsultantProfile
 * Public-facing professional identity with privacy controls
 *
 * Privacy Note: Contains ONLY non-sensitive, consultant-approved data
 * Raw CV content and PII must NEVER be stored here
 */
export interface ConsultantProfile {
  userId: string
  displayName: string | null
  publicBio: string | null
  skillTags: string[]
  jurisdiction: string
  onboardingStatus: OnboardingStatus
  profileVisibility: ProfileVisibility
  createdAt: Date
  updatedAt: Date
}
