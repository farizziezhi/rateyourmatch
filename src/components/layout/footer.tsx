import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t border-[#1e1d1d] bg-[#161e29] py-6 text-[#b8b9bc] mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 text-sm">
        <div>
          &copy; {new Date().getFullYear()} Rate Your Match. Community ratings for FIFA World Cup 2026.
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/matches" className="hover:text-[#9868cc]">
            Matches
          </Link>
          <span className="text-[#1e1d1d]">|</span>
          <span className="text-[#b8b9bc]">Not affiliated with FIFA or any national team.</span>
        </div>
      </div>
    </footer>
  )
}
