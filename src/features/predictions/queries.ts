import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export interface PredictionStats {
  avgHomeScore: number
  avgAwayScore: number
  totalPredictions: number
  homeWinPct: number
  awayWinPct: number
  drawPct: number
}

export const getUserPrediction = cache(async (matchId: number, userId: string) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_id', matchId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user prediction:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('getUserPrediction caught error:', error)
    return null
  }
})

export const getMatchPredictionStats = cache(async (matchId: number): Promise<PredictionStats> => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('home_score, away_score')
      .eq('match_id', matchId)

    if (error || !data || data.length === 0) {
      return {
        avgHomeScore: 0,
        avgAwayScore: 0,
        totalPredictions: 0,
        homeWinPct: 0,
        awayWinPct: 0,
        drawPct: 0,
      }
    }

    const total = data.length
    let sumHome = 0
    let sumAway = 0
    let homeWins = 0
    let awayWins = 0
    let draws = 0

    data.forEach((p) => {
      sumHome += p.home_score
      sumAway += p.away_score

      if (p.home_score > p.away_score) {
        homeWins++
      } else if (p.away_score > p.home_score) {
        awayWins++
      } else {
        draws++
      }
    })

    return {
      avgHomeScore: Number((sumHome / total).toFixed(1)),
      avgAwayScore: Number((sumAway / total).toFixed(1)),
      totalPredictions: total,
      homeWinPct: Math.round((homeWins / total) * 100),
      awayWinPct: Math.round((awayWins / total) * 100),
      drawPct: Math.round((draws / total) * 100),
    }
  } catch (error) {
    console.error('getMatchPredictionStats caught error:', error)
    return {
      avgHomeScore: 0,
      avgAwayScore: 0,
      totalPredictions: 0,
      homeWinPct: 0,
      awayWinPct: 0,
      drawPct: 0,
    }
  }
})
