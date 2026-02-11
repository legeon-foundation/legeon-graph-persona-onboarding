'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { formatAddress, delay, generateMockHash } from '@/lib/utils'
import {
  type ExtractionResult,
  type ComplianceGate,
  type VerificationGate,
  type NFTMintResult,
  type OnChainData,
  type PrivateData,
  VerificationStatus,
  ComplianceStatusType,
} from '@/lib/types'
import {
  MOCK_COMPLIANCE_GATES,
  MOCK_VERIFICATION_GATES,
  MOCK_VERIFICATION_GATES_VERIFIED,
  MOCK_NFT_RESULT,
} from '@/lib/mock-data'

interface VerificationStepProps {
  extractionResult: ExtractionResult
  profileDraft: Record<string, string>
  jurisdiction: string
  walletAddress: string
  verificationGates: VerificationGate[]
  complianceGates: ComplianceGate[]
  nftResult: NFTMintResult | null
  demoMode: boolean
  onSetVerification: (gates: VerificationGate[]) => void
  onSetCompliance: (gates: ComplianceGate[]) => void
  onMint: (result: NFTMintResult) => void
  onDemoMode: () => void
  onNext: () => void
  onBack: () => void
}

type MintPhase = 'idle' | 'preparing' | 'submitting' | 'confirming' | 'done'

