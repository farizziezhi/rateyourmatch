import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rate Your Match | World Cup 2026 Ratings',
  description: 'Football fans rate every FIFA World Cup 2026 match. Join the community.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-zinc-100 font-sans">
        <Header />
        <div className="flex-grow flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
