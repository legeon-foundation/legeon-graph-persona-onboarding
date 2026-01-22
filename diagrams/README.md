# Architecture Diagrams

This folder contains reference diagrams and markdown explanations.
No executable code should live here.

Legeon Technical Architecture Documentation

Welcome to the Legeon Architecture Repository — the technical foundation of the decentralized SAP AI consulting network.
This documentation provides a structured, layered, and scalable view of the entire Legeon platform, connecting AI, privacy, blockchain, data, and enterprise systems into a unified system design.

Legeon blends:

Midnight confidential smart contracts

Cardano L1 identity and governance

AI copilots & agentic automation

Enterprise-grade integrations (SAP, EOR providers)

Secure off-chain storage and verifiable credentials

A community-owned DAO and LEGN token economy

This README is the starting point for understanding how all components work together.

⭐ 1. Architecture Overview

Legeon is designed as a modular, decentralized, AI-first platform that supports:

🔹 Talent onboarding & credential verification

Selective disclosure, encrypted documents, and Midnight-based commitments.

🔹 AI-driven sourcing & matching

Vector embeddings, LangChain pipelines, and agentic reasoning.

🔹 Secure delivery & milestone escrow

Confidential performance verification using Midnight.

🔹 Community governance & tokenized incentives

ProfileNFT identity, LEGN token rewards, and decentralized voting.

🔹 Enterprise-ready integrations

SAP, EOR partners, and industry-standard workflow orchestration.

⭐ 2. Architecture Diagrams (Indexed)

Below are the core diagrams that define the Legeon system.
Each diagram is stored in docs/diagrams/ for versioning and review.

📍 Diagram 1 — Macro Architecture (Level 1)

File: diagrams/macro-architecture.md
A top-level overview of:

User groups

Platform

AI

Privacy core

Blockchain

Enterprise connectors

This is the investor-friendly, high-level map.

📍 Diagram 2 — Platform Architecture (Level 2)

File: diagrams/platform-architecture.md
Detailed system flows from:

Frontend

API gateway

Backend microservices

Data layer

AI engine

Blockchain adapters

Enterprise integrations

Shows how all moving pieces interoperate.

📍 Diagram 3 — Privacy Core (Midnight) Architecture (Level 3)

File: diagrams/privacy-core-architecture.md
Defines the confidential computing heart of Legeon:

Credential verification

Proof generation

Consent & audit registry

Private escrow

Selective disclosure

On-chain/off-chain interplay

This is the core of trust, compliance, and fairness.

📍 Diagram 4 — Onboarding → ProfileNFT Flow (Level 3 Sequence)

File: diagrams/onboarding-profile-nft-flow.md
Covers:

Wallet login

Profile creation

Credential verification

ZK commitments

ProfileNFT minting

Discord role linking

This is the Genesis Innovator user journey.

📍 Diagram 5 — Data Architecture (Postgres + AI Embeddings)

File: diagrams/data-architecture.md

Defines:

User identity structure

Encrypted documents

Credentials and proofs

Audit + consent layer

Embedding storage (pgvector)

Discord/community linkages

This is the canonical off-chain database crucial for privacy.

📍 Diagram 6 — DAO / Treasury / LEGN Token Architecture

File: diagrams/dao-token-architecture.md

Explains:

Treasury flows

Staking & reputation

Reward distribution

Governance proposal lifecycle

Midnight metrics → governance

Consultant and partner incentives

This ties economic value to contribution.

📍 Diagram 7 — AI and Agentic Operating Framework

File: diagrams/ai-architecture.md

Captures Legeon's AI-first design:

LangChain orchestrator

Vector store

Copilots

Autonomous agents

Data-event signals

Interaction with UI and chain layers

This defines Legeon’s long-term automation vision.

⭐ 3. Architectural Principles

Legeon is built around five core principles:

1. Integrity & Fairness

Selective disclosure, encrypted identity, and transparent rules ensure equal opportunity.

2. Privacy-by-Design

Midnight smart contracts anchor proof and consent logic while minimizing what hits public L1.

3. AI-First Augmentation

Automate sourcing, governance, compliance, and documentation using copilots and agents.

4. Enterprise-Ready

SAP Ariba, Fieldglass, S/4HANA, and EOR integrations ensure seamless enterprise adoption.

5. Community Ownership

LEGN staking, rewards, and DAO governance distribute value to contributors.

⭐ 4. Technology Stack
Blockchain

Cardano L1 (ProfileNFT, token, governance)

Midnight (confidential proofs, consent, escrow)

Backend

TypeScript / Python microservices

API Gateway + Auth

Credential Verification & Proof Generator

Data

Postgres

pgvector

Encrypted Blob storage

Audit & consent logs

AI

LangChain pipelines

Embedding models + retrieval

Copilots & agentic workflows

Custom adapters into enterprise systems

Frontend

React + Tailwind

Wallet adapters

Governance and analytics panels

Integrations

SAP Ariba / Fieldglass / BTP

EOR compliance partners

⭐ 5. How to Navigate This Repository
/docs
   /diagrams
      macro-architecture.md
      platform-architecture.md
      privacy-core-architecture.md
      onboarding-profile-nft-flow.md
      data-architecture.md
      dao-token-architecture.md
      ai-architecture.md
   README.md   <- THIS DOCUMENT


This structure makes it easy for contributors, auditors, and the Cardano community to explore the system.

⭐ 6. Next Steps for Contributors

Review diagrams in order (1 → 7)

Explore whitepaper v92 for deeper alignment

Follow the roadmap for Phase 1 → MVP → DAO scale

Use these diagrams as the reference for smart contract and backend development

⭐ 7. Contact & Governance

Legeon is built by the Genesis Innovators, governed through the Legeon DAO, and powered by the Midnight + Cardano ecosystem.

For access, proposals, or technical contributions, please engage through:

GitHub issues

Discord (Genesis Innovator channels)

Catalyst proposal discussion
