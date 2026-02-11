'use client'

import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/utils'
import {
  type UploadedFile,
  type ConsentState,
  CredentialType,
  ConsentType,
} from '@/lib/types'
import { JURISDICTIONS, CONSENT_DESCRIPTIONS } from '@/lib/mock-data'

interface UploadStepProps {
  uploadedFiles: UploadedFile[]
  jurisdiction: string
  consents: ConsentState
  onUpload: (file: UploadedFile) => void
  onRemoveFile: (fileId: string) => void
  onSetJurisdiction: (jurisdiction: string) => void
  onToggleConsent: (consentType: ConsentType) => void
  onNext: () => void
  onBack: () => void
}

export function UploadStep({
  uploadedFiles,
  jurisdiction,
  consents,
  onUpload,
  onRemoveFile,
  onSetJurisdiction,
  onToggleConsent,
  onNext,
  onBack,
}: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const certInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null, type: CredentialType = CredentialType.RESUME) => {
      if (!files) return
      Array.from(files).forEach((f) => {
        const uploaded: UploadedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: f.name,
          size: f.size,
          type,
          uploadedAt: new Date(),
        }
        onUpload(uploaded)
      })
    },
    [onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const requiredConsentsGiven =
    consents[ConsentType.DATA_PROCESSING] &&
    consents[ConsentType.AI_EXTRACTION] &&
    consents[ConsentType.CREDENTIAL_VERIFICATION]

  const hasResume = uploadedFiles.some((f) => f.type === CredentialType.RESUME)

  const canContinue = hasResume && jurisdiction && requiredConsentsGiven

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upload Documents</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your CV/Resume and optional certifications. All documents are encrypted and stored off-chain.
        </p>
      </div>

      {/* CV Upload Dropzone */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            CV / Resume <span className="text-destructive">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors',
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40 hover:bg-secondary/30'
            )}
          >
            <svg
              className="h-10 w-10 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <p className="text-sm text-muted-foreground">
              Drop your CV here or <span className="text-primary font-medium">browse files</span>
            </p>
            <p className="text-xs text-muted-foreground/60">Accepted: PDF / DOC / DOCX &middot; Max 10 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Privacy note under upload */}
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2.5">
            <svg className="h-4 w-4 shrink-0 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <ul className="space-y-0.5 text-[11px] text-muted-foreground">
              <li>Your documents are encrypted and stored off-chain</li>
              <li>Only verification proofs (not documents) may be written on-chain</li>
              <li>You control what is shared and can revoke access later</li>
            </ul>
          </div>

          {/* Uploaded files list */}
          {uploadedFiles.filter((f) => f.type === CredentialType.RESUME).length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles
                .filter((f) => f.type === CredentialType.RESUME)
                .map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-md border bg-secondary/30 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span className="text-sm truncate">{f.name}</span>
                      <Badge variant="muted" className="text-[10px] shrink-0">
                        {formatFileSize(f.size)}
                      </Badge>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveFile(f.id)
                      }}
                      className="ml-2 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certifications (Optional) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Certifications <Badge variant="muted" className="ml-2 text-[10px]">Optional</Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload certificates, badges, or screenshots (optional).
          </p>
        </CardHeader>
        <CardContent>
          <button
            onClick={() => certInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-4 text-sm text-muted-foreground hover:border-primary/40 hover:bg-secondary/30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Certifications
          </button>
          <input
            ref={certInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files, CredentialType.CERTIFICATION)}
          />
          {uploadedFiles.filter((f) => f.type === CredentialType.CERTIFICATION).length > 0 && (
            <div className="mt-3 space-y-2">
              {uploadedFiles
                .filter((f) => f.type === CredentialType.CERTIFICATION)
                .map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-md border bg-secondary/30 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <svg className="h-4 w-4 shrink-0 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                      </svg>
                      <span className="text-sm truncate">{f.name}</span>
                      <Badge variant="muted" className="text-[10px] shrink-0">
                        {formatFileSize(f.size)}
                      </Badge>
                    </div>
                    <button
                      onClick={() => onRemoveFile(f.id)}
                      className="ml-2 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SAP IDs — coming later */}
      <div className="flex items-start gap-2.5 rounded-lg border border-border/50 bg-secondary/10 px-4 py-3">
        <svg className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div>
          <p className="text-xs font-medium text-foreground">Optional SAP IDs (coming later)</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Future versions may allow you to link SAP S-User / Partner IDs for stronger verification. Not required for Genesis.
          </p>
        </div>
      </div>

      {/* Jurisdiction */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Jurisdiction <span className="text-destructive">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            id="jurisdiction"
            options={JURISDICTIONS.map((j) => ({ value: j.code, label: `${j.name} (${j.code})` }))}
            value={jurisdiction}
            onChange={onSetJurisdiction}
            placeholder="Select your jurisdiction..."
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Used to apply the right compliance and work eligibility rules. You can update this later.
          </p>
        </CardContent>
      </Card>

      {/* Consents */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.entries(CONSENT_DESCRIPTIONS) as [ConsentType, typeof CONSENT_DESCRIPTIONS[ConsentType]][]).map(
            ([type, info]) => (
              <Checkbox
                key={type}
                checked={consents[type]}
                onCheckedChange={() => onToggleConsent(type)}
                label={
                  info.required
                    ? `${info.label} (required)`
                    : `${info.label} (optional)`
                }
                description={info.description}
              />
            )
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
