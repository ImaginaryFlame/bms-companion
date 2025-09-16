import { useMemo, useState } from 'react'

const EXCUSES = [
  "Les câbles se sont rebellés, paix à la carte son.",
  "Patch day: Windows a tout cassé (again).",
  "Brainstorm secret BMS: top secret classifié S+.",
  "Le chat a déclenché le mode avion sur le routeur.",
  "Grinding off-stream pour un giga projet surprise.",
  "Le PC minage de confettis est en PLS.",
  "Pause vocale, on économise le skill pour demain.",
]

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function ExcuseGenerator() {
  const [excuse, setExcuse] = useState<string>(() => pick(EXCUSES))
  const count = useMemo(() => EXCUSES.length, [])
  return (
    <div className="card" style={{ background: '#101821', borderColor: '#1c2a3b' }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div className="muted" style={{ fontSize: 12 }}>Générateur d'excuses</div>
          <div style={{ fontWeight: 700 }}>{excuse}</div>
        </div>
        <button className="btn secondary" onClick={() => setExcuse(pick(EXCUSES))}>Nouvelle</button>
      </div>
      <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>{count} excuses possibles</div>
    </div>
  )
}

