CLAUDE.md v1.2

(Canonical Build Instructions for Legeon Genesis Onboarding DApp)

Important:
This file is authoritative. Claude Code must treat this document as binding instructions.
If there is any conflict between code, comments, or assumptions, this file wins.

1. Purpose (Authoritative Scope)

This repository implements Legeon’s Phase 1: Privacy-Preserving Global Onboarding & Identity System.

The DApp exists solely to:

onboard consultants globally,

connect a Cardano wallet (CIP-30),

collect encrypted credentials off-chain,

assist consultants in building their professional profile,

validate credentials via privacy-preserving proofs,

mint a ProfileNFT representing verified onboarding status,

optionally link a verified on-chain identity to Discord.

Explicitly Out of Scope

This project must NOT implement:

DAO proposals or voting

tokenomics or staking

treasury logic

governance execution

token distribution mechanisms

2. Architectural Principles (Non-Negotiable)

Privacy-First by Design
Sensitive data must never be exposed on public blockchains or in client-side state.

Global & Jurisdiction-Aware
Consultants may onboard from any country. Jurisdiction is a required input and drives compliance.

Proof-Based, Not Data-Based
Trust is established via cryptographic proofs and commitments, not raw data disclosure.

Midnight-Ready, SDK-Agnostic
Midnight is treated as a protocol boundary, not a library dependency.

No Throwaway Code
Everything built must remain valid as Midnight tooling matures.

3. System Boundary Overview
Frontend dApp (Next.js)
  └─ Wallet connection (CIP-30)
  └─ Onboarding & Profile UI
  └─ Admin / Verifier UI
        ↓
Legeon Backend (Off-Chain, Encrypted)
  └─ Stores ALL sensitive data
  └─ Extracts structured data from CVs
  └─ Generates commitments & proofs
  └─ Enforces compliance & policy
        ↓
Midnight Confidential L1
        ↓
Cardano Public L1 (ProfileNFT, non-sensitive only)


Sensitive data must never cross the backend → blockchain boundary.

4. CV-Driven Profile Pre-Population (Required Capability)
Authoritative Requirement

The onboarding flow must support CV / resume upload as an early optional step to assist profile creation.

When a consultant uploads a CV:

the CV is encrypted and stored privately off-chain

the system may extract structured, non-sensitive information, such as:

skills

SAP domains

role titles

experience summaries

extracted information is used to pre-populate a draft version of the consultant’s profile

the consultant must explicitly review and approve all extracted fields before:

they are saved to the official profile

any data becomes publicly visible

any data contributes to ProfileNFT metadata

Hard Privacy Rules

Raw CV content must never:

be written directly to public profile fields

be embedded in the ProfileNFT

be exposed to other users or systems

be used by AI without redaction and policy checks

AI-assisted extraction is assistive only, never authoritative.

5. ProfileNFT (Critical Design Constraint)

The ProfileNFT is NOT an identity container.

It may contain ONLY:

cryptographic commitment hashes

proof references or IDs

non-sensitive professional metadata (e.g. skill tags)

It must NEVER contain:

PII

CVs, resumes, or certifications

jurisdictional or legal data

6. Wallet Integration (CIP-30)

Wallet connection uses CIP-30 compatible Cardano wallets

Wallet = root of identity

Wallets are used for:

authentication

signing onboarding actions

authorizing ProfileNFT minting (testnet)

Wallet logic must be isolated behind an adapter

Private keys are never stored or handled by the application.

7. Compliance & Proof Authority

All encryption, extraction, proof generation, and verification coordination occurs server-side

The frontend may only:

request actions

sign messages

display status

Compliance is policy-driven, not hard-coded by country

8. Midnight Integration (Current Reality)

There is no publicly stable Midnight SDK

Midnight must be accessed only via an internal adapter

A mock provider is mandatory

No direct SDK imports in domain or UI logic

No assumed contract syntax

Midnight must be treated as a protocol boundary.

9. Discord Integration (Explicit Constraint)

Optional

Non-authoritative

Post-ProfileNFT mint only

Requires a signed wallet challenge

Discord identity must not be used for:

authentication

compliance

verification decisions

10. Definition of Done (Phase 1)

Global consultant onboarding works end-to-end

CV upload pre-populates a profile draft

Consultant reviews and confirms extracted data

Credentials submitted and verified

Compliance gates enforced

ProfileNFT minted (testnet, non-sensitive only)

Midnight adapter mock wired end-to-end

No DAO or governance code present

Final Guiding Rule

Prefer draft → review → confirm over automation.
Prefer proofs over raw data.
Prefer interfaces over implementations.

If there is ambiguity, do not invent features — ask or defer.
