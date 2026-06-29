import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getAppStats = cache(async () => {
  const supabase = await createClient()
  try {
    const { count: ratingsCount } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true })

    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: matchesCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })

    return {
      ratingsCount: ratingsCount || 0,
      profilesCount: profilesCount || 0,
      matchesCount: matchesCount || 0,
    }
  } catch (error) {
    console.error('Error fetching app stats:', error)
    return {
      ratingsCount: 0,
      profilesCount: 0,
      matchesCount: 0,
    }
  }
})
