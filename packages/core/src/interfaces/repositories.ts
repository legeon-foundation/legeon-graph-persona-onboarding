/**
 * Repository Interfaces
 * Define contracts for data access layer
 *
 * NOTE: Implementations are backend-only
 * Frontend should NEVER directly access repositories
 */

import type {
  User,
  ConsultantProfile,
  Credential,
  ProfileDraft,
  VerificationRecord,
  ProofArtifact,
  ProfileNFT,
  ConsentRecord,
  ComplianceStatus,
  ExternalIdentityLink,
  AuditLog,
} from '../types'

/**
 * IUserRepository
 * TODO: Implement in backend layer
 */
export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByWalletAddress(walletAddress: string): Promise<User | null>
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>
  // TODO: Add update, delete methods as needed
}

/**
 * IConsultantProfileRepository
 * TODO: Implement in backend layer
 */
export interface IConsultantProfileRepository {
  findByUserId(userId: string): Promise<ConsultantProfile | null>
  create(profile: Omit<ConsultantProfile, 'createdAt' | 'updatedAt'>): Promise<ConsultantProfile>
  update(userId: string, data: Partial<ConsultantProfile>): Promise<ConsultantProfile>
  // TODO: Add search, list methods as needed
}

/**
 * ICredentialRepository
 * TODO: Implement in backend layer
 */
export interface ICredentialRepository {
  findById(id: string): Promise<Credential | null>
  findByConsultantId(consultantId: string): Promise<Credential[]>
  create(credential: Omit<Credential, 'id' | 'submittedAt'>): Promise<Credential>
  // TODO: Add update, delete methods as needed
}

/**
 * IProfileDraftRepository
 * TODO: Implement in backend layer
 */
export interface IProfileDraftRepository {
  findByConsultantId(consultantId: string): Promise<ProfileDraft[]>
  findBySourceCredentialId(credentialId: string): Promise<ProfileDraft | null>
  create(draft: Omit<ProfileDraft, 'id' | 'createdAt'>): Promise<ProfileDraft>
  update(id: string, data: Partial<ProfileDraft>): Promise<ProfileDraft>
  // TODO: Add delete method
}

/**
 * IVerificationRepository
 * TODO: Implement in backend layer
 */
export interface IVerificationRepository {
  findByCredentialId(credentialId: string): Promise<VerificationRecord[]>
  create(record: Omit<VerificationRecord, 'id' | 'decidedAt'>): Promise<VerificationRecord>
  // TODO: Add query methods as needed
}

/**
 * IProofArtifactRepository
 * TODO: Implement in backend layer
 */
export interface IProofArtifactRepository {
  findById(id: string): Promise<ProofArtifact | null>
  findByEntity(entityType: string, entityId: string): Promise<ProofArtifact[]>
  create(artifact: Omit<ProofArtifact, 'id' | 'generatedAt'>): Promise<ProofArtifact>
  // TODO: Add verification methods
}

/**
 * IProfileNFTRepository
 * TODO: Implement in backend layer
 */
export interface IProfileNFTRepository {
  findByTokenId(tokenId: string): Promise<ProfileNFT | null>
  findByOwner(walletAddress: string): Promise<ProfileNFT | null>
  create(nft: Omit<ProfileNFT, 'mintedAt'>): Promise<ProfileNFT>
  // TODO: Add update methods for metadata URI
}

/**
 * IConsentRepository
 * TODO: Implement in backend layer
 */
export interface IConsentRepository {
  findByUser(userId: string): Promise<ConsentRecord[]>
  create(consent: Omit<ConsentRecord, 'id' | 'acceptedAt'>): Promise<ConsentRecord>
  // TODO: Add query methods by jurisdiction and type
}

/**
 * IComplianceRepository
 * TODO: Implement in backend layer
 */
export interface IComplianceRepository {
  findByConsultant(consultantId: string): Promise<ComplianceStatus | null>
  create(status: Omit<ComplianceStatus, 'id' | 'evaluatedAt'>): Promise<ComplianceStatus>
  update(id: string, data: Partial<ComplianceStatus>): Promise<ComplianceStatus>
  // TODO: Add reevaluation methods
}

/**
 * IExternalIdentityRepository
 * TODO: Implement in backend layer
 */
export interface IExternalIdentityRepository {
  findByConsultant(consultantId: string): Promise<ExternalIdentityLink[]>
  create(link: Omit<ExternalIdentityLink, 'id' | 'linkedAt'>): Promise<ExternalIdentityLink>
  delete(id: string): Promise<void>
  // TODO: Add verification methods
}

/**
 * IAuditLogRepository
 * TODO: Implement in backend layer
 */
export interface IAuditLogRepository {
  create(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>
  findByActor(actorUserId: string, limit?: number): Promise<AuditLog[]>
  findByResource(resourceType: string, resourceId: string): Promise<AuditLog[]>
  // TODO: Add query and search methods
}
