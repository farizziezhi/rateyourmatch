import { Plus_Jakarta_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'Rate Your Match | World Cup 2026 Ratings',
  description: 'Football fans rate every FIFA World Cup 2026 match. Join the community.',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark h-full antialiased ${jakarta.variable}`}>
      <body className="min-h-full flex flex-col bg-[#161e29] text-[#fefcfb] font-sans">
        <Header />
        <div className="flex-grow flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
