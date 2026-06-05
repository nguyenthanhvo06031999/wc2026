export default function Footer() {
  return (
    <footer className="relative z-10 py-10 px-6 text-center"
      style={{ borderTop: '1px solid rgba(245,166,35,0.12)', background: 'rgba(2,11,24,0.8)', backdropFilter: 'blur(10px)' }}>
      <div className="text-3xl mb-3" style={{ filter: 'drop-shadow(0 0 10px rgba(245,166,35,0.4))' }}>⚽</div>
      <p className="font-display font-bold text-lg text-white mb-1 tracking-wide">World Cup 2026 Predictor</p>
      <p className="text-xs tracking-wide" style={{ color: 'var(--c-muted)' }}>FastAPI · PostgreSQL · React · Tailwind CSS</p>
    </footer>
  )
}
