'use client'

import { cn } from '@/lib/utils'
import { type StepMeta, WizardStep } from '@/lib/types'

interface StepperProps {
  steps: StepMeta[]
  currentStep: WizardStep
  onStepClick?: (step: WizardStep) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  // Skip the Landing step in the stepper display
  const displaySteps = steps.filter((s) => s.step !== WizardStep.LANDING)

  return (
    <nav aria-label="Onboarding progress" className="w-full">
      <ol className="flex items-center justify-between">
        {displaySteps.map((stepMeta, index) => {
          const isCompleted = stepMeta.step < currentStep
          const isCurrent = stepMeta.step === currentStep
          const isUpcoming = stepMeta.step > currentStep
          const isClickable = isCompleted && onStepClick

          return (
            <li
              key={stepMeta.step}
              className={cn('flex items-center', index < displaySteps.length - 1 && 'flex-1')}
            >
              {/* Step circle + label */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick(stepMeta.step)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1.5 group',
                  isClickable && 'cursor-pointer',
                  !isClickable && 'cursor-default'
                )}
              >
                {/* Circle */}
                <div className="relative">
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
                  )}
                  <div
                    className={cn(
                      'relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                      isCompleted &&
                        'bg-success text-success-foreground',
                      isCurrent &&
                        'bg-primary text-primary-foreground ring-2 ring-primary/50 ring-offset-2 ring-offset-background',
                      isUpcoming && 'bg-secondary text-muted-foreground border border-border'
                    )}
                  >
                    {isCompleted ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>
                {/* Label */}
                <span
                  className={cn(
                    'text-xs font-medium transition-colors hidden sm:block',
                    isCompleted && 'text-success',
                    isCurrent && 'text-primary',
                    isUpcoming && 'text-muted-foreground'
                  )}
                >
                  {stepMeta.label}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors sm:hidden',
                    isCompleted && 'text-success',
                    isCurrent && 'text-primary',
                    isUpcoming && 'text-muted-foreground'
                  )}
                >
                  {stepMeta.shortLabel}
                </span>
              </button>

              {/* Connector line */}
              {index < displaySteps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-px flex-1 transition-colors',
                    isCompleted ? 'bg-success' : 'bg-border'
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
