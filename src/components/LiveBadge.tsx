type Props = { live: boolean }

export default function LiveBadge({ live }: Props) {
  return (
    <span className={`badge ${live ? 'live' : 'offline'}`}>
      {live ? 'LIVE' : 'OFFLINE'}
    </span>
  )
}

