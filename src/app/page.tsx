import Link from 'next/link'
import { getTopRatedMatches, getUpcomingMatches, getRecentMatches } from '@/features/matches/queries'
import { getAppStats } from '@/features/stats/queries'
import { MatchCard } from '@/components/match/match-card'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Users, Calendar } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rate Your Match | FIFA World Cup 2026 Fan Ratings & Predictions',
  description: 'Rate every World Cup 2026 match, vote on Referee, Tactics, and VAR quality, and predict match outcomes with the ultimate football fan community.',
}

export default async function HomePage() {
  // Parallel fetch to optimize page load
  const [topRated, upcoming, recent, stats] = await Promise.all([
    getTopRatedMatches(3),
    getUpcomingMatches(3),
    getRecentMatches(3),
    getAppStats(),
  ])

  return (
    <main className="flex-1 flex flex-col bg-[#0a0d14]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4 md:pt-48 md:pb-32 text-center">
        {/* Background Void */}
        
        <div className="relative z-10 container mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-[#fefcfb] leading-[1.1]">
            Rate Every<br />World Cup Match
          </h1>
          <p className="text-lg md:text-xl text-[#b8b9bc] max-w-2xl mx-auto font-medium tracking-tight">
            World Cup 2026 is here. Join the community of football fans, rate the matches, and crown the best game of the tournament.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 w-full sm:w-auto">
            <Link href="/matches" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[#fefcfb] hover:bg-[#e6e4e3] text-[#0a0d14] font-bold px-10 py-6 text-base cursor-pointer rounded-full shadow-[0_0_40px_-10px_rgba(254,252,251,0.3)] transition-all">
                View Matches & Rate
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto text-[#b8b9bc] hover:text-[#fefcfb] hover:bg-white/5 px-10 py-6 text-base cursor-pointer rounded-full font-medium transition-all">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 -mt-8 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-row justify-center items-center gap-6 sm:gap-12 md:gap-20 text-center">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fefcfb] tracking-tight">{stats.matchesCount}</span>
              <span className="text-[10px] md:text-xs text-[#b8b9bc] font-semibold uppercase tracking-widest flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-[#9868cc]" /> Matches
              </span>
            </div>
            <div className="w-px h-10 sm:h-12 bg-white/10"></div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fefcfb] tracking-tight">{stats.ratingsCount}</span>
              <span className="text-[10px] md:text-xs text-[#b8b9bc] font-semibold uppercase tracking-widest flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5">
                <Star className="h-3.5 w-3.5 text-[#9868cc]" /> Ratings
              </span>
            </div>
            <div className="w-px h-10 sm:h-12 bg-white/10"></div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fefcfb] tracking-tight">{stats.profilesCount}</span>
              <span className="text-[10px] md:text-xs text-[#b8b9bc] font-semibold uppercase tracking-widest flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#9868cc]" /> Fans
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="container mx-auto px-4 py-16 max-w-5xl space-y-24">
        
        {/* Top Rated Matches */}
        {topRated.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-10">
              <Trophy className="h-6 w-6 text-[#9868cc]" />
              <h2 className="text-2xl font-bold text-[#fefcfb] tracking-tight">Highest Rated Matches</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topRated.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        <div className="space-y-8">
          <div className="flex items-center justify-center space-x-3 mb-10">
            <Calendar className="h-6 w-6 text-[#9868cc]" />
            <h2 className="text-2xl font-bold text-[#fefcfb] tracking-tight">Upcoming Fixtures</h2>
          </div>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#b8b9bc] py-4 text-center">No upcoming fixtures scheduled.</p>
          )}
          <div className="flex justify-center pt-4">
            <Link href="/matches">
              <Button variant="ghost" className="text-[#b8b9bc] hover:text-[#fefcfb] hover:bg-white/5 rounded-full px-6">
                See all fixtures →
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Matches */}
        {recent.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-10">
              <Star className="h-6 w-6 text-[#9868cc]" />
              <h2 className="text-2xl font-bold text-[#fefcfb] tracking-tight">Recently Finished</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  )
}
