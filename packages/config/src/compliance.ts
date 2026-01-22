/**
 * Compliance Configuration
 * Jurisdiction-aware compliance policies
 *
 * Per CLAUDE.md: Compliance is policy-driven, not hard-coded by country
 */

/**
 * Jurisdiction Configuration
 * Defines compliance requirements per jurisdiction
 */
export interface JurisdictionConfig {
  /** Jurisdiction code (ISO 3166-1 alpha-2) */
  code: string
  /** Display name */
  name: string
  /** Required credential types for onboarding */
  requiredCredentials: string[]
  /** Consent policy version */
  consentPolicyVersion: string
  /** Data retention period in days */
  dataRetentionDays: number
  /** Whether jurisdiction requires explicit right-to-work proof */
  requiresRightToWork: boolean
  /** Whether jurisdiction requires tax documentation */
  requiresTaxDocumentation: boolean
  /** Custom compliance rules */
  customRules?: Record<string, unknown>
}

/**
 * Redaction Policy Configuration
 * Defines PII redaction rules per jurisdiction
 */
export interface RedactionPolicyConfig {
  jurisdiction: string
  /** PII regex patterns to redact */
  piiPatterns: string[]
  /** Sensitive keywords to redact */
  sensitiveKeywords: string[]
  /** Configuration flags */
  redactContactInfo: boolean
  redactAddresses: boolean
  redactDatesOfBirth: boolean
  redactNationalIds: boolean
}

/**
 * Compliance Policy Registry
 * TODO: Load from database or config file
 */
export interface ICompliancePolicyRegistry {
  /**
   * Get jurisdiction configuration
   * @param jurisdictionCode - ISO jurisdiction code
   */
  getJurisdiction(jurisdictionCode: string): Promise<JurisdictionConfig | null>

  /**
   * Get redaction policy for jurisdiction
   * @param jurisdictionCode - ISO jurisdiction code
   */
  getRedactionPolicy(jurisdictionCode: string): Promise<RedactionPolicyConfig>

  /**
   * List all supported jurisdictions
   */
  listJurisdictions(): Promise<JurisdictionConfig[]>
}
