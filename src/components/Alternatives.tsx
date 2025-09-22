import { useEffect, useState } from 'react'
import { LiveService } from '@/services/LiveService'
import type { LiveDetails } from '@/services/LiveService'

export type StreamerProfile = {
  login: string
  name: string
  tagline: string
  schedule: string
  link: string
}

function extractLogin(url: string): string | null {
  const parts = url.split('/')
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const part = parts[i]?.trim()
    if (part) return part
  }
  return null
}

export const STREAMER_SUGGESTIONS = [
  {
    name: 'Imaginary Flame',
    url: 'https://www.twitch.tv/imaginaryflame',
    description: 'Streamer BMS - variety et storytelling nocturne.',
  },
  {
    name: 'Forshana',
    url: 'https://www.twitch.tv/forshana',
    description: 'Streamer BMS - variety.',
  },
  {
    name: 'Sadio',
    url: 'https://www.twitch.tv/sadio',
    description: 'Streamer BMS - talk et events.',
  },
  {
    name: 'Fload TV',
    url: 'https://www.twitch.tv/fload_tv',
    description: 'Streamer BMS - IRL et gaming.',
  },
  {
    name: 'FairyDana',
    url: 'https://www.twitch.tv/fairydana',
    description: 'Streamer BMS - ambience chill.',
  },
  {
    name: 'Kurozu21',
    url: 'https://www.twitch.tv/kurozu21',
    description: 'Streamer BMS - gameplay et coaching.',
  },
  {
    name: 'YacineTahar',
    url: 'https://www.twitch.tv/yacinetahar_',
    description: 'Streamer BMS - IRL et variety.',
  },
  {
    name: 'TenmaWorks',
    url: 'https://www.twitch.tv/tenmaworks',
    description: 'Streamer BMS - art et production.',
  },
  {
    name: 'MazzaAgain',
    url: 'https://www.twitch.tv/mazzaagain',
    description: 'Streamer BMS - talk shows.',
  },
  {
    name: 'CherSmokes',
    url: 'https://www.twitch.tv/chersmokes',
    description: 'Streamer BMS - chill et analyse.',
  },
  {
    name: 'NamelessW',
    url: 'https://www.twitch.tv/namelessw_',
    description: 'Streamer BMS - variety nocturne.',
  },
  {
    name: 'Freshman',
    url: 'https://www.twitch.tv/freshman240312',
    description: 'Streamer BMS - gameplay communautaire.',
  },
  {
    name: 'FreemanSensei',
    url: 'https://www.twitch.tv/freemansensei',
    description: 'Streamer BMS - coaching et review.',
  },
  {
    name: 'NabilTakali',
    url: 'https://www.twitch.tv/nabiltakali',
    description: 'Streamer BMS - IRL et competitif.',
  },
  {
    name: 'BMS Naox',
    url: 'https://www.twitch.tv/bmsnaox',
    description: 'Streamer BMS - scrims et events.',
  },
  {
    name: 'KatsujoHime',
    url: 'https://www.twitch.tv/katsujohime',
    description: 'Streamer BMS - cosplay et art.',
  },
  {
    name: 'ItsSalwar',
    url: 'https://www.twitch.tv/itssalwar',
    description: 'Streamer BMS - variety matinale.',
  },
  {
    name: 'J0vieal',
    url: 'https://www.twitch.tv/j0vieal',
    description: 'Streamer BMS - community games.',
  },
] as const

export const STREAMER_PROFILES: StreamerProfile[] = STREAMER_SUGGESTIONS
  .map((suggestion) => {
    const login = extractLogin(suggestion.url)
    if (!login) return null
    const typed = suggestion as typeof suggestion & { schedule?: string }
    return {
      login,
      name: suggestion.name,
      tagline: suggestion.description,
      schedule: typed.schedule ?? 'Suivre la chaine pour les horaires.',
      link: suggestion.url,
    }
  })
  .filter((s): s is StreamerProfile => s !== null)

const STREAMER_MAP = STREAMER_PROFILES.reduce<Record<string, StreamerProfile>>((acc, streamer) => {
  acc[streamer.login] = streamer
  return acc
}, {} as Record<string, StreamerProfile>)

type LiveStreamer = { profile: StreamerProfile; details: LiveDetails }

export default function Alternatives() {
  const [liveStreamers, setLiveStreamers] = useState<LiveStreamer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchLives() {
      setLoading(true)
      setError(null)
      try {
        const results = await LiveService.getDetailsBatch(STREAMER_PROFILES.map((s) => s.login))
        if (cancelled) return
        const live = results
          .map((item) => {
            if (!item.details?.live) return null
            const profile = STREAMER_MAP[item.login]
            if (!profile) return null
            return { profile, details: item.details }
          })
          .filter(Boolean) as LiveStreamer[]
        setLiveStreamers(live)

        const allErrors = results.filter((item) => item.error)
        if (allErrors.length === results.length && allErrors.length > 0) {
          setError(allErrors[0]?.error ?? 'Erreur inconnue')
        }
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Erreur inconnue'
        setError(message)
        setLiveStreamers([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLives()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      {loading && <p className="muted small">Chargement des suggestions...</p>}

      {!loading && error && (
        <p className="muted small">Impossible de charger les suggestions ({error}).</p>
      )}

      {!loading && !error && liveStreamers.length === 0 && (
        <p className="muted small">Aucun streamer BMS en live pour le moment.</p>
      )}

      {liveStreamers.length > 0 && (
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          {liveStreamers.map(({ profile, details }) => {
            const streamUrl = details.streamUrl ?? profile.link
            const displayName = details.streamer?.displayName ?? profile.name
            const tooltip = details.title ?? profile.tagline
            return (
              <a
                key={profile.login}
                className="btn secondary"
                href={streamUrl}
                target="_blank"
                rel="noreferrer"
                title={tooltip}
                style={{ minWidth: 180, display: 'flex', justifyContent: 'center' }}
              >
                {displayName}
              </a>
            )
          })}
        </div>
      )}

      <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
        Suggestions live BMS quand Joel est offline. Pense aussi au module "BMS Streamers" pour voir qui est en direct.
      </div>
    </div>
  )
}
