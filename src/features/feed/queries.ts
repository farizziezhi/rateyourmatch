import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export interface ActivityItem {
  id: string
  type: 'comment' | 'rating'
  user_id: string
  match_id: number
  created_at: string
  score?: number
  content?: string
  profile: {
    username: string
    display_name: string | null
  } | null
  match: {
    stage: string
    home_score: number | null
    away_score: number | null
    home_team: { name: string; tla: string; crest_url: string } | null
    away_team: { name: string; tla: string; crest_url: string } | null
  } | null
}

export const getRecentActivity = cache(async (limit = 15): Promise<ActivityItem[]> => {
  const supabase = await createClient()

  try {
    // 1. Fetch recent comments
    const { data: comments, error: commError } = await supabase
      .from('comments')
      .select(`
        id,
        user_id,
        match_id,
        content,
        created_at,
        profile:profiles(username, display_name),
        match:matches(
          stage,
          home_score,
          away_score,
          home_team:teams!home_team_id(name, tla, crest_url),
          away_team:teams!away_team_id(name, tla, crest_url)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    // 2. Fetch recent ratings
    const { data: ratings, error: rateError } = await supabase
      .from('ratings')
      .select(`
        id,
        user_id,
        match_id,
        overall_score,
        created_at,
        profile:profiles(username, display_name),
        match:matches(
          stage,
          home_score,
          away_score,
          home_team:teams!home_team_id(name, tla, crest_url),
          away_team:teams!away_team_id(name, tla, crest_url)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (commError) console.error('Error fetching feed comments:', commError)
    if (rateError) console.error('Error fetching feed ratings:', rateError)

    const feedItems: ActivityItem[] = []

    comments?.forEach((c: any) => {
      feedItems.push({
        id: c.id,
        type: 'comment',
        user_id: c.user_id,
        match_id: c.match_id,
        created_at: c.created_at,
        content: c.content,
        profile: c.profile,
        match: c.match,
      })
    })

    ratings?.forEach((r: any) => {
      feedItems.push({
        id: r.id,
        type: 'rating',
        user_id: r.user_id,
        match_id: r.match_id,
        created_at: r.created_at,
        score: r.overall_score,
        profile: r.profile,
        match: r.match,
      })
    })

    // Sort by created_at DESC and limit
    return feedItems
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('getRecentActivity caught error:', error)
    return []
  }
})
