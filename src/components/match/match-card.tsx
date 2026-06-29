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
  
  // Dynamic color for community rating based on Pally palette
  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) return 'text-[#fefcfb] border-[#5f4dbd]/30 bg-[#5f4dbd]/10'
    if (rating >= 5.5) return 'text-[#d0d0d1] border-[#1e1d1d] bg-[#1e1d1d]'
    if (rating > 0) return 'text-[#b8b9bc] border-transparent bg-transparent'
    return 'text-[#8a8d92] border-transparent bg-transparent'
  }

  const formatStage = (stage: string) => {
    return formatStageName(stage)
  }

  return (
    <Link href={`/matches/${match.id}`} className="block group">
      <Card className="glass-panel glass-panel-hover overflow-hidden shadow-none">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          {/* Header Info */}
          <div className="flex items-center justify-between text-xs text-[#8a8d92] border-b border-[#1e1d1d] pb-2">
            <span className="font-semibold text-[10px] tracking-wider uppercase text-[#9868cc]">{formatStage(match.stage)}</span>
            <span className="font-medium text-[#8a8d92]">{formattedDate} UTC</span>
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
                  <div className="h-6 w-6 rounded-full bg-[#1e1d1d] flex items-center justify-center text-[10px] font-bold text-[#b8b9bc]">
                    {match.home_team?.tla || 'H'}
                  </div>
                )}
                <span className="text-sm font-medium text-[#d0d0d1] group-hover:text-[#fefcfb] transition-colors">
                  {match.home_team?.name || 'TBD'}
                </span>
              </div>
              <span className="text-base font-medium text-[#fefcfb]">
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
                  <div className="h-6 w-6 rounded-full bg-[#1e1d1d] flex items-center justify-center text-[10px] font-bold text-[#b8b9bc]">
                    {match.away_team?.tla || 'A'}
                  </div>
                )}
                <span className="text-sm font-medium text-[#d0d0d1] group-hover:text-[#fefcfb] transition-colors">
                  {match.away_team?.name || 'TBD'}
                </span>
              </div>
              <span className="text-base font-medium text-[#fefcfb]">
                {match.away_score ?? '-'}
              </span>
            </div>
          </div>

          {/* Footer Community Rating / Status */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1e1d1d] text-xs">
            <div className="flex items-center space-x-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${
                match.status === 'FINISHED'
                  ? 'bg-[#1e1d1d] text-[#b8b9bc] border-transparent'
                  : match.status === 'IN_PLAY' || match.status === 'LIVE'
                  ? 'bg-[#5f4dbd]/20 text-[#fefcfb] border-[#5f4dbd]/30'
                  : 'bg-transparent text-[#eae5dd] border-[#1e1d1d]'
              }`}>
                {match.status === 'FINISHED' ? 'Full Time' : match.status === 'IN_PLAY' || match.status === 'LIVE' ? 'Live' : 'Upcoming'}
              </span>
            </div>
            
            {/* Community Rating */}
            <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border font-medium text-[11px] ${getRatingColor(Number(match.rating_avg))}`}>
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{match.rating_avg > 0 ? Number(match.rating_avg).toFixed(1) : 'No Ratings'}</span>
              {match.rating_count > 0 && (
                <span className="text-[9px] opacity-60 font-normal ml-0.5">({match.rating_count})</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
