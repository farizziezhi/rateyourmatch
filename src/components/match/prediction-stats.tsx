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
        <h3 className="text-sm font-bold text-zinc-200 flex items-center space-x-1.5">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span>Community Predictions</span>
        </h3>
        <span className="text-[10px] text-zinc-400 font-bold flex items-center bg-zinc-950/60 border border-zinc-800 px-2 py-0.5 rounded-full">
          <Users className="h-3 w-3 mr-1 text-emerald-400" />
          {totalPredictions} {totalPredictions === 1 ? 'vote' : 'votes'}
        </span>
      </div>

      {/* Average Predicted Score */}
      <div className="flex flex-col items-center justify-center space-y-1.5 py-2">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
          Average Forecasted Score
        </span>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-zinc-400 truncate max-w-[120px]">
            {homeTeamName}
          </span>
          <div className="bg-zinc-950/80 border border-zinc-850 px-4 py-2 rounded-xl text-xl font-black text-emerald-450 flex items-center space-x-2 shadow-inner">
            <span>{avgHomeScore.toFixed(1)}</span>
            <span className="text-zinc-700 text-sm font-normal">-</span>
            <span>{avgAwayScore.toFixed(1)}</span>
          </div>
          <span className="text-xs font-bold text-zinc-400 truncate max-w-[120px]">
            {awayTeamName}
          </span>
        </div>
      </div>

      {/* Segmented win/draw/loss bar */}
      <div className="space-y-3">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block text-center">
          Outcome Forecast
        </span>
        
        {/* Segmented progress bar */}
        <div className="h-4 w-full rounded-full bg-zinc-950 overflow-hidden flex border border-zinc-850 shadow-inner">
          <div
            style={{ width: `${homeWinPct}%` }}
            className="h-full bg-emerald-700 transition-all"
            title={`${homeTeamName} Win: ${homeWinPct}%`}
          />
          <div
            style={{ width: `${drawPct}%` }}
            className="h-full bg-zinc-700 transition-all"
            title={`Draw: ${drawPct}%`}
          />
          <div
            style={{ width: `${awayWinPct}%` }}
            className="h-full bg-sky-700 transition-all"
            title={`${awayTeamName} Win: ${awayWinPct}%`}
          />
        </div>

        {/* Legend / Info under the bar */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="space-y-0.5">
            <span className="block text-[10px] text-zinc-500 font-medium truncate">{homeTeamName} Win</span>
            <span className="font-extrabold text-emerald-450">{homeWinPct}%</span>
          </div>
          <div className="space-y-0.5 border-x border-zinc-800/80">
            <span className="block text-[10px] text-zinc-500 font-medium">Draw</span>
            <span className="font-extrabold text-zinc-400">{drawPct}%</span>
          </div>
          <div className="space-y-0.5">
            <span className="block text-[10px] text-zinc-500 font-medium truncate">{awayTeamName} Win</span>
            <span className="font-extrabold text-sky-450">{awayWinPct}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
