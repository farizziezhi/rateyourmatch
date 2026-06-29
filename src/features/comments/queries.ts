import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getCommentsForMatch = cache(async (matchId: number) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profile:profiles(id, username, display_name, avatar_url)
      `)
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error(`Error fetching comments for match ${matchId}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('getCommentsForMatch caught error:', error)
    return []
  }
})