export function VerificationStep({
  extractionResult,
  profileDraft,
  jurisdiction,
  walletAddress,
  verificationGates,
  complianceGates,
  nftResult,
  demoMode,
  onSetVerification,
  onSetCompliance,
  onMint,
  onDemoMode,
  onNext,
  onBack,
}: VerificationStepProps) {
  const [mintPhase, setMintPhase] = useState<MintPhase>(nftResult ? 'done' : 'idle')
  const [showTechDetails, setShowTechDetails] = useState(false)
  const verificationRan = useRef(false)

  // Simulate verification evaluation
  useEffect(() => {
    if (verificationRan.current || verificationGates.length > 0) return
    verificationRan.current = true

    // First set pending gates
    onSetVerification(MOCK_VERIFICATION_GATES)

    // After 2s, set them all to verified
    const t = setTimeout(() => {
      onSetVerification(MOCK_VERIFICATION_GATES_VERIFIED)
      // Then set compliance gates after another 1s
      setTimeout(() => {
        onSetCompliance(MOCK_COMPLIANCE_GATES)
      }, 1000)
    }, 2000)

    return () => clearTimeout(t)
  }, [verificationGates.length, onSetVerification, onSetCompliance])

  const allVerified = verificationGates.length > 0 &&
    verificationGates.every((g) => g.status === VerificationStatus.APPROVED)

  const allCompliant = complianceGates.length > 0 &&
    complianceGates.every((g) => g.status === ComplianceStatusType.PASS)

  const verificationPending = verificationGates.length > 0 &&
    verificationGates.some((g) => g.status === VerificationStatus.PENDING)

  const canMint = allVerified && allCompliant && !nftResult && mintPhase === 'idle'

  const handleMint = async () => {
    setMintPhase('preparing')
    await delay(1000)
    setMintPhase('submitting')
    await delay(1200)
    setMintPhase('confirming')
    await delay(1000)
    setMintPhase('done')
    onMint(MOCK_NFT_RESULT)
  }

  // Build on-chain vs private data for display
  const onChainData: OnChainData = {
    commitmentHashes: [generateMockHash(), generateMockHash(), generateMockHash()],
    proofRefs: [
      'midnight://proof/' + generateMockHash().slice(0, 16),
      'midnight://proof/' + generateMockHash().slice(0, 16),
    ],
    skillTags: (profileDraft['extractedSkillTags'] || extractionResult.extractedSkillTags.value)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6),
    policyId: generateMockHash().slice(0, 56),
  }

  const privateData: PrivateData = {
    displayName: profileDraft['extractedDisplayName'] || extractionResult.extractedDisplayName.value,
    bio: profileDraft['extractedBio'] || extractionResult.extractedBio.value,
    rawCVRef: 'encrypted://blob/' + generateMockHash().slice(0, 24),
    jurisdiction,
    sapDomains: (profileDraft['sapDomains'] || extractionResult.sapDomains.value).split(',').map((s) => s.trim()),
    btpExperience: (profileDraft['btpExperience'] || extractionResult.btpExperience.value).split(',').map((s) => s.trim()),
    aiTransformationRoles: (profileDraft['aiTransformationRoles'] || extractionResult.aiTransformationRoles.value).split(',').map((s) => s.trim()),
    certifications: ['SAP S/4HANA Finance (mock)'],
  }

  const mintProgressValue =
    mintPhase === 'preparing' ? 25
    : mintPhase === 'submitting' ? 55
    : mintPhase === 'confirming' ? 85
    : mintPhase === 'done' ? 100
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Verification & Mint</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review what goes on-chain vs what stays private, then mint your ProfileNFT.
        </p>
      </div>

      {/* Explainer — what happens next */}
      <div className="rounded-lg border border-border/50 bg-secondary/20 px-4 py-3">
        <p className="text-xs font-medium text-foreground mb-2">What happens next</p>
        <ol className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary mt-0.5">1</span>
            <span>Your credentials and profile are verified against compliance rules</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary mt-0.5">2</span>
            <span>Zero-knowledge proofs are generated via Midnight (privacy-preserving)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary mt-0.5">3</span>
            <span>A ProfileNFT is minted on Cardano testnet containing only proofs and non-sensitive metadata</span>
          </li>
        </ol>
      </div>

      {/* Demo note for pending verification */}
      {!allVerified && !nftResult && (
        <div className="flex items-start gap-2.5 rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-[11px] text-muted-foreground">
            In production, verification updates automatically. In this demo, you can proceed using Demo Mode.
          </p>
        </div>
      )}

      {/* Two-Panel Layout — summary labels (tech details collapsed) */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* On-Chain Panel */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
                <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-sm">On-Chain (Public)</CardTitle>
                <p className="text-[10px] text-muted-foreground">Proofs and hashes only</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {/* Summary labels always visible */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Commitment hashes</span>
              <Badge variant="muted" className="text-[10px]">{onChainData.commitmentHashes.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Proof references</span>
              <Badge variant="muted" className="text-[10px]">{onChainData.proofRefs.length}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Skill Tags</p>
              <div className="flex flex-wrap gap-1">
                {onChainData.skillTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Expanded technical details */}
            {showTechDetails && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div>
                  <p className="text-muted-foreground mb-1 font-medium">Commitment Hashes</p>
                  {onChainData.commitmentHashes.map((h, i) => (
                    <code key={i} className="block truncate text-[11px] text-foreground/70 font-mono mb-0.5">
                      {h}
                    </code>
                  ))}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-medium">Proof References</p>
                  {onChainData.proofRefs.map((r, i) => (
                    <code key={i} className="block truncate text-[11px] text-foreground/70 font-mono mb-0.5">
                      {r}
                    </code>
                  ))}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-medium">Policy ID</p>
                  <code className="block truncate text-[11px] text-foreground/70 font-mono">
                    {onChainData.policyId}
                  </code>
                </div>
              </div>
            )}

            <p className="text-[11px] text-muted-foreground/60 pt-1 border-t border-border/50">
              Only cryptographic proofs and non-sensitive metadata are stored on-chain.
            </p>
          </CardContent>
        </Card>

        {/* Private Panel */}
        <Card className="border-warning/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-warning/20">
                <svg className="h-3.5 w-3.5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-sm">Off-Chain (Private)</CardTitle>
                <p className="text-[10px] text-muted-foreground">PII and documents encrypted</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Display Name</span>
              <span className="text-foreground/70 truncate ml-2 max-w-[60%] text-right">{privateData.displayName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Jurisdiction</span>
              <span className="text-foreground/70">{privateData.jurisdiction}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">SAP Domains</span>
              <Badge variant="muted" className="text-[10px]">{privateData.sapDomains.length}</Badge>
            </div>

            {/* Expanded private details */}
            {showTechDetails && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div>
                  <p className="text-muted-foreground mb-0.5 font-medium">Bio</p>
                  <p className="text-foreground/70 line-clamp-2">{privateData.bio}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5 font-medium">Raw CV Reference</p>
                  <code className="block truncate text-[11px] text-foreground/70 font-mono">
                    {privateData.rawCVRef}
                  </code>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5 font-medium">SAP Domains</p>
                  <p className="text-foreground/70">{privateData.sapDomains.join(', ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5 font-medium">BTP Experience</p>
                  <p className="text-foreground/70 line-clamp-1">{privateData.btpExperience.join(', ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5 font-medium">AI Transformation Roles</p>
                  <p className="text-foreground/70">{privateData.aiTransformationRoles.join(', ')}</p>
                </div>
              </div>
            )}

            <p className="text-[11px] text-muted-foreground/60 pt-1 border-t border-border/50">
              PII and raw data are encrypted off-chain and never exposed publicly.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Show/hide technical details toggle */}
      <button
        type="button"
        onClick={() => setShowTechDetails(!showTechDetails)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
      >
        <svg
          className={cn('h-3.5 w-3.5 transition-transform', showTechDetails && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
        {showTechDetails ? 'Hide technical details' : 'Show technical details'}
      </button>

      {/* Verification Gates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Verification Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {verificationGates.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Starting verification...
            </div>
          ) : (
            verificationGates.map((gate) => (
              <div
                key={gate.id}
                className="flex items-center justify-between rounded-md border bg-secondary/20 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  {gate.status === VerificationStatus.APPROVED ? (
                    <svg className="h-4 w-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : gate.status === VerificationStatus.PENDING ? (
                    <svg className="h-4 w-4 animate-spin text-primary shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-destructive shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-sm">{gate.label}</span>
                </div>
                <Badge
                  variant={
                    gate.status === VerificationStatus.APPROVED ? 'success'
                    : gate.status === VerificationStatus.PENDING ? 'muted'
                    : 'destructive'
                  }
                  className="text-[10px]"
                >
                  {gate.status === VerificationStatus.APPROVED
                    ? 'Verified'
                    : gate.status === VerificationStatus.PENDING
                    ? 'Awaiting verification'
                    : 'Failed'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Compliance Gates */}
      {complianceGates.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Compliance Gates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {complianceGates.map((gate) => (
              <div
                key={gate.id}
                className="flex items-center justify-between rounded-md border bg-secondary/20 px-3 py-2"
              >
                <div>
                  <span className="text-sm">{gate.label}</span>
                  <p className="text-[11px] text-muted-foreground">{gate.detail}</p>
                </div>
                <Badge
                  variant={
                    gate.status === ComplianceStatusType.PASS ? 'success'
                    : gate.status === ComplianceStatusType.REVIEW ? 'warning'
                    : 'destructive'
                  }
                  className="text-[10px] shrink-0"
                >
                  {gate.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mint Section */}
      <Card className={cn(nftResult && 'border-success/30')}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">ProfileNFT Minting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mintPhase !== 'idle' && mintPhase !== 'done' && (
            <div className="space-y-3">
              <Progress value={mintProgressValue} />
              <p className="text-sm text-muted-foreground">
                {mintPhase === 'preparing' && 'Preparing transaction...'}
                {mintPhase === 'submitting' && 'Submitting to Cardano testnet...'}
                {mintPhase === 'confirming' && 'Confirming on-chain...'}
              </p>
            </div>
          )}

          {nftResult ? (
            <div className="space-y-3 rounded-lg border border-success/20 bg-success/5 p-4">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-success">ProfileNFT Minted Successfully</span>
              </div>
              <div className="grid gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Token ID:</span>{' '}
                  <code className="font-mono text-foreground/70">{nftResult.tokenId}</code>
                </div>
                <div>
                  <span className="text-muted-foreground">Tx Hash:</span>{' '}
                  <code className="font-mono text-foreground/70 break-all">{nftResult.txHash}</code>
                </div>
                <div>
                  <span className="text-muted-foreground">Owner:</span>{' '}
                  <code className="font-mono text-foreground/70">{formatAddress(nftResult.ownerWalletAddress)}</code>
                </div>
                <div>
                  <span className="text-muted-foreground">Metadata URI:</span>{' '}
                  <code className="font-mono text-foreground/70 break-all">{nftResult.metadataURI}</code>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Button
                onClick={handleMint}
                disabled={!canMint}
                className="w-full"
              >
                {!allVerified
                  ? 'Awaiting Verification...'
                  : !allCompliant
                  ? 'Awaiting Compliance...'
                  : 'Mint ProfileNFT'}
              </Button>
              <div className="mt-2 text-center space-y-0.5">
                <p className="text-[11px] text-muted-foreground">
                  Test environment &mdash; no real cost.
                </p>
                <p className="text-[10px] text-muted-foreground/50">
                  On mainnet, minting requires a small Cardano network fee (paid in ADA).
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {/* When minted: normal Continue */}
            {nftResult ? (
              <Button onClick={onNext}>
                Continue
              </Button>
            ) : (
              <>
                {/* Demo Mode — PRIMARY when verification pending or not yet minted */}
                <Button
                  onClick={() => {
                    onDemoMode()
                    onNext()
                  }}
                >
                  Continue (Demo Mode)
                </Button>
                {/* Normal continue — disabled until minted */}
                <Button variant="ghost" size="sm" disabled className="text-muted-foreground text-xs">
                  Continue
                </Button>
              </>
            )}
          </div>
          {!nftResult && (
            <p className="text-[10px] text-muted-foreground/50 max-w-[320px] text-right">
              Demo Mode skips minting and proceeds to the success screen with simulated data.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
