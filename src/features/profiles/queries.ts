import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getProfileByUsername = cache(async (username: string) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      console.error(`Error fetching profile for ${username}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error('getProfileByUsername caught error:', error)
    return null
  }
})

export const getUserRecentRatings = cache(async (userId: string, limit = 10) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        match:matches(
          id,
          stage,
          status,
          home_score,
          away_score,
          utc_date,
          home_team:teams!home_team_id(name, tla, crest_url),
          away_team:teams!away_team_id(name, tla, crest_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error(`Error fetching ratings for user ${userId}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('getUserRecentRatings caught error:', error)
    return []
  }
})
