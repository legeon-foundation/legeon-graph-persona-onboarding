'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatAddress, delay } from '@/lib/utils'
import { type WalletInfo } from '@/lib/types'
import { WALLETS, MOCK_WALLET_ADDRESS } from '@/lib/mock-data'

interface WalletStepProps {
  walletAddress: string | null
  walletName: string | null
  onConnect: (address: string, name: string) => void
  onDisconnect: () => void
  onNext: () => void
  onBack: () => void
}

function Accordion({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-medium text-foreground hover:bg-secondary/30 transition-colors"
      >
        {title}
        <svg
          className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-border/50 bg-secondary/10 px-4 py-3 text-xs text-muted-foreground space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

export function WalletStep({
  walletAddress,
  walletName,
  onConnect,
  onDisconnect,
  onNext,
  onBack,
}: WalletStepProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (wallet: WalletInfo) => {
    if (!wallet.installed || connecting) return
    setConnecting(wallet.id)
    // Mock CIP-30 connection delay
    await delay(1500)
    onConnect(MOCK_WALLET_ADDRESS, wallet.name)
    setConnecting(null)
  }

  const isConnected = !!walletAddress

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Connect Your Wallet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a supported Cardano wallet. Your wallet is used to prove ownership
          and sign actions &mdash; your documents and personal data remain private and off-chain.
        </p>
      </div>

      {isConnected ? (
        /* Connected State */
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{walletName}</span>
                  <Badge variant="success">Connected</Badge>
                </div>
                <code className="mt-0.5 block text-xs text-muted-foreground font-mono">
                  {formatAddress(walletAddress)}
                </code>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onDisconnect} className="text-muted-foreground">
              Disconnect
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Wallet Grid */
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WALLETS.map((wallet) => {
            const isConnecting = connecting === wallet.id

            return (
              <Card
                key={wallet.id}
                className={cn(
                  'transition-colors cursor-pointer',
                  wallet.installed
                    ? 'hover:border-primary/50 hover:bg-secondary/50'
                    : 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => handleConnect(wallet)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                      wallet.installed
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {isConnecting ? (
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      wallet.icon
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{wallet.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {isConnecting ? 'Connecting...' : wallet.installed ? 'Detected' : 'Not installed'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* New to Cardano wallets? */}
      {!isConnected && (
        <div className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
          <div className="flex items-start gap-2.5">
            <svg className="h-4 w-4 shrink-0 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground">New to Cardano wallets?</p>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li>A wallet is a secure digital identity used to prove ownership and sign actions.</li>
                <li>Your CV and documents are <span className="font-medium text-foreground">never</span> stored on-chain.</li>
                <li>No funds are needed to connect a wallet.</li>
                <li className="text-muted-foreground/70">Network fees apply only if you mint later (and Demo Mode can proceed without minting).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Wallet role explainer */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border/50 bg-secondary/20 px-4 py-3">
          <p className="text-xs font-semibold text-foreground mb-1.5">What your wallet does</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Proves account ownership
            </li>
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Signs consent and verification actions
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-border/50 bg-secondary/20 px-4 py-3">
          <p className="text-xs font-semibold text-foreground mb-1.5">What it does NOT do</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Store your CV or documents
            </li>
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Expose personal data publicly
            </li>
            <li className="flex items-start gap-1.5">
              <svg className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Require payment or tokens at this step
            </li>
          </ul>
        </div>
      </div>

      {/* Helper accordions */}
      <div className="space-y-2">
        <Accordion title="How to install a wallet">
          <ol className="space-y-1.5 list-decimal list-inside">
            <li><span className="font-medium text-foreground">Install the extension</span> &mdash; visit your chosen wallet&rsquo;s website (e.g. Nami, Eternl, Lace) and install the browser extension.</li>
            <li><span className="font-medium text-foreground">Create a new wallet</span> &mdash; follow the on-screen setup to generate a new wallet.</li>
            <li><span className="font-medium text-foreground">Save your recovery phrase</span> &mdash; write it down and store it somewhere safe. This is the only way to recover your wallet.</li>
          </ol>
          <p className="mt-2 text-muted-foreground/70">Once installed, refresh this page and your wallet will appear as &ldquo;Detected&rdquo; above.</p>
        </Accordion>
        <Accordion title="What fees to expect">
          <div className="space-y-1.5">
            <p><span className="font-medium text-foreground">Test / demo:</span> Test environment &mdash; no real cost. Demo Mode lets you complete onboarding without any transaction.</p>
            <p><span className="font-medium text-foreground">Future mainnet:</span> Minting a ProfileNFT requires a small Cardano network fee (paid in ADA). Typical cost is less than 1 ADA.</p>
          </div>
        </Accordion>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex flex-col items-end gap-1">
          <Button onClick={onNext} disabled={!isConnected}>
            Continue
          </Button>
          {!isConnected && (
            <p className="text-[11px] text-muted-foreground/60 max-w-[280px] text-right">
              Connect a wallet to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
