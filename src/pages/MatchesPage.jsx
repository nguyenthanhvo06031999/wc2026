import { useMemo, useState } from 'react'
import { CalendarDays, Clock3, Filter, MapPin, Search, Shield, Trophy } from 'lucide-react'
import { STAGE_LABELS, STAGE_ORDER, parseEasternDate, resolveTeam } from '../data/matches'
import { useLiveMatches } from '../lib/useLiveMatches'
import matchAction from '../assets/matches/match-action.png'
import matchTunnel from '../assets/matches/match-tunnel.png'
import matchFinal from '../assets/matches/match-final.png'

const MATCH_IMAGES = {
  group: matchAction,
  round_of_32: matchTunnel,
  round_of_16: matchTunnel,
  quarter: matchFinal,
  semi: matchFinal,
  third_place: matchFinal,
  final: matchFinal,
}

function formatDateVN(date, time) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(parseEasternDate(date, time))
}

function formatTimeVN(date, time) {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(parseEasternDate(date, time))
}

function getHandicap(match) {
  const seed = [...match.id, ...match.home].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const lines = [-2, -1.5, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.5]
  const line = lines[seed % lines.length]
  const homeOdd = (1.83 + (seed % 9) / 100).toFixed(2)
  const awayOdd = (1.86 + (seed % 7) / 100).toFixed(2)
  const awayLine = -line

  const showLine = (value) => value > 0 ? `+${value}` : `${value}`
  return {
    homeLine: showLine(line),
    awayLine: showLine(awayLine),
    homeOdd,
    awayOdd,
  }
}

function getMatchImage(match) {
  return MATCH_IMAGES[match.stage] || matchAction
}

function TeamName({ teamName }) {
  const team = resolveTeam(teamName)
  return (
    <span className="match-board-team">
      {team.flag && <span>{team.flag}</span>}
      <strong>{team.name}</strong>
      {team.code && <small>{team.code}</small>}
    </span>
  )
}

function MatchBoardRow({ match }) {
  const handicap = getHandicap(match)
  const stageLabel = match.stage === 'group' ? `Bảng ${match.group}` : STAGE_LABELS[match.stage]
  const hasActualScore = typeof match.actual_home === 'number' && typeof match.actual_away === 'number'

  return (
    <article className="match-board-row">
      <img className="match-board-photo" src={getMatchImage(match)} alt="" loading="lazy" />

      <div className="match-board-index">
        <span>{match.id}</span>
        <small>{stageLabel}</small>
      </div>

      <div className="match-board-fixture">
        <TeamName teamName={match.home} />
        <span className="match-board-versus">vs</span>
        <TeamName teamName={match.away} />
      </div>

      <div className="match-board-when">
        <strong><CalendarDays size={15} /> {formatDateVN(match.date, match.time)}</strong>
        <span><Clock3 size={15} /> {formatTimeVN(match.date, match.time)} VN</span>
        <small>{match.time} ET</small>
      </div>

      <div className="match-board-venue">
        <MapPin size={16} />
        <span>{match.venue}</span>
      </div>

      <div className="match-board-score">
        <span>{match.status === 'live' ? 'Đang đá' : 'Tỷ số'}</span>
        <strong>{hasActualScore ? `${match.actual_home} - ${match.actual_away}` : 'Chưa có'}</strong>
      </div>

      <div className="match-board-odds" aria-label="Kèo chấp">
        <span>Kèo chấp</span>
        <div>
          <strong>{handicap.homeLine}</strong>
          <em>{handicap.homeOdd}</em>
        </div>
        <div>
          <strong>{handicap.awayLine}</strong>
          <em>{handicap.awayOdd}</em>
        </div>
      </div>
    </article>
  )
}

