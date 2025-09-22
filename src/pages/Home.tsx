import { Link } from 'react-router-dom'
import BMSNewsFeed from '@/components/BMSNewsFeed'

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card-grid">
        <div className="card">
          <h3>BMS Talents</h3>
          <p className="muted">Agence talents: graphisme, montage, dev...</p>
          <Link className="btn" to="/talents">Ouvrir</Link>
        </div>
        <div className="card">
          <h3>BMS Streamers</h3>
          <p className="muted">Statut live et infos des streamers de la structure.</p>
          <Link className="btn" to="/streamers">Ouvrir</Link>
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
    </div>
  )
}
