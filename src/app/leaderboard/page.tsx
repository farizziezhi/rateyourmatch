import { getLeaderboard } from '@/features/profiles/queries'
import { Trophy, Star, Award, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Leaderboard | Rate Your Match',
  description: 'See the top football fans on Rate Your Match ranked by reputation score and match ratings.',
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard(50)

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl flex flex-col space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-2 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tighter text-[#fefcfb]">
          Community Leaderboard
        </h1>
        <p className="text-sm text-[#b8b9bc]">
          Top predictors and contributors in the Rate Your Match community. Rank is determined by Reputation Score and Total Ratings.
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl border border-[#1e1d1d] text-center">
          <ShieldAlert className="h-10 w-10 text-[#b8b9bc] mb-4" />
          <p className="text-sm text-[#b8b9bc]">No profiles registered on the leaderboard yet.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {/* Top 3 Podiums (Optional custom highlight layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
            {/* 2nd Place */}
            {leaderboard[1] && (
              <div className="order-2 md:order-1 glass-panel p-6 rounded-2xl border border-[#1e1d1d] bg-[#161e29]/40 flex flex-col items-center text-center space-y-3 md:h-[220px] justify-center relative overflow-hidden">
                <div className="absolute top-3 left-3 bg-[#b8b9bc]/20 text-[#b8b9bc] text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#b8b9bc]/20">
                  #2
                </div>
                <div className="h-14 w-14 rounded-full bg-[#1e1d1d] flex items-center justify-center text-xl font-bold text-[#b8b9bc] border border-[#1e1d1d] shadow-[0_0_20px_rgba(184,185,188,0.05)]">
                  {leaderboard[1].username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <Link href={`/profiles/${leaderboard[1].username}`} className="font-bold text-[#fefcfb] hover:text-[#9868cc] transition-colors block truncate max-w-[180px]">
                    {leaderboard[1].display_name || leaderboard[1].username}
                  </Link>
                  <p className="text-[10px] text-[#b8b9bc]">@{leaderboard[1].username}</p>
                </div>
                <div className="flex justify-between w-full border-t border-[#1e1d1d] pt-3 text-xs text-[#b8b9bc]">
                  <div>
                    <span className="block font-bold text-[#fefcfb]">{leaderboard[1].reputation_score || 0}</span>
                    <span>Rep</span>
                  </div>
                  <div className="w-px bg-[#1e1d1d]" />
                  <div>
                    <span className="block font-bold text-[#fefcfb]">{leaderboard[1].total_ratings || 0}</span>
                    <span>Ratings</span>
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {leaderboard[0] && (
              <div className="order-1 md:order-2 glass-panel p-8 rounded-2xl border border-[#9868cc]/30 bg-[#161e29]/60 flex flex-col items-center text-center space-y-4 md:h-[260px] justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-[#9868cc]/20 text-[#9868cc] text-xs font-extrabold px-3 py-1 rounded-full border border-[#9868cc]/30 flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> #1
                </div>
                <div className="h-16 w-16 rounded-full bg-[#1e1d1d] flex items-center justify-center text-2xl font-bold text-[#9868cc] border border-[#9868cc]/40 shadow-[0_0_30px_rgba(152,104,204,0.15)] relative">
                  {leaderboard[0].username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <Link href={`/profiles/${leaderboard[0].username}`} className="font-extrabold text-[#fefcfb] hover:text-[#9868cc] transition-colors block text-lg truncate max-w-[200px]">
                    {leaderboard[0].display_name || leaderboard[0].username}
                  </Link>
                  <p className="text-xs text-[#b8b9bc]">@{leaderboard[0].username}</p>
                </div>
                <div className="flex justify-between w-full border-t border-[#1e1d1d] pt-3 text-xs text-[#b8b9bc]">
                  <div>
                    <span className="block font-extrabold text-[#9868cc]">{leaderboard[0].reputation_score || 0}</span>
                    <span>Reputation</span>
                  </div>
                  <div className="w-px bg-[#1e1d1d]" />
                  <div>
                    <span className="block font-extrabold text-[#fefcfb]">{leaderboard[0].total_ratings || 0}</span>
                    <span>Ratings</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {leaderboard[2] && (
              <div className="order-3 glass-panel p-6 rounded-2xl border border-[#1e1d1d] bg-[#161e29]/40 flex flex-col items-center text-center space-y-3 md:h-[220px] justify-center relative overflow-hidden">
                <div className="absolute top-3 left-3 bg-[#5f4dbd]/20 text-[#9868cc] text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#5f4dbd]/20">
                  #3
                </div>
                <div className="h-14 w-14 rounded-full bg-[#1e1d1d] flex items-center justify-center text-xl font-bold text-[#b8b9bc] border border-[#1e1d1d] shadow-[0_0_20px_rgba(95,77,189,0.05)]">
                  {leaderboard[2].username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <Link href={`/profiles/${leaderboard[2].username}`} className="font-bold text-[#fefcfb] hover:text-[#9868cc] transition-colors block truncate max-w-[180px]">
                    {leaderboard[2].display_name || leaderboard[2].username}
                  </Link>
                  <p className="text-[10px] text-[#b8b9bc]">@{leaderboard[2].username}</p>
                </div>
                <div className="flex justify-between w-full border-t border-[#1e1d1d] pt-3 text-xs text-[#b8b9bc]">
                  <div>
                    <span className="block font-bold text-[#fefcfb]">{leaderboard[2].reputation_score || 0}</span>
                    <span>Rep</span>
                  </div>
                  <div className="w-px bg-[#1e1d1d]" />
                  <div>
                    <span className="block font-bold text-[#fefcfb]">{leaderboard[2].total_ratings || 0}</span>
                    <span>Ratings</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Table List (Rest of Users) */}
          <div className="glass-panel rounded-2xl border border-[#1e1d1d] overflow-hidden">
            <div className="divide-y divide-[#1e1d1d]">
              {leaderboard.map((user, index) => {
                // Skip rendering podiums in the table if they are top 3
                if (index < 3) return null

                return (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-[#161e29]/20 transition-colors">
                    <div className="flex items-center space-x-4">
                      {/* Rank Number */}
                      <span className="text-sm font-extrabold text-[#b8b9bc] w-6 text-center">
                        #{index + 1}
                      </span>
                      {/* Avatar */}
                      <div className="h-10 w-10 rounded-full bg-[#1e1d1d] flex items-center justify-center text-sm font-bold text-[#b8b9bc] border border-[#1e1d1d]">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      {/* Name */}
                      <div>
                        <Link href={`/profiles/${user.username}`} className="font-bold text-[#fefcfb] hover:text-[#9868cc] transition-colors">
                          {user.display_name || user.username}
                        </Link>
                        <p className="text-[10px] text-[#b8b9bc]">@{user.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8 text-right">
                      <div>
                        <span className="block text-sm font-extrabold text-[#9868cc]">{user.reputation_score || 0}</span>
                        <span className="text-[9px] uppercase tracking-wider text-[#b8b9bc]">Reputation</span>
                      </div>
                      <div className="w-px h-6 bg-[#1e1d1d]" />
                      <div className="w-16">
                        <span className="block text-sm font-bold text-[#fefcfb]">{user.total_ratings || 0}</span>
                        <span className="text-[9px] uppercase tracking-wider text-[#b8b9bc]">Ratings</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
