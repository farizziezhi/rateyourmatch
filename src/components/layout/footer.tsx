import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 py-6 text-zinc-400 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 text-sm">
        <div>
          &copy; {new Date().getFullYear()} Rate Your Match. Community ratings for FIFA World Cup 2026.
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/matches" className="hover:text-emerald-400">
            Matches
          </Link>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-500">Not affiliated with FIFA or any national team.</span>
        </div>
      </div>
    </footer>
  )
}
