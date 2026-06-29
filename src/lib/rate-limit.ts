import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

// general rate limiter
export const rateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: '@upstash/ratelimit/rateyourmatch',
    })
  : null

// sensitive action rate limiter (e.g. submitting ratings)
export const sensitiveRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '60 s'),
      analytics: true,
      prefix: '@upstash/ratelimit/rateyourmatch_sensitive',
    })
  : null

export async function isRateLimited(
  identifier: string,
  type: 'general' | 'sensitive' = 'general'
): Promise<boolean> {
  const limiter = type === 'sensitive' ? sensitiveRateLimit : rateLimit
  if (!limiter) return false
  
  try {
    const { success } = await limiter.limit(identifier)
    return !success
  } catch (error) {
    console.error('Rate limiting check error:', error)
    return false
  }
}
