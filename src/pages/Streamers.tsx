import BMSStreamers from '@/components/BMSStreamers'

export default function StreamersPage() {
  return (
    <div className="card">
      <h2>BMS Streamers</h2>
      <p className="muted">Suivi live et dernieres infos des streamers BMS.</p>
      <BMSStreamers />
    </div>
  )
}
