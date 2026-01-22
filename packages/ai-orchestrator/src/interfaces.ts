/**
 * AI Orchestrator Interfaces
 *
 * Defines contracts for AI-assisted CV extraction
 * All implementations are backend-only and privacy-controlled
 */

import type {
  ExtractionRequest,
  ExtractionResult,
  RedactionPolicy,
  ExtractionAuditLog,
} from './types'

/**
 * IAIExtractor
 * Interface for AI-assisted CV data extraction
 *
 * CRITICAL PRIVACY RULES:
 * - Extraction is ASSISTIVE ONLY, never authoritative
 * - Raw CV must be redacted before AI processing
 * - Results must be reviewed by consultant before use
 * - All extractions must be audit logged
 *
 * TODO: Implement in backend layer
 */
export interface IAIExtractor {
  /**
   * Extract structured data from encrypted CV
   * @param request - Extraction request with privacy controls
   * @returns Extracted data for consultant review
   */
  extractFromCV(request: ExtractionRequest): Promise<ExtractionResult>

  /**
   * Get redaction policy for jurisdiction
   * @param jurisdiction - Jurisdiction code (e.g., 'US', 'EU', 'UK')
   * @returns Redaction policy to apply
   */
  getRedactionPolicy(jurisdiction: string): Promise<RedactionPolicy>

  /**
   * Validate extracted data against schema
   * @param result - Extraction result to validate
   * @returns True if valid, false otherwise
   */
  validateExtraction(result: ExtractionResult): Promise<boolean>

  // TODO: Add batch extraction methods
}

/**
 * IRedactionService
 * Interface for PII redaction before AI processing
 *
 * Privacy Note: This service runs BEFORE any AI processing
 * TODO: Implement in backend layer
 */
export interface IRedactionService {
  /**
   * Redact sensitive data from CV text
   * @param text - Raw CV text
   * @param policy - Redaction policy to apply
   * @returns Redacted text safe for AI processing
   */
  redactText(text: string, policy: RedactionPolicy): Promise<string>

  /**
   * Detect PII in text
   * @param text - Text to analyze
   * @returns Array of detected PII types
   */
  detectPII(text: string): Promise<string[]>

  /**
   * Validate redaction completeness
   * @param text - Redacted text
   * @param policy - Policy that was applied
   * @returns True if properly redacted
   */
  validateRedaction(text: string, policy: RedactionPolicy): Promise<boolean>

  // TODO: Add custom redaction rule methods
}

/**
 * IAIAuditLogger
 * Interface for AI extraction audit logging
 *
 * Privacy Note: Audit logs are critical for compliance
 * TODO: Implement in backend layer
 */
export interface IAIAuditLogger {
  /**
   * Log AI extraction event
   * @param log - Extraction audit log entry
   */
  logExtraction(log: Omit<ExtractionAuditLog, 'id' | 'extractedAt'>): Promise<void>

  /**
   * Get extraction history for consultant
   * @param consultantId - Consultant user ID
   * @returns Array of extraction audit logs
   */
  getExtractionHistory(consultantId: string): Promise<ExtractionAuditLog[]>

  /**
   * Get extraction logs by credential
   * @param credentialRef - Credential reference
   * @returns Array of extraction audit logs
   */
  getExtractionsByCredential(credentialRef: string): Promise<ExtractionAuditLog[]>

  // TODO: Add compliance reporting methods
}

/**
 * IAIOrchestrator
 * High-level orchestration of AI extraction workflow
 *
 * Coordinates: Redaction → Extraction → Validation → Audit
 * TODO: Implement in backend layer
 */
export interface IAIOrchestrator {
  /**
   * Orchestrate full CV extraction workflow
   * @param request - Extraction request
   * @returns Extraction result ready for consultant review
   */
  processCV(request: ExtractionRequest): Promise<ExtractionResult>

  /**
   * Get extraction status
   * @param credentialRef - Credential reference
   * @returns Extraction status
   */
  getExtractionStatus(credentialRef: string): Promise<'pending' | 'completed' | 'failed'>

  /**
   * Cancel in-progress extraction
   * @param credentialRef - Credential reference
   */
  cancelExtraction(credentialRef: string): Promise<void>

  // TODO: Add batch processing methods
}
