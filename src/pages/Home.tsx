import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BMSNewsFeed from '@/components/BMSNewsFeed'
import { STREAMER_PROFILES } from '@/components/Alternatives'
import type { StreamerProfile } from '@/components/Alternatives'
import { LiveService } from '@/services/LiveService'
import type { LiveDetails } from '@/services/LiveService'

const spotlightEntries = [
  {
    title: 'Spotlight BMS DNA - Coaching montage',
    highlight: 'PUB DE LA SEMAINE',
    description: 'Besoin d un montage pro pour ton prochain highlight ? Notre cellule BMS DNA t accompagne.',
    cta: 'Contacter la team',
    link: 'mailto:pub@thebmscrew.com?subject=Coaching%20montage',
  },
  {
    title: 'Imaginary Flame - Pack overlays animés',
    highlight: 'ARTISTE EN VITRINE',
    description: 'Overlays et alertes animées prêts pour ta prochaine saison. Demo sur Twitch et pack disponible sur demande.',
    cta: 'Voir la vitrine',
    link: 'https://www.twitch.tv/imaginaryflame',
  },
  {
    title: 'Kana - Production tournois',
    highlight: 'SERVICES EVENT',
    description: 'Casts FR, overlays dynamiques et modération complète pour ton tournoi en ligne.',
    cta: 'Demander un devis',
    link: 'mailto:pub@thebmscrew.com?subject=Production%20tournoi',
  },
] as const

const SPOTLIGHT_DURATION_MS = 10_000

const STREAMERS: StreamerProfile[] = STREAMER_PROFILES

const STREAMER_MAP = STREAMERS.reduce<Record<string, StreamerProfile>>((acc, streamer) => {
  acc[streamer.login] = streamer
  return acc
}, {} as Record<string, StreamerProfile>)

type LiveStreamer = { profile: StreamerProfile; details: LiveDetails }

export default function Home() {
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [liveStreamers, setLiveStreamers] = useState<LiveStreamer[]>([])
  const [loadingStreamers, setLoadingStreamers] = useState(true)
  const [streamersError, setStreamersError] = useState<string | null>(null)

  useEffect(() => {
    if (spotlightEntries.length <= 1) return
    const id = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % spotlightEntries.length)
    }, SPOTLIGHT_DURATION_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchLive() {
      setLoadingStreamers(true)
      setStreamersError(null)
      try {
        const results = await LiveService.getDetailsBatch(STREAMERS.map((s) => s.login))
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

        const errors = results.filter((item) => item.error)
        if (errors.length === results.length && errors.length > 0) {
          setStreamersError(errors[0]?.error ?? 'Erreur inconnue')
        }
      } catch (error) {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'Erreur inconnue'
        setStreamersError(message)
        setLiveStreamers([])
      } finally {
        if (!cancelled) setLoadingStreamers(false)
      }
    }

    fetchLive()

    return () => {
      cancelled = true
    }
  }, [])

  const spotlight = useMemo(() => spotlightEntries[spotlightIndex] ?? spotlightEntries[0], [spotlightIndex])

  return (
    <div className="home-sections">
      <div className="gacha-banner-wrapper">
        <a className="gacha-banner" href={spotlight.link} target="_blank" rel="noreferrer">
          <div className="eyebrow">{spotlight.highlight}</div>
          <h1>{spotlight.title}</h1>
          <p>{spotlight.description}</p>
          <span className="cta">{spotlight.cta} -&gt;</span>
        </a>
        {spotlightEntries.length > 1 && (
          <div className="banner-indicators">
            {spotlightEntries.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={idx === spotlightIndex ? 'dot active' : 'dot'}
                onClick={() => setSpotlightIndex(idx)}
                aria-label={`Voir la pub ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <section className="card">
        <h2>BMS Streamers</h2>
        <p className="muted">Projecteur sur la scene live: seulement ceux qui sont en direct.</p>

        {loadingStreamers && <p className="muted small">Chargement des lives...</p>}

        {!loadingStreamers && streamersError && (
          <p className="muted small">Impossible de recuperer les lives ({streamersError}).</p>
        )}

        {!loadingStreamers && !streamersError && liveStreamers.length === 0 && (
          <p className="muted small">Personne n'est en live pour l'instant.</p>
        )}

        {liveStreamers.length > 0 && (
          <div className="streamer-grid">
            {liveStreamers.map(({ profile, details }) => {
              const streamUrl = details.streamUrl ?? profile.link
              const sinceLabel = details.startedAt
                ? `En direct depuis ${new Date(details.startedAt).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : profile.schedule
              const description = details.title ?? profile.tagline
              const displayName = details.streamer?.displayName ?? profile.name

              return (
                <article key={profile.login} className="streamer-card">
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>{displayName}</h3>
                    <span className="badge live">Live</span>
                  </div>
                  <p className="muted">{description}</p>
                  <p className="muted small">{sinceLabel}</p>
                  <a className="btn secondary" href={streamUrl} target="_blank" rel="noreferrer">
                    Rejoindre le live
                  </a>
                </article>
              )}
            })}
          </div>
        )}
      </section>

      <div className="card-grid">
        <div className="card">
          <h3>BMS DNA</h3>
          <p className="muted">Collectif talents: graphisme, montage, dev...</p>
          <Link className="btn" to="/talents">Ouvrir</Link>
        </div>
        <div className="card">
          <h3>Has Joel Streamed Today? - Infinity</h3>
          <p className="muted">Suivre si Joel est en live, avec un twist.</p>
          <Link className="btn" to="/has-joel-infinity">Ouvrir</Link>
        </div>
        <div className="card">
          <h3>Boutique</h3>
          <p className="muted">Merch officiel BMS (lien externe).</p>
          <a className="btn" href="https://thebmscrew.com/" target="_blank" rel="noreferrer">Visiter</a>
        </div>
      </div>

      <section className="card" id="news">
        <h2>Fil actu BMS</h2>
        <p className="muted small">Dernieres nouvelles de la structure.</p>
        <BMSNewsFeed />
      </section>

      <section className="promo-banner">
        <div>
          <h3>Creations, services, collabs</h3>
          <p>
            Tu veux mettre en avant un projet lie a BMS ? Envoie-nous une note et on te recontacte pour diffuser
            sur le hub.
          </p>
        </div>
        <a className="btn" href="mailto:pub@thebmscrew.com">
          Proposer un projet
        </a>
      </section>
    </div>
  )
}
