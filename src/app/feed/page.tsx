import { getRecentActivity } from '@/features/feed/queries'
import { Card, CardContent } from '@/components/ui/card'
import { Star, MessageSquare, Clock, Globe } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Metadata } from 'next'
import { formatStageName } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Community Activity Feed | Rate Your Match',
  description: 'See live fan ratings, comment discussions, and forecasts submitted by the World Cup football community.',
}

export default async function FeedPage() {
  const feed = await getRecentActivity(15)

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 border-b border-zinc-900 pb-4">
        <div className="flex items-center space-x-2 text-emerald-400">
          <Globe className="h-5 w-5" />
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100">
            Community Activity
          </h1>
        </div>
        <p className="text-xs text-zinc-500">
          See what other fans are rating and saying about World Cup matches in real-time.
        </p>
      </div>

      <div className="space-y-4">
        {feed.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800 bg-zinc-950/20 rounded-xl">
            <p className="text-sm text-zinc-500">No activity yet. Be the first to rate a match!</p>
          </div>
        ) : (
          feed.map((item) => {
            const date = new Date(item.created_at)
            const match = item.match
            const profile = item.profile

            return (
              <Card key={item.id} className="border-zinc-800/80 bg-zinc-900/20 hover:border-zinc-700/60 transition-colors">
                <CardContent className="p-4 flex flex-col space-y-3">
                  {/* Top user action row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Link href={`/profiles/${profile?.username || ''}`} className="font-bold text-zinc-200 hover:text-emerald-400 truncate">
                        {profile?.display_name || profile?.username || 'User'}
                      </Link>
                      <span className="text-zinc-700">•</span>
                      <span className="text-zinc-550 text-[10px] flex items-center space-x-1 whitespace-nowrap" suppressHydrationWarning>
                        <Clock className="h-3 w-3 mr-0.5" />
                        {formatDistanceToNow(date, { addSuffix: true })}
                      </span>
                    </div>

                    {/* Action badge */}
                    {item.type === 'rating' ? (
                      <span className="flex items-center space-x-1 text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-semibold">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Rated</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-[10px] bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded text-teal-400 font-semibold">
                        <MessageSquare className="h-3 w-3" />
                        <span>Commented</span>
                      </span>
                    )}
                  </div>

                  {/* Middle match description row */}
                  <div className="text-xs bg-zinc-950/40 p-2.5 rounded border border-zinc-900 flex items-center justify-between">
                    <Link href={`/matches/${item.match_id}`} className="font-medium text-zinc-400 hover:text-emerald-400 truncate">
                      {match?.home_team?.name} vs {match?.away_team?.name}
                    </Link>
                    <span className="text-zinc-500 text-[10px] font-semibold tracking-wider uppercase ml-2 whitespace-nowrap">
                      {match && formatStageName(match.stage)}
                    </span>
                  </div>

                  {/* Bottom custom detail row */}
                  {item.type === 'rating' ? (
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-zinc-500">Gave a rating of</span>
                      <div className="flex items-center space-x-1 text-zinc-100 font-extrabold text-sm bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                        <span>{item.score}</span>
                        <span className="text-zinc-650 font-normal text-xs">/ 10</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-300 italic pl-2 border-l border-zinc-800 break-words">
                      &ldquo;{item.content}&rdquo;
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </main>
  )
}
