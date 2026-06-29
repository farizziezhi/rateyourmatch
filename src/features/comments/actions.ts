'use server'

import { createClient } from '@/lib/supabase/server'
import { commentSchema } from './validation'
import { isRateLimited } from '@/lib/rate-limit'
import { revalidatePath } from 'next/cache'

export async function submitCommentAction(state: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be signed in to post comments.' }
  }

  // 2. Rate limit check
  const isLim = await isRateLimited(user.id, 'sensitive')
  if (isLim) {
    return { error: 'You are commenting too quickly. Please wait a minute.' }
  }

  // 3. Validation
  const rawMatchId = formData.get('matchId')
  const rawContent = formData.get('content')

  const parsed = commentSchema.safeParse({
    matchId: rawMatchId,
    content: rawContent,
  })

  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Invalid comment input.'
    return { error: errorMsg }
  }

  const { matchId, content } = parsed.data

  // 4. Save comment
  const { error } = await supabase
    .from('comments')
    .insert({
      user_id: user.id,
      match_id: matchId,
      content,
      created_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error inserting comment:', error)
    return { error: 'Failed to post comment. Please try again.' }
  }

  revalidatePath(`/matches/${matchId}`)
  return { success: true, message: 'Comment posted successfully!' }
}

export async function deleteCommentAction(commentId: string, matchId: number) {
  const supabase = await createClient()

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be signed in.' }
  }

  // 2. Delete comment
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting comment:', error)
    return { error: 'Failed to delete comment.' }
  }

  revalidatePath(`/matches/${matchId}`)
  return { success: true }
}
