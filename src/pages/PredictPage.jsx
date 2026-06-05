import { useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth'
import toast from 'react-hot-toast'
import { Clock, MapPin, CheckCircle, Lock, ChevronDown, ChevronUp, FileSpreadsheet, UserRound, Activity } from 'lucide-react'
import { STAGE_LABELS, STAGE_ORDER, resolveTeam } from '../data/matches'
import { useLiveMatches } from '../lib/useLiveMatches'
import {
  downloadExcelWorkbook,
  downloadMatchResultsCsv,
  downloadRankingsCsv,
  getPredictionsForPhone,
  savePrediction,
  syncToSheets,
} from '../lib/predictionStore'

function timeUntil(dt) {
  const diff = new Date(dt) - Date.now()
  if (diff < 0) return null
  const h = Math.floor(diff/3.6e6), m = Math.floor((diff%3.6e6)/6e4)
  if (h > 48) return `${Math.floor(h/24)} ngày nữa`
  if (h > 0) return `${h}g${m}p nữa`
  return `${m} phút nữa`
}

function MatchCard({ match, existing, onSubmit, disabled }) {
  const [home, setHome] = useState(existing?.predicted_home ?? '')
  const [away, setAway] = useState(existing?.predicted_away ?? '')
  const [loading, setLoading] = useState(false)
  const homeTeam = resolveTeam(match.home)
  const awayTeam = resolveTeam(match.away)
  const isPast = new Date(match.match_time) <= new Date()
  const countdown = timeUntil(match.match_time)
  const hasActualScore = typeof match.actual_home === 'number' && typeof match.actual_away === 'number'
  const fmtTime = new Date(match.match_time).toLocaleString('vi-VN', {
    weekday:'short', day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'
  })

  const handleSubmit = async () => {
    if (disabled) { toast.error('Nhập tên và số điện thoại trước'); return }
    if (home===''||away==='') { toast.error('Nhập đủ tỉ số!'); return }
    setLoading(true)
    await onSubmit(match.id, parseInt(home), parseInt(away))
    setLoading(false)
  }

  return (
    <div className="prediction-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b"
        style={{ background:'rgba(123,80,179,0.08)', borderColor:'rgba(123,80,179,0.2)' }}>
        <div className="flex items-center gap-3 text-xs" style={{ color:'var(--c-muted)' }}>
          <span className="font-mono font-bold text-gold">{match.id}</span>
          <span className="flex items-center gap-1"><Clock size={11}/>{fmtTime}</span>
          <span className="flex items-center gap-1 hidden sm:flex"><MapPin size={11}/>{match.venue}</span>
        </div>
        <div className="flex items-center gap-2">
          {match.groupName && (
            <span className="tag tag-purple">Bảng {match.groupName}</span>
          )}
          {isPast
            ? <span className="tag tag-done">✓ Đã diễn ra</span>
            : countdown && <span className="tag tag-soon">⏰ {countdown}</span>
          }
          {hasActualScore && <span className="tag tag-live">Tỷ số {match.actual_home}-{match.actual_away}</span>}
          {existing && <span className="flex items-center gap-1 text-green-400 text-xs font-semibold"><CheckCircle size={11}/>Đã đoán</span>}
        </div>
      </div>

      {/* Main */}
      <div className="px-5 py-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Home team */}
        <div className="flex-1 flex flex-col items-center gap-2 text-center">
          <div className="text-4xl" style={{ filter:`drop-shadow(0 3px 10px ${homeTeam.color}66)` }}>{homeTeam.flag}</div>
          <div className="font-display font-bold text-sm text-white leading-tight">{homeTeam.name}</div>
          <div className="font-mono text-xs" style={{ color:'var(--c-muted)' }}>{homeTeam.code}</div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-2">
          {hasActualScore && (
            <div className="actual-score-pill">
              <span>FT</span>
              <strong>{match.actual_home} - {match.actual_away}</strong>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input type="number" className="score-input" min="0" max="20"
              value={home} placeholder="0"
              onChange={e=>setHome(e.target.value)} disabled={isPast || disabled} />
            <span className="font-display font-bold text-2xl" style={{ color:'var(--c-muted)' }}>–</span>
            <input type="number" className="score-input" min="0" max="20"
              value={away} placeholder="0"
              onChange={e=>setAway(e.target.value)} disabled={isPast || disabled} />
          </div>
          {existing && (
            <div className="text-xs text-center" style={{ color:'var(--c-muted)' }}>
              Dự đoán: <span className="font-mono text-gold font-bold">{existing.predicted_home}–{existing.predicted_away}</span>
              {hasActualScore && <span className="text-green-400 ml-1">+{existing.points_earned || 0}đ</span>}
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex flex-col items-center gap-2 text-center">
          <div className="text-4xl" style={{ filter:`drop-shadow(0 3px 10px ${awayTeam.color}66)` }}>{awayTeam.flag}</div>
          <div className="font-display font-bold text-sm text-white leading-tight">{awayTeam.name}</div>
          <div className="font-mono text-xs" style={{ color:'var(--c-muted)' }}>{awayTeam.code}</div>
        </div>
      </div>

      {/* Action */}
      <div className="px-5 pb-4">
        <button onClick={handleSubmit} disabled={isPast||loading||disabled}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          style={isPast
            ? { background:'rgba(255,255,255,0.05)', color:'var(--c-muted)', cursor:'not-allowed' }
            : disabled
              ? { background:'rgba(255,255,255,0.05)', color:'var(--c-muted)', cursor:'not-allowed' }
            : existing
              ? { background:'rgba(255,236,0,0.15)', color:'var(--c-gold)', border:'1px solid rgba(255,236,0,0.3)' }
              : { background:'linear-gradient(135deg,#7B50B3,#9D72D4)', color:'#fff', boxShadow:'0 4px 20px rgba(123,80,179,0.4)' }
          }>
          {isPast ? <><Lock size={13}/>Đã hết hạn</> : disabled ? 'Nhập thông tin trước' : loading ? 'Đang lưu...' : existing ? '✏️ Cập nhật' : '🔮 Gửi dự đoán'}
        </button>
      </div>
    </div>
  )
}

function ParticipantGate({ user, setUser }) {
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const set = key => event => setForm(current => ({ ...current, [key]: event.target.value }))

  const handleSubmit = async event => {
    event.preventDefault()
    if (form.name.trim().length < 2) {
      toast.error('Nhập tên của bạn')
      return
    }
    if (form.phone.replace(/\D/g, '').length < 8) {
      toast.error('Số điện thoại chưa hợp lệ')
      return
    }
    const participant = setUser(form)
    const result = await syncToSheets('participant', participant)
    toast.success(result.ok ? `Đã lưu ${participant.name}. Google Sheets đang nhận nền.` : `Đã lưu ${participant.name} cục bộ.`)
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background:'rgba(255,236,0,0.12)', color:'var(--c-gold)', border:'1px solid rgba(255,236,0,0.26)' }}>
          <UserRound size={18}/>
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-white">Nhập thông tin người chơi</h2>
          <p className="text-sm" style={{ color:'var(--c-muted)' }}>
            Không cần tài khoản. Số điện thoại sẽ dùng để lưu và tính bảng xếp hạng.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
        <input className="participant-input" value={form.name} onChange={set('name')} placeholder="Tên của bạn" required />
        <input className="participant-input" value={form.phone} onChange={set('phone')} placeholder="Số điện thoại" type="tel" required />
        <button className="btn-gold justify-center rounded-xl" type="submit">Lưu thông tin</button>
      </div>
    </form>
  )
}

export default function PredictPage() {
  const { user, setUser } = useAuth()
  const { matches, syncState } = useLiveMatches()
  const [predictionVersion, setPredictionVersion] = useState(0)
  const [activeStage, setActiveStage] = useState('group')
  const [expandedGroups, setExpandedGroups] = useState({ A:true, B:true, C:true, D:true, E:true, F:true, G:true, H:true, I:true, J:true, K:true, L:true })

  const myPreds = useMemo(() => {
    void predictionVersion
    if (!user) return {}
    const map = {}
    getPredictionsForPhone(user.phone).forEach(prediction => { map[prediction.match_id] = prediction })
    return map
  }, [user, predictionVersion])

  const handleSubmit = async (matchId, home, away) => {
    if (!user) {
      toast.error('Nhập tên và số điện thoại trước')
      return
    }
    try {
      const result = await savePrediction(user, { match_id:matchId, predicted_home:home, predicted_away:away })
      setPredictionVersion(version => version + 1)
      toast.success(result.sheetSync.ok ? 'Dự đoán đã lưu. Google Sheets đang nhận nền.' : 'Dự đoán đã lưu cục bộ. Google Sheets chưa đồng bộ.')
    } catch {
      toast.error('Không lưu được dự đoán')
    }
  }

  const stageMatches = matches.filter(m => m.stage === activeStage)
  const predicted = matches.filter(m=>m.status!=='finished').length
  const done = Object.keys(myPreds).length

  // Group matches by groupName for group stage
  const byGroup = stageMatches.reduce((acc,m) => {
    const g = m.groupName || 'KO'
    acc[g] = acc[g]||[]
    acc[g].push(m)
    return acc
  }, {})

  const toggleGroup = (g) => setExpandedGroups(prev => ({...prev, [g]: !prev[g]}))

  return (
    <div className="relative z-10 min-h-screen pt-[4.5rem]">
      {/* Page header */}
      <div className="border-b" style={{ borderColor:'rgba(123,80,179,0.2)', background:'rgba(13,8,32,0.85)', backdropFilter:'blur(16px)' }}>
        <div className="max-w-4xl mx-auto px-6 py-7">
          <h1 className="font-display font-bold text-3xl text-white mb-1">Dự đoán trận đấu</h1>
          <p className="text-sm mb-5" style={{ color:'var(--c-muted)' }}>
            Đặt tỉ số trước giờ bóng lăn — {matches.length} trận tổng cộng
            {user && <span className="text-gold"> · {user.name} ({user.phone})</span>}
          </p>

          <div className="prediction-sync-bar">
            <span className={syncState.error ? 'tag tag-live' : syncState.configured ? 'tag tag-green' : 'tag tag-purple'}>
              <Activity size={12}/>
              {syncState.error ? 'Lỗi cập nhật tỷ số' : syncState.configured ? 'Tỷ số tự động' : 'Dữ liệu lịch offline'}
            </span>
            <small>
              {syncState.error || (syncState.updated_at ? `Cập nhật ${new Date(syncState.updated_at).toLocaleTimeString('vi-VN')}` : 'Thêm VITE_MATCHES_FEED_URL để cập nhật live')}
            </small>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={downloadMatchResultsCsv} className="btn-outline text-xs rounded-lg" type="button">
              <FileSpreadsheet size={14}/> Xuất trận đấu CSV
            </button>
            <button onClick={downloadRankingsCsv} className="btn-outline text-xs rounded-lg" type="button">
              <FileSpreadsheet size={14}/> Xuất BXH CSV
            </button>
            <button onClick={downloadExcelWorkbook} className="btn-gold text-xs rounded-lg" type="button">
              <FileSpreadsheet size={14}/> Xuất Excel tổng hợp
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:'rgba(123,80,179,0.2)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width:`${predicted>0?(done/predicted)*100:0}%`, background:'linear-gradient(90deg,#7B50B3,#FFEC00)' }}/>
            </div>
            <span className="font-mono text-xs whitespace-nowrap" style={{ color:'var(--c-muted)' }}>{done}/{predicted} trận</span>
          </div>

          {/* Stage tabs */}
          <div className="flex gap-2 flex-wrap">
            {STAGE_ORDER.map(s => {
              const count = matches.filter(m=>m.stage===s).length
              return (
                <button key={s} onClick={()=>setActiveStage(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                  style={activeStage===s
                    ? { background:'linear-gradient(135deg,#7B50B3,#9D72D4)', color:'#fff', boxShadow:'0 4px 16px rgba(123,80,179,0.4)' }
                    : { background:'rgba(123,80,179,0.1)', color:'var(--c-muted)', border:'1px solid rgba(123,80,179,0.2)' }
                  }>
                  {STAGE_LABELS[s]}
                  <span className="font-mono opacity-70">({count})</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Matches */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {!user && <ParticipantGate user={user} setUser={setUser} />}
        {activeStage === 'group' ? (
          // Group stage: collapsible by group
          Object.entries(byGroup).sort().map(([grp, gMatches]) => (
            <div key={grp} className="mb-6">
              <button onClick={()=>toggleGroup(grp)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl mb-3 transition-all"
                style={{ background:'rgba(123,80,179,0.12)', border:'1px solid rgba(123,80,179,0.25)' }}>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-lg" style={{ color:'var(--c-gold)' }}>Bảng {grp}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background:'rgba(255,236,0,0.1)', color:'var(--c-gold)' }}>
                    {gMatches.length} trận
                  </span>
                  <span className="font-mono text-xs" style={{ color:'var(--c-muted)' }}>
                    {gMatches.filter(m=>myPreds[m.id]).length}/{gMatches.length} đã dự đoán
                  </span>
                </div>
                {expandedGroups[grp] ? <ChevronUp size={18} color="var(--c-muted)"/> : <ChevronDown size={18} color="var(--c-muted)"/>}
              </button>
              {expandedGroups[grp] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gMatches.map(m => (
                    <MatchCard key={`${m.id}-${user?.phone || 'guest'}-${myPreds[m.id]?.updated_at || 'new'}`} match={m} existing={myPreds[m.id]} onSubmit={handleSubmit} disabled={!user} />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          // KO rounds: flat list
          <div className="flex flex-col gap-4">
            {stageMatches.map(m => (
              <MatchCard key={`${m.id}-${user?.phone || 'guest'}-${myPreds[m.id]?.updated_at || 'new'}`} match={m} existing={myPreds[m.id]} onSubmit={handleSubmit} disabled={!user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
