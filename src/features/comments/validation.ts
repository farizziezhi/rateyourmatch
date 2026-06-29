import { z } from 'zod'

export const commentSchema = z.object({
  matchId: z.coerce.number().int().positive(),
  content: z.string().trim()
    .min(3, 'Comment must be at least 3 characters.')
    .max(1000, 'Comment cannot exceed 1000 characters.'),
})

export type CommentInput = z.infer<typeof commentSchema>
