import { getCache, setCache } from './redis'

const BASE_URL = 'https://api.football-data.org/v4'

export async function fetchFootballData<T>(endpoint: string, cacheTtlSeconds = 300): Promise<T> {
  const cacheKey = `football-api:${endpoint}`
  
  // Try cache first
  const cached = await getCache<T>(cacheKey)
  if (cached) {
    return cached
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) {
    throw new Error('FOOTBALL_DATA_API_KEY environment variable is not defined.')
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'X-Auth-Token': apiKey,
      },
      next: {
        revalidate: cacheTtlSeconds,
      },
    })

    if (!response.ok) {
      throw new Error(`Football Data API error: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as T
    
    // Save to Upstash Redis cache
    await setCache(cacheKey, data, cacheTtlSeconds)

    return data
  } catch (error) {
    console.error(`Error fetching football data for ${endpoint}:`, error)
    throw error
  }
}
