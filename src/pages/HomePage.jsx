import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js';
import { ArrowRight, CalendarDays, Flame, Star, Trophy, Users, Zap, Target, TrendingUp, Crown } from 'lucide-react'
import PlayerCard, { PLAYERS } from '../components/PlayerCard'

const FLAGS = [
  { emoji:'🇧🇷', name:'Brazil',       color:'#4ADE80', delay:0,    dur:3.2 },
  { emoji:'🇦🇷', name:'Argentina',    color:'#60A5FA', delay:0.4,  dur:4.0 },
  { emoji:'🇫🇷', name:'Pháp',         color:'#93C5FD', delay:0.8,  dur:3.5 },
  { emoji:'🇩🇪', name:'Đức',          color:'#D1D5DB', delay:1.2,  dur:4.2 },
  { emoji:'🇪🇸', name:'Tây Ban Nha',  color:'#FCA5A5', delay:0.2,  dur:3.8 },
  { emoji:'🇵🇹', name:'Bồ Đào Nha',  color:'#4ADE80', delay:1.6,  dur:3.0 },
  { emoji:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', name:'Anh',         color:'#F87171', delay:0.6,  dur:4.5 },
  { emoji:'🇮🇹', name:'Ý',            color:'#60A5FA', delay:1.0,  dur:3.3 },
  { emoji:'🇳🇱', name:'Hà Lan',       color:'#FFEC00', delay:1.4,  dur:3.7 },
  { emoji:'🇧🇪', name:'Bỉ',           color:'#F87171', delay:0.3,  dur:4.1 },
  { emoji:'🇺🇾', name:'Uruguay',      color:'#60A5FA', delay:1.8,  dur:3.4 },
  { emoji:'🇺🇸', name:'Mỹ',           color:'#F87171', delay:0.7,  dur:3.9 },
  { emoji:'🇯🇵', name:'Nhật Bản',    color:'#F87171', delay:1.1,  dur:3.6 },
  { emoji:'🇰🇷', name:'Hàn Quốc',    color:'#60A5FA', delay:0.5,  dur:4.3 },
  { emoji:'🇲🇦', name:'Morocco',      color:'#4ADE80', delay:1.3,  dur:3.1 },
  { emoji:'🇸🇳', name:'Senegal',      color:'#4ADE80', delay:0.9,  dur:4.4 },
  { emoji:'🇳🇴', name:'Na Uy',        color:'#F87171', delay:0.35, dur:3.9 },
  { emoji:'🇨🇭', name:'Thụy Sĩ',     color:'#F87171', delay:1.55, dur:3.6 },
]

const FLAG_POS = [
  {top:'7%',left:'0.5%'},{top:'12%',left:'91%'},{top:'24%',left:'2%'},{top:'19%',left:'86%'},
  {top:'40%',left:'0.3%'},{top:'37%',left:'94%'},{top:'57%',left:'1.5%'},{top:'51%',left:'90%'},
  {top:'70%',left:'3%'},{top:'65%',left:'89%'},{top:'81%',left:'1%'},{top:'76%',left:'93%'},
  {top:'14%',left:'46%'},{top:'32%',left:'49%'},{top:'50%',left:'45%'},{top:'67%',left:'48%'},
  {top:'85%',left:'44%'},{top:'88%',left:'87%'},
]

const STEPS = [
  { icon:<Zap size={20}/>,        title:'Nhập thông tin', desc:'Điền tên và số điện thoại để bắt đầu.' },
  { icon:<Target size={20}/>,     title:'Dự đoán',       desc:'Đặt tỉ số từng trận trước giờ bóng lăn.' },
  { icon:<TrendingUp size={20}/>, title:'Ghi điểm',      desc:'Hệ thống tự động tính điểm sau mỗi trận.' },
  { icon:<Crown size={20}/>,      title:'Lên đỉnh BXH',  desc:'Cạnh tranh và nhận huy hiệu danh dự.' },
]
const SCORING = [
  { label:'Đúng kết quả (W / D / L)', pts:'+3',  color:'#4ADE80' },
  { label:'Đúng tỉ số chính xác',     pts:'+2',  color:'#FFEC00' },
  { label:'Đúng đội vô địch',         pts:'+10', color:'#FFEC00' },
  { label:'Đúng top 4 (mỗi đội)',     pts:'+3',  color:'#C084FC' },
  { label:'Đúng Vua phá lưới',        pts:'+5',  color:'#A78BFA' },
]
const MOCK_LB = [
  { rank:1, name:'Nguyễn Anh', pts:142, correct:28, exact:8,  color:'#FFEC00', icon:'🥇' },
  { rank:2, name:'Trần Minh',  pts:138, correct:26, exact:7,  color:'#94A3B8', icon:'🥈' },
  { rank:3, name:'Lê Hùng',   pts:125, correct:24, exact:6,  color:'#CD7F32', icon:'🥉' },
]

const HERO_STATS = [
  { icon:<Users size={18}/>, value:'2,048+', label:'Người chơi' },
  { icon:<CalendarDays size={18}/>, value:'104', label:'Trận đấu' },
  { icon:<Flame size={18}/>, value:'18K+', label:'Dự đoán' },
]

function FlagBubble({ f, index }) {
  const pos = FLAG_POS[index % FLAG_POS.length]
  return (
    <div className="absolute pointer-events-none select-none z-10"
      style={{ top:pos.top, left:pos.left,
        animation:`flagFloat ${f.dur}s ease-in-out ${f.delay}s infinite alternate`,
        filter:`drop-shadow(0 6px 16px ${f.color}50)` }}>
      <div className="flex flex-col items-center gap-1">
        <span style={{ fontSize:'2.8rem', lineHeight:1,
          animation:`flagWobble ${f.dur * .75}s ease-in-out ${f.delay}s infinite alternate` }}>
          {f.emoji}
        </span>
        <span style={{ fontSize:'0.5rem', fontFamily:"'DM Mono',monospace", fontWeight:700,
          letterSpacing:'0.1em', textTransform:'uppercase', color:f.color,
          background:`${f.color}18`, border:`1px solid ${f.color}30`,
          padding:'1px 5px', borderRadius:3 }}>
          {f.name}
        </span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const go = () => navigate('/predict')

  return (
    <div className="home-page relative z-10">

      {/* ══ HERO ══ */}
      <section className="home-hero relative min-h-screen flex items-center px-6 pt-20 pb-10 overflow-hidden">
        {/* Pitch stripes */}
        <div className="absolute inset-0 pitch-stripes opacity-30 pointer-events-none" />
        <div className="home-hero-light" />

        {/* Flying flags */}
        {FLAGS.map((f, i) => <FlagBubble key={i} f={f} index={i} />)}

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center relative z-20">

          {/* Left: text */}
          <div className="home-hero-copy">
            {/* Live badge */}
            <div className="home-live-badge">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-[0.18em] uppercase text-gold">
                World Cup 2026 · 11/06 – 19/07 · USA/CAN/MEX
              </span>
            </div>

            <h1 className="font-display font-bold leading-[0.88] mb-6 home-title">
              <span className="text-white block">Ai Sẽ</span>
              <span className="gold-gradient block"
                style={{ filter:'drop-shadow(0 0 50px rgba(255,236,0,0.5))' }}>
                Vô Địch?
              </span>
            </h1>

            <p className="home-hero-text text-lg leading-relaxed mb-8 max-w-lg">
              Dự đoán tỉ số 104 trận đấu, tranh tài cùng đồng nghiệp và bạn bè.
              Người tiên tri nhất sẽ lên đỉnh bảng vinh quang!
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <button onClick={go} className="btn-gold text-base px-8 py-4 rounded-xl">
                {user ? 'Dự đoán ngay' : 'Nhập tên & dự đoán'}
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/leaderboard')} className="btn-outline text-base px-8 py-4 rounded-xl">
                Bảng xếp hạng
              </button>
            </div>

            {/* Stats */}
            <div className="home-stat-row">
              {HERO_STATS.map((s, i) => (
                <div key={i} className="stat-pill home-stat-pill">
                  <div className="home-stat-icon">{s.icon}</div>
                  <div className="font-display font-bold text-2xl gold-gradient">{s.value}</div>
                  <div className="font-mono text-xs mt-1 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: real player cards */}
          <div className="home-player-deck">
            {PLAYERS.map((p, i) => (
              <PlayerCard key={p.name} player={p} index={i} />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce z-20"
          style={{ color:'var(--c-muted)' }}>
          <span className="font-mono text-xs tracking-widest uppercase">Cuộn xuống</span>
          <div className="w-4 h-4 border-r-2 border-b-2 rotate-45" style={{ borderColor:'var(--c-muted)' }} />
        </div>
      </section>

      <hr className="divider-gold" />

      {/* ══ FLAG PARADE ══ */}
      <section className="py-12 px-6 overflow-hidden"
        style={{ background:'rgba(8,28,16,0.7)', backdropFilter:'blur(10px)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="reveal section-label text-center mb-6">32 Đội Tham Dự · World Cup 2026</p>
          <div className="flex flex-wrap justify-center gap-5">
            {FLAGS.map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 cursor-default group"
                style={{ animation:`flagFloat ${f.dur}s ease-in-out ${f.delay}s infinite alternate` }}>
                <span className="transition-transform duration-300 group-hover:scale-125 block"
                  style={{ fontSize:'3rem', filter:`drop-shadow(0 5px 16px ${f.color}65)` }}>
                  {f.emoji}
                </span>
                <span className="font-mono text-xs font-semibold" style={{ color:f.color, opacity:.9 }}>{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider-green" />

      {/* ══ PLAYER SPOTLIGHT ══ */}
      <section className="home-spotlight py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="home-section-head reveal">
            <div>
              <p className="section-label">Real player cards</p>
              <h2 className="font-display font-bold text-white">Ngôi sao tạo khác biệt</h2>
            </div>
            <button onClick={() => navigate('/matches')} className="btn-outline">
              Lịch đấu <ArrowRight size={16}/>
            </button>
          </div>

          <div className="home-spotlight-grid">
            {PLAYERS.map((p, i) => (
              <div key={p.name} className="home-spotlight-card reveal" style={{ transitionDelay:`${i*75}ms` }}>
                <img src={p.image} alt={`${p.name} on the pitch`} loading="lazy" />
                <div>
                  <span>{p.flag} {p.country}</span>
                  <h3>{p.name}</h3>
                  <p>{p.role} · {p.stat}</p>
                  <strong>{p.goals} bàn thắng sự nghiệp</strong>
                </div>
              </div>
            ))}
          </div>
          <p className="home-photo-credit reveal">
            Ảnh cầu thủ:
            {PLAYERS.map((p, i) => (
              <a key={p.name} href={p.sourceUrl} target="_blank" rel="noreferrer">
                {i > 0 ? ', ' : ' '}{p.name}
              </a>
            ))}
            {' '}qua Wikimedia Commons.
          </p>
        </div>
      </section>

      <hr className="divider-gold" />

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="reveal section-label">Cách chơi</p>
            <h2 className="reveal font-display font-bold text-white" style={{ fontSize:'clamp(2rem,5vw,3.5rem)' }}>
              4 bước đơn giản
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div key={i} className="reveal card p-6 group" style={{ transitionDelay:`${i*80}ms` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background:'rgba(26,122,60,0.2)', border:'1px solid rgba(26,122,60,0.4)',
                    color:'#4ADE80' }}>
                  {s.icon}
                </div>
                <div className="font-mono text-xs mb-2" style={{ color:'var(--c-muted)' }}>0{i+1}</div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:'var(--c-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider-gold" />

      {/* ══ SCORING + LEADERBOARD ══ */}
      <section className="py-24 px-6" style={{ background:'rgba(8,28,16,0.55)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Scoring */}
          <div className="reveal">
            <p className="section-label">Hệ thống điểm</p>
            <h2 className="font-display font-bold text-white mb-8" style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)' }}>
              Ghi điểm thế nào?
            </h2>
            <div className="card overflow-hidden">
              {SCORING.map((s, i) => (
                <div key={i}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors ${i < SCORING.length-1 ? 'border-b' : ''}`}
                  style={{ borderColor:'rgba(26,122,60,0.25)' }}>
                  <span className="text-sm" style={{ color:'rgba(210,240,220,0.82)' }}>{s.label}</span>
                  <span className="font-display font-bold text-2xl"
                    style={{ color:s.color, textShadow:`0 0 20px ${s.color}66` }}>{s.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini leaderboard */}
          <div className="reveal" style={{ transitionDelay:'100ms' }}>
            <p className="section-label">Bảng xếp hạng</p>
            <h2 className="font-display font-bold text-white mb-8" style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)' }}>
              Top 3 hiện tại
            </h2>
            <div className="card overflow-hidden">
              <div className="grid grid-cols-[44px_1fr_64px_56px] px-5 py-3 border-b font-mono text-xs font-bold uppercase tracking-widest"
                style={{ borderColor:'rgba(26,122,60,0.25)', color:'var(--c-muted)', background:'rgba(26,122,60,0.08)' }}>
                <div>#</div><div>Người chơi</div><div className="text-right">Điểm</div><div className="text-right">Đúng</div>
              </div>
              {MOCK_LB.map(row => (
                <div key={row.rank} className="grid grid-cols-[44px_1fr_64px_56px] px-5 py-4 border-b items-center hover:bg-white/[0.03] transition-colors"
                  style={{ borderColor:'rgba(26,122,60,0.18)' }}>
                  <div className="text-2xl">{row.icon}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background:row.color, color:'#0A2E1A', boxShadow:`0 0 14px ${row.color}66` }}>
                      {row.name.slice(0,2)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">{row.name}</div>
                      {row.exact > 0 && (
                        <div className="flex items-center gap-1 text-xs mt-0.5 text-gold">
                          <Star size={9} fill="currentColor"/>{row.exact} tỉ số chính xác
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right font-display font-bold text-xl"
                    style={{ color:row.color, textShadow:`0 0 12px ${row.color}55` }}>{row.pts}</div>
                  <div className="text-right text-sm font-mono text-green-400">{row.correct}</div>
                </div>
              ))}
              <div className="px-5 py-3 text-center">
                <button onClick={() => navigate('/leaderboard')}
                  className="text-sm font-medium inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                  style={{ color:'var(--c-muted)' }}>
                  Xem toàn bộ <ArrowRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider-green" />

      {/* ══ CTA ══ */}
      <section className="home-final-cta py-24 px-6 text-center">
        <div className="max-w-xl mx-auto reveal">
          <div className="home-trophy-mark"><Trophy size={58}/></div>
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize:'clamp(2rem,5vw,3.5rem)' }}>
            Sẵn sàng <span className="gold-gradient">chinh phục?</span>
          </h2>
          <p className="text-lg mb-10" style={{ color:'rgba(180,230,195,0.5)' }}>
            Chỉ cần tên và số điện thoại. Kết quả có thể xuất ra Excel hoặc Google Sheets.
          </p>
          <button onClick={go} className="btn-gold px-10 py-4 text-base rounded-xl">
            {user ? 'Dự đoán ngay' : 'Bắt đầu dự đoán'}
            <ArrowRight size={18}/>
          </button>
        </div>
      </section>

      <style>{`
        @keyframes flagFloat  { from { transform: translateY(0) rotate(-5deg); } to { transform: translateY(-18px) rotate(5deg); } }
        @keyframes flagWobble { from { transform: rotate(-8deg) scale(0.94);  } to { transform: rotate(8deg) scale(1.06); } }
      `}</style>
    </div>
  )
}
