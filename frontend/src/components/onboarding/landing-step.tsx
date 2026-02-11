'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface LandingStepProps {
  onBegin: () => void
}

const VALUE_PROPS = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Privacy-Preserving',
    description: 'Your credentials stay encrypted and private. Only cryptographic proofs are shared on-chain.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Global Onboarding',
    description: 'Onboard from any jurisdiction worldwide with compliance-aware processing.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Verified Identity',
    description: 'Mint a ProfileNFT representing your verified onboarding status on Cardano.',
  },
]

export function LandingStep({ onBegin }: LandingStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/Legeon_Logo_CircleSafe.png"
          alt="Legeon"
          width={160}
          height={160}
          className="mx-auto h-auto w-[120px] sm:w-[160px] opacity-90"
          priority
        />
      </div>

      {/* Heading — locked copy */}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Welcome to LEGEON
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Privacy-preserving global onboarding for SAP consultants
      </p>

      {/* Value Props */}
      <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {VALUE_PROPS.map((prop) => (
          <Card key={prop.title} className="border-border/50 bg-secondary/30">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="text-primary">{prop.icon}</div>
              <h3 className="text-sm font-semibold">{prop.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{prop.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Button onClick={onBegin} size="lg" className="mt-10">
        Begin Onboarding
      </Button>

      {/* Reassurance line */}
      <p className="mt-3 text-xs text-muted-foreground/70">
        Takes ~5&ndash;10 minutes &middot; No on-chain transaction until the final step
      </p>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground/60">
        Powered by Cardano &middot; Midnight &middot; Zero-Knowledge Proofs
      </p>
      <p className="mt-2 text-[11px] text-muted-foreground/40">
        &copy; Legeon Foundation 2026
      </p>
    </div>
  )
}