export default function MatchesPage() {
  const { matches, syncState } = useLiveMatches()
  const [activeStage, setActiveStage] = useState('all')
  const [query, setQuery] = useState('')

  const stageOptions = useMemo(() => [
    { key: 'all', label: STAGE_LABELS.all, count: matches.length },
    ...STAGE_ORDER.map((stage) => ({
      key: stage,
      label: STAGE_LABELS[stage],
      count: matches.filter((match) => match.stage === stage).length,
    })),
  ], [matches])

  const filteredMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return matches.filter((match) => {
      if (activeStage !== 'all' && match.stage !== activeStage) return false
      if (!normalizedQuery) return true

      const home = resolveTeam(match.home)
      const away = resolveTeam(match.away)
      const searchable = [
        home.name,
        home.code,
        away.name,
        away.code,
        match.home,
        match.away,
        match.group,
        STAGE_LABELS[match.stage],
        match.venue,
      ].join(' ').toLowerCase()

      return searchable.includes(normalizedQuery)
    })
  }, [activeStage, matches, query])

  const featuredMatch = filteredMatches[0] || matches[0]
  const featuredStage = featuredMatch.stage === 'group'
    ? `Bảng ${featuredMatch.group}`
    : STAGE_LABELS[featuredMatch.stage]
  const featuredHandicap = getHandicap(featuredMatch)
  const totalVenues = useMemo(() => new Set(matches.map((match) => match.venue)).size, [matches])
  const knockoutCount = useMemo(() => matches.filter((match) => match.stage !== 'group').length, [matches])

  return (
    <div className="matches-screen">
      <section className="matches-hero">
        <img src={matchAction} alt="" className="matches-hero-image" />
        <div className="matches-hero-content">
          <p className="matches-board-kicker"><Trophy size={16} /> FIFA World Cup 2026</p>
          <h1>Lịch thi đấu, tỷ số và kèo chấp</h1>
          <p className="matches-hero-copy">
            Theo dõi 104 trận đấu theo giờ Việt Nam, lọc nhanh theo vòng đấu và xem kèo chấp từng cặp.
          </p>
          <div className="matches-hero-stats">
            <div>
              <strong>{matches.length}</strong>
              <span>trận</span>
            </div>
            <div>
              <strong>{totalVenues}</strong>
              <span>sân</span>
            </div>
            <div>
              <strong>{knockoutCount}</strong>
              <span>knockout</span>
            </div>
          </div>
          <p className="matches-hero-copy text-xs">
            {syncState.error || (syncState.configured ? 'Tỷ số được làm mới tự động mỗi 60 giây.' : 'Đang dùng lịch cục bộ. Cấu hình VITE_MATCHES_FEED_URL để cập nhật tỷ số live.')}
          </p>
        </div>

        <div className="matches-featured-card">
          <img src={getMatchImage(featuredMatch)} alt="" />
          <div>
            <span>{featuredStage} · {featuredMatch.id}</span>
            <strong>{resolveTeam(featuredMatch.home).name} vs {resolveTeam(featuredMatch.away).name}</strong>
            <small><MapPin size={14} /> {featuredMatch.venue}</small>
          </div>
        </div>
      </section>

      <section className="matches-toolbar" aria-label="Bộ lọc lịch thi đấu">
        <div className="matches-toolbar-top">
          <div className="matches-search">
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm đội, bảng hoặc sân"
              aria-label="Tìm trận đấu"
            />
          </div>

          <div className="matches-board-summary">
            <strong>{filteredMatches.length}</strong>
            <span>trận đang hiển thị</span>
          </div>
        </div>

        <div className="matches-stage-tabs" role="tablist" aria-label="Lọc theo vòng đấu">
          {stageOptions.map((stage) => (
            <button
              key={stage.key}
              type="button"
              className={activeStage === stage.key ? 'is-active' : ''}
              onClick={() => setActiveStage(stage.key)}
            >
              {stage.label}
              <span>{stage.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="matches-list-shell" aria-label="Lịch thi đấu World Cup 2026">
        <div className="matches-section-heading">
          <span><Filter size={16} /> Bảng lịch thi đấu</span>
          <strong><Shield size={16} /> Kèo đầu: {featuredHandicap.homeLine} · {featuredHandicap.homeOdd}</strong>
        </div>

        <div className="match-board-head" aria-hidden="true">
          <span>Ảnh</span>
          <span>Trận</span>
          <span>Cặp đấu</span>
          <span>Ngày / giờ</span>
          <span>Sân</span>
          <span>Tỷ số</span>
          <span>Kèo chấp</span>
        </div>

        <div className="matches-list">
          {filteredMatches.map((match) => (
            <MatchBoardRow key={match.id} match={match} />
          ))}
        </div>
      </section>
    </div>
  )
}
