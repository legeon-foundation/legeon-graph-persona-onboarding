/**
 * Wizard state machine reducer — extracted to a separate module for testability.
 *
 * Back-navigation fix (suppressProcessingAutoAdvance):
 *   When PREV_STEP or GO_TO_STEP lands on WizardStep.PROCESSING, the flag is
 *   set to true so ProcessingStep can skip auto-advance and render a manual
 *   Continue button instead of immediately advancing to Review.
 *
 *   The flag is cleared by SET_EXTRACTION, which fires when the user continues
 *   from the Processing step (either via the manual Continue or normally).
 */

import {
  WizardStep,
  ProfileDraftStatus,
  type WizardState,
  type WizardAction,
  type ExtractionResult,
} from '@/lib/types'
import { createProfileVersion } from '@/lib/profileVersioning'
import { isDemoMode } from '@/config/demoMode'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function initDraftFromExtraction(result: ExtractionResult): Record<string, string> {
  const draft: Record<string, string> = {}
  const fields = [
    result.extractedDisplayName,
    result.extractedBio,
    result.extractedSkillTags,
    result.extractedExperienceSummary,
    result.sapDomains,
    result.btpExperience,
    result.aiTransformationRoles,
  ]
  for (const field of fields) {
    draft[field.key] = field.value
  }
  return draft
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    // ── Hardening: vault hydration ─────────────────────────────────────────
    case 'RESTORE_STATE':
      return {
        ...action.state,
        // Always re-check the demo mode env flag on restore; the env var may
        // have changed between sessions (e.g. developer enabling/disabling it).
        demoMode: action.state.demoMode || isDemoMode(),
      }

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, WizardStep.DISCORD_SUCCESS) as WizardStep,
      }

    case 'PREV_STEP': {
      const prevStep = Math.max(state.currentStep - 1, WizardStep.LANDING) as WizardStep

      // Set suppression flag when back-navigating onto the Processing step so
      // ProcessingStep skips auto-advance and shows a manual Continue button.
      const suppressProcessingAutoAdvance = prevStep === WizardStep.PROCESSING

      // If going back from review, reset draft status so the consultant can
      // re-edit fields before confirming again.
      if (state.currentStep === WizardStep.REVIEW_CONFIRM && prevStep < WizardStep.REVIEW_CONFIRM) {
        return {
          ...state,
          currentStep: prevStep,
          profileDraftStatus: ProfileDraftStatus.DRAFT,
          suppressProcessingAutoAdvance,
        }
      }

      return { ...state, currentStep: prevStep, suppressProcessingAutoAdvance }
    }

    case 'GO_TO_STEP':
      // Only allow navigating to completed steps (backward navigation via stepper).
      if (action.step < state.currentStep) {
        return {
          ...state,
          currentStep: action.step,
          // Same suppression logic for stepper back-clicks.
          suppressProcessingAutoAdvance: action.step === WizardStep.PROCESSING,
        }
      }
      return state

    case 'SET_WALLET':
      return {
        ...state,
        walletAddress: action.address,
        walletName: action.name,
      }

    case 'DISCONNECT_WALLET':
      return {
        ...state,
        walletAddress: null,
        walletName: null,
      }

    case 'SET_JURISDICTION':
      return { ...state, jurisdiction: action.jurisdiction }

    case 'TOGGLE_CONSENT':
      return {
        ...state,
        consents: {
          ...state.consents,
          [action.consentType]: !state.consents[action.consentType],
        },
      }

    case 'UPLOAD_FILE':
      return {
        ...state,
        uploadedFiles: [...state.uploadedFiles, action.file],
      }

    case 'REMOVE_FILE':
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter((f) => f.id !== action.fileId),
      }

    case 'SET_EXTRACTION':
      return {
        ...state,
        extractionResult: action.result,
        profileDraft: initDraftFromExtraction(action.result),
        profileDraftStatus: ProfileDraftStatus.DRAFT,
        // Clear the suppression flag — this action fires when the user continues
        // from the Processing step (either via auto-advance or manual Continue).
        suppressProcessingAutoAdvance: false,
      }

    case 'UPDATE_DRAFT_FIELD':
      return {
        ...state,
        profileDraft: {
          ...state.profileDraft,
          [action.key]: action.value,
        },
      }

    // ── Hardening: profile versioning ─────────────────────────────────────
    // When the consultant confirms their profile, create a SHA-256 commitment
    // hash over the confirmed fields and append a version record.
    case 'CONFIRM_PROFILE': {
      const existingVersions = state.profileVersionHistory ?? []
      const newVersion = createProfileVersion(state.profileDraft, existingVersions)
      return {
        ...state,
        profileDraftStatus: ProfileDraftStatus.CONFIRMED,
        profileVersionHistory: [...existingVersions, newVersion],
      }
    }

    case 'SET_VERIFICATION':
      return {
        ...state,
        verificationGates: action.gates,
      }

    case 'SET_COMPLIANCE':
      return {
        ...state,
        complianceGates: action.gates,
      }

    case 'SET_NFT':
      return {
        ...state,
        nftResult: action.result,
      }

    case 'LINK_DISCORD':
      return {
        ...state,
        discordLinked: true,
        discordUsername: action.username,
      }

    case 'ENABLE_DEMO_MODE':
      return {
        ...state,
        demoMode: true,
      }

    default:
      return state
  }
}
