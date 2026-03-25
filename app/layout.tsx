import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Moods.ai — Design Explorations',
  description: '10 homepage design directions for Moods.ai',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
