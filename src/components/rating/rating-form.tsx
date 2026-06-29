'use client'

import * as React from 'react'
import { useActionState, useState } from 'react'
import { submitRatingAction } from '@/features/ratings/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Star, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface RatingFormProps {
  matchId: number
  userId?: string
  initialOverallScore?: number
  initialEntertainmentScore?: number
  initialRefereeScore?: number
  initialTacticsScore?: number
  initialVarScore?: number
}

export function RatingForm({
  matchId,
  userId,
  initialOverallScore = 0,
  initialEntertainmentScore = 5,
  initialRefereeScore = 5,
  initialTacticsScore = 5,
  initialVarScore = 5,
}: RatingFormProps) {
  const [overallScore, setOverallScore] = useState(initialOverallScore)
  const [entertainmentScore, setEntertainmentScore] = useState(initialEntertainmentScore)
  const [refereeScore, setRefereeScore] = useState(initialRefereeScore)
  const [tacticsScore, setTacticsScore] = useState(initialTacticsScore)
  const [varScore, setVarScore] = useState(initialVarScore)
  const [hoverScore, setHoverScore] = useState<number | null>(null)

  const [state, action, isPending] = useActionState(submitRatingAction, null)

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-zinc-800 rounded-xl bg-zinc-950/50 backdrop-blur-sm text-center">
        <p className="text-sm text-zinc-400 mb-4">You must be signed in to rate World Cup matches.</p>
        <Link href="/login">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold cursor-pointer">
            Sign In to Rate
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-xl">
      <h3 className="text-lg font-extrabold text-zinc-100 mb-4">Rate this Match</h3>

      <form action={action} className="space-y-6">
        {/* Hidden inputs to send state with Form */}
        <input type="hidden" name="matchId" value={matchId} />
        <input type="hidden" name="overallScore" value={overallScore} />
        <input type="hidden" name="entertainmentScore" value={entertainmentScore} />
        <input type="hidden" name="refereeScore" value={refereeScore} />
        <input type="hidden" name="tacticsScore" value={tacticsScore} />
        <input type="hidden" name="varScore" value={varScore} />

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

        {/* 1-10 Overall Match Quality Star Rating */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#b8b9bc]">
            Match Quality: <span className="text-[#9868cc] font-bold text-base">{overallScore || 'Select'}</span> / 10
          </Label>
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1.5">
            {Array.from({ length: 10 }).map((_, idx) => {
              const score = idx + 1
              const isFilled = hoverScore !== null ? score <= hoverScore : score <= overallScore
              
              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => setOverallScore(score)}
                  onMouseEnter={() => setHoverScore(score)}
                  onMouseLeave={() => setHoverScore(null)}
                  className="p-1 rounded transition-transform duration-250 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5f4dbd]/50"
                >
                  <Star
                    className={`h-7 w-7 transition-all ${
                      isFilled
                        ? 'text-[#9868cc] fill-[#9868cc]'
                        : 'text-[#1e1d1d]'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Entertainment Value Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-[#b8b9bc]">
              Entertainment Value: <span className="text-[#9868cc] font-bold">{entertainmentScore}</span> / 10
            </Label>
            <span className="text-[9px] text-zinc-550 uppercase tracking-wider">
              {entertainmentScore >= 8 ? 'Thriller' : entertainmentScore >= 5 ? 'Good Game' : 'Boring'}
            </span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[entertainmentScore]}
            onValueChange={(val) => setEntertainmentScore(Array.isArray(val) ? val[0] : val)}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Referee Quality Slider */}
        <div className="space-y-3 border-t border-zinc-800/60 pt-4">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-[#b8b9bc]">
              Referee Quality: <span className="text-[#9868cc] font-bold">{refereeScore}</span> / 10
            </Label>
            <span className="text-[9px] text-zinc-550 uppercase tracking-wider">
              {refereeScore >= 8 ? 'Excellent' : refereeScore >= 5 ? 'Fair' : 'Poor Decisions'}
            </span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[refereeScore]}
            onValueChange={(val) => setRefereeScore(Array.isArray(val) ? val[0] : val)}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Tactics Quality Slider */}
        <div className="space-y-3 border-t border-zinc-800/60 pt-4">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-[#b8b9bc]">
              Tactical & Coaching Level: <span className="text-[#9868cc] font-bold">{tacticsScore}</span> / 10
            </Label>
            <span className="text-[9px] text-zinc-550 uppercase tracking-wider">
              {tacticsScore >= 8 ? 'Masterclass' : tacticsScore >= 5 ? 'Standard' : 'Tactically Poor'}
            </span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[tacticsScore]}
            onValueChange={(val) => setTacticsScore(Array.isArray(val) ? val[0] : val)}
            className="w-full cursor-pointer"
          />
        </div>

        {/* VAR Quality Slider */}
        <div className="space-y-3 border-t border-zinc-800/60 pt-4">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-[#b8b9bc]">
              VAR Accuracy & Speed: <span className="text-[#9868cc] font-bold">{varScore}</span> / 10
            </Label>
            <span className="text-[9px] text-zinc-550 uppercase tracking-wider">
              {varScore >= 8 ? 'Flawless' : varScore >= 5 ? 'Acceptable' : 'Frustrating'}
            </span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[varScore]}
            onValueChange={(val) => setVarScore(Array.isArray(val) ? val[0] : val)}
            className="w-full cursor-pointer"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || overallScore === 0}
          className="w-full bg-[#fefcfb] text-[#161e29] hover:bg-[#fefcfb]/95 font-bold transition-all duration-200 cursor-pointer rounded-full"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Rating
        </Button>
      </form>
    </div>
  )
}
