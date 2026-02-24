# Legeon Genesis Onboarding CompactDApp
**Privacy-preserving consultant onboarding for SAP AI**  
Catalyst Fund 15 — Midnight CompactDApps Track

---

## 🧭 Current Status: Baseline Hardening v1 (branch `baseline/hardening-v1`)

The onboarding prototype is now runnable and includes four hardening features that make it stable for demos and iterative development:

1. **Encrypted Local Persistence** — wizard progress is saved encrypted (AES-GCM) in IndexedDB with a localStorage fallback. Refresh or reopen the tab to resume exactly where you left off.
2. **Off-chain Profile Versioning** — confirming a profile creates v1 with a SHA-256 commitment hash. Editing after confirmation creates v2, v3, … without requiring a re-mint.
3. **Demo Mode Feature Flag** — controlled by `NEXT_PUBLIC_DEMO_MODE`. When `true`, a persistent amber banner is shown and Step 5 offers a "Continue (Demo Mode)" shortcut. When `false`, Step 5 blocks until verification is approved.
4. **Centralized Privacy Policy** — `frontend/src/lib/privacyPolicy.ts` is the single source of truth for `PUBLIC_ALLOWED / PRIVATE_ONLY / RESTRICTED_NEVER_PUBLIC` field classification, used by the Step 5 panels and commitment-hash generation.

---

## How to run

```bash
# Install dependencies (Node ≥ 18, pnpm ≥ 8 required)
pnpm install

# Start the frontend dev server
pnpm dev
# or: cd frontend && pnpm dev

# Open http://localhost:3000
```

## Environment variables

Copy `frontend/.env.local.example` to `frontend/.env.local` and adjust:

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_DEMO_MODE` | `false` | `true` enables demo banner + Step 5 shortcut |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend API base URL |
| `NEXT_PUBLIC_CARDANO_NETWORK` | `preprod` | `mainnet \| preprod \| preview` |

Restart the dev server after changing env vars.

## How to reset onboarding progress

Click the **Reset Onboarding** button in the step navigation bar (top of the wizard).
This calls `vault.reset()`, which:
- Deletes the encrypted blob from IndexedDB
- Clears the localStorage fallback key
- Removes the device encryption key
- Returns the wizard to Step 1

## How profile versions work (prototype)

| Event | Result |
|---|---|
| Consultant confirms profile draft (Step 4) | ProfileVersion v1 created with SHA-256 commitment hash |
| Consultant edits profile and saves | ProfileVersion v2 (etc.) created; mint status unchanged |
| ProfileNFT minted | Token ID recorded; does **not** lock the profile |
| Subsequent edits after mint | New profile versions; no re-mint required |

The last three versions are displayed on Step 4 (edit view) and Step 6 (post-mint summary). Each version's commitment hash is derived from `publicInputs + privateInputs + salt` using the policy in `privacyPolicy.ts`.

## Running tests

```bash
cd frontend
pnpm test          # run all tests once
pnpm test:watch    # watch mode
pnpm test:coverage # with coverage report
```

Tests cover:
- `vault.test.ts` — encryption round-trip, not-plaintext assertion, reset
- `profileVersioning.test.ts` — deterministic hash, version increment
- `demoMode.test.ts` — flag behaviour per env value
- `privacyPolicy.test.ts` — invariants, unclassified field detection
- `DemoBanner.test.tsx` — React component banner visibility

---

---


## Overview
The **Legeon Genesis Onboarding CompactDApp** is an open-source, privacy-first onboarding module designed for **SAP AI and hyperautomation consultants**.

It demonstrates how **encrypted profile attributes**, **selective disclosure**, and **zero-knowledge proofs** can enable **enterprise-safe decentralized consulting** on **Midnight**—without exposing sensitive consultant or enterprise data.

This project supports Legeon’s:
- **Phase 2: Privacy Core**
- **Phase 3: MVP (Enterprise Gateway & Private T&M Workflows)**

## Status
📘 **Phase 0.5 (Pre-Grant): documentation & repo hygiene only.**  
This repository currently contains architecture notes, specs, and placeholders.  
There are **no runnable components** in this phase. Setup steps and demos will be added **post-approval**.

## What this CompactDApp enables (vertical slice)
Consultants can:
- Create **encrypted profile attributes** (3–5 fields)
- Upload CVs **securely off-chain**
- Generate **selective disclosure proofs** (e.g., skills, experience, eligibility)
- Mint a **privacy-safe ProfileNFT** (**no personal data stored on-chain**)
- Access early governance privately through **ZK-validated eligibility**

**Design principle:** 100% of **PII remains off-chain**; on-chain logic validates proofs and issues certificates without revealing underlying data.

## Architecture (high level)
### 1) Enterprise Systems (SAP / Fieldglass / Ariba / HRIS)
All operational and personal data remains **off-chain** and governed by enterprise controls.

### 2) Legeon Backend (private, encrypted off-chain storage)
Stores sensitive data and generates:
- hashes & commitments  
- encrypted attributes  
- zero-knowledge proofs  
- proof artifacts for: **profile / assignment / timesheet / invoice**

### 3) Midnight Confidential L1
Validates proofs privately and issues:
- profile certificates  
- assignment/timesheet/invoice certificates  
- encrypted reputation counters  
- governance logic

### 4) Cardano Public L1
Stores only **minimal metadata** (e.g., governance summaries / token actions).  
✅ No enterprise or consultant PII is stored on Cardano.

See `/diagrams` for architecture graphics.

## Repository structure
- `/frontend` → Next.js UI (placeholder)
- `/compact` → CompactDApp scripts (placeholder)
- `/docs` → Documentation & future specs
- `/diagrams` → Architecture diagrams & UI mockups

## Frontend notes
The frontend will use **Next.js** and include:
- Wallet connection via **CIP-30**
- No direct access to raw credentials or proofs  
- Sensitive operations performed via backend APIs only

## Roadmap (12 weeks)
**Weeks 1–3**
- Architecture finalization
- Encrypted schema
- Compact scripts scaffolding
- Selective disclosure design

**Weeks 4–6**
- React/Next.js UI prototype
- Lace wallet integration
- ProfileNFT contract integration

**Weeks 7–9**
- Governance gating
- Internal pilot onboarding
- Testing & refinement

**Weeks 10–12**
- Documentation package
- Public release packaging
- Demo & Catalyst showcase

## Goals & metrics
- Onboard up to **40 Genesis Innovators** post-build
- Deploy **3–5 encrypted profile attributes**
- Complete **1 selective disclosure** use case
- Deliver **1 PET-enabled Compact script**
- Release a fully open-source implementation

## Security & privacy notes
- No PII is stored on public chains.
- Treat this repo as a **reference implementation**; do not deploy to production without a security review.
- If you believe you’ve found a security issue, please avoid posting details publicly—open an issue asking for a private channel

## Contributing
Contributions, issues, and feature suggestions are welcome.  
Please open an **Issue** to begin collaborating.

## License
MIT License — see `LICENSE`.

## About Legeon
Legeon is building a privacy-preserving decentralized consulting network for SAP AI—enabling enterprises and consultants to interact with trust, confidentiality, and verifiable correctness using Midnight’s privacy-enhancing technologies.


Website: https://legeon.co (placeholder)


