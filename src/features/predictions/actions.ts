'use server'

import { createClient } from '@/lib/supabase/server'
import { predictionSchema } from './validation'
import { isRateLimited } from '@/lib/rate-limit'
import { revalidatePath } from 'next/cache'

export async function submitPredictionAction(state: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be signed in to submit predictions.' }
  }

  // 2. Rate limit check
  const isLim = await isRateLimited(user.id, 'sensitive')
  if (isLim) {
    return { error: 'You are submitting predictions too quickly. Please wait a moment.' }
  }

  // 3. Parse values
  const rawMatchId = formData.get('matchId')
  const rawHomeScore = formData.get('homeScore')
  const rawAwayScore = formData.get('awayScore')

  const parsed = predictionSchema.safeParse({
    matchId: rawMatchId,
    homeScore: rawHomeScore,
    awayScore: rawAwayScore,
  })

  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Invalid prediction inputs.'
    return { error: errorMsg }
  }

  const { matchId, homeScore, awayScore } = parsed.data

  // 4. Verify match is SCHEDULED and hasn't kicked off yet
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('status, utc_date')
    .eq('id', matchId)
    .single()

  if (matchError || !match) {
    return { error: 'Match not found.' }
  }

  if (match.status !== 'SCHEDULED' || new Date(match.utc_date).getTime() < Date.now()) {
    return { error: 'Predictions are closed for this match.' }
  }

  // 5. Upsert prediction
  const { error: predError } = await supabase
    .from('predictions')
    .upsert({
      user_id: user.id,
      match_id: matchId,
      home_score: homeScore,
      away_score: awayScore,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id, match_id' })

  if (predError) {
    console.error('Error upserting prediction:', predError)
    return { error: 'Failed to submit prediction. Please try again.' }
  }

  // Clear cache for detail page
  revalidatePath(`/matches/${matchId}`)
  
  return { success: true, message: 'Prediction submitted successfully!' }
}
