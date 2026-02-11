'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  type ExtractionResult,
  type ExtractionField,
  ProfileDraftStatus,
} from '@/lib/types'

interface ReviewStepProps {
  extractionResult: ExtractionResult
  profileDraft: Record<string, string>
  profileDraftStatus: ProfileDraftStatus
  onUpdateField: (key: string, value: string) => void
  onConfirm: () => void
  onNext: () => void
  onBack: () => void
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const variant: 'success' | 'warning' | 'destructive' =
    confidence >= 0.85 ? 'success' : confidence >= 0.65 ? 'warning' : 'destructive'

  const label =
    confidence >= 0.85 ? 'High confidence' : confidence >= 0.65 ? 'Medium confidence' : 'Low confidence'

  return (
    <Badge variant={variant} className="text-[10px]">
      {pct}% &mdash; {label}
    </Badge>
  )
}

/** Renders skill tags as visual chips with an X button for removal */
function SkillChips({
  value,
  onUpdate,
  readOnly,
}: {
  value: string
  onUpdate: (value: string) => void
  readOnly: boolean
}) {
  const [newTag, setNewTag] = useState('')
  const tags = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const removeTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index)
    onUpdate(updated.join(', '))
  }

  const addTag = () => {
    const trimmed = newTag.trim()
    if (!trimmed) return
    onUpdate([...tags, trimmed].join(', '))
    setNewTag('')
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border bg-secondary/50 px-2.5 py-1 text-xs',
              readOnly && 'opacity-80'
            )}
          >
            {tag}
            {!readOnly && (
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </span>
        ))}
      </div>
      {!readOnly && (
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder="Type and press Enter"
            className="text-xs h-8"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTag}
            disabled={!newTag.trim()}
            className="shrink-0 h-8 text-xs"
          >
            Add
          </Button>
        </div>
      )}
    </div>
  )
}

/** Whether a field should be considered "required" in the profile */
function isRequiredField(key: string): boolean {
  return ['extractedDisplayName', 'extractedBio', 'extractedSkillTags'].includes(key)
}

/** Whether a field renders as skill chips */
function isChipField(key: string): boolean {
  return ['extractedSkillTags', 'sapDomains', 'btpExperience', 'aiTransformationRoles'].includes(key)
}

