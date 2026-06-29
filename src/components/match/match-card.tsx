import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { formatStageName } from '@/lib/utils'

interface Team {
  name: string
  short_name: string
  tla: string
  crest_url: string
}

interface MatchCardProps {
  match: {
    id: number
    utc_date: string
    stage: string
    status: string
    home_score: number | null
    away_score: number | null
    rating_avg: number
    rating_count: number
    home_team: Team | null
    away_team: Team | null
    venue: string | null
  }
}

export function MatchCard({ match }: MatchCardProps) {
  const date = new Date(match.utc_date)
  const formattedDate = format(date, 'MMM dd, HH:mm')
  const isFinished = match.status === 'FINISHED'
  
  // Dynamic color for community rating
  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    if (rating >= 5.5) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
    if (rating > 0) return 'text-orange-400 border-orange-500/30 bg-orange-500/10'
    return 'text-zinc-500 border-zinc-800 bg-zinc-900/50'
  }

  const formatStage = (stage: string) => {
    return formatStageName(stage)
  }

  return (
    <Link href={`/matches/${match.id}`} className="block group">
      <Card className="overflow-hidden border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all duration-300 group-hover:border-zinc-700 shadow-lg">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          {/* Header Info */}
          <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-800/60 pb-2">
            <span>{formatStage(match.stage)}</span>
            <span className="font-medium text-zinc-400">{formattedDate} UTC</span>
          </div>

          {/* Teams and Scores */}
          <div className="flex flex-col space-y-3 py-1">
            {/* Home Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {match.home_team?.crest_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={match.home_team.crest_url}
                    alt={match.home_team.name}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                    {match.home_team?.tla || 'H'}
                  </div>
                )}
                <span className="text-sm font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
                  {match.home_team?.name || 'TBD'}
                </span>
              </div>
              <span className="text-base font-bold text-zinc-100">
                {match.home_score ?? '-'}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {match.away_team?.crest_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={match.away_team.crest_url}
                    alt={match.away_team.name}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                    {match.away_team?.tla || 'A'}
                  </div>
                )}
                <span className="text-sm font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
                  {match.away_team?.name || 'TBD'}
                </span>
              </div>
              <span className="text-base font-bold text-zinc-100">
                {match.away_score ?? '-'}
              </span>
            </div>
          </div>

          {/* Footer Community Rating / Status */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
            <div className="flex items-center space-x-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isFinished ? 'bg-zinc-800 text-zinc-400 border-zinc-700/50' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {match.status}
              </span>
            </div>
            
            {/* Community Rating */}
            <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-md border font-semibold ${getRatingColor(Number(match.rating_avg))}`}>
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{match.rating_avg > 0 ? Number(match.rating_avg).toFixed(1) : 'No Ratings'}</span>
              {match.rating_count > 0 && (
                <span className="text-[10px] text-zinc-500 font-normal ml-0.5">({match.rating_count})</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
