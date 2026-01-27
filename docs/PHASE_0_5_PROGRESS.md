# Phase 0.5 Progress Update (Pre-Funding)
Legeon Genesis Onboarding – Midnight Compact DApp

## Purpose
This document provides a **transparent progress update** for proposal reviewers while the Midnight Compact DApp proposal is under review.

**Phase 0.5 is pre-funding preparation only.** It demonstrates readiness and reduces delivery risk **without implementing funded scope**.

## What Phase 0.5 Means
Phase 0.5 is limited to:
- Architecture scaffolding and documentation
- Domain modeling and interface definitions
- Mock adapters and placeholders (no real integrations)

Phase 0.5 explicitly excludes:
- Midnight/Compact smart contracts or proof circuits
- Wallet (CIP-30) integration
- Production APIs, business logic, or deployments
- Database migrations / live persistence

## Work Completed
- **Repo and governance:** Repository prepared with a protected-branch workflow (PR-based changes).
- **Canonical build constraints:** `CLAUDE.md` defines non-negotiable privacy and scope rules (no PII on-chain, AI is assistive-only, Midnight treated as a protocol boundary).
- **Domain model:** `/docs/domain-schema-seed.md` defines onboarding entities including ProfileDraft (CV extraction → review → confirm).
- **Scaffolding (structure only):** Monorepo structure, frontend placeholder, domain types/interfaces, mock Midnight adapter boundary, AI extraction interfaces, config types, and a draft Prisma schema (no migrations, no runtime logic). See `PHASE_0_SCAFFOLD.md`.

## What Will Only Start After Approval
- Compact contract implementation and proof logic
- Wallet integration and on-chain interactions
- Backend services/APIs and full onboarding UX
- Testnet/devnet deployments and production hardening

## Summary
Phase 0.5 shows **architectural readiness and disciplined scope control**. No funded milestones have been delivered or pre-empted.

*Status: informational only (pre-funding).*

