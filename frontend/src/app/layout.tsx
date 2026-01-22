import type { Metadata } from 'next'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