function FieldCard({
  field,
  draftValue,
  onUpdate,
  readOnly,
}: {
  field: ExtractionField
  draftValue: string
  onUpdate: (value: string) => void
  readOnly: boolean
}) {
  const isEdited = draftValue !== field.value
  const isLongField = field.key === 'extractedBio' || field.key === 'extractedExperienceSummary'
  const required = isRequiredField(field.key)
  const chips = isChipField(field.key)

  return (
    <Card className={cn('transition-colors', readOnly && 'opacity-80')}>
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">{field.label}</CardTitle>
            {required ? (
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                Required
              </Badge>
            ) : (
              <Badge variant="muted" className="text-[10px]">
                Optional
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <ConfidenceBadge confidence={field.confidence} />
            {isEdited && <Badge variant="outline" className="text-[10px]">Edited</Badge>}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Source: {field.source}
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {readOnly ? (
          chips ? (
            <SkillChips value={draftValue} onUpdate={onUpdate} readOnly />
          ) : (
            <div className="rounded-md bg-secondary/50 px-3 py-2 text-sm">
              {draftValue}
            </div>
          )
        ) : chips ? (
          <SkillChips value={draftValue} onUpdate={onUpdate} readOnly={false} />
        ) : isLongField ? (
          <Textarea
            value={draftValue}
            onChange={(e) => onUpdate(e.target.value)}
            className="text-sm"
            rows={3}
          />
        ) : (
          <Input
            value={draftValue}
            onChange={(e) => onUpdate(e.target.value)}
            className="text-sm"
          />
        )}
      </CardContent>
    </Card>
  )
}

export function ReviewStep({
  extractionResult,
  profileDraft,
  profileDraftStatus,
  onUpdateField,
  onConfirm,
  onNext,
  onBack,
}: ReviewStepProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const isConfirmed = profileDraftStatus === ProfileDraftStatus.CONFIRMED
  const readOnly = isConfirmed

  // Panel ref for focus trap and keyboard handling
  const panelRef = useRef<HTMLDivElement>(null)

  const closePanel = useCallback(() => setShowConfirmDialog(false), [])

  // Escape key closes the panel
  useEffect(() => {
    if (!showConfirmDialog) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closePanel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showConfirmDialog, closePanel])

  // Auto-focus panel when opened & basic focus trap
  useEffect(() => {
    if (!showConfirmDialog || !panelRef.current) return
    const panel = panelRef.current
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length > 0) focusable[0].focus()

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', trapFocus)
    return () => document.removeEventListener('keydown', trapFocus)
  }, [showConfirmDialog])

  // Get ordered fields from extraction result
  const fields: ExtractionField[] = [
    extractionResult.extractedDisplayName,
    extractionResult.extractedBio,
    extractionResult.extractedSkillTags,
    extractionResult.extractedExperienceSummary,
    extractionResult.sapDomains,
    extractionResult.btpExperience,
    extractionResult.aiTransformationRoles,
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Review Extracted Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-assisted extraction is assistive only. Review and edit all fields before confirming.
        </p>
      </div>

      {/* Confidence Explanation */}
      <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-secondary/20 px-4 py-3">
        <svg className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p className="font-medium text-foreground">About confidence scores</p>
          <p>
            Each field shows how confident the AI was when extracting this data from your CV.
            <span className="text-success font-medium"> Green (85%+)</span> = high confidence,
            <span className="text-warning font-medium"> amber (65-84%)</span> = medium,
            <span className="text-destructive font-medium"> red (&lt;65%)</span> = low.
            We recommend reviewing all amber and red fields carefully.
          </p>
        </div>
      </div>

      {/* Privacy Callout */}
      <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <svg className="h-5 w-5 shrink-0 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <div>
          <p className="text-sm font-medium">Privacy Notice</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Raw CV content will never be published. Only the fields you explicitly confirm below will become part of your professional profile.
          </p>
        </div>
      </div>

      {/* Edit Hint (when not confirmed) */}
      {!isConfirmed && (
        <p className="text-xs text-muted-foreground/70 italic">
          Click into any field to edit. Skill and domain fields can be modified as individual tags.
        </p>
      )}

      {/* Confirmed Banner */}
      {isConfirmed && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3">
          <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-success">
            Profile confirmed. These fields are now part of your professional profile.
          </span>
        </div>
      )}

      {/* Field Cards */}
      <div className="space-y-3">
        {fields.map((field) => (
          <FieldCard
            key={field.key}
            field={field}
            draftValue={profileDraft[field.key] ?? field.value}
            onUpdate={(value) => onUpdateField(field.key, value)}
            readOnly={readOnly}
          />
        ))}
      </div>

      {/* Pre-confirm checklist */}
      {!isConfirmed && !showConfirmDialog && (
        <div className="rounded-lg border border-border/50 bg-secondary/10 px-4 py-3">
          <p className="text-xs font-medium text-foreground mb-2">Before you confirm, double-check:</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', profileDraft['extractedDisplayName'] ? 'bg-success' : 'bg-muted-foreground/40')} />
              Display name
            </li>
            <li className="flex items-center gap-2">
              <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', profileDraft['extractedBio'] ? 'bg-success' : 'bg-muted-foreground/40')} />
              Bio
            </li>
            <li className="flex items-center gap-2">
              <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', profileDraft['extractedSkillTags'] ? 'bg-success' : 'bg-muted-foreground/40')} />
              Skill tags (client-facing)
            </li>
          </ul>
        </div>
      )}

      {/* Confirmation Panel — becomes the sole way to proceed when open */}
      {showConfirmDialog && !isConfirmed && (
        <Card
          ref={panelRef}
          role="dialog"
          aria-label="Confirm your LEGEON professional profile"
          className="border-primary/30 bg-primary/5"
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  Confirm your LEGEON professional profile
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  No blockchain transaction will occur at this step. You are confirming your profile details before verification begins.
                </p>

                {/* Checklist */}
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <svg className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmed fields will be used for your professional profile
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Non-sensitive fields (e.g. skill tags) may appear in your ProfileNFT metadata
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Raw CV content is never published or shared
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    You can edit your profile again later from the dashboard
                  </li>
                </ul>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      onConfirm()
                      setShowConfirmDialog(false)
                      onNext()
                    }}
                  >
                    Confirm Profile Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closePanel}
                  >
                    Go Back & Edit
                  </Button>
                </div>

                <p className="mt-2 text-[10px] text-muted-foreground/50">
                  Press <kbd className="rounded border border-border/50 bg-secondary/50 px-1 py-0.5 text-[9px] font-mono">Esc</kbd> to go back
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Step Hint — only when panel is closed and not yet confirmed */}
      {!isConfirmed && !showConfirmDialog && (
        <p className="text-[11px] text-muted-foreground/60 text-center">
          Next: we&rsquo;ll run verification checks and prepare your ProfileNFT.
        </p>
      )}

      {/* Navigation — hidden when confirmation panel is open */}
      {!showConfirmDialog && (
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            {!isConfirmed && (
              <Button
                variant="secondary"
                onClick={() => setShowConfirmDialog(true)}
              >
                Confirm Profile
              </Button>
            )}
            <Button onClick={onNext} disabled={!isConfirmed}>
              {isConfirmed ? 'Continue to Verification' : 'Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
