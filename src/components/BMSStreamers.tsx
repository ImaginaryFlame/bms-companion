import { useEffect, useMemo, useState } from 'react'
import LiveBadge from '@/components/LiveBadge'
import { LiveService, type LiveDetails, type LiveDetailsBatchItem } from '@/services/LiveService'

type StreamerLink = { label: string; url: string }

type StreamerConfig = {
  name: string
  login: string
  description: string
  url: string
  links?: StreamerLink[]
}

type StreamerState = StreamerConfig & {
  details?: LiveDetails
  error?: string
}

const STREAMERS: StreamerConfig[] = [
  {
    name: 'Joel',
    login: 'bmsjoel',
    description: 'Talk shows, communautaire et annonces BMS.',
    url: 'https://twitch.tv/bmsjoel',
  },
  {
    name: 'Imaginary Flame',
    login: 'imaginaryflame',
    description:
      'Createur passionne, supporter BMS et streamer pop culture. Rage et good vibes garanties.',
    url: 'https://www.twitch.tv/imaginaryflame',
    links: [
      { label: 'Linktree', url: 'https://linktr.ee/ImaginaryFlame' },
      { label: 'YouTube', url: 'https://www.youtube.com/channel/UCbVWhV1QQHy-iur65xP_KIA' },
      { label: 'Wattpad', url: 'https://www.wattpad.com/user/ImaginaryFlame' },
      { label: 'Twitter', url: 'https://twitter.com/Imaginary_Flame' },
      { label: 'Instagram', url: 'https://www.instagram.com/imaginary_flame/' },
      { label: 'Webnovel', url: 'https://www.webnovel.com/profile/4501965027' },
    ],
  },
  {
    name: 'Forshana',
    login: 'forshana',
    description: 'Variety et community nights.',
    url: 'https://twitch.tv/forshana',
  },
  {
    name: 'Sadio',
    login: 'sadio',
    description: 'Talk, chill et events BMS.',
    url: 'https://twitch.tv/sadio',
  },
  {
    name: 'Fload TV',
    login: 'fload_tv',
    description: 'Sessions IRL, prod et plateaux.',
    url: 'https://twitch.tv/fload_tv',
  },
  {
    name: 'FairyDana',
    login: 'fairydana',
    description: 'Lives chill, art et discussion.',
    url: 'https://twitch.tv/fairydana',
  },
  {
    name: 'Kurozu21',
    login: 'kurozu21',
    description: 'Gameplay competitif et coaching.',
    url: 'https://twitch.tv/kurozu21',
  },
  {
    name: 'YacineTahar',
    login: 'yacinetahar_',
    description: 'IRL, talk et variety.',
    url: 'https://twitch.tv/yacinetahar_',
  },
  {
    name: 'TenmaWorks',
    login: 'tenmaworks',
    description: 'Art, production et coulisses BMS.',
    url: 'https://twitch.tv/tenmaworks',
  },
  {
    name: 'MazzaAgain',
    login: 'mazzaagain',
    description: 'Talk shows et community games.',
    url: 'https://twitch.tv/mazzaagain',
  },
  {
    name: 'CherSmokes',
    login: 'chersmokes',
    description: 'Chill, watch et commentaires.',
    url: 'https://twitch.tv/chersmokes',
  },
  {
    name: 'NamelessW',
    login: 'namelessw_',
    description: 'Variety nocturne et lineups BMS.',
    url: 'https://twitch.tv/namelessw_',
  },
  {
    name: 'Freshman',
    login: 'freshman240312',
    description: 'Gameplay communautaire et events.',
    url: 'https://twitch.tv/freshman240312',
  },
  {
    name: 'FreemanSensei',
    login: 'freemansensei',
    description: 'Analyse, coaching et review.',
    url: 'https://twitch.tv/freemansensei',
  },
  {
    name: 'NabilTakali',
    login: 'nabiltakali',
    description: 'IRL, sport et sessions training.',
    url: 'https://twitch.tv/nabiltakali',
  },
  {
    name: 'BMS Naox',
    login: 'bmsnaox',
    description: 'Scrims, ranked et coaching.',
    url: 'https://twitch.tv/bmsnaox',
  },
  {
    name: 'KatsujoHime',
    login: 'katsujohime',
    description: 'Cosplay, art et IRL.',
    url: 'https://twitch.tv/katsujohime',
  },
  {
    name: 'ItsSalwar',
    login: 'itssalwar',
    description: 'Variety matinale et commu.',
    url: 'https://twitch.tv/itssalwar',
  },
  {
    name: 'J0vieal',
    login: 'j0vieal',
    description: 'Community games et events.',
    url: 'https://twitch.tv/j0vieal',
  },
]

