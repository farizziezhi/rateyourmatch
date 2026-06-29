import Link from 'next/link'
import { getCurrentUser } from '@/features/auth/queries'
import { signOutAction } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export async function Header() {
  const session = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-zinc-100">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="RateYourMatch Logo"
            className="h-7 w-7 object-contain transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="text-base font-extrabold tracking-wider text-zinc-100 group-hover:text-emerald-500 transition-colors">
            RATEYOURMATCH
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <Link href="/matches" className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors">
            Matches
          </Link>
          <Link href="/feed" className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors">
            Feed
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-emerald-400 border border-zinc-700">
                  {session.profile?.username?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-sm font-medium text-zinc-300">
                  {session.profile?.display_name || session.profile?.username}
                </span>
              </div>
              <form action={signOutAction}>
                <Button variant="ghost" size="icon" type="submit" className="text-zinc-400 hover:text-red-400 hover:bg-zinc-900 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-[#b8b9bc] hover:text-[#fefcfb] hover:bg-[#1e1d1d] rounded-full cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full bg-[#fefcfb] text-[#161e29] hover:bg-[#fefcfb]/90 font-semibold cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
