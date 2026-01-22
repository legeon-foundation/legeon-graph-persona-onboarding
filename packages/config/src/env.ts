/**
 * Environment Configuration
 * Type-safe environment variables for backend and frontend
 */

/**
 * Environment Type
 */
export type Environment = 'development' | 'staging' | 'production' | 'test'

/**
 * Backend Environment Configuration
 * TODO: Populate from process.env with validation
 */
export interface BackendEnvConfig {
  // Application
  NODE_ENV: Environment
  PORT: number
  API_URL: string

  // Database
  DATABASE_URL: string

  // Cardano
  CARDANO_NETWORK: 'mainnet' | 'preprod' | 'preview'

  // Midnight (future)
  MIDNIGHT_NETWORK_URL?: string
  MIDNIGHT_API_KEY?: string

  // AI Services
  OPENAI_API_KEY?: string
  AI_MODEL?: string

  // Security
  JWT_SECRET: string
  ENCRYPTION_KEY: string

  // Storage
  BLOB_STORAGE_URL: string
  BLOB_STORAGE_KEY: string

  // Feature Flags
  ENABLE_AI_EXTRACTION: boolean
  ENABLE_DISCORD_INTEGRATION: boolean

  // Logging
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
}

/**
 * Frontend Environment Configuration
 * TODO: Populate from Next.js env with NEXT_PUBLIC_ prefix
 */
export interface FrontendEnvConfig {
  // Application
  NEXT_PUBLIC_API_URL: string
  NEXT_PUBLIC_CARDANO_NETWORK: 'mainnet' | 'preprod' | 'preview'

  // Feature Flags
  NEXT_PUBLIC_ENABLE_DISCORD: boolean

  // Analytics (future)
  NEXT_PUBLIC_ANALYTICS_ID?: string
}

/**
 * Environment variable validation
 * TODO: Implement runtime validation with Zod or similar
 */
export interface IEnvValidator {
  validateBackendEnv(): BackendEnvConfig
  validateFrontendEnv(): FrontendEnvConfig
}
