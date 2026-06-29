import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const MOCK_TEAMS = [
  // Group A
  { name: 'Mexico', tla: 'MEX', group: 'A' },
  { name: 'Canada', tla: 'CAN', group: 'A' },
  { name: 'New Zealand', tla: 'NZL', group: 'A' },
  { name: 'Morocco', tla: 'MAR', group: 'A' },
  // Group B
  { name: 'United States', tla: 'USA', group: 'B' },
  { name: 'Wales', tla: 'WAL', group: 'B' },
  { name: 'Iran', tla: 'IRN', group: 'B' },
  { name: 'Senegal', tla: 'SEN', group: 'B' },
  // Group C
  { name: 'Argentina', tla: 'ARG', group: 'C' },
  { name: 'Saudi Arabia', tla: 'KSA', group: 'C' },
  { name: 'Mexico Mock', tla: 'MXM', group: 'C' }, // just a filler for mock
  { name: 'Poland', tla: 'POL', group: 'C' },
  // Group D
  { name: 'France', tla: 'FRA', group: 'D' },
  { name: 'Australia', tla: 'AUS', group: 'D' },
  { name: 'Denmark', tla: 'DEN', group: 'D' },
  { name: 'Tunisia', tla: 'TUN', group: 'D' },
  // Group E
  { name: 'Spain', tla: 'ESP', group: 'E' },
  { name: 'Costa Rica', tla: 'CRC', group: 'E' },
  { name: 'Germany', tla: 'GER', group: 'E' },
  { name: 'Japan', tla: 'JPN', group: 'E' },
  // Group F
  { name: 'Belgium', tla: 'BEL', group: 'F' },
  { name: 'Canada Mock', tla: 'CAM', group: 'F' },
  { name: 'Morocco Mock', tla: 'MOM', group: 'F' },
  { name: 'Croatia', tla: 'CRO', group: 'F' },
  // Group G
  { name: 'Brazil', tla: 'BRA', group: 'G' },
  { name: 'Serbia', tla: 'SRB', group: 'G' },
  { name: 'Switzerland', tla: 'SUI', group: 'G' },
  { name: 'Cameroon', tla: 'CMR', group: 'G' },
  // Group H
  { name: 'Portugal', tla: 'POR', group: 'H' },
  { name: 'Ghana', tla: 'GHA', group: 'H' },
  { name: 'Uruguay', tla: 'URU', group: 'H' },
  { name: 'South Korea', tla: 'KOR', group: 'H' },
  // Group I to L (Fillers for 48 teams)
  { name: 'England', tla: 'ENG', group: 'I' },
  { name: 'Italy', tla: 'ITA', group: 'I' },
  { name: 'Netherlands', tla: 'NED', group: 'I' },
  { name: 'Ecuador', tla: 'ECU', group: 'I' },
  { name: 'Senegal Mock', tla: 'SEM', group: 'J' },
  { name: 'Qatar', tla: 'QAT', group: 'J' },
  { name: 'Ukraine', tla: 'UKR', group: 'J' },
  { name: 'Scotland', tla: 'SCO', group: 'J' },
  { name: 'Austria', tla: 'AUT', group: 'K' },
  { name: 'Sweden', tla: 'SWE', group: 'K' },
  { name: 'Norway', tla: 'NOR', group: 'K' },
  { name: 'Turkey', tla: 'TUR', group: 'K' },
  { name: 'Egypt', tla: 'EGY', group: 'L' },
  { name: 'Nigeria', tla: 'NGA', group: 'L' },
  { name: 'Algeria', tla: 'ALG', group: 'L' },
  { name: 'Cameroon Mock', tla: 'CMM', group: 'L' },
]

