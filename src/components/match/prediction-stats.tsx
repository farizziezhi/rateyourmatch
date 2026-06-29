import * as React from 'react'
import { PredictionStats as StatsType } from '@/features/predictions/queries'
import { TrendingUp, Users } from 'lucide-react'

interface PredictionStatsProps {
  stats: StatsType
  homeTeamName: string
  awayTeamName: string
}

export function PredictionStats({
  stats,
  homeTeamName,
  awayTeamName,
}: PredictionStatsProps) {
  const { avgHomeScore, avgAwayScore, totalPredictions, homeWinPct, awayWinPct, drawPct } = stats

  if (totalPredictions === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl text-center shadow-xl">
        <p className="text-sm text-zinc-400">No predictions submitted yet.</p>
        <p className="text-[10px] text-zinc-550 mt-1">Be the first to predict the outcome!</p>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <h3 className="text-sm font-bold text-[#fefcfb] flex items-center space-x-1.5">
          <TrendingUp className="h-4 w-4 text-[#9868cc]" />
          <span>Community Predictions</span>
        </h3>
        <span className="text-[10px] text-[#b8b9bc] font-bold flex items-center bg-[#1e1d1d]/60 border border-[#1e1d1d] px-2 py-0.5 rounded-full">
          <Users className="h-3 w-3 mr-1 text-[#9868cc]" />
          {totalPredictions} {totalPredictions === 1 ? 'vote' : 'votes'}
        </span>
      </div>

      {/* Average Predicted Score */}
      <div className="flex flex-col items-center justify-center space-y-1.5 py-2">
        <span className="text-[10px] text-[#b8b9bc] uppercase tracking-wider font-bold">
          Average Forecasted Score
        </span>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-[#b8b9bc] truncate max-w-[120px]">
            {homeTeamName}
          </span>
          <div className="bg-[#1e1d1d]/80 border border-[#1e1d1d] px-4 py-2 rounded-xl text-xl font-black text-[#fefcfb] flex items-center space-x-2 shadow-inner shadow-black/30">
            <span>{avgHomeScore.toFixed(1)}</span>
            <span className="text-[#b8b9bc] text-sm font-normal">-</span>
            <span>{avgAwayScore.toFixed(1)}</span>
          </div>
          <span className="text-xs font-bold text-[#b8b9bc] truncate max-w-[120px]">
            {awayTeamName}
          </span>
        </div>
      </div>

      {/* Segmented win/draw/loss bar */}
      <div className="space-y-3">
        <span className="text-[10px] text-[#b8b9bc] uppercase tracking-wider font-bold block text-center">
          Outcome Forecast
        </span>
        
        {/* Segmented progress bar */}
        <div className="h-4 w-full rounded-full bg-[#161e29] overflow-hidden flex border border-[#1e1d1d] shadow-inner shadow-black/50">
          <div
            style={{ width: `${homeWinPct}%` }}
            className="h-full bg-[#5f4dbd] transition-all"
            title={`${homeTeamName} Win: ${homeWinPct}%`}
          />
          <div
            style={{ width: `${drawPct}%` }}
            className="h-full bg-[#1e1d1d] transition-all"
            title={`Draw: ${drawPct}%`}
          />
          <div
            style={{ width: `${awayWinPct}%` }}
            className="h-full bg-[#9868cc] transition-all"
            title={`${awayTeamName} Win: ${awayWinPct}%`}
          />
        </div>

        {/* Legend / Info under the bar */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="space-y-0.5">
            <span className="block text-[10px] text-[#b8b9bc] font-medium truncate">{homeTeamName} Win</span>
            <span className="font-extrabold text-[#fefcfb]">{homeWinPct}%</span>
          </div>
          <div className="space-y-0.5 border-x border-[#1e1d1d]">
            <span className="block text-[10px] text-[#b8b9bc] font-medium">Draw</span>
            <span className="font-extrabold text-[#b8b9bc]">{drawPct}%</span>
          </div>
          <div className="space-y-0.5">
            <span className="block text-[10px] text-[#b8b9bc] font-medium truncate">{awayTeamName} Win</span>
            <span className="font-extrabold text-[#9868cc]">{awayWinPct}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
