import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
        <span className="text-2xl font-bold text-primary">L</span>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Legeon Genesis
        </h1>
        <p className="mt-2 text-muted-foreground">
          Privacy-Preserving Global Onboarding &amp; Identity System
        </p>
      </div>

      <Link
        href="/onboarding"
        className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Start Onboarding
      </Link>

      <p className="mt-6 text-xs text-muted-foreground/60">
        Powered by Cardano &middot; Midnight &middot; Zero-Knowledge Proofs
      </p>
    </main>
  )
}
