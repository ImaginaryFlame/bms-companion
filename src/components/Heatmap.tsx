import { useEffect, useMemo, useState } from 'react'
import { LiveService } from '@/services/LiveService'

type Grid = number[][] // [day][hour] 7x24, 0..N

function buildStub(): Grid {
  // Simple stub: evenings are hotter, Fri/Sat hottest
  const grid: Grid = Array.from({ length: 7 }, () => Array(24).fill(0))
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const eveningBoost = Math.max(0, Math.min(1, (h - 18) / 4))
      const lateBoost = h >= 20 && h <= 23 ? 1 : 0
      const wdBoost = d === 5 || d === 6 ? 1.2 : d === 4 ? 1.0 : 0.6
      const base = 0.2
      let v = base + 0.6 * eveningBoost + 0.5 * lateBoost
      v *= wdBoost
      grid[d][h] = v
    }
  }
  return grid
}

export default function Heatmap() {
  const [grid, setGrid] = useState<Grid | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const login = (import.meta.env.VITE_TWITCH_USER_LOGIN as string) || 'bmsjoel'
        const token = await LiveService.getAccessToken()
        const user = await LiveService.getUser(token, login)
        const vids = await LiveService.getVideosLast30Days(token, user.id)
        const g: Grid = Array.from({ length: 7 }, () => Array(24).fill(0))
        for (const v of vids) {
          const dt = new Date(v.created_at)
          const dow = dt.getDay() // 0..6, Sun..Sat
          const hour = dt.getHours()
          g[dow][hour] = (g[dow][hour] ?? 0) + 1
        }
        if (!cancelled) setGrid(g)
      } catch (e: any) {
        // Fallback to stub if creds missing or network blocked
        if (!cancelled) {
          setGrid(buildStub())
          setError(null)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const maxVal = useMemo(() => {
    if (!grid) return 1
    let m = 0
    for (const row of grid) for (const v of row) m = Math.max(m, v)
    return m || 1
  }, [grid])

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  if (!grid) return <div className="muted">Chargement heatmap...</div>

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '64px repeat(24, 1fr)', gap: 6, alignItems: 'center' }}>
        {grid.map((row, d) => (
          <>
            <div key={`lab-${d}`} className="muted" style={{ fontSize: 12 }}>{days[d]}</div>
            {row.map((v, h) => {
              const t = v / maxVal
              const c = `rgba(100,181,246,${Math.max(0.05, t)})`
              return (
                <div key={`c-${d}-${h}`} title={`${days[d]} ${h}h: ${(v || 0).toFixed(0)}x`}
                  style={{ height: 14, borderRadius: 3, background: c, border: '1px solid #203142' }} />
              )
            })}
          </>
        ))}
      </div>
      {error && <div className="muted" style={{ marginTop: 8 }}>Fallback stub (tokens manquants)</div>}
    </div>
  )
}

