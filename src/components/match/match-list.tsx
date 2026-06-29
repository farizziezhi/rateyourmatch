import { MatchCard } from './match-card'

interface MatchListProps {
  matches: any[]
}

export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-lg bg-zinc-950/40 text-center">
        <p className="text-zinc-400 font-medium">No matches found matching the criteria.</p>
        <p className="text-xs text-zinc-600 mt-1">Try resetting the filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
