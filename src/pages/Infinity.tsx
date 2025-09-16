import { useEffect, useMemo, useRef, useState } from 'react'
import LiveBadge from '@/components/LiveBadge'
import { HasJoelService, HasJoelStatus } from '@/services/HasJoelService'
import BigYesNo from '@/components/BigYesNo'
import Heatmap from '@/components/Heatmap'
import Streaks from '@/components/Streaks'
import CopiumMeter from '@/components/CopiumMeter'
import ExcuseGenerator from '@/components/ExcuseGenerator'
import Alternatives from '@/components/Alternatives'
import ProphetMode from '@/components/ProphetMode'

export default function InfinityPage() {
  const [status, setStatus] = useState<HasJoelStatus>({ live: false, checkedAt: new Date(), source: 'stub' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastTick = useRef<number>(Date.now())
  const [elapsed, setElapsed] = useState<string>('')

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const s = await HasJoelService.getStatus()
      setStatus(s)
    } catch (e: any) {
      setError(e?.message ?? 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  // infinity: rafraîchir l'affichage du temps écoulé (1s)
  useEffect(() => {
    const id = setInterval(() => {
      if (!status.lastStreamAt) return
      const last = new Date(status.lastStreamAt).getTime()
      const now = Date.now()
      lastTick.current = now
      const diff = Math.max(0, now - last)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setElapsed(`${days}j ${hours}h ${minutes}m ${seconds}s`)
    }, 1000)
    return () => clearInterval(id)
  }, [status.lastStreamAt])

  const monthlyText = useMemo(() => {
    if (!status.monthlyStreamTime) return '-'
    const { hours, minutes } = status.monthlyStreamTime
    return `${hours}h ${minutes}m`
  }, [status.monthlyStreamTime])

  const memes = [
    'https://placekitten.com/640/320',
    'https://picsum.photos/640/320',
    'https://placebear.com/640/320',
  ]
  const reasons = [
    'Réunion secrète BMSCrew',
    'Grinding off-stream pour la surprise',
    'Setup audio en PLS',
    'Farm sommeil (rare).',
    'Internet fait des siennes',
  ]
  const seed = new Date().toDateString().length
  const offlineImageUrl = memes[seed % memes.length]
  const reasonOfTheDay = reasons[(seed + 3) % reasons.length]

  return (
    <div className="card">
      <h2>Infinity</h2>
      <p className="muted">Statut basé sur Twitch (via OAuth app credentials).</p>
      <div className="row">
        <LiveBadge live={status.live} />
        <button className="btn" onClick={refresh} disabled={loading}>
          {loading ? 'Vérification...' : 'Rafraîchir'}
        </button>
      </div>
      {error && <p className="muted" style={{color:'#ff6961'}}>Erreur: {error}</p>}
      <div className="spacer" />
      {status.streamer && (
        <div className="row" style={{alignItems:'center'}}>
          <img src={status.streamer.avatarUrl} alt="Avatar" style={{ width: 48, height: 48, borderRadius: 999, border: '2px solid #8e24aa' }} />
          <strong>{status.streamer.displayName}</strong>
        </div>
      )}
      <div className="spacer" />
      <BigYesNo yes={status.live} />
      {status.live ? (
        <>
          <p className="muted">{status.title}</p>
          {status.streamThumbnail && (
            <img src={status.streamThumbnail} alt="Stream Thumbnail" style={{ width: '100%', maxWidth: 640, borderRadius: 12, border: '2px solid #64b5f6' }} />
          )}
          <div className="spacer" />
          <LiveSince startedAt={status.startedAt} />
          <div className="spacer" />
          <a className="btn" href={status.streamUrl} target="_blank" rel="noreferrer">Regarder</a>
        </>
      ) : (
        <>
          <h3>Temps écoulé depuis le dernier stream</h3>
          <strong>{elapsed || '-'}</strong>
          <div className="spacer" />
          <p className="muted">Temps de stream ce mois: {monthlyText}</p>
          {status.lastStreamAt && (
            <p className="muted">Dernier stream: {new Date(status.lastStreamAt).toLocaleString()}</p>
          )}
          <div className="spacer" />
          <img src={offlineImageUrl} alt="Joel n'est pas en live" style={{ width: '100%', borderRadius: 12 }} />
          <div className="spacer" />
          <p className="muted">Raison du jour: {reasonOfTheDay}</p>
          <div className="spacer" />
          <ExcuseGenerator />
          <div className="spacer" />
          <Alternatives />
        </>
      )}
      <div className="spacer" />
      <p className="muted">Dernière vérif: {new Date(status.checkedAt).toLocaleTimeString()}</p>
      <div className="spacer" />
      <section>
        <h3>Habitudes de stream (hebdo)</h3>
        <Heatmap />
      </section>
      <div className="spacer" />
      <section>
        <h3>Streaks</h3>
        <Streaks />
      </section>
      <div className="spacer" />
      <section>
        <h3>Copium / Soon-o-mètre</h3>
        <CopiumMeter lastStreamAt={status.lastStreamAt} startedAt={status.startedAt} />
      </section>
      <div className="spacer" />
      <section>
        <h3>Prophet Mode</h3>
        <ProphetMode />
      </section>
    </div>
  )
}

function LiveSince({ startedAt }: { startedAt?: string }) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!startedAt) return
    const id = setInterval(() => {
      const start = new Date(startedAt).getTime()
      const diff = Math.max(0, Date.now() - start)
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1000)
      setText(`${h}h ${m}m ${s}s`)
    }, 1000)
    return () => clearInterval(id)
  }, [startedAt])
  if (!startedAt) return null
  return <div className="muted">En live depuis {text}</div>
}
