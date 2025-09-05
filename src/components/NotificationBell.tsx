import { useNotificationsStore } from '@/store/notifications'

export default function NotificationBell() {
  const unread = useNotificationsStore(s => s.unread)
  return (
    <button className="btn secondary" title="Notifications">
      🔔
      {unread > 0 && <span className="badge live">{unread}</span>}
    </button>
  )
}

