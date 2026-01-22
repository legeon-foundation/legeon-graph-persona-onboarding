/**
 * Cardano Configuration
 * Network and wallet configuration for CIP-30 integration
 */

/**
 * Cardano Network Configuration
 */
export interface CardanoNetworkConfig {
  /** Network name */
  network: 'mainnet' | 'preprod' | 'preview'
  /** Network magic number */
  networkMagic: number
  /** Blockfrost API URL */
  blockfrostUrl: string
  /** Blockfrost project ID */
  blockfrostProjectId?: string
  /** Policy ID for ProfileNFT (will be set after minting policy creation) */
  profileNFTPolicyId?: string
}

/**
 * Supported CIP-30 Wallets
 */
export enum SupportedWallet {
  NAMI = 'nami',
  ETERNL = 'eternl',
  FLINT = 'flint',
  TYPHON = 'typhoncip30',
  GERO = 'gerowallet',
  LACE = 'lace',
}

/**
 * Wallet Configuration
 */
export interface WalletConfig {
  /** Supported wallet list */
  supportedWallets: SupportedWallet[]
  /** Default wallet (if user has multiple) */
  defaultWallet?: SupportedWallet
  /** Connection timeout in ms */
  connectionTimeout: number
  /** Enable wallet connection */
  enabled: boolean
}

/**
 * Cardano Configuration Provider
 * TODO: Implement in backend/frontend
 */
export interface ICardanoConfigProvider {
  /**
   * Get network configuration
   */
  getNetworkConfig(): CardanoNetworkConfig

  /**
   * Get wallet configuration
   */
  getWalletConfig(): WalletConfig

  /**
   * Check if network is testnet
   */
  isTestnet(): boolean
}
