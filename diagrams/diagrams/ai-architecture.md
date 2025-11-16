# Legeon AI and Agentic Operating Framework Architecture

```mermaid
flowchart LR
    %% Actors and Data Sources
    subgraph SOURCES[Data and Event Sources]
        PROFILES[Profiles and Skills\n(Postgres)]
        CREDS[Credentials and Proofs\n(DB + Midnight)]
        ENGDATA[Engagement Data\n(Milestones, Timesheets)]
        SAPDATA[SAP Signals\n(Ariba, S4HANA, BTP)]
        GOVDATA[Governance Data\n(Proposals, Votes, Treasury)]
    end

    %% AI Foundation and Orchestration
    subgraph AICORE[AI Foundation and Orchestration]
        ORCH[AI Orchestrator\n(LangChain, Pipelines)]
        FM[Legeon AI Models\n(Embedding and Task Models)]
        VEC[(Vector Store\n(pgvector))]
    end

    PROFILES --> ORCH
    CREDS --> ORCH
    ENGDATA --> ORCH
    SAPDATA --> ORCH
    GOVDATA --> ORCH

    ORCH --> FM
    FM --> VEC
    ORCH --> VEC
    VEC --> ORCH

    %% AI Copilots
    subgraph COPILOTS[AI Copilots]
        CP_ONB[Onboarding and Profile Copilot]
        CP_MATCH[Sourcing and Matching Copilot]
        CP_DELIV[Delivery and Documentation Copilot]
        CP_GOV[Governance and Proposal Copilot]
        CP_LEARN[Upskilling and Learning Copilot]
    end

    ORCH --> CP_ONB
    ORCH --> CP_MATCH
    ORCH --> CP_DELIV
    ORCH --> CP_GOV
    ORCH --> CP_LEARN

    %% AI Agents (Longer Term Agentic Layer)
    subgraph AGENTS[Agentic Operating Framework]
        AG_TALENT[Talent Agent\n(Matching and Routing)]
        AG_COMP[Compliance Agent\n(Checks and Flags)]
        AG_GOV[Governance Agent\n(Policy and Voting Support)]
        AG_LEARN[Learning Agent\n(Skill Gaps and Paths)]
        AG_IP[Knowledge IP Agent\n(Solution and Asset Curation)]
    end

    CP_MATCH --> AG_TALENT
    CP_ONB --> AG_TALENT
    CP_DELIV --> AG_IP
    CP_GOV --> AG_GOV
    CP_LEARN --> AG_LEARN

    AG_TALENT --> ENGDATA
    AG_COMP --> ENGDATA
    AG_COMP --> CREDS
    AG_GOV --> GOVDATA
    AG_LEARN --> PROFILES
    AG_IP --> PROFILES

    %% Platform Connections
    subgraph PLATFORM[Legeon Platform and Interfaces]
        FE_ONB[Onboarding UI]
        FE_MKT[Marketplace and Matching UI]
        FE_ENT[Enterprise Gateway UI]
        FE_GOV[DAO and Governance UI]
    end

    FE_ONB --> CP_ONB
    FE_MKT --> CP_MATCH
    FE_ENT --> CP_MATCH
    FE_ENT --> CP_DELIV
    FE_GOV --> CP_GOV

    CP_LEARN --> FE_ONB
    CP_LEARN --> FE_MKT

    %% Blockchain Links
    subgraph CHAIN[Blockchain Links]
        MID[Midnight\n(Private Metrics and Proofs)]
        CARD[Cardano L1\n(ProfileNFT and Governance)]
    end

    ENGDATA --> MID
    CREDS --> MID
    GOVDATA --> CARD
    CP_GOV --> CARD
