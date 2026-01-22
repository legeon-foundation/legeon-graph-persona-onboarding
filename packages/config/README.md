# @legeon/config

Configuration types and schemas for the Legeon privacy-preserving onboarding system.

## Phase 0 Status

This package contains **configuration types and interfaces only**. No runtime implementations are provided.

## Contents

### Environment Configuration (`/src/env.ts`)
Type-safe environment variables for:
- Backend configuration (database, APIs, secrets)
- Frontend configuration (Next.js public vars)
- Feature flags
- Service endpoints

### Compliance Configuration (`/src/compliance.ts`)
Jurisdiction-aware compliance policies:
- Jurisdiction definitions (per ISO 3166-1)
- Required credentials per jurisdiction
- Redaction policies for PII
- Data retention policies

### Feature Flags (`/src/features.ts`)
Centralized feature toggles:
- Core features (wallet, CV upload, verification)
- Advanced features (AI, Midnight, Discord)
- Admin features (dashboard, audit logs)
- Experimental features

### Cardano Configuration (`/src/cardano.ts`)
Cardano network and wallet settings:
- Network configuration (mainnet, preprod, preview)
- CIP-30 wallet support
- ProfileNFT policy configuration
- Blockfrost integration

## Usage

```typescript
import {
  BackendEnvConfig,
  JurisdictionConfig,
  FeatureFlags,
  CardanoNetworkConfig
} from '@legeon/config'

// Type-safe environment access
const config: BackendEnvConfig = {
  NODE_ENV: 'development',
  PORT: 3000,
  // ...
}

// Jurisdiction policy
const usJurisdiction: JurisdictionConfig = {
  code: 'US',
  name: 'United States',
  requiredCredentials: ['RESUME', 'RIGHT_TO_WORK'],
  // ...
}
```

## Design Principles

### Policy-Driven Compliance
Per CLAUDE.md: Compliance is **policy-driven**, not hard-coded by country
- Jurisdiction configurations loaded from database/config
- Extensible custom rules
- Version-controlled consent policies

### Environment Separation
- Backend: Full configuration access
- Frontend: Public vars only (NEXT_PUBLIC_*)
- Secrets never in frontend bundle

### Type Safety
All configuration is strongly typed:
- Runtime validation (TODO: implement with Zod)
- TypeScript compile-time checks
- Clear documentation

## Next Steps (Phase 1+)

1. [ ] Implement environment variable validation
2. [ ] Create jurisdiction policy database schema
3. [ ] Add feature flag service integration
4. [ ] Configure Cardano network endpoints
5. [ ] Add compliance policy registry
6. [ ] Implement runtime config validation

See `/CLAUDE.md` for authoritative constraints.
