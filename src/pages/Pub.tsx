const streamers = [
  {
    name: 'Joel',
    tagline: 'Talk shows, projets BMS et bonnes vibes en soiree.',
    schedule: 'Rendez-vous: mardi, jeudi et dimanche a 20h30.',
    link: 'https://www.twitch.tv/joel'
  },
  {
    name: 'Kana',
    tagline: 'Casts de tournois BMS et scrims compet sur FPS.',
    schedule: 'Rendez-vous: mercredi et samedi a 21h00.',
    link: 'https://www.twitch.tv/kanachan'
  },
  {
    name: 'Mira',
    tagline: 'Lives illustration et overlays personnalises pour la team.',
    schedule: 'Rendez-vous: lundi et vendredi a 19h00.',
    link: 'https://www.twitch.tv/mira'
  }
] as const

export default function PubPage() {
  return (
    <div className="pub-page">
      <section className="card">
        <h2>Pub</h2>
        <p className="muted">Projecteur sur les streamers et talents de la commu BMS.</p>
        <div className="streamer-grid">
          {streamers.map((streamer) => (
            <article key={streamer.name} className="streamer-card">
              <h3>{streamer.name}</h3>
              <p className="muted">{streamer.tagline}</p>
              <p className="muted small">{streamer.schedule}</p>
              <a className="btn secondary" href={streamer.link} target="_blank" rel="noreferrer">
                Voir la chaine
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="promo-banner">
        <div>
          <h3>Creations, services, collabs</h3>
          <p>
            Tu veux mettre en avant un projet lie a BMS ? Envoie-nous une note et on te recontacte pour diffuser
            sur le hub.
          </p>
        </div>
        <a className="btn" href="mailto:pub@thebmscrew.com">
          Proposer un projet
        </a>
      </section>
    </div>
  )
}
