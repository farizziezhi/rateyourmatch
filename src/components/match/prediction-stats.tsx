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
      <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl text-center backdrop-blur-md">
        <p className="text-sm text-zinc-400">No predictions submitted yet.</p>
        <p className="text-[10px] text-zinc-650 mt-1">Be the first to predict the outcome!</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl backdrop-blur-md space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
        <h3 className="text-sm font-bold text-zinc-200 flex items-center space-x-1.5">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span>Community Predictions</span>
        </h3>
        <span className="text-[10px] text-zinc-500 font-semibold flex items-center bg-zinc-950/60 border border-zinc-800 px-2 py-0.5 rounded">
          <Users className="h-3 w-3 mr-1 text-emerald-400" />
          {totalPredictions} {totalPredictions === 1 ? 'vote' : 'votes'}
        </span>
      </div>

      {/* Average Predicted Score */}
      <div className="flex flex-col items-center justify-center space-y-1.5 py-2">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
          Average Forecasted Score
        </span>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-bold text-zinc-300 truncate max-w-[120px]">
            {homeTeamName}
          </span>
          <div className="bg-zinc-950/60 border border-zinc-850 px-4 py-2 rounded-xl text-xl font-extrabold text-emerald-400 flex items-center space-x-2">
            <span>{avgHomeScore.toFixed(1)}</span>
            <span className="text-zinc-700 text-sm font-normal">-</span>
            <span>{avgAwayScore.toFixed(1)}</span>
          </div>
          <span className="text-sm font-bold text-zinc-300 truncate max-w-[120px]">
            {awayTeamName}
          </span>
        </div>
      </div>

      {/* Segmented win/draw/loss bar */}
      <div className="space-y-3">
        <span className="text-[10px] text-zinc-550 uppercase tracking-wider font-semibold block text-center">
          Outcome Forecast
        </span>
        
        {/* Segmented progress bar */}
        <div className="h-4 w-full rounded-full bg-zinc-950 overflow-hidden flex border border-zinc-850">
          <div
            style={{ width: `${homeWinPct}%` }}
            className="h-full bg-emerald-500/80 transition-all"
            title={`Home Win: ${homeWinPct}%`}
          />
          <div
            style={{ width: `${drawPct}%` }}
            className="h-full bg-zinc-600/80 transition-all"
            title={`Draw: ${drawPct}%`}
          />
          <div
            style={{ width: `${awayWinPct}%` }}
            className="h-full bg-sky-500/80 transition-all"
            title={`Away Win: ${awayWinPct}%`}
          />
        </div>

        {/* Legend / Info under the bar */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="space-y-0.5">
            <span className="block text-[10px] text-zinc-500 font-medium truncate">{homeTeamName} Win</span>
            <span className="font-extrabold text-emerald-400">{homeWinPct}%</span>
          </div>
          <div className="space-y-0.5 border-x border-zinc-850">
            <span className="block text-[10px] text-zinc-500 font-medium">Draw</span>
            <span className="font-extrabold text-zinc-400">{drawPct}%</span>
          </div>
          <div className="space-y-0.5">
            <span className="block text-[10px] text-zinc-500 font-medium truncate">{awayTeamName} Win</span>
            <span className="font-extrabold text-sky-400">{awayWinPct}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
