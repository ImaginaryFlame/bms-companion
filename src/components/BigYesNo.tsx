import { useEffect, useRef } from 'react'

export default function BigYesNo({ yes }: { yes: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!yes) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    const W = (canvas.width = canvas.offsetWidth)
    const H = (canvas.height = 160)

    const pieces = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * W,
      y: -Math.random() * 60,
      r: Math.random() * 6 + 3,
      c: `hsl(${Math.floor(Math.random() * 360)},80%,60%)`,
      vx: (Math.random() - 0.5) * 1.2,
      vy: Math.random() * 2 + 1,
      a: Math.random() * Math.PI,
      va: (Math.random() - 0.5) * 0.2,
    }))

    const start = performance.now()
    const duration = 2200

    const loop = () => {
      const t = performance.now() - start
      ctx.clearRect(0, 0, W, H)
      for (const p of pieces) {
        p.x += p.vx
        p.y += p.vy
        p.a += p.va
        if (p.y > H + 20) {
          p.y = -20
          p.x = Math.random() * W
        }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.a)
        ctx.fillStyle = p.c
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2)
        ctx.restore()
      }
      if (t < duration) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [yes])

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          letterSpacing: 2,
          lineHeight: 1,
          margin: '8px 0',
          background: yes
            ? 'linear-gradient(90deg,#17c964,#64b5f6)'
            : 'linear-gradient(90deg,#ff4d4f,#8e24aa)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
        aria-live="polite"
      >
        {yes ? 'YES' : 'NO'}
      </div>
      {yes && (
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: 160, display: 'block' }}
          aria-hidden
        />
      )}
    </div>
  )
}

