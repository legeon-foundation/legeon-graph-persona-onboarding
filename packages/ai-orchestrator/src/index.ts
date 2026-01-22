/**
 * @legeon/ai-orchestrator
 *
 * AI orchestration for CV extraction in Legeon onboarding system
 *
 * CRITICAL PRIVACY CONSTRAINTS per CLAUDE.md:
 * - AI-assisted extraction is ASSISTIVE ONLY, never authoritative
 * - Raw CV content must NEVER be used without redaction and policy checks
 * - Extracted data must be explicitly reviewed and confirmed by consultant
 * - AI must NOT auto-publish any data
 *
 * Architecture:
 * 1. Redaction: Remove PII before AI processing
 * 2. Extraction: AI extracts structured data from redacted content
 * 3. Validation: Check extracted data quality
 * 4. Audit: Log all extraction events
 * 5. Review: Consultant confirms before promotion to profile
 */

// Export types
export * from './types'

// Export interfaces
export * from './interfaces'
