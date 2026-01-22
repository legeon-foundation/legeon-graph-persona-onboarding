/**
 * User Role Enumeration
 * Defines the different roles within the Legeon onboarding system
 */
export enum UserRole {
  CONSULTANT = 'CONSULTANT',
  VERIFIER = 'VERIFIER',
  OPS_ADMIN = 'OPS_ADMIN',
  AUDITOR = 'AUDITOR',
}

/**
 * User
 * Represents an authenticated actor identified by a Cardano wallet
 *
 * Privacy Note: Wallet address is the root of identity (CIP-30)
 */
export interface User {
  id: string
  walletAddress: string
  role: UserRole
  createdAt: Date
}
