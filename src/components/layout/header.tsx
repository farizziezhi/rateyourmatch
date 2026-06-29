import Link from 'next/link'
import { getCurrentUser } from '@/features/auth/queries'
import { signOutAction } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { Trophy, LogOut } from 'lucide-react'

export async function Header() {
  const session = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-zinc-100">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-emerald-400" />
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
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
                <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-600 cursor-pointer">
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
