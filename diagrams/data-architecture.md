# Legeon Data Architecture (Postgres, Storage, AI Embeddings)

```mermaid
classDiagram
    %% Core Identity and Wallets
    class User {
        UUID id
        datetime created_at
        string status
    }

    class UserWallet {
        UUID id
        UUID user_id
        string wallet_address
        bool is_primary
        datetime created_at
    }

    class UserIdentityPrivate {
        UUID user_id
        string legal_name_enc
        string email_enc
        string email_hash
        string country_enc
        string eor_provider_enc
        string pii_encryption_scheme
        int version
    }

    class UserProfilePublic {
        UUID user_id
        string display_name
        string alias
        string sap_domain
        string skill_tags
        string profile_nft_policy_id
        string profile_nft_asset_name
        bool is_genesis_innovator
        datetime onchain_sync_at
    }

    %% Credentials and Documents
    class Document {
        UUID id
        UUID user_id
        string doc_type  // RESUME, SAP_CERT, ID_DOC
        string storage_uri
        string sha256_hash
        bool encrypted_at_client
        string encryption_scheme
        datetime created_at
        datetime deleted_at
    }

    class Credential {
        UUID id
        UUID user_id
        UUID document_id
        string credential_type  // SAP_CERT, PROJECT_REF
        string issuer_name
        string issuer_id_enc
        string claim_json_enc
        datetime valid_from
        datetime valid_to
        string verification_status  // PENDING, VERIFIED, FAILED, REVOKED
        datetime verified_at
        string verified_by
    }

    class CredentialProof {
        UUID id
        UUID credential_id
        string proof_hash
        string proof_type  // HASH_COMMITMENT, ZK_ATTESTATION
        string midnight_tx_hash
        string midnight_proof_id
        datetime created_at
        datetime revoked_at
    }

    %% Discord and Community Links
    class DiscordLink {
        UUID id
        UUID user_id
        string discord_id_hash
        string roles_json
        datetime linked_at
        datetime last_challenge_at
    }

    %% AI and Matching Layer
    class Embedding {
        UUID id
        UUID user_id
        UUID document_id
        string embedding_type  // PROFILE, RESUME, PROJECT
        string vector  // pgvector column
        string model_name
        datetime created_at
    }

    class MatchingEvent {
        UUID id
        UUID user_id
        UUID project_id
        string event_type  // RECOMMENDED, VIEWED, ACCEPTED
        datetime created_at
    }

    %% Audit and Consent
    class ConsentRecord {
        UUID id
        UUID user_id
        string consent_type  // DATA_PROCESSING, MARKETING, DISCLOSURE
        bool granted
        datetime granted_at
        datetime revoked_at
        string source  // UI, IMPORT, ENTERPRISE
    }

    class AuditLog {
        UUID id
        UUID user_id
        string action
        string actor  // USER, SYSTEM, ADMIN
        string metadata_json
        datetime created_at
    }

    %% Relationships
    User "1" --> "many" UserWallet : has
    User "1" --> "1" UserIdentityPrivate : has_private
    User "1" --> "1" UserProfilePublic : has_public
    User "1" --> "many" Document : owns
    User "1" --> "many" Credential : has
    User "1" --> "many" DiscordLink : linked_to
    User "1" --> "many" Embedding : represented_by
    User "1" --> "many" MatchingEvent : activity
    User "1" --> "many" ConsentRecord : consents
    User "1" --> "many" AuditLog : logged

    Document "1" --> "many" Credential : supports
    Credential "1" --> "many" CredentialProof : proven_by
    Document "1" --> "many" Embedding : embedded_as
