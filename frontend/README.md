# Legeon Genesis Onboarding - Frontend

Next.js frontend application for the Legeon privacy-preserving onboarding system.

## Phase 0 Status

This is a **placeholder** scaffold only. No business logic is implemented.

## Planned Features (Phase 1+)

- [ ] CIP-30 Cardano wallet connection
- [ ] Consultant onboarding flow
- [ ] CV/Resume upload with privacy controls
- [ ] Profile draft review & confirmation
- [ ] Verifier & admin interfaces
- [ ] ProfileNFT minting UI

## Development

```bash
pnpm dev
```

## Important Constraints

See `/CLAUDE.md` for authoritative build instructions.

Key principles:
- Privacy-first: No sensitive data in client state
- Wallet = root of identity (CIP-30)
- All sensitive operations server-side only
- No DAO/governance features
