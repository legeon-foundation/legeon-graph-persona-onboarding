import type { Metadata } from 'next'
import './globals.css'

import { DemoBanner } from '@/components/DemoBanner'


export const metadata: Metadata = {
  title: 'Legeon Genesis Onboarding',
  description: 'Privacy-Preserving Global Onboarding & Identity System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">

        {/* Demo Mode banner — zero DOM footprint when NEXT_PUBLIC_DEMO_MODE is not 'true' */}
        <DemoBanner />


        {children}
      </body>
    </html>
  )
}
