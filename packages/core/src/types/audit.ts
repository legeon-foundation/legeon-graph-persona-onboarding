/**
 * AuditLog
 * Immutable log of sensitive actions
 *
 * Privacy Note: Audit logs are critical for compliance and security
 */
export interface AuditLog {
  id: string
  actorUserId: string
  action: string
  resourceType: string
  resourceId: string
  timestamp: Date
  /** Optional JSON metadata for context */
  metadata: Record<string, unknown> | null
}
