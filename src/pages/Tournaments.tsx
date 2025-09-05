import { useTournamentsStore } from '@/store/tournaments'

export default function Tournaments() {
  const { tournaments, loading, fetchTournaments } = useTournamentsStore()

  return (
    <div className="card">
      <h2>Tournois</h2>
      <p className="muted">Page de base. Connectez un backend plus tard.</p>
      <div className="spacer" />
      <button className="btn" onClick={fetchTournaments} disabled={loading}>
        {loading ? 'Chargement...' : 'Actualiser'}
      </button>
      <div className="spacer" />
      <ul>
        {tournaments.map(t => (
          <li key={t.id}>
            <strong>{t.name}</strong> — {new Date(t.startAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

