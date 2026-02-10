'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatAddress, delay } from '@/lib/utils'
import { type NFTMintResult, type ExtractionResult } from '@/lib/types'

interface DiscordStepProps {
  nftResult: NFTMintResult | null
  walletAddress: string
  jurisdiction: string
  discordLinked: boolean
  discordUsername: string | null
  demoMode: boolean
  profileDraft: Record<string, string>
  extractionResult: ExtractionResult | null
  onLinkDiscord: (username: string) => void
  onFinish: () => void
}

type LinkPhase = 'idle' | 'challenge' | 'signing' | 'verifying' | 'done'

export function DiscordStep({
  nftResult,
  walletAddress,
  jurisdiction,
  discordLinked,
  discordUsername,
  demoMode,
  profileDraft,
  extractionResult,
  onLinkDiscord,
  onFinish,
}: DiscordStepProps) {
  const [linkPhase, setLinkPhase] = useState<LinkPhase>(discordLinked ? 'done' : 'idle')

  const handleLinkDiscord = async () => {
    setLinkPhase('challenge')
    await delay(1000)
    setLinkPhase('signing')
    await delay(500)
    setLinkPhase('verifying')
    await delay(1000)
    setLinkPhase('done')
    onLinkDiscord('consultant_alex#4821')
  }

  // Derive skill tags from profile or extraction
  const skillTags = (
    profileDraft['extractedSkillTags'] ||
    extractionResult?.extractedSkillTags.value ||
    ''
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const displayName =
    profileDraft['extractedDisplayName'] ||
    extractionResult?.extractedDisplayName.value ||
    'Consultant'

  return (
    <div className="space-y-8">
      {/* Success Celebration */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
          <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Created</h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-md">
          Your professional profile has been created. Sensitive data stays private and encrypted &mdash; only verified proofs are shared.
        </p>

        {/* Demo Mode Badge */}
        {demoMode && (
          <Badge variant="warning" className="mt-3 text-xs">
            Demo Complete &mdash; minting was skipped
          </Badge>
        )}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Onboarding Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border bg-secondary/20 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Display Name</p>
              <p className="text-sm font-medium">{displayName}</p>
            </div>
            <div className="rounded-md border bg-secondary/20 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Wallet</p>
              <code className="text-xs font-mono">{formatAddress(walletAddress)}</code>
            </div>
            <div className="rounded-md border bg-secondary/20 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Jurisdiction</p>
              <p className="text-xs">{jurisdiction}</p>
            </div>
            <div className="rounded-md border bg-secondary/20 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">ProfileNFT</p>
              {nftResult ? (
                <code className="text-xs font-mono truncate block">{nftResult.tokenId}</code>
              ) : (
                <p className="text-xs text-muted-foreground italic">Not minted (demo mode)</p>
              )}
            </div>
            <div className="rounded-md border bg-secondary/20 px-3 py-2 sm:col-span-2">
              <p className="text-[11px] text-muted-foreground mb-1">Verified Skills</p>
              <div className="flex flex-wrap gap-1">
                {skillTags.slice(0, 6).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
                {skillTags.length > 6 && (
                  <Badge variant="muted" className="text-[10px]">
                    +{skillTags.length - 6}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* On-Chain vs Off-Chain Recap */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-xs font-semibold text-foreground mb-1.5">Stored on-chain</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Cryptographic commitment hashes
            </li>
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Zero-knowledge proof references
            </li>
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Non-sensitive skill tags
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-warning/20 bg-warning/5 px-4 py-3">
          <p className="text-xs font-semibold text-foreground mb-1.5">Stays private (off-chain)</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Your CV and documents (encrypted)
            </li>
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Personal and contact information
            </li>
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Jurisdiction and compliance data
            </li>
          </ul>
        </div>
      </div>

      {/* Discord Linking */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {/* Discord Icon */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5865F2]/10">
              <svg className="h-4 w-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-sm">Join Legeon Discord</CardTitle>
              <p className="text-[11px] text-muted-foreground">Optional &middot; Non-authoritative</p>
            </div>
            <Badge variant="muted" className="ml-auto text-[10px]">
              Optional
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Optionally link your Discord account for gated community access. Discord identity is not used for authentication, compliance, or verification decisions.
          </p>

          {linkPhase === 'done' || discordLinked ? (
            <div className="flex items-center gap-3 rounded-md border border-success/20 bg-success/5 px-3 py-2">
              <svg className="h-4 w-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-sm font-medium">Discord Linked</p>
                <p className="text-xs text-muted-foreground">{discordUsername}</p>
              </div>
              <Badge variant="success" className="ml-auto text-[10px]">
                Verified
              </Badge>
            </div>
          ) : linkPhase !== 'idle' ? (
            <div className="flex items-center gap-3 rounded-md border bg-secondary/20 px-3 py-3">
              <svg className="h-4 w-4 animate-spin text-primary shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm text-muted-foreground">
                {linkPhase === 'challenge' && 'Generating wallet challenge...'}
                {linkPhase === 'signing' && 'Signing challenge...'}
                {linkPhase === 'verifying' && 'Verifying signature...'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleLinkDiscord}
                className="flex items-center gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Link Discord
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Skip
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button size="lg">
              View Profile Summary
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Edit Profile
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          You can update your profile and manage credentials from the dashboard.
        </p>
      </div>
    </div>
  )
}
