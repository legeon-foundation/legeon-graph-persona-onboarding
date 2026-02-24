/**
 * Regression tests for wizardReducer — back-navigation bug fix.
 *
 * Bug: navigating Back from Step 4 (REVIEW_CONFIRM) to Step 3 (PROCESSING)
 * caused ProcessingStep to immediately auto-advance back to Step 4 because
 * its internal useEffect re-ran the mock pipeline on every mount.
 *
 * Fix: the reducer sets suppressProcessingAutoAdvance=true whenever
 * PREV_STEP or GO_TO_STEP lands on WizardStep.PROCESSING. The flag is
 * cleared by SET_EXTRACTION (fired when the user continues from Processing).
 *
 * Covers:
 *  - PREV_STEP from REVIEW_CONFIRM → PROCESSING sets the flag
 *  - PREV_STEP from PROCESSING → UPLOAD_DOCS clears the flag
 *  - Full regression: Step4 → Back → Step3 stays; Back → Step2
 *  - GO_TO_STEP backward to PROCESSING sets the flag
 *  - GO_TO_STEP backward to non-PROCESSING step clears the flag
 *  - GO_TO_STEP forward is ignored (no state change)
 *  - SET_EXTRACTION clears the flag
 *  - NEXT_STEP (forward) does NOT set the flag
 *  - PREV_STEP to LANDING (non-PROCESSING) does not set the flag
 */

import { describe, it, expect } from 'vitest'
import { wizardReducer } from '@/lib/wizardReducer'
import {
  WizardStep,
  ProfileDraftStatus,
  ConsentType,
  type WizardState,
  type ExtractionResult,
} from '@/lib/types'

// ---------------------------------------------------------------------------
// Minimal base state for tests
// ---------------------------------------------------------------------------

const baseState: WizardState = {
  currentStep: WizardStep.LANDING,
  walletAddress: null,
  walletName: null,
  jurisdiction: '',
  consents: {
    [ConsentType.DATA_PROCESSING]: false,
    [ConsentType.CREDENTIAL_VERIFICATION]: false,
    [ConsentType.PROFILE_PUBLICATION]: false,
    [ConsentType.AI_EXTRACTION]: false,
  },
  uploadedFiles: [],
  extractionResult: null,
  profileDraft: {},
  profileDraftStatus: ProfileDraftStatus.DRAFT,
  verificationGates: [],
  complianceGates: [],
  nftResult: null,
  discordLinked: false,
  discordUsername: null,
  demoMode: false,
  profileVersionHistory: [],
}

