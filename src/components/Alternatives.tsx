const SUGGESTIONS = [
  
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

export default function Alternatives() {
  return (
    <div>
      <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
        {SUGGESTIONS.map((s) => (
          <a
            key={s.url}
            className="btn secondary"
            href={s.url}
            target="_blank"
            rel="noreferrer"
            title={s.description}
            style={{ minWidth: 180, display: 'flex', justifyContent: 'center' }}
          >
            {s.name}
          </a>
        ))}
      </div>
      <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
        Suggestions BMS quand Joel est offline. Pense aussi au module "BMS Streamers" ci-dessous pour voir qui est en live.
      </div>
    </div>
  )
}
