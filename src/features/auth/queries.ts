import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      user,
      profile,
    }
  } catch (error) {
    console.error('Error fetching current user profile:', error)
    return null
  }
})
