/**
 * Feature Flags Configuration
 * Controls feature availability across environments
 */

/**
 * Feature Flags
 * Centralized feature toggle configuration
 */
export interface FeatureFlags {
  // Core Features
  walletConnection: boolean
  cvUpload: boolean
  profileDrafts: boolean
  credentialVerification: boolean

  // Advanced Features
  aiExtraction: boolean
  midnightIntegration: boolean
  discordIntegration: boolean
  profileNFTMinting: boolean

  // Admin Features
  adminDashboard: boolean
  verifierTools: boolean
  auditLogs: boolean

  // Experimental Features
  batchProcessing: boolean
  advancedSearch: boolean
}

/**
 * Feature Flag Provider Interface
 * TODO: Implement with LaunchDarkly, ConfigCat, or similar
 */
export interface IFeatureFlagProvider {
  /**
   * Get all feature flags
   */
  getFlags(): Promise<FeatureFlags>

  /**
   * Check if specific feature is enabled
   * @param feature - Feature key
   */
  isEnabled(feature: keyof FeatureFlags): Promise<boolean>

  /**
   * Update feature flag (admin only)
   * @param feature - Feature key
   * @param enabled - Enable or disable
   */
  setFlag(feature: keyof FeatureFlags, enabled: boolean): Promise<void>
}
