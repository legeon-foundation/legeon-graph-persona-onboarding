# Legeon Onboarding and ProfileNFT Flow (Level 3 - Sequence)

```mermaid
sequenceDiagram
    participant C as Consultant
    participant FE as Legeon dApp (Frontend)
    participant BE as Backend Services
    participant DB as Postgres and Encrypted Storage
    participant MID as Midnight Contracts
    participant ADA as Cardano L1 (ProfileNFT)
    participant DIS as Discord Bot

    %% Step 1 - Connect Wallet
    C->>FE: Open Legeon onboarding portal
    FE->>C: Request wallet connection and signature
    C-->>FE: Connect wallet and sign auth message
    FE->>BE: Send wallet address and signed message
    BE->>BE: Verify signature and create session

    %% Step 2 - Build Profile (Public Data)
    C->>FE: Enter profile data and SAP AI skills
    FE->>BE: Submit profile draft
    BE->>DB: Store profile draft (public metadata)

    %% Step 3 - Upload and Verify Credentials
    C->>FE: Upload resume and certifications
    FE->>BE: Send encrypted docs and metadata
    BE->>DB: Store encrypted docs and credential records
    BE->>DB: Log verification request
    BE->>BE: Run credential verification checks
    BE->>DB: Update credentials as VERIFIED or FAILED

    %% Step 4 - Generate Proofs and Commitments
    BE->>BE: Generate hashes and proof commitments
    BE->>DB: Store proof metadata
    BE->>MID: Call Verifiable Credential Engine with commitments
    MID-->>BE: Confirm proof state stored confidentially

    %% Step 5 - Mint ProfileNFT
    BE->>BE: Assemble on-chain profile metadata
    BE->>ADA: Submit ProfileNFT mint transaction
    ADA-->>BE: Return transaction hash and NFT reference
    BE->>DB: Link user profile to ProfileNFT

    %% Step 6 - Sync Back to Frontend
    BE-->>FE: Return ProfileNFT details and status
    FE-->>C: Show "Genesis Innovator Profile" and NFT status

    %% Step 7 - Discord Linking and Token Gating
    C->>DIS: Run /link-wallet command
    DIS->>C: Request wallet signature for linking
    C-->>DIS: Sign challenge with same wallet
    DIS->>BE: Submit wallet address and signature
    BE->>ADA: Check ProfileNFT ownership for wallet
    ADA-->>BE: Confirm NFT exists and is valid
    BE-->>DIS: Return roles and tags (e.g. Genesis Innovator)
    DIS-->>C: Assign Discord roles and gated channel access
