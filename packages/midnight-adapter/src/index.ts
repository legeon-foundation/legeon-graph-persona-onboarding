/**
 * @legeon/midnight-adapter
 *
 * Midnight protocol adapter for Legeon onboarding system
 *
 * Design Constraints per CLAUDE.md:
 * - Midnight treated as protocol boundary, not library dependency
 * - No direct SDK imports in domain or UI logic
 * - Mock provider mandatory until SDK stabilizes
 * - Adapter must be swappable without changing domain logic
 *
 * Current Status: Mock implementation only
 * TODO: Replace with real Midnight SDK when available
 */

// Export types
export * from './types'

// Export adapter interface
export * from './adapter'

// Export mock implementation (current default)
export * from './mock-adapter'
