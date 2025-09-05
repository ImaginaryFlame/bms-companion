import { useNotificationsStore } from '@/store/notifications'

export default function Notifications() {
  const { unread, topics, toggleTopic, markAllRead } = useNotificationsStore()
  return (
    <div className="card">
      <h2>Notifications</h2>
      <p className="muted">Souscrivez aux catégories qui vous intéressent.</p>
      <div className="spacer" />
      <div className="row">
        <label><input type="checkbox" checked={topics.tournaments} onChange={() => toggleTopic('tournaments')} /> Tournois</label>
        <label><input type="checkbox" checked={topics.events} onChange={() => toggleTopic('events')} /> Events BMS</label>
        <label><input type="checkbox" checked={topics.news} onChange={() => toggleTopic('news')} /> News</label>
        <label><input type="checkbox" checked={topics.lives} onChange={() => toggleTopic('lives')} /> Lives</label>
        <label><input type="checkbox" checked={topics.hasJoel} onChange={() => toggleTopic('hasJoel')} /> Has Joel</label>
      </div>
      <div className="spacer" />
      <div className="row">
        <button className="btn" onClick={markAllRead}>Marquer tout comme lu ({unread})</button>
        <button className="btn secondary" onClick={() => alert('A implémenter: permission + service worker')}>Activer les notifications</button>
      </div>
    </div>
  )
}

