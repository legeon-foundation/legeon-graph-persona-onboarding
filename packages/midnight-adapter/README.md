# @legeon/midnight-adapter

Midnight protocol adapter for the Legeon privacy-preserving onboarding system.

## Phase 0 Status

This package contains a **mock adapter only**. No real Midnight SDK integration is implemented.

## Design Principles (per CLAUDE.md)

### Midnight as Protocol Boundary
- Midnight is treated as a **protocol**, not a library dependency
- No direct Midnight SDK imports in domain or UI logic
- No assumed contract syntax
- Adapter is fully swappable

### Mock Provider Mandatory
- There is no publicly stable Midnight SDK (as of Phase 0)
- Mock allows end-to-end development without SDK dependency
- Mock will be replaced when SDK stabilizes
- **No throwaway code**: Interface remains stable

## Architecture

```
Domain Logic (packages/core)
         ↓
   IMidnightAdapter (interface)
         ↓
   ┌─────┴─────┐
   ↓           ↓
MockAdapter   RealAdapter (future)
```

## Usage

```typescript
import { createMockMidnightAdapter } from '@legeon/midnight-adapter'

const adapter = createMockMidnightAdapter()

// Generate commitment
const commitment = await adapter.generateCommitment({
  data: { credentialId: '123' }
})

// Generate proof
const proof = await adapter.generateProof({
  entityType: 'Credential',
  entityId: '123',
  proofType: 'CREDENTIAL_COMMITMENT',
  data: {}
})

// Verify proof
const verification = await adapter.verifyProof({
  proofRef: proof.proofRef
})
```

## Capabilities

### Current (Mock)
- ✅ Commitment generation (mock hash)
- ✅ Proof generation (mock references)
- ✅ Proof verification (always valid for dev)
- ✅ Connection status checking

### Future (Real Midnight SDK)
- [ ] Real cryptographic commitments
- [ ] Zero-knowledge proof generation
- [ ] On-chain proof verification
- [ ] Midnight network submission
- [ ] Circuit integration

## Important Constraints

- Backend-only: This adapter runs **server-side only**
- Frontend never calls Midnight directly
- All sensitive operations are backend-coordinated

## Next Steps (Phase 1+)

1. Monitor Midnight SDK releases
2. Implement `RealMidnightAdapter` when SDK stabilizes
3. Create adapter factory to switch between mock/real
4. Add integration tests with Midnight devnet
5. Add circuit definitions for proof types

See `/CLAUDE.md` for authoritative constraints.
