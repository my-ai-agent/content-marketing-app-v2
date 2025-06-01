import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Content Marketing Pro',
  description: 'Cultural Story Multiplication Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen min-w-screen flex items-center justify-center">
        {children}
      </body>
    </html>
  )
}
