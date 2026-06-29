'use server'

import { createClient } from '@/lib/supabase/server'
import { ratingSchema } from './validation'
import { isRateLimited } from '@/lib/rate-limit'
import { revalidatePath } from 'next/cache'

export async function submitRatingAction(state: any, formData: FormData) {
  const supabase = await createClient()
  
  // 1. Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be signed in to rate matches.' }
  }

  // 2. Rate limit check
  const isLim = await isRateLimited(user.id, 'sensitive')
  if (isLim) {
    return { error: 'You are submitting ratings too quickly. Please wait a minute.' }
  }

  // 3. Validate form data
  const rawMatchId = formData.get('matchId')
  const rawOverallScore = formData.get('overallScore')
  const rawEntertainmentScore = formData.get('entertainmentScore')
  const rawRefereeScore = formData.get('refereeScore')
  const rawTacticsScore = formData.get('tacticsScore')
  const rawVarScore = formData.get('varScore')

  const parsed = ratingSchema.safeParse({
    matchId: rawMatchId,
    overallScore: rawOverallScore,
    entertainmentScore: rawEntertainmentScore || undefined,
    refereeScore: rawRefereeScore || undefined,
    tacticsScore: rawTacticsScore || undefined,
    varScore: rawVarScore || undefined,
  })

  if (!parsed.success) {
    return { error: 'Invalid rating values. Score must be between 1 and 10.' }
  }

  const { matchId, overallScore, entertainmentScore, refereeScore, tacticsScore, varScore } = parsed.data

  // 4. Verify match exists and is finished (is_ratable)
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('status, is_ratable')
    .eq('id', matchId)
    .single()

  if (matchError || !match) {
    return { error: 'Match not found.' }
  }

  if (!match.is_ratable) {
    return { error: 'This match is not finished yet and cannot be rated.' }
  }

  // 5. Upsert rating
  const { error: ratingError } = await supabase
    .from('ratings')
    .upsert({
      user_id: user.id,
      match_id: matchId,
      overall_score: overallScore,
      entertainment_score: entertainmentScore || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id, match_id' })

  if (ratingError) {
    console.error('Error upserting rating:', ratingError)
    return { error: 'Failed to submit rating. Please try again.' }
  }

  // 6. Upsert technical ratings (if any are provided)
  if (refereeScore !== undefined || tacticsScore !== undefined || varScore !== undefined) {
    const { error: techError } = await supabase
      .from('technical_ratings')
      .upsert({
        user_id: user.id,
        match_id: matchId,
        referee_score: refereeScore || null,
        tactics_score: tacticsScore || null,
        var_score: varScore || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id, match_id' })

    if (techError) {
      console.error('Error upserting technical ratings:', techError)
    }
  }

  // Clear cache for related routes
  revalidatePath(`/matches/${matchId}`)
  revalidatePath('/matches')
  revalidatePath('/')
  
  return { success: true, message: 'Rating submitted successfully!' }
}
