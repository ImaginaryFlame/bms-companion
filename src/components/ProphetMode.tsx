import { useEffect, useMemo, useState } from 'react'

type Prediction = { date: string; answer: 'oui' | 'non'; eta?: string }
type Result = { date: string; happened: boolean }

function storage<T>(key: string, initial: T) {
  const load = (): T => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial } catch { return initial }
  }
  const save = (v: T) => { try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }
  return { load, save }
}

const sPred = storage<Prediction[]>('prophet:predictions', [])
const sRes = storage<Result[]>('prophet:results', [])
const sName = storage<string>('prophet:name', '')

function todayKey(d = new Date()) { return d.toISOString().slice(0, 10) }

export default function ProphetMode() {
  const [name, setName] = useState<string>(() => sName.load())
  const [preds, setPreds] = useState<Prediction[]>(() => sPred.load())
  const [res, setRes] = useState<Result[]>(() => sRes.load())
  const today = todayKey()
  const existing = preds.find(p => p.date === today)

  useEffect(() => { sName.save(name) }, [name])
  useEffect(() => { sPred.save(preds) }, [preds])
  useEffect(() => { sRes.save(res) }, [res])

  const points = useMemo(() => {
    // +3 correct, -1 wrong, +1 bonus if ETA within 1h of result time (manual)
    let p = 0
    const mapRes = new Map(res.map(r => [r.date, r.happened]))
    for (const pr of preds) {
      const r = mapRes.get(pr.date)
      if (r == null) continue
      const saidYes = pr.answer === 'oui'
      if (r === saidYes) p += 3
      else p -= 1
    }
    return p
  }, [preds, res])

  function submitPrediction(answer: 'oui' | 'non', eta?: string) {
    const p: Prediction = { date: today, answer, eta }
    setPreds(prev => [...prev.filter(x => x.date !== today), p])
  }
  function resolve(happened: boolean) {
    const r: Result = { date: today, happened }
    setRes(prev => [...prev.filter(x => x.date !== today), r])
  }

  return (
    <div className="card">
      <h3>Prophet Mode</h3>
      <div className="muted" style={{ marginBottom: 8 }}>Fais ta prédiction du jour. Score hebdo local.</div>
      <div className="row" style={{ marginBottom: 8 }}>
        <input value={name} placeholder="Ton pseudo" onChange={e => setName(e.target.value)}
               style={{ background: 'transparent', color: 'var(--text)', border: '1px solid #2a3a4e', borderRadius: 6, padding: '6px 8px' }} />
      </div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn" onClick={() => submitPrediction('oui')}>Oui</button>
        <button className="btn secondary" onClick={() => submitPrediction('non')}>Non</button>
        <input placeholder="Heure estimée (ex: 21:00)" onBlur={e => existing && submitPrediction(existing.answer, e.target.value)}
               style={{ background: 'transparent', color: 'var(--text)', border: '1px solid #2a3a4e', borderRadius: 6, padding: '6px 8px', flex: 1, minWidth: 160 }} />
      </div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn secondary" onClick={() => resolve(true)}>Résoudre: il a stream</button>
        <button className="btn secondary" onClick={() => resolve(false)}>Résoudre: pas de stream</button>
      </div>
      <div className="row" style={{ gap: 24 }}>
        <div>
          <div className="muted">Prédiction du jour</div>
          <strong>{existing ? `${existing.answer.toUpperCase()} ${existing.eta ? `@ ${existing.eta}` : ''}` : '—'}</strong>
        </div>
        <div>
          <div className="muted">Points (local)</div>
          <strong>{points}</strong>
        </div>
      </div>
    </div>
  )
}

