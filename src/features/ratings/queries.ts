import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getUserRatingForMatch = cache(async (matchId: number, userId: string) => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('match_id', matchId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user rating:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('getUserRatingForMatch caught error:', error)
    return null
  }
})

export const getRatingDistribution = cache(async (matchId: number) => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('overall_score')
      .eq('match_id', matchId)

    if (error) {
      console.error('Error fetching rating distribution:', error)
      return Array(10).fill(0)
    }

    const distribution = Array(10).fill(0)
    data?.forEach((r) => {
      const score = r.overall_score
      if (score >= 1 && score <= 10) {
        distribution[score - 1]++
      }
    })

    return distribution
  } catch (error) {
    console.error('getRatingDistribution caught error:', error)
    return Array(10).fill(0)
  }
})

export const getUserTechnicalRatingForMatch = cache(async (matchId: number, userId: string) => {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('technical_ratings')
      .select('*')
      .eq('match_id', matchId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user technical rating:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('getUserTechnicalRatingForMatch caught error:', error)
    return null
  }
})
