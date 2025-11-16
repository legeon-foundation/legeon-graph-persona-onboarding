# Legeon Privacy Core Architecture (Level 3 - Midnight)

```mermaid
flowchart LR
    %% Actors
    subgraph ACTORS[Actors]
        C[Consultant]
        ENT[Enterprise Client]
    end

    %% Frontend and Wallets
    subgraph FE[Frontend and Wallet Layer]
        ONB[Onboarding and Profile App]
        WALLET[Selective Disclosure Wallet UI]
        ENTUI[Enterprise Portal - Project and Compliance]
    end

    C --> ONB
    C --> WALLET
    ENT --> ENTUI

    %% Backend Privacy Services
    subgraph BE[Backend Privacy Services]
        CV[Credential Verification Service]
        PG[Proof Generator and Commitment Builder]
        CONSVC[Consent Management Service]
        ESCORCH[Escrow Orchestrator]
    end

    ONB --> CV
    CV --> PG
    ONB --> CONSVC
    ENTUI --> ESCORCH

    %% Off-Chain Storage
    subgraph STORE[Off-Chain Storage]
        DB[(Private DB - Proof and Consent Metadata)]
        DOCS[(Encrypted Document Store)]
        LOGS[(Audit and Event Logs)]
    end

    CV --> DOCS
    CV --> DB
    PG --> DB
    CONSVC --> DB
    ESCORCH --> DB
    BE --> LOGS

    %% Midnight Privacy Core
    subgraph MID[Midnight Privacy Core]
        VCE[Verifiable Credential Engine Contract]
        SDC[Selective Disclosure Contract]
        ESC[Private Escrow Contract]
        CAR[Consent and Audit Registry Contract]
    end

    %% Cardano Public Layer (Light Touch)
    subgraph CARD[Cardano Public Layer]
        PNFT[ProfileNFT - Public Identity]
        GOV[DAO and Governance Logic]
    end

    %% Flows to Midnight
    PG --> VCE
    PG --> CAR
    CONSVC --> CAR
    ESCORCH --> ESC

    DB --> VCE
    DB --> CAR

    VCE --> MIDTX[Midnight Transactions and Proof State]
    ESC --> MIDTX
    CAR --> MIDTX

    %% Selective Disclosure Flow
    WALLET --> SDC
    ENTUI --> SDC
    SDC --> VCE
    SDC --> CAR

    %% Public Linkage
    MIDTX --> PNFT
    PNFT --> ENTUI
    GOV --> PNFT
    LOGS --> GOV
