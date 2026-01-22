# Phase 0 Scaffolding - Complete

This document describes the Phase 0 scaffolding structure for the Legeon Genesis Onboarding DApp.

## Status: COMPLETE ✅

All Phase 0 scaffolding tasks have been completed. The repository is now ready for Phase 1 implementation.

## What Was Created

### 1. Monorepo Structure
- ✅ pnpm workspace configuration
- ✅ Root package.json with workspace scripts
- ✅ TypeScript configuration per package

### 2. Frontend Placeholder (`/frontend`)
- ✅ Next.js 14 app directory structure
- ✅ Minimal layout and page components
- ✅ TypeScript configuration
- ✅ Package.json with dependencies

### 3. Core Package (`/packages/core`)
- ✅ Domain types (User, ConsultantProfile, Credential, etc.)
- ✅ Repository interfaces (data access layer)
- ✅ Service interfaces (business logic layer)
- ✅ All types based on `/docs/domain-schema-seed.md`

### 4. Midnight Adapter (`/packages/midnight-adapter`)
- ✅ IMidnightAdapter interface
- ✅ MockMidnightAdapter implementation
- ✅ Commitment and proof types
- ✅ Protocol boundary design (no SDK dependencies)

### 5. AI Orchestrator (`/packages/ai-orchestrator`)
- ✅ IAIExtractor interface
- ✅ IRedactionService interface
- ✅ IAIAuditLogger interface
- ✅ IAIOrchestrator interface
- ✅ Privacy-first extraction types

### 6. Config Package (`/packages/config`)
- ✅ Environment configuration types
- ✅ Compliance policy types (jurisdiction-aware)
- ✅ Feature flag types
- ✅ Cardano network configuration types

### 7. Prisma Schema (`/prisma`)
- ✅ Complete schema based on domain seed
- ✅ Privacy-first design (encrypted blob refs)
- ✅ All domain entities modeled
- ✅ Audit logging support

## Repository Structure

```
legeon-genesis-onboarding-compactdapp/
├── CLAUDE.md                    # Authoritative build instructions
├── docs/
│   └── domain-schema-seed.md    # Domain model specification
├── frontend/                    # Next.js app (placeholder)
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── package.json
│   └── tsconfig.json
├── packages/
│   ├── core/                    # Domain types & interfaces
│   │   ├── src/
│   │   │   ├── types/          # User, Profile, Credential, etc.
│   │   │   └── interfaces/     # Repository & Service contracts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── midnight-adapter/        # Mock Midnight adapter
│   │   ├── src/
│   │   │   ├── adapter.ts      # IMidnightAdapter interface
│   │   │   ├── mock-adapter.ts # Mock implementation
│   │   │   └── types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ai-orchestrator/         # AI extraction interfaces
│   │   ├── src/
│   │   │   ├── interfaces.ts   # Extractor, Redaction, Audit
│   │   │   └── types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/                  # Configuration types
│       ├── src/
│       │   ├── env.ts          # Environment config
│       │   ├── compliance.ts   # Jurisdiction policies
│       │   ├── features.ts     # Feature flags
│       │   └── cardano.ts      # Cardano network config
│       ├── package.json
│       └── tsconfig.json
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── README.md
├── package.json                # Root workspace config
├── pnpm-workspace.yaml
└── PHASE_0_SCAFFOLD.md         # This file
```

## What Was NOT Created (By Design)

Per instructions, Phase 0 explicitly excludes:
- ❌ Business logic implementations
- ❌ UI flows and components
- ❌ Wallet integration (CIP-30)
- ❌ Midnight devnet code
- ❌ DAO functionality
- ❌ API endpoints
- ❌ Database migrations
- ❌ Authentication logic
- ❌ Actual AI extraction

## Key Design Principles Applied

### 1. Privacy-First by Design
- Sensitive data never exposed on-chain
- Encrypted blob references, not raw data
- ProfileDraft requires explicit confirmation
- ProfileNFT contains NO PII

### 2. Midnight as Protocol Boundary
- No direct SDK imports
- Mock adapter mandatory
- Interface-based design
- Swappable implementations

### 3. Interfaces Over Implementations
- All packages define contracts
- TODO comments for implementations
- Type-safe boundaries
- Clear separation of concerns

### 4. Jurisdiction-Aware Compliance
- Policy-driven, not hard-coded
- Extensible configuration
- Redaction policies per region
- Consent tracking

## Next Steps (Phase 1+)

### Backend Implementation
1. [ ] Implement repository layer with Prisma
2. [ ] Implement service layer (wallet, profile, credential)
3. [ ] Add CIP-30 wallet adapter
4. [ ] Implement AI extraction with OpenAI/Anthropic
5. [ ] Add Cardano testnet integration
6. [ ] Implement compliance engine
7. [ ] Build API endpoints (REST/GraphQL)

### Frontend Implementation
1. [ ] Build onboarding flow UI
2. [ ] Implement wallet connection
3. [ ] Add CV upload UI
4. [ ] Build profile draft review
5. [ ] Add verifier/admin dashboards
6. [ ] Implement Discord integration

### DevOps
1. [ ] Set up PostgreSQL database
2. [ ] Configure blob storage (S3/Azure)
3. [ ] Add environment configuration
4. [ ] Set up CI/CD pipelines
5. [ ] Configure Midnight devnet (when ready)

## Validation

All Phase 0 requirements met:
- ✅ Repository structure created
- ✅ Frontend placeholder only
- ✅ Packages contain types & interfaces only
- ✅ Mock Midnight adapter included
- ✅ Prisma schema reflects domain seed
- ✅ No business logic implemented
- ✅ No DAO functionality
- ✅ Interfaces and TODOs preferred over implementations

## Development Commands

```bash
# Install dependencies (Phase 1+)
pnpm install

# Type check all packages
pnpm type-check

# Start frontend dev server (Phase 1+)
pnpm dev

# Build all packages (Phase 1+)
pnpm build
```

## Important Notes

1. **CLAUDE.md is authoritative** - All implementation decisions must follow `/CLAUDE.md`
2. **Domain seed is canonical** - Schema based on `/docs/domain-schema-seed.md`
3. **Privacy is non-negotiable** - All privacy constraints must be enforced
4. **Midnight is SDK-agnostic** - Use adapter pattern, no direct dependencies
5. **AI is assistive only** - Never authoritative, requires confirmation

## References

- `/CLAUDE.md` - Canonical build instructions
- `/docs/domain-schema-seed.md` - Domain model specification
- `/prisma/schema.prisma` - Database schema
- Each package has its own README.md with detailed documentation

---

**Phase 0 Scaffolding Complete** - Ready for Phase 1 implementation
