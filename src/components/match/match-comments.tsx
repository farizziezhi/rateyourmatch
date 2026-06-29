'use client'

import * as React from 'react'
import { useActionState, useTransition } from 'react'
import { submitCommentAction, deleteCommentAction } from '@/features/comments/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Trash2, Loader2, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  user_id: string
  match_id: number
  content: string
  created_at: string
  profile: {
    username: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

interface MatchCommentsProps {
  matchId: number
  comments: Comment[]
  userId?: string
}

export function MatchComments({ matchId, comments, userId }: MatchCommentsProps) {
  const [state, action, isPending] = useActionState(submitCommentAction, null)
  const [isDeleting, startDeletingTransition] = useTransition()

  const handleDelete = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      startDeletingTransition(async () => {
        await deleteCommentAction(commentId, matchId)
      })
    }
  }

  return (
    <div className="space-y-6 bg-[#1e1d1d]/30 border border-[#1e1d1d] p-6 rounded-xl backdrop-blur-md">
      <div className="flex items-center space-x-2 border-b border-[#1e1d1d] pb-3">
        <MessageSquare className="h-5 w-5 text-[#9868cc]" />
        <h3 className="text-lg font-bold text-[#fefcfb]">Discussion ({comments.length})</h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-6">No comments yet. Start the conversation!</p>
        ) : (
          comments.map((comment) => {
            const isOwner = userId === comment.user_id
            const profile = comment.profile
            const date = new Date(comment.created_at)
            
            return (
              <div key={comment.id} className="flex space-x-3 p-3 rounded-lg bg-[#161e29]/40 border border-[#1e1d1d] group">
                <Link href={`/profiles/${profile?.username || ''}`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e1d1d] text-xs font-bold text-[#9868cc] border border-[#1e1d1d]">
                    {profile?.username?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                </Link>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs">
                      <Link href={`/profiles/${profile?.username || ''}`} className="font-semibold text-[#fefcfb] hover:text-[#9868cc]">
                        {profile?.display_name || profile?.username || 'User'}
                      </Link>
                      <span className="text-[#b8b9bc]">•</span>
                      <span className="text-[#b8b9bc]" suppressHydrationWarning>{formatDistanceToNow(date, { addSuffix: true })}</span>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(comment.id)}
                        disabled={isDeleting}
                        className="h-6 w-6 text-[#b8b9bc] hover:text-red-400 hover:bg-[#1e1d1d] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-[#b8b9bc] break-words">{comment.content}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Comment Form */}
      {userId ? (
        <form action={action} className="space-y-3 pt-4 border-t border-zinc-800/85">
          <input type="hidden" name="matchId" value={matchId} />
          
          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs text-[#b8b9bc] font-semibold uppercase tracking-wider">Write a comment</Label>
            <textarea
              id="content"
              name="content"
              required
              placeholder="What did you think of the match? Add your thoughts..."
              rows={3}
              className="w-full rounded-md border border-[#1e1d1d] bg-[#161e29] p-3 text-sm text-[#fefcfb] placeholder-[#b8b9bc] focus:border-[#5f4dbd] focus:outline-none focus:ring-1 focus:ring-[#5f4dbd]"
            />
          </div>

          {state?.error && (
            <p className="text-xs text-red-400 font-medium">{state.error}</p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#fefcfb] hover:bg-[#e6e4e3] text-[#161e29] font-bold px-5 cursor-pointer text-xs rounded-full"
            >
              {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 border border-[#1e1d1d] rounded-lg bg-[#161e29]/20 text-center text-xs">
          <p className="text-[#b8b9bc] mb-2">You must be signed in to join the discussion.</p>
          <Link href="/login">
            <Button size="sm" className="bg-[#fefcfb] text-[#161e29] hover:bg-[#e6e4e3] font-semibold cursor-pointer rounded-full">
              Sign In
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
