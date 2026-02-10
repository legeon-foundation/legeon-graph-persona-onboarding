'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { type ExtractionResult } from '@/lib/types'
import { PROCESSING_STEPS, MOCK_EXTRACTION_RESULT } from '@/lib/mock-data'

interface ProcessingStepProps {
  onComplete: (result: ExtractionResult) => void
}

export function ProcessingStep({ onComplete }: ProcessingStepProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const calledComplete = useRef(false)

  const totalStages = PROCESSING_STEPS.length
  const progressValue = completed
    ? 100
    : (currentStageIndex / totalStages) * 100

  useEffect(() => {
    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const runStages = async () => {
      let elapsed = 0

      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        if (cancelled) return

        // Wait for this stage's duration
        await new Promise<void>((resolve) => {
          const t = setTimeout(() => {
            if (!cancelled) {
              setCurrentStageIndex(i + 1)
            }
            resolve()
          }, PROCESSING_STEPS[i].duration)
          timeouts.push(t)
        })

        elapsed += PROCESSING_STEPS[i].duration
      }

      // Brief pause before completing
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
  }, [])

  // Separate effect to call onComplete when done
  useEffect(() => {
    if (completed && !calledComplete.current) {
      calledComplete.current = true
      const t = setTimeout(() => {
        onComplete(MOCK_EXTRACTION_RESULT)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [completed, onComplete])

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Processing Your Documents</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Encrypting, extracting, and generating proofs. Please wait.
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
                Processing complete. Loading results...
              </span>
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
