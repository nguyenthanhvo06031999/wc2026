import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    let id, W, H, ribbons = [], sparks = []

    const resize = () => {
      W = c.width = window.innerWidth
      H = c.height = window.innerHeight

      // Confetti ribbons in gold, purple, green
      ribbons = Array.from({ length: 32 }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vy: -(Math.random() * 0.5 + 0.2),
        vx: (Math.random() - 0.5) * 0.3,
        w: Math.random() * 22 + 8, h: Math.random() * 9 + 3,
        wobble: Math.random() * Math.PI * 2,
        ws: Math.random() * 0.03 + 0.01,
        color: ['#FFEC00','#7B50B3','#22C55E','#FFF176','#9D72D4','#FFEC00','#4ADE80','#C084FC'][i % 8],
        opacity: Math.random() * 0.35 + 0.12,
      }))

      sparks = Array.from({ length: 100 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.018 + 0.005,
      }))
    }

    let t = 0
    const draw = () => {
      t += 0.01
      ctx.clearRect(0, 0, W, H)

      // Deep pitch green gradient bg
      const bg = ctx.createLinearGradient(0, 0, W * 0.5, H)
      bg.addColorStop(0,   '#061A0E')
      bg.addColorStop(0.35,'#0A2E1A')
      bg.addColorStop(0.65,'#0C3520')
      bg.addColorStop(1,   '#071510')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Alternating grass stripes (subtle)
      for (let i = 0; i < H; i += 90) {
        ctx.fillStyle = i % 180 === 0
          ? 'rgba(20,80,35,0.12)'
          : 'rgba(10,50,20,0.08)'
        ctx.fillRect(0, i, W, 90)
      }

      // Grid lines — faint pitch markings
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // Atmospheric color blobs
      const blobs = [
        { x: W * 0.08, y: H * 0.2,  r: W * 0.38, c: 'rgba(26,122,60,0.12)'  },
        { x: W * 0.92, y: H * 0.15, r: W * 0.32, c: 'rgba(255,236,0,0.07)'  },
        { x: W * 0.5,  y: H * 0.55, r: W * 0.42, c: 'rgba(26,122,60,0.09)'  },
        { x: W * 0.12, y: H * 0.82, r: W * 0.28, c: 'rgba(123,80,179,0.08)' },
        { x: W * 0.88, y: H * 0.78, r: W * 0.24, c: 'rgba(255,236,0,0.06)'  },
      ]
      blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, b.c); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
      })

      // Stadium spotlight beams (green-tinted)
      ;[W * 0.12, W * 0.38, W * 0.62, W * 0.88].forEach((bx, i) => {
        ctx.save(); ctx.translate(bx, 0)
        ctx.rotate(Math.sin(t * 0.22 + i * 0.9) * 0.06)
        const sg = ctx.createLinearGradient(0, 0, 0, H * 0.72)
        sg.addColorStop(0, 'rgba(120,220,150,0.06)')
        sg.addColorStop(0.6, 'rgba(80,180,100,0.02)')
        sg.addColorStop(1, 'transparent')
        ctx.fillStyle = sg
        const hw = W * 0.06
        ctx.beginPath()
        ctx.moveTo(-hw * 0.15, 0); ctx.lineTo(hw * 0.15, 0)
        ctx.lineTo(hw, H * 0.72); ctx.lineTo(-hw, H * 0.72)
        ctx.closePath(); ctx.fill(); ctx.restore()
      })

      // Pitch center circle + lines (faint glow)
      ctx.save(); ctx.globalAlpha = 0.07
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1.5
      const py = H * 0.8
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke()
      ctx.beginPath(); ctx.arc(W / 2, py + H * 0.07, H * 0.11, 0, Math.PI * 2); ctx.stroke()
      const bw = W * 0.22, bh = H * 0.09
      ctx.strokeRect(W / 2 - bw / 2, py - bh, bw, bh); ctx.restore()

      // Stars/sparks
      sparks.forEach(s => {
        s.phase += s.speed
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,255,200,${(Math.sin(s.phase) + 1) / 2 * 0.5})`
        ctx.fill()
      })

      // Floating ribbons
      ribbons.forEach(f => {
        f.wobble += f.ws
        f.x += f.vx + Math.sin(f.wobble) * 0.55
        f.y += f.vy
        if (f.y < -40) { f.y = H + 20; f.x = Math.random() * W }
        if (f.x < -40) f.x = W + 20
        if (f.x > W + 40) f.x = -20
        ctx.save()
        ctx.globalAlpha = f.opacity * (0.6 + 0.4 * Math.sin(f.wobble))
        ctx.translate(f.x, f.y); ctx.rotate(f.wobble * 0.6)
        ctx.fillStyle = f.color
        ctx.beginPath()
        ctx.moveTo(-f.w / 2, -f.h / 2); ctx.lineTo(f.w / 2, -f.h / 2)
        ctx.lineTo(f.w * 0.4, f.h / 2); ctx.lineTo(-f.w * 0.4, f.h / 2)
        ctx.closePath(); ctx.fill()
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillRect(-f.w / 2, -f.h * 0.1, f.w, f.h * 0.12)
        ctx.restore()
      })

      id = requestAnimationFrame(draw)
    }

    resize(); draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} id="bg-canvas" />
}
