# Legeon Macro Architecture

```mermaid
flowchart LR
    %% User Groups
    subgraph Users [User Groups]
        C[Consultants]
        E[Enterprises]
        P[Partners - MSPs, Training, SIs]
    end

    C <--> LP[Legeon Platform]
    E <--> LP
    P <--> LP

    %% Core Services
    subgraph Core [Legeon Core Services]
        AI[AI Engine - Copilots and Agents]
        REP[Reputation Graph and Scoring]
        TLE[Talent Liquidity Engine]
        CGA[Client Growth Autopilot]
        PRIV[Privacy Core - Verifiable Credentials and Selective Disclosure]
        DB[(Postgres and Off-Chain Storage)]
    end

    LP --> Core

    LP --> AI
    AI --> REP
    AI --> TLE
    AI --> CGA
    AI --> DB
    REP --> DB
    TLE --> DB

    %% Blockchain Layer
    subgraph Chain [Blockchain Layer]
        M[Midnight - Confidential Contracts, Proofs, Escrow, CAR]
        ADA[Cardano L1 - ProfileNFT, LEGN Token, DAO]
    end

    Core --> M
    Core --> ADA

    %% Enterprise and Compliance Integrations
    subgraph Ent [Enterprise Integrations]
        SAP[SAP Stack - Ariba, Fieldglass, S4HANA, BTP, Joule]
        EOR[EOR and Compliance Providers]
    end

    LP <--> SAP
    LP <--> EOR

    %% DAO and Treasury
    ADA <--> DAO[Legeon DAO and Treasury]
    DAO -. governance .-> LP
    DAO -. incentives .-> C

    %% Growth Autopilot high-level links
    CGA --> LP
    CGA --> SAP