/** Minimal ExtractionResult for SET_EXTRACTION tests */
const mockExtractionResult: ExtractionResult = {
  extractedDisplayName: {
    key: 'displayName', label: 'Name', value: 'Alice', confidence: 0.9, source: 'cv', edited: false,
  },
  extractedBio: {
    key: 'bio', label: 'Bio', value: 'Consultant', confidence: 0.8, source: 'cv', edited: false,
  },
  extractedSkillTags: {
    key: 'skillTags', label: 'Skills', value: 'SAP, FICO', confidence: 0.9, source: 'cv', edited: false,
  },
  extractedExperienceSummary: {
    key: 'experienceSummary', label: 'Experience', value: '5 years', confidence: 0.85, source: 'cv', edited: false,
  },
  sapDomains: {
    key: 'sapDomains', label: 'SAP Domains', value: 'FICO, MM', confidence: 0.9, source: 'cv', edited: false,
  },
  btpExperience: {
    key: 'btpExperience', label: 'BTP', value: 'None', confidence: 0.7, source: 'cv', edited: false,
  },
  aiTransformationRoles: {
    key: 'aiTransformationRoles', label: 'AI Roles', value: 'None', confidence: 0.7, source: 'cv', edited: false,
  },
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('wizardReducer — back navigation (suppressProcessingAutoAdvance)', () => {
  // ── PREV_STEP ─────────────────────────────────────────────────────────────

  it('PREV_STEP from REVIEW_CONFIRM → PROCESSING sets suppressProcessingAutoAdvance=true', () => {
    const state: WizardState = { ...baseState, currentStep: WizardStep.REVIEW_CONFIRM }
    const next = wizardReducer(state, { type: 'PREV_STEP' })

    expect(next.currentStep).toBe(WizardStep.PROCESSING)
    expect(next.suppressProcessingAutoAdvance).toBe(true)
  })

  it('PREV_STEP from PROCESSING → UPLOAD_DOCS clears suppressProcessingAutoAdvance', () => {
    const state: WizardState = {
      ...baseState,
      currentStep: WizardStep.PROCESSING,
      suppressProcessingAutoAdvance: true,
    }
    const next = wizardReducer(state, { type: 'PREV_STEP' })

    expect(next.currentStep).toBe(WizardStep.UPLOAD_DOCS)
    expect(next.suppressProcessingAutoAdvance).toBe(false)
  })

  it('PREV_STEP from WALLET_CONNECT → LANDING does not set suppressProcessingAutoAdvance', () => {
    const state: WizardState = { ...baseState, currentStep: WizardStep.WALLET_CONNECT }
    const next = wizardReducer(state, { type: 'PREV_STEP' })

    expect(next.currentStep).toBe(WizardStep.LANDING)
    expect(next.suppressProcessingAutoAdvance).toBe(false)
  })

  it('PREV_STEP from UPLOAD_DOCS → WALLET_CONNECT does not set suppressProcessingAutoAdvance', () => {
    const state: WizardState = { ...baseState, currentStep: WizardStep.UPLOAD_DOCS }
    const next = wizardReducer(state, { type: 'PREV_STEP' })

    expect(next.currentStep).toBe(WizardStep.WALLET_CONNECT)
    expect(next.suppressProcessingAutoAdvance).toBe(false)
  })

  // ── Full regression scenario ───────────────────────────────────────────────

  it('full regression: Step4 → Back → Step3 stays suppressed; Back → Step2', () => {
    // Simulate being at Review (step 4) after normal forward navigation
    const atReview: WizardState = {
      ...baseState,
      currentStep: WizardStep.REVIEW_CONFIRM,
      suppressProcessingAutoAdvance: false,
    }

    // User clicks Back → should land on Processing with flag set
    const atProcessing = wizardReducer(atReview, { type: 'PREV_STEP' })
    expect(atProcessing.currentStep).toBe(WizardStep.PROCESSING)
    expect(atProcessing.suppressProcessingAutoAdvance).toBe(true)

    // User clicks Back again → should land on Upload, flag cleared
    const atUpload = wizardReducer(atProcessing, { type: 'PREV_STEP' })
    expect(atUpload.currentStep).toBe(WizardStep.UPLOAD_DOCS)
    expect(atUpload.suppressProcessingAutoAdvance).toBe(false)
  })

  // ── GO_TO_STEP ────────────────────────────────────────────────────────────

  it('GO_TO_STEP backward to PROCESSING sets suppressProcessingAutoAdvance=true', () => {
    const state: WizardState = { ...baseState, currentStep: WizardStep.REVIEW_CONFIRM }
    const next = wizardReducer(state, { type: 'GO_TO_STEP', step: WizardStep.PROCESSING })

    expect(next.currentStep).toBe(WizardStep.PROCESSING)
    expect(next.suppressProcessingAutoAdvance).toBe(true)
  })

  it('GO_TO_STEP backward to UPLOAD_DOCS clears suppressProcessingAutoAdvance', () => {
    const state: WizardState = {
      ...baseState,
      currentStep: WizardStep.REVIEW_CONFIRM,
      suppressProcessingAutoAdvance: true,
    }
    const next = wizardReducer(state, { type: 'GO_TO_STEP', step: WizardStep.UPLOAD_DOCS })

    expect(next.currentStep).toBe(WizardStep.UPLOAD_DOCS)
    expect(next.suppressProcessingAutoAdvance).toBe(false)
  })

  it('GO_TO_STEP forward is ignored — step unchanged, no flag set', () => {
    const state: WizardState = { ...baseState, currentStep: WizardStep.UPLOAD_DOCS }
    const next = wizardReducer(state, { type: 'GO_TO_STEP', step: WizardStep.REVIEW_CONFIRM })

    // Forward navigation should be silently rejected
    expect(next.currentStep).toBe(WizardStep.UPLOAD_DOCS)
    expect(next.suppressProcessingAutoAdvance).toBeUndefined()
  })

  // ── SET_EXTRACTION ────────────────────────────────────────────────────────

  it('SET_EXTRACTION clears suppressProcessingAutoAdvance', () => {
    const state: WizardState = {
      ...baseState,
      currentStep: WizardStep.PROCESSING,
      suppressProcessingAutoAdvance: true,
    }
    const next = wizardReducer(state, { type: 'SET_EXTRACTION', result: mockExtractionResult })

    expect(next.suppressProcessingAutoAdvance).toBe(false)
    // Also sanity-check that extraction data was stored
    expect(next.extractionResult).toEqual(mockExtractionResult)
  })

  it('SET_EXTRACTION populates profileDraft from extraction field keys', () => {
    const state: WizardState = { ...baseState, currentStep: WizardStep.PROCESSING }
    const next = wizardReducer(state, { type: 'SET_EXTRACTION', result: mockExtractionResult })

    expect(next.profileDraft['displayName']).toBe('Alice')
    expect(next.profileDraft['bio']).toBe('Consultant')
    expect(next.profileDraft['sapDomains']).toBe('FICO, MM')
  })

  // ── NEXT_STEP ─────────────────────────────────────────────────────────────

  it('NEXT_STEP (forward) does NOT set suppressProcessingAutoAdvance', () => {
    // Going forward through UPLOAD_DOCS → PROCESSING via NEXT_STEP should
    // never set the flag — only backward navigation should.
    const state: WizardState = { ...baseState, currentStep: WizardStep.UPLOAD_DOCS }
    const next = wizardReducer(state, { type: 'NEXT_STEP' })

    expect(next.currentStep).toBe(WizardStep.PROCESSING)
    expect(next.suppressProcessingAutoAdvance).toBeUndefined()
  })
})
