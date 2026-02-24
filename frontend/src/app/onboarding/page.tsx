'use client'

import { useReducer, useEffect, useRef, useState } from 'react'
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
} from '@/lib/types'
// ── Hardening features ──────────────────────────────────────────────────────
import { wizardVault } from '@/lib/wizardVault'
import { isDemoMode } from '@/config/demoMode'
// ── Reducer (extracted for testability, contains back-nav fix) ───────────────
import { wizardReducer } from '@/lib/wizardReducer'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Debounce window for background vault saves (ms) */
const AUTOSAVE_DEBOUNCE_MS = 300

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
  // Pre-seed demoMode from the NEXT_PUBLIC_DEMO_MODE env flag so that
  // the banner and verification-step demo button are always in sync.
  demoMode: isDemoMode(),
  profileVersionHistory: [],
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  const [hydrated, setHydrated] = useState(false)

  // Always-current state ref — lets beforeunload read the latest state without
  // re-registering the listener every render.
  const stateRef = useRef<WizardState>(state)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Hardening: vault hydration on mount ─────────────────────────────────
  useEffect(() => {
    wizardVault
      .load()
      .then((saved) => {
        if (saved && saved.currentStep !== undefined) {
          dispatch({ type: 'RESTORE_STATE', state: saved })
        }
      })
      .catch(() => {
        // Silently fall back to initial state
      })
      .finally(() => {
        setHydrated(true)
      })
  }, [])

  // ── Keep stateRef in sync ───────────────────────────────────────────────
  useEffect(() => {
    stateRef.current = state
  })

  // ── Hardening: debounced autosave ────────────────────────────────────────
  // Fires AUTOSAVE_DEBOUNCE_MS after the last state change.
  // Skipped before hydration completes to avoid overwriting a valid vault entry
  // with the default initial state.
  useEffect(() => {
    if (!hydrated) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      wizardVault.save(stateRef.current).catch(() => {})
    }, AUTOSAVE_DEBOUNCE_MS)
  }, [state, hydrated])

  // ── Hardening: best-effort flush on page unload ──────────────────────────
  // Cancels the pending debounce and fires an immediate synchronous-ish save
  // (encrypt → localStorage, then IDB — same pattern as onboardingVault).
  useEffect(() => {
    const flush = () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      wizardVault.save(stateRef.current).catch(() => {})
    }
    window.addEventListener('beforeunload', flush)
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('beforeunload', flush)
      window.removeEventListener('pagehide', flush)
    }
  }, [])

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
            suppressAutoAdvance={state.suppressProcessingAutoAdvance ?? false}
            onComplete={(result) => {
              dispatch({ type: 'SET_EXTRACTION', result })
              dispatch({ type: 'NEXT_STEP' })
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
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
