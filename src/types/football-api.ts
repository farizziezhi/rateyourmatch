export interface FootballTeam {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  area?: {
    code: string
  }
}

export interface FootballCompetition {
  id: number
  name: string
  code: string
  emblem: string
  currentSeason?: {
    startDate: string
    endDate: string
  }
}

export interface FootballMatch {
  id: number
  utcDate: string
  status: string
  matchday: number
  stage: string
  homeTeam: FootballTeam
  awayTeam: FootballTeam
  score: {
    winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
    fullTime: {
      home: number | null
      away: number | null
    }
  }
  venue?: string
}

export interface FootballMatchesResponse {
  competition: FootballCompetition
  matches: FootballMatch[]
}

export interface FootballTeamsResponse {
  competition: FootballCompetition
  teams: FootballTeam[]
}
