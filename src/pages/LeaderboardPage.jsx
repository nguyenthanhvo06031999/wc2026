import { useState } from 'react'
import { Trophy, Medal, Star, TrendingUp, FileSpreadsheet } from 'lucide-react'
import { downloadExcelWorkbook, downloadMatchResultsCsv, downloadRankingsCsv, getRankings } from '../lib/predictionStore'

const RANK_STYLE = [
  { color:'#FFEC00', bg:'rgba(255,236,0,0.1)',   border:'rgba(255,236,0,0.25)',   icon:<Trophy size={16}/> },
  { color:'#94A3B8', bg:'rgba(148,163,184,0.1)', border:'rgba(148,163,184,0.25)',icon:<Medal  size={16}/> },
  { color:'#CD7F32', bg:'rgba(205,127,50,0.1)',  border:'rgba(205,127,50,0.25)', icon:<Medal  size={16}/> },
]

function Podium({ data }) {
  if(data.length<3) return null
  const slots = [
    {entry:data[1], rank:2, height:'h-20', label:'🥈'},
    {entry:data[0], rank:1, height:'h-32', label:'🥇'},
    {entry:data[2], rank:3, height:'h-16', label:'🥉'},
  ]
  return (
    <div className="flex items-end justify-center gap-4 mb-12">
      {slots.map(({entry,rank,height,label})=>{
        const rs = RANK_STYLE[rank-1]
        return (
          <div key={rank} className="flex flex-col items-center gap-2 w-32">
            <span className="text-3xl">{label}</span>
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-sm"
              style={{ background:rs.color, color:'#0D0820', boxShadow:`0 0 20px ${rs.color}60` }}>
              {entry.name.slice(0,2).toUpperCase()}
            </div>
            <div className="font-semibold text-sm text-white text-center leading-tight">{entry.name}</div>
            <div className="font-display font-bold text-xl" style={{ color:rs.color, textShadow:`0 0 12px ${rs.color}66` }}>
              {entry.total_points}đ
            </div>
            <div className={`w-full ${height} rounded-t-xl`}
              style={{ background:`linear-gradient(180deg,${rs.bg},transparent)`, border:`1px solid ${rs.border}`, borderBottom:'none' }}/>
          </div>
        )
      })}
    </div>
  )
}

