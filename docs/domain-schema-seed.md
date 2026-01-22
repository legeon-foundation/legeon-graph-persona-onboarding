# Legeon Global Onboarding — Domain Schema Seed v1.1

## Purpose
This document defines the conceptual domain objects for the Legeon
privacy-preserving onboarding DApp.

This is not a database schema or smart contract.
It exists to keep frontend, backend, and privacy boundaries aligned.

---

## User
Represents an authenticated actor identified by a Cardano wallet.

- id
- walletAddress
- role (CONSULTANT | VERIFIER | OPS_ADMIN | AUDITOR)
- createdAt

---

## ConsultantProfile
Public-facing professional identity with privacy controls.

- userId
- displayName
- publicBio
- skillTags[]
- jurisdiction
- onboardingStatus
- profileVisibility
- createdAt
- updatedAt

---

## Credential
A submitted professional credential (CV, certification, etc.).

- id
- consultantId
- credentialType (RESUME | CERTIFICATION | RIGHT_TO_WORK | TAX | OTHER)
- issuer
- encryptedBlobRef
- commitmentHash
- verificationStatus
- expiresAt?
- submittedAt

---

## ProfileDraft
Unconfirmed profile data extracted from a CV.

- consultantId
- sourceCredentialId
- extractedDisplayName?
- extractedBio?
- extractedSkillTags[]
- extractedExperienceSummary?
- status (DRAFT | CONFIRMED | DISCARDED)
- createdAt

Rules:
- ProfileDraft is never public
- Consultant must review and confirm all fields
- Only confirmed fields may be promoted to ConsultantProfile
- Raw CV data must never auto-publish

---

## VerificationRecord
Human or automated verification action.

- id
- credentialId
- verifierUserId
- decision (APPROVE | REJECT)
- notes?
- decidedAt

---

## ProofArtifact
Cryptographic proof or attestation reference.

- id
- relatedEntityType
- relatedEntityId
- proofType
- proofRef
- verificationResult
- generatedAt

---

## ProfileNFT
On-chain pointer representing verified onboarding status.

- tokenId
- ownerWalletAddress
- metadataURI
- commitmentRefs[]
- mintedAt

Rules:
- No PII
- No CVs or credentials
- No jurisdictional data
- Proof references only

---

## ConsentRecord
Tracks user consent by jurisdiction.

- userId
- jurisdiction
- consentType
- version
- acceptedAt

---

## ComplianceStatus
Evaluated readiness for onboarding.

- consultantId
- jurisdiction
- status (PASS | FAIL | REVIEW)
- blockingReasons[]
- evaluatedAt

---

## ExternalIdentityLink
Optional linkage to external platforms.

- consultantId
- platform (DISCORD)
- externalUserId
- verificationMethod
- linkedAt

Rules:
- Optional
- Post-ProfileNFT only
- Non-authoritative

---

## AuditLog
Immutable log of sensitive actions.

- id
- actorUserId
- action
- resourceType
- resourceId
- timestamp
- metadata?

---

## Onboarding State Machine

DRAFT  
→ WALLET_CONNECTED  
→ CONSENT_CAPTURED  
→ PROFILE_COMPLETE  
→ CREDENTIALS_SUBMITTED  
→ COMPLIANCE_REVIEW  
→ READY_FOR_MATCHING  
→ BLOCKED
