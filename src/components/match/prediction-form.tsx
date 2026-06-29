'use client'

import * as React from 'react'
import { useActionState, useState } from 'react'
import { submitPredictionAction } from '@/features/predictions/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface PredictionFormProps {
  matchId: number
  userId?: string
  homeTeamName: string
  awayTeamName: string
  initialHomeScore?: number
  initialAwayScore?: number
}

export function PredictionForm({
  matchId,
  userId,
  homeTeamName,
  awayTeamName,
  initialHomeScore,
  initialAwayScore,
}: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState(initialHomeScore !== undefined ? String(initialHomeScore) : '')
  const [awayScore, setAwayScore] = useState(initialAwayScore !== undefined ? String(initialAwayScore) : '')

  const [state, action, isPending] = useActionState(submitPredictionAction, null)

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-zinc-800 rounded-xl bg-zinc-950/50 backdrop-blur-sm text-center">
        <p className="text-sm text-zinc-400 mb-4">You must be signed in to submit predictions.</p>
        <Link href="/login">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold cursor-pointer">
            Sign In to Predict
          </Button>
        </Link>
      </div>
    )
  }

  const hasPredicted = initialHomeScore !== undefined && initialAwayScore !== undefined

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-xl">
      <div className="space-y-1 mb-4">
        <h3 className="text-lg font-extrabold text-zinc-100">
          {hasPredicted ? 'Update Your Prediction' : 'Predict the Score'}
        </h3>
        <p className="text-xs text-zinc-500">
          Score prediction closes as soon as the match kicks off.
        </p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="matchId" value={matchId} />

        {state?.error && (
          <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
            {state.message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="homeScore" className="text-xs text-zinc-400 font-semibold truncate block">
              {homeTeamName}
            </Label>
            <Input
              id="homeScore"
              name="homeScore"
              type="number"
              min="0"
              max="99"
              placeholder="0"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="bg-zinc-950/60 border-zinc-800 text-center font-bold text-lg text-zinc-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="awayScore" className="text-xs text-zinc-400 font-semibold truncate block">
              {awayTeamName}
            </Label>
            <Input
              id="awayScore"
              name="awayScore"
              type="number"
              min="0"
              max="99"
              placeholder="0"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="bg-zinc-950/60 border-zinc-800 text-center font-bold text-lg text-zinc-200"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || homeScore === '' || awayScore === ''}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-zinc-950 font-bold transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {hasPredicted ? 'Update Forecast' : 'Submit Forecast'}
        </Button>
      </form>
    </div>
  )
}
