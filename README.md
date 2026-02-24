# 🧬 Graph Persona: Genesis Phase  
## The Identity Anchor for the Agentic SAP Economy  
### A Midnight-powered Gateway for the Legeon Reputation Graph


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

## 🧭 Project Status: Phase 1 (Initial Build)

Legeon is currently in the **Genesis Build Phase**.

Legeon is actively developing the Graph Persona — a self-sovereign, privacy-preserving identity asset for SAP professionals globally.

### 🔧 Active Development Focus

- Next.js 14 Frontend  
- Midnight Selective-Disclosure Schema Design  
- Sovereign Activation Flow  

No legacy Catalyst constraints apply.  
This is the foundational build for the Legeon ecosystem.

📄 See detailed progress: `docs/PHASE_1_GENESIS_PROGRESS.md`


---

# 🌐 Overview

The **Graph Persona** is a decentralized identity framework designed to disrupt traditional staffing models.

It demonstrates how:

- 🔐 Encrypted profile attributes  
- 🧾 Selective disclosure  
- 🧠 Zero-knowledge proofs  

Enable enterprise-safe decentralized consulting on Midnight — without exposing sensitive consultant or enterprise data.

### This project supports Legeon’s:

#### 🛡 Sovereign Identity  
Private, encrypted professional personas.

#### 📊 Verifiable Reputation  
Mapping outcomes to the Legeon Reputation Graph.

#### 🤖 Agentic Integration  
Identity anchors for SAP AI Orchestration.

---

# 📘 Current Status

**Genesis Build Phase — Active Development**

This repository contains:

- Next.js 14 frontend  
- Architectural schemas  
- Identity logic scaffolding  

We are transitioning from documentation into the functional build of the **Sovereign Activation Flow**.

---

# 🔑 What the Graph Persona Enables

Consultants can:

- Create encrypted profile attributes (SAP P2P, Joule, BTP expertise)
- Upload credentials securely off-chain
- Generate selective disclosure proofs (e.g., specific project experience)
- Mint a privacy-safe `ProfileNFT` (no personal data stored on-chain)
- Access early governance privately via ZK-validated eligibility

---

## 🧱 Core Design Principle

> **100% of PII remains off-chain.**

On-chain logic:
- Validates proofs  
- Issues certificates  
- Updates encrypted reputation counters  

Without revealing underlying data.

---

# 🏗 Architecture (High-Level)

## 1️⃣ Enterprise Systems (SAP / Fieldglass / Ariba / HRIS)

- All operational & personal data remains off-chain  
- Governed by enterprise security controls  

## 2️⃣ Legeon Vault (Private, Encrypted Off-Chain Storage)

Generates:
- Hashes & commitments  
- Encrypted attributes  
- Zero-knowledge proofs  

Produces proof artifacts for:
- Profile  
- Assignment  
- Timesheet  
- Invoice  

## 3️⃣ Midnight Confidential L1

Validates proofs privately and issues:

- Profile certificates (Sovereign Activation)  
- Assignment / timesheet / invoice certificates  
- Encrypted reputation counters  
- Governance eligibility logic  

## 4️⃣ Cardano Public L1

Stores only minimal metadata:

- Governance summaries  
- Token actions  

✅ No enterprise or consultant PII is stored on Cardano.

📊 See `/diagrams` for architecture visuals.

---

# 📁 Repository Structure

/frontend → Next.js 14 Sovereign Activation Wizard (Active)
/logic → Midnight Compact scripts & ZK-proof schemas (In Design)
/docs → Project Manifest, Brand Guidelines, Technical Specs
/diagrams → Reputation Graph & Architecture flows

---

# 🖥 Frontend Notes

Built with **Next.js 14**.

Planned integrations:

- CIP-30 wallet connection (Lace / Midnight compatible wallets)
- Backend API isolation for sensitive operations
- No direct access to raw credentials or ZK proofs from frontend

All sensitive cryptographic operations occur server-side.

---

# 🗺 Roadmap: 2026 Genesis Cycle

## Month 1
- UI/UX finalization for Graph Persona Initialization  
- Finalize Midnight encrypted schemas  
- Sovereign Activation wizard scaffolding  

## Month 2
- Lace / Midnight wallet integration  
- First mock-minting of Sovereign Personas  
- ProfileNFT contract integration (Devnet)  

## Month 3
- Pilot onboarding of 40 Genesis Innovators  
- Initialization of the Reputation Graph  
- Testing & refinement  

## Month 4+
- Transition to Enterprise Gateway  
- Private Time & Materials workflows  

---

# 📈 Goals & Metrics

- Onboard up to **40 Genesis Innovators**
- Deploy **5+ encrypted profile attributes** per Sovereign Persona
- Complete 1 selective disclosure use case (Expertise Verification)
- Establish the Reputation Anchor for the Legeon DAO
- Path toward **$10M net worth** via tokenized equity + consulting reinvestment

---

# 🔐 Security & Privacy Notes

- No PII is stored on public chains.
- This repository is a reference implementation.
- Do not deploy to production without formal security review.

If you believe you’ve discovered a security issue:

Please **do not post details publicly.**  
Open an Issue requesting a private disclosure channel.

---

# 🤝 Contributing

Contributions, feature suggestions, and issues are welcome.

Please open an Issue to begin collaborating.

---

# 📜 License

MIT License — see `LICENSE`.

---

# 🌍 About Legeon

From LiquidMedium to Legeon.

Legeon is building a privacy-preserving decentralized consulting network for SAP AI — enabling enterprises and consultants to interact with:

- Trust  
- Confidentiality  
- Verifiable correctness  

Powered by Midnight’s privacy-enhancing technologies.

---

### Values

**Integrity | Fairness | Ownership | Transparency**

Website: https://legeon.co (placeholder)

