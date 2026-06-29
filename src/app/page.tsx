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
    <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 md:py-32 bg-black text-center border-b border-zinc-900">
        {/* Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-black" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        
        <div className="relative z-10 container mx-auto max-w-4xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-100 bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            Rate Every World Cup Match
          </h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
            World Cup 2026 is here. Join the community of football fans, rate the matches, and crown the best game of the tournament.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/matches">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-zinc-950 font-bold px-8 cursor-pointer">
                View Matches & Rate
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 px-8 cursor-pointer">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-zinc-950 py-8 border-b border-zinc-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <Trophy className="h-5 w-5 text-emerald-400 mb-1" />
              <span className="text-xl md:text-2xl font-bold text-zinc-200">{stats.matchesCount}</span>
              <span className="text-[10px] md:text-xs text-zinc-500 font-semibold uppercase tracking-wider">Matches</span>
            </div>
            <div className="flex flex-col items-center space-y-1 border-x border-zinc-800">
              <Star className="h-5 w-5 text-emerald-400 mb-1" />
              <span className="text-xl md:text-2xl font-bold text-zinc-200">{stats.ratingsCount}</span>
              <span className="text-[10px] md:text-xs text-zinc-500 font-semibold uppercase tracking-wider">Ratings</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Users className="h-5 w-5 text-emerald-400 mb-1" />
              <span className="text-xl md:text-2xl font-bold text-zinc-200">{stats.profilesCount}</span>
              <span className="text-[10px] md:text-xs text-zinc-500 font-semibold uppercase tracking-wider">Fans</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        
        {/* Top Rated Matches */}
        {topRated.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-zinc-200">Highest Rated Matches</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topRated.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-zinc-200">Upcoming Fixtures</h2>
            </div>
            <Link href="/matches" className="text-xs font-semibold text-zinc-400 hover:text-emerald-500 transition-colors">
              See all
            </Link>
          </div>
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 py-4 text-center">No upcoming fixtures scheduled.</p>
          )}
        </div>

        {/* Recent Matches */}
        {recent.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
              <Star className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-bold text-zinc-200">Recently Finished</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
