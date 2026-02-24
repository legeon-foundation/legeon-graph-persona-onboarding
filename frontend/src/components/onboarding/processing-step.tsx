'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { type ExtractionResult } from '@/lib/types'
import { PROCESSING_STEPS, MOCK_EXTRACTION_RESULT } from '@/lib/mock-data'

interface ProcessingStepProps {
  onComplete: (result: ExtractionResult) => void
  /**
   * When true (arrived via back navigation from Review), skip the animation
   * pipeline and render the completed state immediately with a manual Continue
   * button. The consumer is responsible for setting this via
   * WizardState.suppressProcessingAutoAdvance.
   */
  suppressAutoAdvance?: boolean
  /** Called when the user clicks Back (only relevant when suppressAutoAdvance=true). */
  onBack?: () => void
}

export function ProcessingStep({
  onComplete,
  suppressAutoAdvance = false,
  onBack,
}: ProcessingStepProps) {
  // When suppressAutoAdvance, initialise directly into the completed state so
  // all stage indicators show as done without running the animation pipeline.
  const [currentStageIndex, setCurrentStageIndex] = useState(
    suppressAutoAdvance ? PROCESSING_STEPS.length : 0
  )
  const [completed, setCompleted] = useState(suppressAutoAdvance)
  const calledComplete = useRef(false)

  const totalStages = PROCESSING_STEPS.length
  const progressValue = completed
    ? 100
    : (currentStageIndex / totalStages) * 100

  // Animation pipeline — skipped when arrived via back navigation.
  useEffect(() => {
    if (suppressAutoAdvance) return

    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const runStages = async () => {
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        if (cancelled) return

        await new Promise<void>((resolve) => {
          const t = setTimeout(() => {
            if (!cancelled) {
              setCurrentStageIndex(i + 1)
            }
            resolve()
          }, PROCESSING_STEPS[i].duration)
          timeouts.push(t)
        })
      }

      if (!cancelled) {
        const t = setTimeout(() => {
          if (!cancelled) {
            setCompleted(true)
          }
        }, 600)
        timeouts.push(t)
      }
    }

    runStages()

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [suppressAutoAdvance])

  // Auto-advance effect — skipped when arrived via back navigation.
  // In the back-nav case the user must click the Continue button explicitly.
  useEffect(() => {
    if (suppressAutoAdvance) return

    if (completed && !calledComplete.current) {
      calledComplete.current = true
      const t = setTimeout(() => {
        onComplete(MOCK_EXTRACTION_RESULT)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [completed, onComplete, suppressAutoAdvance])

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Processing Your Documents</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {suppressAutoAdvance
            ? 'Your documents were already processed. Review the results below.'
            : 'Encrypting, extracting, and generating proofs. Please wait.'}
        </p>
      </div>

      <Card className="w-full max-w-lg">
        <CardContent className="p-6 space-y-6">
          {/* Progress Bar */}
          <Progress value={progressValue} />

          {/* Stage List */}
          <div className="space-y-3">
            {PROCESSING_STEPS.map((stage, index) => {
              const isDone = index < currentStageIndex
              const isActive = index === currentStageIndex && !completed
              const isPending = index > currentStageIndex

              return (
                <div
                  key={stage.label}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 transition-colors',
                    isActive && 'bg-primary/5'
                  )}
                >
                  {/* Status Icon */}
                  <div className="shrink-0">
                    {isDone ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
                        <svg className="h-3 w-3 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : isActive ? (
                      <svg className="h-5 w-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-border" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      'text-sm',
                      isDone && 'text-muted-foreground line-through',
                      isActive && 'text-foreground font-medium',
                      isPending && 'text-muted-foreground'
                    )}
                  >
                    {stage.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Complete Message */}
          {completed && (
            <div className="flex items-center justify-center gap-2 rounded-md bg-success/10 px-4 py-3">
              <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-success">
                {suppressAutoAdvance
                  ? 'Processing complete.'
                  : 'Processing complete. Loading results...'}
              </span>
            </div>
          )}

          {/* Navigation — only rendered when arrived via back navigation */}
          {suppressAutoAdvance && completed && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={() => onComplete(MOCK_EXTRACTION_RESULT)}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Continue to Review
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground/60 text-center max-w-sm">
        Your documents are encrypted end-to-end. Raw data never leaves the secure backend.
      </p>
    </div>
  )
}
