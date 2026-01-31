# Legeon Genesis Onboarding CompactDApp
**Privacy-preserving consultant onboarding for SAP AI**  
Catalyst Fund 15 — Midnight CompactDApps Track

---

## 🧭 Current Status: Phase 0.5 (Pre-Grant)

Legeon is currently in **Phase 0.5**, focused solely on documentation, repository hygiene, and developer-experience setup.  
**No production logic** (smart contracts, wallets, APIs, databases, deployments) is being implemented at this stage.

This phase documents scope and readiness for review. Full implementation will commence upon grant approval.

📄 See detailed progress: [docs/PHASE_0_5_PROGRESS.md](docs/PHASE_0_5_PROGRESS.md)

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