export async function POST(request: Request) {
  // Only allow in development or with sync bypass
  if (process.env.NODE_ENV === 'production' && !request.url.includes('bypass=true')) {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  const supabase = createAdminClient()

  try {
    // 1. Create Mock Competition
    const { data: comp, error: compErr } = await supabase
      .from('competitions')
      .upsert({
        external_id: 2000,
        name: 'FIFA World Cup 2026',
        code: 'WC',
        emblem_url: 'https://crests.thesportsdb.com/images/media/league/badge/fifa_world_cup.png',
        season_start: '2026-06-11',
        season_end: '2026-07-19',
      }, { onConflict: 'external_id' })
      .select()
      .single()

    if (compErr || !comp) {
      throw new Error(`Competition insert failed: ${compErr?.message}`)
    }

    // 2. Create Mock Teams
    const teamsToInsert = MOCK_TEAMS.map((t, idx) => ({
      external_id: 10000 + idx,
      name: t.name,
      short_name: t.name,
      tla: t.tla,
      crest_url: `https://flagsapi.com/${t.tla === 'ENG' ? 'GB-ENG' : t.tla.substring(0, 2)}/flat/64.png`,
      country_code: t.tla,
      group_letter: t.group,
    }))

    const { data: dbTeams, error: teamsErr } = await supabase
      .from('teams')
      .upsert(teamsToInsert, { onConflict: 'external_id' })
      .select('id, name, group_letter')

    if (teamsErr || !dbTeams) {
      throw new Error(`Teams insert failed: ${teamsErr?.message}`)
    }

    // 3. Generate Mock Matches
    const matchesToInsert = []
    let matchIdCounter = 50000

    // Group Stage: pair teams in each group
    // Each group has 4 teams. Let's make 3 matchdays.
    // Matchday 1: 0 vs 1, 2 vs 3
    // Matchday 2: 0 vs 2, 1 vs 3
    // Matchday 3: 0 vs 3, 1 vs 2
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

    const baseDate = new Date('2026-06-11T18:00:00Z')

    for (const group of groups) {
      const groupTeams = dbTeams.filter((t) => t.group_letter === group)
      if (groupTeams.length < 4) continue

      // Matchday 1
      matchesToInsert.push(
        createMockMatchData(matchIdCounter++, comp.id, groupTeams[0], groupTeams[1], 1, 'GROUP_STAGE', new Date(baseDate.getTime() + 0 * 86400000), 'Azteca, Mexico City'),
        createMockMatchData(matchIdCounter++, comp.id, groupTeams[2], groupTeams[3], 1, 'GROUP_STAGE', new Date(baseDate.getTime() + 1 * 86400000), 'BC Place, Vancouver')
      )

      // Matchday 2 (finished matches for rating test)
      matchesToInsert.push(
        createMockMatchData(matchIdCounter++, comp.id, groupTeams[0], groupTeams[2], 2, 'GROUP_STAGE', new Date(baseDate.getTime() - 2 * 86400000), 'MetLife Stadium, NY', true, 2, 1, 'HOME_TEAM'),
        createMockMatchData(matchIdCounter++, comp.id, groupTeams[1], groupTeams[3], 2, 'GROUP_STAGE', new Date(baseDate.getTime() - 1 * 86400000), 'SoFi Stadium, LA', true, 1, 1, 'DRAW')
      )

      // Matchday 3
      matchesToInsert.push(
        createMockMatchData(matchIdCounter++, comp.id, groupTeams[0], groupTeams[3], 3, 'GROUP_STAGE', new Date(baseDate.getTime() + 4 * 86400000), 'Hard Rock Stadium, Miami'),
        createMockMatchData(matchIdCounter++, comp.id, groupTeams[1], groupTeams[2], 3, 'GROUP_STAGE', new Date(baseDate.getTime() + 5 * 86400000), 'Mercedes-Benz, Atlanta')
      )
    }

    const { error: matchesErr } = await supabase
      .from('matches')
      .upsert(matchesToInsert, { onConflict: 'external_id' })

    if (matchesErr) {
      throw new Error(`Matches insert failed: ${matchesErr.message}`)
    }

    return NextResponse.json({
      success: true,
      competition: comp.name,
      teamsCount: dbTeams.length,
      matchesCount: matchesToInsert.length,
    })
  } catch (err: any) {
    console.error('Mock sync failed:', err)
    return NextResponse.json({ error: 'Mock sync failed', message: err.message }, { status: 500 })
  }
}

function createMockMatchData(
  extId: number,
  compId: number,
  homeTeam: any,
  awayTeam: any,
  matchday: number,
  stage: string,
  date: Date,
  venue: string,
  finished = false,
  homeScore: number | null = null,
  awayScore: number | null = null,
  winner: string | null = null
) {
  return {
    external_id: extId,
    competition_id: compId,
    home_team_id: homeTeam.id,
    away_team_id: awayTeam.id,
    matchday,
    stage,
    status: finished ? 'FINISHED' : 'SCHEDULED',
    utc_date: date.toISOString(),
    venue,
    home_score: homeScore,
    away_score: awayScore,
    winner,
    is_ratable: finished,
    rating_avg: finished ? 7.2 : 0, // start finished matches with a baseline rating
    rating_count: finished ? 1 : 0,
  }
}
