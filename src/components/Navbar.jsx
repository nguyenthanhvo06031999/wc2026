import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js';
import toast from 'react-hot-toast'

const LINKS = [
  { to:'/', label:'Trang chủ' },
  { to:'/matches', label:'Trận đấu' },
  { to:'/predict', label:'Dự đoán' },
  { to:'/leaderboard', label:'Bảng xếp hạng' },
]

export default function Navbar({ onOpenProfile }) {
  const { user, setUser } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setUser(null); toast.success('Đã xóa thông tin người chơi'); navigate('/')
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16"
      style={{
        background: 'rgba(6,18,10,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(26,122,60,0.35)',
        boxShadow: '0 1px 40px rgba(0,0,0,0.6)',
      }}>
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg,#FFEC00,#FFF176)',
              color: '#0A2E1A',
              boxShadow: '0 0 16px rgba(255,236,0,0.5)',
            }}>
            ⚽
          </div>
          <span className="font-display font-bold text-base tracking-wide hidden sm:block">
            World Cup <span className="text-gold">2026</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={pathname === l.to
                ? { background:'rgba(26,122,60,0.25)', color:'var(--c-gold)', border:'1px solid rgba(26,122,60,0.5)' }
                : { color:'var(--c-muted)' }}
              onMouseEnter={e => { if (pathname !== l.to) { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}}
              onMouseLeave={e => { if (pathname !== l.to) { e.currentTarget.style.color='var(--c-muted)'; e.currentTarget.style.background='transparent' }}}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Participant */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background:'rgba(255,236,0,0.08)', border:'1px solid rgba(255,236,0,0.22)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background:'linear-gradient(135deg,#FFEC00,#FFF176)', color:'#0A2E1A' }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block text-gold">{user.name}</span>
              </div>
              <button onClick={onOpenProfile} className="btn-outline text-xs px-3 py-1.5 rounded-lg">Sửa</button>
              <button onClick={handleLogout} className="btn-outline text-xs px-3 py-1.5 rounded-lg">Xóa</button>
            </div>
          ) : (
            <button onClick={onOpenProfile} className="btn-gold text-sm rounded-lg">Nhập tên & SĐT</button>
          )}
        </div>
      </div>
    </nav>
  )
}
