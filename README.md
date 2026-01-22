# Frontend Application

This folder will contain the Legeon Genesis Onboarding DApp frontend.

Notes:
- Next.js will be used
- Wallet connection (CIP-30) lives here
- No direct access to raw credentials or proofs
- All sensitive operations occur via backend APIs

# legeon-genesis-onboarding-compactdapp
Open-source Genesis Onboarding CompactDApp for Legeon — a privacy-preserving consultant onboarding module built on Midnight
# 🌐 Legeon Genesis Onboarding CompactDApp
### Privacy-Preserving Consultant Onboarding for SAP AI  
**Catalyst Fund 15 — Midnight CompactDApps Track**

The Legeon Genesis Onboarding CompactDApp is an open-source, privacy-first onboarding module designed for SAP AI and hyperautomation consultants.  
It demonstrates how encrypted profile attributes, zero-knowledge proofs, and selective disclosure can be used to enable **enterprise-safe decentralized consulting** on Midnight.

This project serves as the foundation for Legeon’s:
- **Phase 2 Privacy Core**, and  
- **Phase 3 MVP** (Enterprise Gateway & Private T&M Workflows)

---

## 🔐 What This CompactDApp Does
This vertical slice enables consultants to:

- Create encrypted profile attributes (3–5 fields)
- Upload CVs securely off-chain
- Generate selective disclosure proofs (skills, experience, or credibility)
- Mint a privacy-safe ProfileNFT (no personal data stored on-chain)
- Access early governance privately through ZK-validated eligibility

The full architecture is designed for **100% off-chain PII storage** and **confidential smart contract validation** using Midnight.

---

## 🏗 Architecture Overview

**1. Enterprise Systems (SAP / Fieldglass / Ariba / HRIS)**  
All operational and personal data remains off-chain and regulated.

**2. Legeon Backend (Private, Encrypted Off-Chain Storage)**  
Stores sensitive data and generates:
- Hashes  
- Attribute commitments  
- Zero-knowledge proofs  
- Profile/Assignment/Timesheet/Invoice proof artifacts  

**3. Midnight Confidential L1**  
Validates proofs privately and issues:
- Profile Certificates  
- Assignment/Timesheet/Invoice Certificates  
- Encrypted reputation counters  
- Governance logic  

**4. Cardano Public L1**  
Stores only minimal metadata (governance summaries, token actions).  
No enterprise or consultant data is ever stored here.

See `/diagrams` for architecture graphics.

---

## 📂 Repository Structure

```plaintext
/frontend        → React UI (placeholder)
/compact         → CompactDApp scripts (placeholder)
/docs            → Documentation & future specs
/diagrams        → Architecture diagrams & UI mockups

You said:
does the below also need to be copied and pasted into the README?  🚀 Roadmap (12 Weeks)

Weeks 1–3:

Architecture

Encrypted schema

Compact scripts

Selective disclosure design

Weeks 4–6:

React UI prototype

Lace wallet integration

ProfileNFT contract

Weeks 7–9:

Governance gating

Internal pilot onboarding

Testing & refinement

Weeks 10–12:

Documentation package

Public GitHub release

Demo & Catalyst showcase

🎯 Goals & Metrics

Onboard up to 40 Genesis Innovators post-build

Deploy 3–5 encrypted profile attributes

Complete 1 selective disclosure use case

Deliver 1 PET-enabled Compact script

Release fully open-source implementation

📜 License

This project is released under the MIT License.
See LICENSE for full text.

🤝 Contributing

Contributions, issues, and feature suggestions are welcome.
Please open an Issue to begin collaborating.

🧭 About Legeon

Legeon is building the first privacy-preserving decentralized consulting network for SAP AI, enabling enterprises and consultants to interact with trust, confidentiality, and verifiable correctness using Midnight’s Privacy-Enhancing Technologies.

Visit: https://legeon.org
 (placeholder)
