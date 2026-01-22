# @legeon/core

Core domain types and interfaces for the Legeon privacy-preserving onboarding system.

## Phase 0 Status

This package contains **types and interfaces only**. No implementations are provided.

## Contents

### Types (`/src/types`)
Domain object definitions based on `/docs/domain-schema-seed.md`:
- User & roles
- ConsultantProfile
- Credential & verification
- ProfileDraft (CV extraction)
- ProofArtifact
- ProfileNFT
- ConsentRecord & ComplianceStatus
- ExternalIdentityLink (Discord)
- AuditLog

### Interfaces (`/src/interfaces`)
Service and repository contracts:
- Repository interfaces (data access layer)
- Service interfaces (business logic layer)

## Usage

```typescript
import {
  User,
  ConsultantProfile,
  IProfileService
} from '@legeon/core'
```

## Privacy Principles

All types enforce privacy-first design:
- **ProfileDraft**: Never public, requires explicit confirmation
- **Credential**: Encrypted blob refs only, no raw data
- **ProfileNFT**: Proof references only, NO PII
- **ComplianceStatus**: Server-side evaluation only

## Important Constraints

See `/CLAUDE.md` for authoritative rules:
- Wallet = root of identity (CIP-30)
- Sensitive data NEVER crosses backend → blockchain boundary
- AI extraction is assistive only, never authoritative
- Prefer proofs over raw data
