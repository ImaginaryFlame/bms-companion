import { useMemo } from 'react'

type NewsItem = {
  title: string
  date: string // ISO string for sorting
  summary: string
  link?: string
}

// Update NEWS to publier rapidement les nouvelles importantes
const NEWS: NewsItem[] = [
  {
    title: 'BMS Cup - Split Automne',
    date: '2025-09-12',
    summary: 'Inscriptions ouvertes pour la prochaine BMS Cup. Qualifs online, finale en studio.',
    link: 'https://thebmscrew.com/events/bms-cup-automne',
  },
  {
    title: 'Nouveau studio setup',
    date: '2025-09-05',
    summary: 'Le plateau BMS upgrade son decor et ajoute plus de cams pour les shows.',
  },
  {
    title: 'Recrutement Talents',
    date: '2025-08-28',
    summary: 'Ouverture des candidatures pour rejoindre l equipe production / design.',
    link: 'mailto:talents@thebmscrew.com',
  },
]

export default function BMSNewsFeed() {
  const items = useMemo(() => {
    return [...NEWS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  if (!items.length) {
    return <p className="muted small">Aucune actu pour le moment.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item) => (
        <article
          key={`${item.date}-${item.title}`}
          style={{
            border: '1px solid #2a2d35',
            borderRadius: 12,
            padding: 12,
            background: '#14161c',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <strong>{item.title}</strong>
            <span className="muted small">{new Date(item.date).toLocaleDateString()}</span>
          </div>
          <p className="muted small">{item.summary}</p>
          {item.link && (
            <a className="btn secondary" href={item.link} target="_blank" rel="noreferrer">
              En savoir plus
            </a>
          )}
        </article>
      ))}
    </div>
  )
}
