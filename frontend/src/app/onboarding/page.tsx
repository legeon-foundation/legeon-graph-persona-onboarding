'use client'

import { useReducer } from 'react'
import { Stepper } from '@/components/onboarding/stepper'
import { LandingStep } from '@/components/onboarding/landing-step'
import { WalletStep } from '@/components/onboarding/wallet-step'
import { UploadStep } from '@/components/onboarding/upload-step'
import { ProcessingStep } from '@/components/onboarding/processing-step'
import { ReviewStep } from '@/components/onboarding/review-step'
import { VerificationStep } from '@/components/onboarding/verification-step'
import { DiscordStep } from '@/components/onboarding/discord-step'
import { STEP_META } from '@/lib/mock-data'
import {
  WizardStep,
  ProfileDraftStatus,
  ConsentType,
  type WizardState,
  type WizardAction,
  type ExtractionResult,
} from '@/lib/types'

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

const initialState: WizardState = {
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
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function initDraftFromExtraction(result: ExtractionResult): Record<string, string> {
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

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, WizardStep.DISCORD_SUCCESS) as WizardStep,
      }

    case 'PREV_STEP': {
      const prevStep = Math.max(state.currentStep - 1, WizardStep.LANDING) as WizardStep

      // If going back from review, reset draft status
      if (state.currentStep === WizardStep.REVIEW_CONFIRM && prevStep < WizardStep.REVIEW_CONFIRM) {
        return {
          ...state,
          currentStep: prevStep,
          profileDraftStatus: ProfileDraftStatus.DRAFT,
        }
      }

      return { ...state, currentStep: prevStep }
    }

    case 'GO_TO_STEP':
      // Only allow navigating to completed steps
      if (action.step < state.currentStep) {
        return { ...state, currentStep: action.step }
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
      }

    case 'UPDATE_DRAFT_FIELD':
      return {
        ...state,
        profileDraft: {
          ...state.profileDraft,
          [action.key]: action.value,
        },
      }

    case 'CONFIRM_PROFILE':
      return {
        ...state,
        profileDraftStatus: ProfileDraftStatus.CONFIRMED,
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

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const [state, dispatch] = useReducer(wizardReducer, initialState)

  const renderStep = () => {
    switch (state.currentStep) {
      case WizardStep.LANDING:
        return <LandingStep onBegin={() => dispatch({ type: 'NEXT_STEP' })} />

      case WizardStep.WALLET_CONNECT:
        return (
          <WalletStep
            walletAddress={state.walletAddress}
            walletName={state.walletName}
            onConnect={(address, name) =>
              dispatch({ type: 'SET_WALLET', address, name })
            }
            onDisconnect={() => dispatch({ type: 'DISCONNECT_WALLET' })}
            onNext={() => dispatch({ type: 'NEXT_STEP' })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
          />
        )

      case WizardStep.UPLOAD_DOCS:
        return (
          <UploadStep
            uploadedFiles={state.uploadedFiles}
            jurisdiction={state.jurisdiction}
            consents={state.consents}
            onUpload={(file) => dispatch({ type: 'UPLOAD_FILE', file })}
            onRemoveFile={(fileId) => dispatch({ type: 'REMOVE_FILE', fileId })}
            onSetJurisdiction={(jurisdiction) =>
              dispatch({ type: 'SET_JURISDICTION', jurisdiction })
            }
            onToggleConsent={(consentType) =>
              dispatch({ type: 'TOGGLE_CONSENT', consentType })
            }
            onNext={() => dispatch({ type: 'NEXT_STEP' })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
          />
        )

      case WizardStep.PROCESSING:
        return (
          <ProcessingStep
            onComplete={(result) => {
              dispatch({ type: 'SET_EXTRACTION', result })
              dispatch({ type: 'NEXT_STEP' })
            }}
          />
        )

      case WizardStep.REVIEW_CONFIRM:
        if (!state.extractionResult) return null
        return (
          <ReviewStep
            extractionResult={state.extractionResult}
            profileDraft={state.profileDraft}
            profileDraftStatus={state.profileDraftStatus}
            onUpdateField={(key, value) =>
              dispatch({ type: 'UPDATE_DRAFT_FIELD', key, value })
            }
            onConfirm={() => dispatch({ type: 'CONFIRM_PROFILE' })}
            onNext={() => dispatch({ type: 'NEXT_STEP' })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
          />
        )

      case WizardStep.VERIFICATION_MINT:
        if (!state.extractionResult || !state.walletAddress) return null
        return (
          <VerificationStep
            extractionResult={state.extractionResult}
            profileDraft={state.profileDraft}
            jurisdiction={state.jurisdiction}
            walletAddress={state.walletAddress}
            verificationGates={state.verificationGates}
            complianceGates={state.complianceGates}
            nftResult={state.nftResult}
            demoMode={state.demoMode}
            onSetVerification={(gates) =>
              dispatch({ type: 'SET_VERIFICATION', gates })
            }
            onSetCompliance={(gates) =>
              dispatch({ type: 'SET_COMPLIANCE', gates })
            }
            onMint={(result) => dispatch({ type: 'SET_NFT', result })}
            onDemoMode={() => {
              dispatch({ type: 'ENABLE_DEMO_MODE' })
              dispatch({ type: 'NEXT_STEP' })
            }}
            onNext={() => dispatch({ type: 'NEXT_STEP' })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
          />
        )

      case WizardStep.DISCORD_SUCCESS:
        if (!state.walletAddress) return null
        return (
          <DiscordStep
            nftResult={state.nftResult}
            walletAddress={state.walletAddress}
            jurisdiction={state.jurisdiction}
            discordLinked={state.discordLinked}
            discordUsername={state.discordUsername}
            demoMode={state.demoMode}
            profileDraft={state.profileDraft}
            extractionResult={state.extractionResult}
            onLinkDiscord={(username) =>
              dispatch({ type: 'LINK_DISCORD', username })
            }
            onFinish={() => {
              // Navigate to home — in a real app this would go to a dashboard
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Stepper — hidden on landing */}
        {state.currentStep !== WizardStep.LANDING && (
          <div className="mb-8">
            <Stepper
              steps={STEP_META}
              currentStep={state.currentStep}
              onStepClick={(step) => dispatch({ type: 'GO_TO_STEP', step })}
            />
          </div>
        )}

        {/* Active Step */}
        {renderStep()}
      </div>
    </div>
  )
}
