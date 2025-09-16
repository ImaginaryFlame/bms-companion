const SUGGESTIONS = [
  { name: 'BMS Crew Live', url: 'https://twitch.tv/thebmscrew' },
  { name: 'BMS Kaelo', url: 'https://twitch.tv/kaelo' },
  { name: 'BMS HyP', url: 'https://twitch.tv/hyp' },
  { name: 'BMS Montage', url: 'https://www.youtube.com/@thebmscrew' },
]

export default function Alternatives() {
  return (
    <div>
      <div className="row" style={{ flexWrap: 'wrap' }}>
        {SUGGESTIONS.map((s) => (
          <a key={s.url} className="btn secondary" href={s.url} target="_blank" rel="noreferrer">
            {s.name}
          </a>
        ))}
      </div>
      <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>Suggestions BMS quand Joel est offline</div>
    </div>
  )
}

