import { z } from 'zod'

export const predictionSchema = z.object({
  matchId: z.coerce.number().int().positive(),
  homeScore: z.coerce.number().int().min(0, 'Score cannot be negative').max(99, 'Score is too high'),
  awayScore: z.coerce.number().int().min(0, 'Score cannot be negative').max(99, 'Score is too high'),
})

export type PredictionInput = z.infer<typeof predictionSchema>
