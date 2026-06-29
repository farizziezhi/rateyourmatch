import { Redis } from '@upstash/redis'

const isConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_TOKEN
)

export const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    return await redis.get<T>(key)
  } catch (error) {
    console.error('Redis cache get error:', error)
    return null
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  if (!redis) return
  try {
    if (ttlSeconds) {
      await redis.set(key, value, { ex: ttlSeconds })
    } else {
      await redis.set(key, value)
    }
  } catch (error) {
    console.error('Redis cache set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!redis) return
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis cache delete error:', error)
  }
}
