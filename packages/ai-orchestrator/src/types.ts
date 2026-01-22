/**
 * AI Orchestrator Types
 *
 * CRITICAL PRIVACY CONSTRAINTS per CLAUDE.md:
 * - AI-assisted extraction is ASSISTIVE ONLY, never authoritative
 * - Raw CV content must NEVER be used by AI without redaction and policy checks
 * - Extracted data must be explicitly reviewed and confirmed by consultant
 * - AI must NOT auto-publish any data to public profile
 */

/**
 * Extraction Request
 * Encapsulates a CV extraction request with privacy controls
 */
export interface ExtractionRequest {
  /** Reference to encrypted CV blob (NOT raw content) */
  credentialRef: string
  /** Consultant's jurisdiction (for compliance) */
  jurisdiction: string
  /** Consultant user ID (for audit logging) */
  consultantId: string
  /** Optional extraction hints */
  hints?: ExtractionHints
}

/**
 * Extraction Hints
 * Optional hints to guide AI extraction (domain-specific)
 */
export interface ExtractionHints {
  /** Expected language of CV */
  language?: string
  /** Expected industry or domain (e.g., 'SAP', 'Software Engineering') */
  domain?: string
  /** Specific fields to prioritize */
  priorityFields?: string[]
}

/**
 * Extraction Result
 * Structured data extracted from CV
 *
 * PRIVACY: This data is NOT public until consultant explicitly confirms it
 */
export interface ExtractionResult {
  /** Extracted display name (optional) */
  displayName?: string
  /** Extracted professional bio (optional) */
  bio?: string
  /** Extracted skill tags */
  skillTags: string[]
  /** Extracted experience summary (optional) */
  experienceSummary?: string
  /** Confidence score (0-1) for extracted data quality */
  confidenceScore: number
  /** Extraction timestamp */
  extractedAt: Date
}

/**
 * Redaction Policy
 * Defines what data must be redacted before AI processing
 */
export interface RedactionPolicy {
  /** PII patterns to redact (regex) */
  piiPatterns: string[]
  /** Sensitive keywords to redact */
  sensitiveKeywords: string[]
  /** Whether to redact contact information */
  redactContactInfo: boolean
  /** Whether to redact addresses */
  redactAddresses: boolean
  /** Whether to redact dates of birth */
  redactDatesOfBirth: boolean
}

/**
 * Extraction Audit Log
 * Tracks AI extraction for compliance
 */
export interface ExtractionAuditLog {
  id: string
  consultantId: string
  credentialRef: string
  modelUsed: string
  redactionPolicyApplied: string
  extractionDurationMs: number
  confidenceScore: number
  extractedAt: Date
}
