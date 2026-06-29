import { getMatches } from '@/features/matches/queries'
import { MatchFilters } from '@/components/match/match-filters'
import { MatchList } from '@/components/match/match-list'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Matches | Rate Your Match',
  description: 'Browse, predict, and rate every World Cup 2026 match. Filter by group stage, knockout rounds, or team details.',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MatchesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const stage = typeof resolvedSearchParams.stage === 'string' ? resolvedSearchParams.stage : undefined
  const group = typeof resolvedSearchParams.group === 'string' ? resolvedSearchParams.group : undefined

  // Fetch matches from server-side query
  const matches = await getMatches({ stage, group })

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          FIFA World Cup 2026 Matches
        </h1>
        <p className="text-sm text-zinc-400">
          Browse fixtures and view community ratings for all matches.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 items-start">
        {/* Filters */}
        <div className="lg:col-span-1 lg:sticky lg:top-20">
          <MatchFilters />
        </div>

        {/* Match List */}
        <div className="lg:col-span-3">
          <MatchList matches={matches} />
        </div>
      </div>
    </main>
  )
}
