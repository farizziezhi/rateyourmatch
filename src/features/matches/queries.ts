import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export interface MatchFilter {
  stage?: string
  status?: string
  group?: string
  limit?: number
}

export const getMatches = cache(async (filters: MatchFilter = {}) => {
  const supabase = await createClient()
  
  try {
    let query = supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*),
        competition:competitions(*)
      `)
      .order('utc_date', { ascending: true })

    if (filters.stage) {
      query = query.eq('stage', filters.stage)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.group) {
      // In PostgreSQL/PostgREST we filter referenced table fields via dot notation
      // But to filter matches where home team or away team is in a group:
      // We can check if either home_team.group_letter or away_team.group_letter equals filters.group
      // Wait, PostgREST doesn't support OR on nested relations easily.
      // So we can fetch all matches and filter in-memory, or filter using postgrest or.
      // Let's filter in-memory for group filters since there are at most 104 matches, which is extremely small!
      // This is highly robust and avoids complex SQL queries.
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching matches:', error)
      return []
    }

    let result = data || []

    if (filters.group) {
      result = result.filter(
        (m: any) => 
          m.home_team?.group_letter === filters.group || 
          m.away_team?.group_letter === filters.group
      )
    }

    if (filters.limit) {
      result = result.slice(0, filters.limit)
    }

    return result
  } catch (error) {
    console.error('getMatches caught error:', error)
    return []
  }
})

export const getMatchById = cache(async (id: number) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*),
        competition:competitions(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching match ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`getMatchById ${id} caught error:`, error)
    return null
  }
})

export const getTopRatedMatches = cache(async (limit = 3) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*),
        competition:competitions(*)
      `)
      .gt('rating_count', 0)
      .order('rating_avg', { ascending: false })
      .order('rating_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching top rated matches:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('getTopRatedMatches caught error:', error)
    return []
  }
})

export const getRecentMatches = cache(async (limit = 3) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*),
        competition:competitions(*)
      `)
      .eq('status', 'FINISHED')
      .order('utc_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent matches:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('getRecentMatches caught error:', error)
    return []
  }
})

export const getUpcomingMatches = cache(async (limit = 3) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*),
        competition:competitions(*)
      `)
      .in('status', ['SCHEDULED', 'TIMED', 'LIVE', 'IN_PLAY'])
      .order('utc_date', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching upcoming matches:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('getUpcomingMatches caught error:', error)
    return []
  }
})
