import { getMatchById } from '@/features/matches/queries'
import { getRatingDistribution, getUserRatingForMatch, getUserTechnicalRatingForMatch } from '@/features/ratings/queries'
import { getCommentsForMatch } from '@/features/comments/queries'
import { getCurrentUser } from '@/features/auth/queries'
import { RatingForm } from '@/components/rating/rating-form'
import { RatingDistribution } from '@/components/rating/rating-distribution'
import { MatchComments } from '@/components/match/match-comments'
import { ShareButtons } from '@/components/match/share-buttons'
import { getUserPrediction, getMatchPredictionStats } from '@/features/predictions/queries'
import { PredictionForm } from '@/components/match/prediction-form'
import { PredictionStats } from '@/components/match/prediction-stats'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Star, MapPin, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import { formatStageName } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const matchId = parseInt(resolvedParams.id, 10)

  if (isNaN(matchId)) {
    return {}
  }

  const match = await getMatchById(matchId)
  if (!match) {
    return {
      title: 'Match Not Found - Rate Your Match',
    }
  }

  const homeName = match.home_team?.name || 'TBD'
  const awayName = match.away_team?.name || 'TBD'
  const isFinished = match.status === 'FINISHED'
  
  let title = `${homeName} vs ${awayName} Match Rating & Predictions | Rate Your Match`
  let description = `Predict and rate the FIFA World Cup 2026 match: ${homeName} vs ${awayName}. See community rating statistics.`

  if (isFinished) {
    const scoreText = `${match.home_score}-${match.away_score}`
    const ratingText = match.rating_count > 0 ? ` (Fan Rating: ${Number(match.rating_avg).toFixed(1)}/10)` : ''
    title = `${homeName} ${scoreText} ${awayName} Match Fan Rating${ratingText} | Rate Your Match`
    description = `View fan ratings, technical ratings (referee, tactics, VAR) and match discussion for ${homeName} vs ${awayName} which ended ${scoreText}.`
  }

  const ogImageUrl = `/api/og/match/${match.id}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${homeName} vs ${awayName} Social Preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function MatchDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const matchId = parseInt(resolvedParams.id, 10)

  if (isNaN(matchId)) {
    notFound()
  }

  const match = await getMatchById(matchId)
  if (!match) {
    notFound()
  }

  // Get current user auth state
  const session = await getCurrentUser()
  const userId = session?.user?.id

  // Fetch current user rating if signed in
  const userRating = userId ? await getUserRatingForMatch(match.id, userId) : null
  const userTechRating = userId ? await getUserTechnicalRatingForMatch(match.id, userId) : null

  // Fetch rating distribution
  const distribution = await getRatingDistribution(match.id)

  // Fetch comments
  const comments = await getCommentsForMatch(match.id)

  const matchDate = new Date(match.utc_date)
  const isFinished = match.status === 'FINISHED'

  // Fetch prediction if not finished
  const userPrediction = userId && !isFinished ? await getUserPrediction(match.id, userId) : null
  const predictionStats = !isFinished ? await getMatchPredictionStats(match.id) : null

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl flex flex-col space-y-8">
      {/* Back button */}
      <div>
        <Link href="/matches" className="text-xs font-semibold text-emerald-400 hover:underline">
          &larr; Back to Matches
        </Link>
      </div>

      {/* Match Scoreboard Hero */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 md:p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl">
        {/* Glowing backdrop blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

        {/* Stage and Venue */}
        <div className="flex flex-col items-center space-y-1 text-xs text-zinc-500 z-10">
          <span className="font-extrabold tracking-wider uppercase text-emerald-400">
            {formatStageName(match.stage)}
          </span>
          <div className="flex items-center space-x-3 text-zinc-400 mt-1">
            {match.venue && (
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{match.venue}</span>
              </span>
            )}
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{format(matchDate, 'PPP')}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{format(matchDate, 'p')} UTC</span>
            </span>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="flex items-center justify-between w-full max-w-xl z-10 py-2">
          {/* Home Team */}
          <div className="flex flex-col items-center space-y-3 w-5/12 text-center group">
            {match.home_team?.crest_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.home_team.crest_url} alt={match.home_team.name} className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-[0_4px_10px_rgba(255,255,255,0.05)] transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-400">
                {match.home_team?.tla || 'H'}
              </div>
            )}
            <span className="text-sm md:text-base font-extrabold text-zinc-100 group-hover:text-emerald-400 transition-colors tracking-tight">{match.home_team?.name || 'TBD'}</span>
            <span className="text-[10px] text-zinc-400 font-bold px-2 py-0.5 rounded-full bg-zinc-900/80 border border-zinc-850">
              Group {match.home_team?.group_letter || '-'}
            </span>
          </div>

          {/* Scores or vs */}
          <div className="flex flex-col items-center justify-center w-2/12 space-y-3">
            {isFinished ? (
              <div className="flex items-center space-x-1.5 md:space-x-2.5 text-3xl md:text-5xl font-black font-mono text-zinc-100 tracking-wider">
                <span className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-inner">{match.home_score}</span>
                <span className="text-zinc-600 font-sans text-2xl">:</span>
                <span className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-inner">{match.away_score}</span>
              </div>
            ) : (
              <span className="text-lg md:text-xl font-black text-zinc-500 uppercase tracking-widest bg-zinc-900/60 border border-zinc-850 px-3 py-1 rounded-lg">VS</span>
            )}
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
              match.status === 'FINISHED'
                ? 'bg-zinc-850/80 text-zinc-400 border-zinc-700/40'
                : match.status === 'IN_PLAY' || match.status === 'LIVE'
                ? 'bg-red-500/10 text-red-400 border-red-500/25 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            }`}>
              {match.status === 'FINISHED' ? 'Full Time' : match.status === 'IN_PLAY' || match.status === 'LIVE' ? 'Live' : 'Upcoming'}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center space-y-3 w-5/12 text-center group">
            {match.away_team?.crest_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.away_team.crest_url} alt={match.away_team.name} className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-[0_4px_10px_rgba(255,255,255,0.05)] transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-400">
                {match.away_team?.tla || 'A'}
              </div>
            )}
            <span className="text-sm md:text-base font-extrabold text-zinc-100 group-hover:text-emerald-400 transition-colors tracking-tight">{match.away_team?.name || 'TBD'}</span>
            <span className="text-[10px] text-zinc-400 font-bold px-2 py-0.5 rounded-full bg-zinc-900/80 border border-zinc-850">
              Group {match.away_team?.group_letter || '-'}
            </span>
          </div>
        </div>

        {/* Global Rating Stats */}
        {match.rating_count > 0 && (
          <div className="flex flex-col items-center space-y-4 z-10 w-full pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Community Rating</span>
              <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-emerald-400 font-extrabold text-sm">
                <Star className="h-4 w-4 fill-current mr-0.5" />
                <span>{Number(match.rating_avg).toFixed(1)}</span>
              </div>
              <span className="text-zinc-500 text-xs font-medium">({match.rating_count} ratings)</span>
            </div>
            
            {/* Technical averages */}
            <div className="grid grid-cols-3 gap-3 text-center text-[10px] border-t border-zinc-850 pt-4 w-full max-w-sm">
              <div className="bg-zinc-900/30 border border-zinc-850 px-2 py-2 rounded-lg">
                <span className="text-zinc-500 block font-bold uppercase tracking-wider mb-0.5">Referee</span>
                <span className="text-zinc-200 font-extrabold text-xs">{Number(match.referee_avg || 0).toFixed(1)}</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-850 px-2 py-2 rounded-lg">
                <span className="text-zinc-500 block font-bold uppercase tracking-wider mb-0.5">Tactics</span>
                <span className="text-zinc-200 font-extrabold text-xs">{Number(match.tactics_avg || 0).toFixed(1)}</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-850 px-2 py-2 rounded-lg">
                <span className="text-zinc-500 block font-bold uppercase tracking-wider mb-0.5">VAR</span>
                <span className="text-zinc-200 font-extrabold text-xs">{Number(match.var_avg || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="z-10 pt-2">
          <ShareButtons
            matchId={match.id}
            homeTeamName={match.home_team?.name || 'TBD'}
            awayTeamName={match.away_team?.name || 'TBD'}
            homeScore={match.home_score}
            awayScore={match.away_score}
          />
        </div>
      </div>

      {/* Action / Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Side: Rating Form or Prediction Form */}
        <div>
          {isFinished ? (
            <RatingForm
              matchId={match.id}
              userId={userId}
              initialOverallScore={userRating?.overall_score || 0}
              initialEntertainmentScore={userRating?.entertainment_score || 5}
              initialRefereeScore={userTechRating?.referee_score || 5}
              initialTacticsScore={userTechRating?.tactics_score || 5}
              initialVarScore={userTechRating?.var_score || 5}
            />
          ) : (
            <PredictionForm
              matchId={match.id}
              userId={userId}
              homeTeamName={match.home_team?.name || 'Home'}
              awayTeamName={match.away_team?.name || 'Away'}
              initialHomeScore={userPrediction?.home_score}
              initialAwayScore={userPrediction?.away_score}
            />
          )}
        </div>

        {/* Right Side: Rating Distribution or Prediction Stats */}
        <div>
          {isFinished ? (
            <RatingDistribution distribution={distribution} />
          ) : (
            predictionStats && (
              <PredictionStats
                stats={predictionStats}
                homeTeamName={match.home_team?.name || 'Home'}
                awayTeamName={match.away_team?.name || 'Away'}
              />
            )
          )}
        </div>
      </div>

      {/* Comments Discussion Section */}
      <div className="w-full">
        <MatchComments matchId={match.id} comments={comments} userId={userId} />
      </div>
    </main>
  )
}
