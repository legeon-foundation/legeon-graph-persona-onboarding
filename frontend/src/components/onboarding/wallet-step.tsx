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
          </ul>
        </div>
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
          <p className="text-[11px] text-muted-foreground/60 max-w-[280px] text-right">
            We connect your wallet first so verification and credentials are securely linked from the start.
          </p>
        </div>
      </div>
    </div>
  )
}
