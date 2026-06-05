import { resolveTeam } from '../data/matches'
import { useLiveMatches } from '../lib/useLiveMatches'

function getTickerItems(matches) {
  const scored = matches
    .filter(match => typeof match.actual_home === 'number' && typeof match.actual_away === 'number')
    .sort((a, b) => new Date(b.updated_at || b.match_time) - new Date(a.updated_at || a.match_time))
    .slice(0, 6)

  const upcoming = matches
    .filter(match => match.status !== 'finished' && new Date(match.match_time) > new Date())
    .sort((a, b) => new Date(a.match_time) - new Date(b.match_time))
    .slice(0, 6)

  const source = scored.length > 0 ? scored : upcoming

  return source.map(match => {
    const home = resolveTeam(match.home)
    const away = resolveTeam(match.away)
    const hasScore = typeof match.actual_home === 'number' && typeof match.actual_away === 'number'
    const time = new Date(match.match_time).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    return {
      tag: match.status === 'live' ? 'LIVE' : hasScore ? 'KT' : 'SẮP',
      cls: match.status === 'live' ? 'tag-live' : hasScore ? 'tag-done' : 'tag-soon',
      dot: match.status === 'live',
      left: home.name,
      mid: hasScore ? `${match.actual_home} - ${match.actual_away}` : 'vs',
      right: away.name,
      extra: hasScore ? match.id : time,
    }
  })
}

export default function LiveTicker() {
  const { matches, syncState } = useLiveMatches()
  const items = getTickerItems(matches)
  const doubled = [...items, ...items]

  return (
    <div className="relative z-20 h-9 overflow-hidden flex items-center"
      style={{
        background: 'rgba(6,18,10,0.97)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,236,0,0.2)',
      }}>
      <div className="flex-shrink-0 px-4 h-full flex items-center gap-1.5 border-r z-10"
        style={{
          background: syncState.error ? 'linear-gradient(135deg,#7f1d1d,#ef4444)' : 'linear-gradient(135deg,#1A7A3C,#22C55E)',
          borderColor: 'rgba(26,122,60,0.5)',
        }}>
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        <span className="font-display font-bold text-xs tracking-widest" style={{ color:'#0A2E1A' }}>
          {syncState.configured ? 'LIVE' : 'FIX'}
        </span>
      </div>

      <div className="overflow-hidden flex-1">
        <div className="ticker-inner items-center h-9">
          {doubled.map((item, i) => (
            <span key={`${item.left}-${item.right}-${i}`} className="inline-flex items-center gap-2.5 px-6 whitespace-nowrap text-sm">
              <span className={`tag ${item.cls}`}>
                {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
                {item.tag}
              </span>
              <span className="font-medium" style={{ color:'rgba(220,245,225,0.9)' }}>{item.left}</span>
              {item.mid && (
                <span className="font-mono font-bold px-1.5 py-0.5 rounded text-gold"
                  style={{ background:'rgba(255,236,0,0.1)' }}>{item.mid}</span>
              )}
              <span className="font-medium" style={{ color:'rgba(220,245,225,0.9)' }}>{item.right}</span>
              {item.extra && <span className="text-xs" style={{ color:'var(--c-muted)' }}>{item.extra}</span>}
              <span className="mx-1" style={{ color:'rgba(255,255,255,0.1)' }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
