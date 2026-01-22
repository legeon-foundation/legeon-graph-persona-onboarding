/**
 * Profile Draft Status Enumeration
 */
export enum ProfileDraftStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  DISCARDED = 'DISCARDED',
}

/**
 * ProfileDraft
 * Unconfirmed profile data extracted from a CV
 *
 * Privacy Rules (CRITICAL):
 * - ProfileDraft is NEVER public
 * - Consultant MUST review and confirm all fields
 * - Only confirmed fields may be promoted to ConsultantProfile
 * - Raw CV data must NEVER auto-publish
 * - AI-assisted extraction is assistive only, never authoritative
 */
export interface ProfileDraft {
  id: string
  consultantId: string
  sourceCredentialId: string
  extractedDisplayName: string | null
  extractedBio: string | null
  extractedSkillTags: string[]
  extractedExperienceSummary: string | null
  status: ProfileDraftStatus
  createdAt: Date
}
