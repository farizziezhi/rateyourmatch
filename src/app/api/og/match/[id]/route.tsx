import { ImageResponse } from 'next/og'
import { getMatchById } from '@/features/matches/queries'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteProps) {
  const resolvedParams = await params
  const matchId = parseInt(resolvedParams.id, 10)

  if (isNaN(matchId)) {
    return new Response('Invalid Match ID', { status: 400 })
  }

  const match = await getMatchById(matchId)
  if (!match) {
    return new Response('Match Not Found', { status: 404 })
  }

  const homeTeam = match.home_team
  const awayTeam = match.away_team
  const isFinished = match.status === 'FINISHED'
  const ratingAvg = Number(match.rating_avg || 0).toFixed(1)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          backgroundImage: 'radial-gradient(circle at center, #022c22 0%, #09090b 70%)',
          padding: '40px',
          color: '#f4f4f5',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#34d399',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '40px',
          }}
        >
          🏆 Rate Your Match
        </div>

        {/* Scoreboard Block */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            width: '100%',
            marginBottom: '40px',
          }}
        >
          {/* Home Team */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '320px',
            }}
          >
            {homeTeam?.crest_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={homeTeam.crest_url}
                alt={homeTeam.name}
                style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '16px' }}
              />
            ) : (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#27272a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#a1a1aa',
                  marginBottom: '16px',
                }}
              >
                {homeTeam?.tla || 'TBD'}
              </div>
            )}
            <span
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {homeTeam?.name || 'To Be Decided'}
            </span>
          </div>

          {/* Scores or VS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#18181b',
              border: '2px solid #27272a',
              borderRadius: '24px',
              padding: '16px 32px',
              minWidth: '180px',
            }}
          >
            {isFinished ? (
              <span style={{ fontSize: '48px', fontWeight: '900', color: '#f4f4f5' }}>
                {match.home_score} - {match.away_score}
              </span>
            ) : (
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: '850',
                  color: '#a1a1aa',
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                }}
              >
                VS
              </span>
            )}
          </div>

          {/* Away Team */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '320px',
            }}
          >
            {awayTeam?.crest_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={awayTeam.crest_url}
                alt={awayTeam.name}
                style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '16px' }}
              />
            ) : (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#27272a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#a1a1aa',
                  marginBottom: '16px',
                }}
              >
                {awayTeam?.tla || 'TBD'}
              </div>
            )}
            <span
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {awayTeam?.name || 'To Be Decided'}
            </span>
          </div>
        </div>

        {/* Ratings or CTA Section */}
        {isFinished && match.rating_count > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                padding: '8px 24px',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '20px', color: '#a1a1aa' }}>Community Rating:</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399' }}>
                ⭐ {ratingAvg} / 10
              </span>
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#71717a' }}>
              <span>REF: {Number(match.referee_avg || 0).toFixed(1)}</span>
              <span>•</span>
              <span>TACTICS: {Number(match.tactics_avg || 0).toFixed(1)}</span>
              <span>•</span>
              <span>VAR: {Number(match.var_avg || 0).toFixed(1)}</span>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              padding: '12px 32px',
              borderRadius: '16px',
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#34d399' }}>
              🔮 Predict and Rate matches live on rateyourmatch.com!
            </span>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
