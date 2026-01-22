/**
 * Consent Type Enumeration
 */
export enum ConsentType {
  DATA_PROCESSING = 'DATA_PROCESSING',
  CREDENTIAL_VERIFICATION = 'CREDENTIAL_VERIFICATION',
  PROFILE_PUBLICATION = 'PROFILE_PUBLICATION',
  AI_EXTRACTION = 'AI_EXTRACTION',
}

/**
 * ConsentRecord
 * Tracks user consent by jurisdiction
 *
 * Privacy Note: Consent is policy-driven and jurisdiction-aware
 */
export interface ConsentRecord {
  id: string
  userId: string
  jurisdiction: string
  consentType: ConsentType
  /** Version of the consent policy accepted */
  version: string
  acceptedAt: Date
}

/**
 * Compliance Status Enumeration
 */
export enum ComplianceStatusType {
  PASS = 'PASS',
  FAIL = 'FAIL',
  REVIEW = 'REVIEW',
}

/**
 * ComplianceStatus
 * Evaluated readiness for onboarding
 *
 * Privacy Note: Compliance is evaluated server-side
 * Frontend only displays status, never makes decisions
 */
export interface ComplianceStatus {
  id: string
  consultantId: string
  jurisdiction: string
  status: ComplianceStatusType
  blockingReasons: string[]
  evaluatedAt: Date
}
