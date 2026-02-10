import type { Metadata } from 'next'
import './globals.css'

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
        {children}
      </body>
    </html>
  )
}