export default function BMSStreamers() {
  const [items, setItems] = useState<StreamerState[]>(STREAMERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const results = await LiveService.getDetailsBatch(STREAMERS.map((s) => s.login))
      const map = new Map<string, LiveDetailsBatchItem>(results.map((r) => [r.login, r]))
      setItems(
        STREAMERS.map((config) => {
          const result = map.get(config.login)
          return {
            ...config,
            details: result?.details,
            error: result?.error,
          }
        }),
      )
    } catch (err) {
      console.error('BMSStreamers refresh error', err)
      setError('Impossible de recuperer le statut des streamers BMS pour le moment.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const liveCount = useMemo(() => items.filter((item) => item.details?.live).length, [items])
  const unavailableText = useMemo(() => {
    const failures = items.filter((item) => item.error)
    if (!failures.length) return null
    const names = failures.map((f) => f.name).join(', ')
    return `Statut indisponible pour: ${names}.`
  }, [items])

  return (
    <div>
      <div
        className="row"
        style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="muted small" style={{ margin: 0 }}>Suivi en direct via Twitch (statut live).</p>
          <p className="muted small" style={{ margin: 0 }}>{liveCount} streamers BMS en live maintenant.</p>
          {unavailableText && (
            <p className="muted small" style={{ margin: 0, color: '#ff6961' }}>{unavailableText}</p>
          )}
        </div>
        <button className="btn secondary" onClick={refresh} disabled={loading}>
          {loading ? 'Chargement...' : 'Rafraichir'}
        </button>
      </div>
      {error && (
        <p className="muted small" style={{ color: '#ff6961', marginTop: 8 }}>{error}</p>
      )}
      <div
        style={{
          display: 'grid',
          gap: 12,
          marginTop: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        {items.map((item) => (
          <article
            key={item.login}
            style={{
              border: '1px solid #2a2d35',
              borderRadius: 12,
              padding: 12,
              background: '#16181f',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <strong>{item.name}</strong>
              <LiveBadge live={!!item.details?.live} />
            </div>
            <p className="muted small">{item.description}</p>
            {item.error && (
              <p className="muted small" style={{ color: '#ff6961' }}>Erreur: {item.error}</p>
            )}
            {!item.details && !item.error && (
              <p className="muted small">Chargement du statut...</p>
            )}
            {item.details && !item.error && (
              <StreamerDetails details={item.details} url={item.url} links={item.links} />
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

type StreamerDetailsProps = {
  details: LiveDetails
  url: string
  links?: StreamerLink[]
}

function StreamerDetails({ details, url, links }: StreamerDetailsProps) {
  if (details.live) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {details.title && <p className="muted small">{details.title}</p>}
        {details.startedAt && <p className="muted small">En live depuis {formatRelative(details.startedAt)}</p>}
        <a className="btn secondary" href={details.streamUrl ?? url} target="_blank" rel="noreferrer">
          Rejoindre le live
        </a>
        {links && <ExtraLinks links={links} />}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p className="muted small">
        Dernier live: {details.lastStreamAt ? new Date(details.lastStreamAt).toLocaleString() : 'inconnu'}
      </p>
\n
      <a className="btn secondary" href={details.streamUrl ?? url} target="_blank" rel="noreferrer">
        Voir la chaine
      </a>
      {links && <ExtraLinks links={links} />}
    </div>
  )
}

function ExtraLinks({ links }: { links: StreamerLink[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {links.map((link) => (
        <a
          key={link.url}
          className="btn ghost small"
          href={link.url}
          target="_blank"
          rel="noreferrer"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

function formatRelative(startedAt: string): string {
  const start = new Date(startedAt).getTime()
  const diff = Math.max(0, Date.now() - start)
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  return `${hours}h ${minutes}m`
}