export default function LeaderboardPage() {
  const [data] = useState(() => getRankings())
  const [tab, setTab] = useState('overall')

  const sorted = tab==='overall'
    ? [...data].sort((a,b)=>b.total_points-a.total_points)
    : [...data].sort((a,b)=>b.correct_scores-a.correct_scores)

  return (
    <div className="relative z-10 min-h-screen pt-[4.5rem]">
      {/* Header */}
      <div className="border-b" style={{ borderColor:'rgba(123,80,179,0.2)', background:'rgba(13,8,32,0.85)', backdropFilter:'blur(16px)' }}>
        <div className="max-w-3xl mx-auto px-6 py-7">
          <div className="flex items-center gap-3 mb-1">
            <Trophy className="text-gold" size={28}/>
            <h1 className="font-display font-bold text-3xl text-white">Bảng xếp hạng</h1>
          </div>
          <p className="text-sm mb-5" style={{ color:'var(--c-muted)' }}>
            Lấy từ dữ liệu dự đoán đã lưu. Có thể xuất CSV để mở bằng Excel hoặc Google Sheets.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[['overall','Tổng điểm',<TrendingUp size={14}/>],['exact','Tỉ số chính xác',<Star size={14}/>]].map(([t,l,ic])=>(
              <button key={t} onClick={()=>setTab(t)}
                className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all"
                style={tab===t
                  ? { background:'linear-gradient(135deg,#7B50B3,#9D72D4)', color:'#fff', boxShadow:'0 4px 16px rgba(123,80,179,0.4)' }
                  : { background:'rgba(123,80,179,0.1)', color:'var(--c-muted)', border:'1px solid rgba(123,80,179,0.2)' }
                }>
                {ic}{l}
              </button>
            ))}
            <button onClick={downloadRankingsCsv} className="btn-outline text-sm rounded-lg" type="button">
              <FileSpreadsheet size={14}/> Xuất BXH CSV
            </button>
            <button onClick={downloadMatchResultsCsv} className="btn-outline text-sm rounded-lg" type="button">
              <FileSpreadsheet size={14}/> Xuất trận đấu CSV
            </button>
            <button onClick={downloadExcelWorkbook} className="btn-gold text-sm rounded-lg" type="button">
              <FileSpreadsheet size={14}/> Xuất Excel tổng hợp
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Podium */}
        {sorted.length>=3 && <Podium data={sorted}/>}

        {/* Table */}
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="grid px-5 py-3 border-b font-mono text-xs font-bold uppercase tracking-widest"
            style={{ gridTemplateColumns:'52px 1fr 80px 72px 72px',
              borderColor:'rgba(123,80,179,0.2)', color:'var(--c-muted)', background:'rgba(123,80,179,0.06)' }}>
            <div>Hạng</div><div>Người chơi</div>
            <div className="text-right">Điểm</div>
            <div className="text-right">KQ đúng</div>
            <div className="text-right">Tỉ số</div>
          </div>

          {sorted.length === 0 ? (
            <div className="py-16 text-center">
              <div className="font-display text-lg text-white">Chưa có dự đoán nào</div>
              <p className="text-sm mt-1" style={{ color:'var(--c-muted)' }}>Vào trang Dự đoán, nhập tên và số điện thoại để bắt đầu.</p>
            </div>
          ) : sorted.map((row,i)=>{
            const isTop = i<3
            const rs = isTop ? RANK_STYLE[i] : null
            return (
              <div key={row.user_id} className="grid items-center px-5 py-4 border-b hover:bg-white/[0.025] transition-colors"
                style={{ gridTemplateColumns:'52px 1fr 80px 72px 72px', borderColor:'rgba(123,80,179,0.12)' }}>
                {/* Rank */}
                <div>
                  {isTop ? (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background:rs.bg, color:rs.color, border:`1px solid ${rs.border}` }}>
                      {rs.icon}
                    </div>
                  ) : (
                    <span className="font-mono text-sm" style={{ color:'var(--c-muted)' }}>{row.rank}</span>
                  )}
                </div>
                {/* User */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={isTop
                      ? { background:rs.color, color:'#0D0820', boxShadow:`0 0 12px ${rs.color}55` }
                      : { background:'rgba(123,80,179,0.2)', color:'var(--c-muted)' }}>
                    {row.name.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isTop?'text-white':'text-white/75'}`}>{row.name}</div>
                    {row.correct_scores>0&&(
                      <div className="flex items-center gap-1 text-xs mt-0.5 text-gold">
                        <Star size={9} fill="currentColor"/>{row.correct_scores} tỉ số chính xác
                      </div>
                    )}
                  </div>
                </div>
                {/* Points */}
                <div className="text-right font-display font-bold text-lg"
                  style={{ color:isTop?rs.color:'var(--c-text)', textShadow:isTop?`0 0 12px ${rs.color}44`:'' }}>
                  {row.total_points}
                </div>
                <div className="text-right text-sm font-mono text-green-400">{row.correct_results}</div>
                <div className="text-right text-sm font-mono text-gold">{row.correct_scores}</div>
              </div>
            )
          })}
        </div>

        {/* Points guide */}
        <div className="mt-6 card px-5 py-5">
          <p className="font-mono text-xs font-bold uppercase tracking-widest mb-4 text-gold">Cách tính điểm</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
            {[
              ['Đúng kết quả (W/D/L)','3đ','#4ADE80'],
              ['Đúng tỉ số chính xác','+2đ','#FFEC00'],
              ['Đúng đội vô địch','10đ','#FFEC00'],
              ['Đúng top 4 (mỗi đội)','3đ','#A78BFA'],
              ['Đúng Vua phá lưới','5đ','#C084FC'],
            ].map(([k,v,c])=>(
              <div key={k} className="flex items-center justify-between py-2 border-b"
                style={{ borderColor:'rgba(123,80,179,0.15)' }}>
                <span className="text-xs" style={{ color:'var(--c-muted)' }}>{k}</span>
                <span className="font-mono font-bold text-sm" style={{ color:c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
