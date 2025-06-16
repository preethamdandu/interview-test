import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sentari Interview Template',
  description: 'A template for the Sentari interview task',
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