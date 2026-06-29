import { getProfileByUsername, getUserRecentRatings } from '@/features/profiles/queries'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Trophy, Award, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Metadata } from 'next'
import { formatStageName } from '@/lib/utils'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const decodedUsername = decodeURIComponent(resolvedParams.username)
  const profile = await getProfileByUsername(decodedUsername)

  if (!profile) {
    return {
      title: 'Profile Not Found | Rate Your Match',
    }
  }

  const title = `${profile.display_name || profile.username} (@${profile.username}) Fan Profile | Rate Your Match`
  const description = `Check out World Cup match ratings, score predictions, and reputation stats for ${profile.display_name || profile.username} on Rate Your Match.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const resolvedParams = await params
  const decodedUsername = decodeURIComponent(resolvedParams.username)
  
  const profile = await getProfileByUsername(decodedUsername)
  if (!profile) {
    notFound()
  }

  const ratings = await getUserRecentRatings(profile.id)
  const joinDate = new Date(profile.created_at)

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl flex flex-col space-y-8">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1e1d1d] bg-[#161e29]/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5f4dbd]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex items-center space-x-4 z-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1e1d1d] text-2xl font-bold text-[#9868cc] border border-[#1e1d1d]">
            {profile.username.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#fefcfb]">{profile.display_name || profile.username}</h1>
            <p className="text-xs text-[#b8b9bc]">@{profile.username}</p>
            <div className="flex items-center space-x-1.5 text-[#b8b9bc] text-xs mt-1">
              <Calendar className="h-3.5 w-3.5 text-[#b8b9bc]" />
              <span>Member since {format(joinDate, 'MMMM yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Reputation and Rating Stats */}
        <div className="flex items-center space-x-6 z-10 bg-[#1e1d1d]/40 border border-[#1e1d1d] p-4 rounded-xl">
          <div className="text-center">
            <span className="block text-xl font-bold text-[#fefcfb]">{ratings.length}</span>
            <span className="text-[10px] text-[#b8b9bc] font-semibold uppercase tracking-wider">Ratings</span>
          </div>
          <div className="h-8 w-px bg-[#1e1d1d]" />
          <div className="text-center">
            <span className="block text-xl font-bold text-[#9868cc]">{profile.reputation_score || 0}</span>
            <span className="text-[10px] text-[#b8b9bc] font-semibold uppercase tracking-wider flex items-center space-x-0.5">
              <Award className="h-3 w-3 text-[#9868cc] mr-0.5" />
              Reputation
            </span>
          </div>
        </div>
      </div>

      {/* Ratings History List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#fefcfb] flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-[#9868cc]" />
          <span>Recent Match Ratings</span>
        </h2>

        {ratings.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#1e1d1d] bg-[#161e29]/20 rounded-xl">
            <p className="text-sm text-[#b8b9bc]">This user hasn&apos;t rated any matches yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ratings.map((userRating: any) => {
              const match = userRating.match
              if (!match) return null

              const homeTeam = match.home_team
              const awayTeam = match.away_team
              const date = new Date(match.utc_date)

              return (
                <Card key={userRating.id} className="border-[#1e1d1d] bg-[#1e1d1d]/20 hover:border-[#5f4dbd] transition-colors rounded-2xl">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center space-x-2 text-[10px] text-[#b8b9bc]">
                        <span>{formatStageName(match.stage)}</span>
                        <span>•</span>
                        <span>{format(date, 'MMM dd, yyyy')}</span>
                      </div>
                      
                      {/* Teams display */}
                      <Link href={`/matches/${match.id}`} className="flex items-center space-x-3 text-sm font-bold text-[#fefcfb] hover:text-[#9868cc] truncate">
                        <span className="truncate">{homeTeam?.name || 'TBD'}</span>
                        <span className="text-[#b8b9bc] text-xs">({match.home_score})</span>
                        <span className="text-[#b8b9bc] font-normal">vs</span>
                        <span className="truncate">{awayTeam?.name || 'TBD'}</span>
                        <span className="text-[#b8b9bc] text-xs">({match.away_score})</span>
                      </Link>
                    </div>

                    {/* Score badge */}
                    <div className="flex items-center space-x-1 bg-[#5f4dbd]/10 border border-[#5f4dbd]/30 px-3 py-1.5 rounded-full text-[#9868cc] font-extrabold text-sm">
                      <Star className="h-4 w-4 fill-current mr-0.5" />
                      <span>{userRating.overall_score}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
