# Legeon AI and Agentic Operating Framework Architecture
flowchart LR
    %% Data and Event Sources
    subgraph SOURCES[Data and Event Sources]
        PROFILES[Profiles and Skills - Postgres]
        CREDS[Credentials and Proofs - DB and Midnight]
        ENGDATA[Engagement Data - Milestones and Activity]
        SAPDATA[SAP Signals - Ariba, S4HANA, BTP]
        GOVDATA[Governance Data - Proposals and Votes]
    end

    %% Dynamic Reputation Graph v2
    subgraph REPUTE[Dynamic Reputation Graph v2]
        REP_CALC[Reputation Engine]
        REP_STORE[(Reputation Scores - Private)]
    end

    ENGDATA --> REP_CALC
    GOVDATA --> REP_CALC
    CREDS --> REP_CALC

    REP_CALC --> REP_STORE
    REP_STORE --> PROFILES
    REP_STORE --> ENGDATA

    %% AI Core
    subgraph AICORE[AI Core and Orchestration]
        ORCH[AI Orchestrator]
        FM[AI Models]
        VEC[(Vector Store)]
    end

    PROFILES --> ORCH
    CREDS --> ORCH
    ENGDATA --> ORCH
    SAPDATA --> ORCH
    GOVDATA --> ORCH
    REP_STORE --> ORCH

    ORCH --> FM
    ORCH --> VEC
    VEC --> ORCH

    %% Copilots
    subgraph COPILOTS[AI Copilots]
        CP_ONB[Onboarding and Profile Copilot]
        CP_MATCH[Sourcing and Matching Copilot]
        CP_DELIV[Delivery and Documentation Copilot]
        CP_GOV[Governance and Proposal Copilot]
        CP_LEARN[Learning and Upskilling Copilot]
        CP_GROW[Client Growth Autopilot]
    end

    ORCH --> CP_ONB
    ORCH --> CP_MATCH
    ORCH --> CP_DELIV
    ORCH --> CP_GOV
    ORCH --> CP_LEARN
    ORCH --> CP_GROW

    %% Agentic Framework (incl. Talent Liquidity Engine)
    subgraph AGENTS[Agentic Operating Framework]
        AG_TALENT[Talent Agent]
        AG_LIQ[Talent Liquidity Engine]
        AG_COMP[Compliance Agent]
        AG_GOV[Governance Agent]
        AG_LEARN[Learning Agent]
        AG_IP[Knowledge IP Agent]
    end

    CP_MATCH --> AG_TALENT
    CP_ONB --> AG_TALENT
    CP_ONB --> AG_LIQ
    CP_MATCH --> AG_LIQ
    CP_GROW --> AG_TALENT

    CP_DELIV --> AG_IP
    CP_GOV --> AG_GOV
    CP_LEARN --> AG_LEARN

    AG_TALENT --> ENGDATA
    AG_COMP --> ENGDATA
    AG_COMP --> CREDS
    AG_GOV --> GOVDATA
    AG_LEARN --> PROFILES
    AG_IP --> PROFILES

    %% Talent Liquidity Engine data flows
    AG_LIQ --> PROFILES
    AG_LIQ --> ENGDATA
    AG_LIQ --> CREDS
    REP_STORE --> AG_TALENT
    REP_STORE --> CP_MATCH

    %% Platform UIs
    subgraph PLATFORM[Legeon Platform]
        FE_ONB[Onboarding UI]
        FE_MKT[Marketplace UI]
        FE_ENT[Enterprise Gateway UI]
        FE_GOV[Governance UI]
    end

    FE_ONB --> CP_ONB
    FE_MKT --> CP_MATCH
    FE_ENT --> CP_MATCH
    FE_ENT --> CP_DELIV
    FE_GOV --> CP_GOV
    FE_ENT --> CP_GROW

    CP_LEARN --> FE_ONB
    CP_LEARN --> FE_MKT

    %% Chain Links
    subgraph CHAIN[Blockchain Links]
        MID[Midnight - Private Metrics]
        CARD[Cardano L1 - ProfileNFT and Governance]
    end

    ENGDATA --> MID
    CREDS --> MID
    REP_STORE --> MID
    GOVDATA --> CARD
    CP_GOV --> CARD
