# Prisma Schema

Database schema for the Legeon privacy-preserving onboarding system.

## Phase 0 Status

This is a **draft schema only**. No migrations or database have been created yet.

## Schema Design

Based on `/docs/domain-schema-seed.md` with strict privacy constraints per `/CLAUDE.md`.

### Core Entities

1. **User** - Authenticated actor (wallet = identity)
2. **ConsultantProfile** - Public professional identity
3. **Credential** - Encrypted credentials (CV, certs)
4. **ProfileDraft** - Unconfirmed CV extraction (private)
5. **VerificationRecord** - Verification decisions
6. **ProofArtifact** - Cryptographic proofs
7. **ProfileNFT** - On-chain status pointer
8. **ConsentRecord** - Jurisdiction-aware consent
9. **ComplianceStatus** - Evaluated compliance
10. **ExternalIdentityLink** - Optional Discord linkage
11. **AuditLog** - Immutable action log

### Privacy Constraints

#### Encrypted Data Storage
- **Credential.encryptedBlobRef**: Reference to encrypted blob, NOT raw data
- Raw CVs and credentials NEVER stored in database
- Blob storage (S3/Azure/GCS) used for encrypted files

#### ProfileDraft Privacy
- **NEVER** public
- Requires explicit consultant confirmation
- AI extraction assistive only, not authoritative

#### ProfileNFT Constraints
- **NO PII**
- **NO CVs or credentials**
- **NO jurisdictional data**
- Proof references ONLY

#### Audit Logging
- All sensitive actions logged
- Immutable (no updates/deletes)
- Includes actor, action, resource, timestamp

## Database Choice

**PostgreSQL** recommended for:
- JSONB support (metadata, compliance rules)
- Array types (skillTags, commitmentRefs)
- Strong ACID guarantees
- Mature ecosystem

## Next Steps (Phase 1+)

1. [ ] Initialize Prisma client in backend
2. [ ] Create initial migration
3. [ ] Set up PostgreSQL (local/cloud)
4. [ ] Implement repository layer
5. [ ] Add database seeding (test jurisdictions, policies)
6. [ ] Configure connection pooling
7. [ ] Add database encryption at rest

## Usage

```bash
# Generate Prisma client
npx prisma generate

# Create migration (Phase 1+)
npx prisma migrate dev --name init

# Open Prisma Studio
npx prisma studio
```

## Important Notes

- **Backend-only**: Prisma client used server-side only
- **No direct queries in frontend**: Use API endpoints
- **Encryption**: Blob storage encrypted separately
- **Compliance**: Schema supports multi-jurisdiction

See `/CLAUDE.md` for authoritative privacy constraints.
