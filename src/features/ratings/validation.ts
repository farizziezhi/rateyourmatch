import { z } from 'zod'

export const ratingSchema = z.object({
  matchId: z.coerce.number().int().positive(),
  overallScore: z.coerce.number().int().min(1).max(10),
  entertainmentScore: z.coerce.number().int().min(1).max(10).optional(),
  refereeScore: z.coerce.number().int().min(1).max(10).optional(),
  tacticsScore: z.coerce.number().int().min(1).max(10).optional(),
  varScore: z.coerce.number().int().min(1).max(10).optional(),
})

export type RatingInput = z.infer<typeof ratingSchema>
