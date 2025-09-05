import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="card-grid">
      <div className="card">
        <h3>BMS Talents</h3>
        <p className="muted">Agence talents: graphisme, montage, dev...</p>
        <Link className="btn" to="/talents">Ouvrir</Link>
      </div>
      <div className="card">
        <h3>Has Joel Streamed Today</h3>
        <p className="muted">Suivre si Joel est en live, avec un twist.</p>
        <Link className="btn" to="/has-joel">Ouvrir</Link>
      </div>
      <div className="card">
        <h3>Notifications</h3>
        <p className="muted">S'abonner: events BMS, news, lives.</p>
        <Link className="btn" to="/notifications">Configurer</Link>
      </div>
      <div className="card">
        <h3>Boutique</h3>
        <p className="muted">Merch officiel BMS (lien externe).</p>
        <a className="btn" href="https://thebmscrew.com/" target="_blank" rel="noreferrer">Visiter</a>
      </div>
    </div>
  )
}
