import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchFootballData } from '@/lib/football-api'
import { FootballMatchesResponse, FootballTeamsResponse } from '@/types/football-api'

export async function POST(request: Request) {
  // 1. Simple security check
  const authHeader = request.headers.get('Authorization')
  const syncToken = process.env.SYNC_TOKEN

  if (syncToken && authHeader !== `Bearer ${syncToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    console.log('Starting World Cup sync...')

    // 2. Fetch teams and competition data
    const teamsData = await fetchFootballData<FootballTeamsResponse>('/competitions/WC/teams')
    const { competition: fc, teams } = teamsData

    // 3. Upsert competition
    const { data: dbCompetition, error: compError } = await supabase
      .from('competitions')
      .upsert(
        {
          external_id: fc.id,
          name: fc.name,
          code: fc.code,
          emblem_url: fc.emblem,
          season_start: fc.currentSeason?.startDate || null,
          season_end: fc.currentSeason?.endDate || null,
        },
        { onConflict: 'external_id' }
      )
      .select()
      .single()

    if (compError || !dbCompetition) {
      console.error('Error upserting competition:', compError)
      return NextResponse.json({ error: 'Failed to sync competition', details: compError }, { status: 500 })
    }

    // 4. Upsert teams
    const teamsToInsert = teams.map((team) => ({
      external_id: team.id,
      name: team.name,
      short_name: team.shortName,
      tla: team.tla,
      crest_url: team.crest,
      country_code: team.area?.code || null,
    }))

    const { data: dbTeams, error: teamsError } = await supabase
      .from('teams')
      .upsert(teamsToInsert, { onConflict: 'external_id' })
      .select('id, external_id')

    if (teamsError || !dbTeams) {
      console.error('Error upserting teams:', teamsError)
      return NextResponse.json({ error: 'Failed to sync teams', details: teamsError }, { status: 500 })
    }

    // Map team external_id to local id
    const teamIdMap = new Map<number, number>()
    dbTeams.forEach((t) => teamIdMap.set(t.external_id, t.id))

    // 5. Fetch matches
    const matchesData = await fetchFootballData<FootballMatchesResponse>('/competitions/WC/matches')
    const { matches } = matchesData

    // 6. Upsert matches
    const matchesToInsert = matches.map((match) => {
      const homeTeamLocalId = match.homeTeam ? teamIdMap.get(match.homeTeam.id) : null
      const awayTeamLocalId = match.awayTeam ? teamIdMap.get(match.awayTeam.id) : null
      const isFinished = match.status === 'FINISHED'

      return {
        external_id: match.id,
        competition_id: dbCompetition.id,
        home_team_id: homeTeamLocalId,
        away_team_id: awayTeamLocalId,
        matchday: match.matchday,
        stage: match.stage,
        status: match.status,
        utc_date: match.utcDate,
        venue: match.venue || null,
        home_score: match.score?.fullTime?.home ?? null,
        away_score: match.score?.fullTime?.away ?? null,
        winner: match.score?.winner || null,
        is_ratable: isFinished,
        updated_at: new Date().toISOString(),
      }
    })

    const { error: matchesError } = await supabase
      .from('matches')
      .upsert(matchesToInsert, { onConflict: 'external_id' })

    if (matchesError) {
      console.error('Error upserting matches:', matchesError)
      return NextResponse.json({ error: 'Failed to sync matches', details: matchesError }, { status: 500 })
    }

    console.log(`Successfully synced ${teams.length} teams and ${matches.length} matches.`)

    return NextResponse.json({
      success: true,
      syncedTeams: teams.length,
      syncedMatches: matches.length,
    })
  } catch (error: any) {
    console.error('Sync process caught error:', error)
    return NextResponse.json({ error: 'Sync failed', message: error.message }, { status: 500 })
  }
}
