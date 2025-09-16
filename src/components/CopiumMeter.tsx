import { useEffect, useMemo, useState } from 'react'

function dayWeight(dow: number) {
  // 0..6 => Sun..Sat
  switch (dow) {
    case 5: // Fri
    case 6: // Sat
      return 0.9
    case 4: // Thu
      return 0.75
    case 0: // Sun
      return 0.7
    default:
      return 0.55
  }
}

function hourWeight(h: number) {
  if (h >= 20 && h <= 23) return 1.0
  if (h >= 18 && h < 20) return 0.8
  if (h >= 0 && h <= 2) return 0.6
  return 0.25
}

export default function CopiumMeter({ lastStreamAt, startedAt }: { lastStreamAt?: string; startedAt?: string }) {
  const [now, setNow] = useState<Date>(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const score = useMemo(() => {
    if (startedAt) return 100
    const d = now
    let p = 100 * dayWeight(d.getDay()) * hourWeight(d.getHours())
    // If last stream was very recent, bump a bit
    if (lastStreamAt) {
      const diffH = (d.getTime() - new Date(lastStreamAt).getTime()) / 3_600_000
      if (diffH < 24) p = Math.max(p, 70)
      else if (diffH < 72) p = Math.max(p, 50)
    }
    return Math.max(0, Math.min(100, Math.round(p)))
  }, [now, lastStreamAt, startedAt])

  const odds = useMemo(() => {
    const p = score / 100
    const dec = p === 0 ? Infinity : 1 / p
    return dec === Infinity ? '∞' : dec.toFixed(2)
  }, [score])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, background: '#203142', borderRadius: 8, overflow: 'hidden', height: 18 }}>
          <div style={{ width: `${score}%`, height: '100%', background: 'linear-gradient(90deg,#8e24aa,#64b5f6)' }} />
        </div>
        <div style={{ fontWeight: 800, minWidth: 56, textAlign: 'right' }}>{score}%</div>
      </div>
      <div className="muted" style={{ marginTop: 6 }}>Côtes implicites: {odds}</div>
    </div>
  )
}

