import { MATCHES_BASE, STAGE_LABELS as BASE_STAGE_LABELS, STAGE_ORDER, getTeam, parseEasternDate } from './worldCup2026'

const MATCH_UPDATES_KEY = 'wc2026.matchUpdates'

export const STAGE_LABELS = {
  ...BASE_STAGE_LABELS,
  group: 'Vòng bảng',
  round_of_32: 'Vòng 32 đội',
  round_of_16: 'Vòng 16 đội',
  third_place: 'Tranh hạng 3',
  final: 'Chung kết',
}

export { STAGE_ORDER }
export { parseEasternDate }

function normalizeMatch(baseMatch) {
  const home = getTeam(baseMatch.home)
  const away = getTeam(baseMatch.away)
  const matchTime = parseEasternDate(baseMatch.date, baseMatch.time).toISOString()

  return {
    ...baseMatch,
    groupName: baseMatch.group,
    match_time: matchTime,
    home: baseMatch.home,
    away: baseMatch.away,
    home_code: home.code,
    away_code: away.code,
    status: 'upcoming',
    source: 'local-fixture',
  }
}

export const MATCHES_BASE_NORMALIZED = MATCHES_BASE.map(normalizeMatch)

export function resolveTeam(rawName) {
  const team = getTeam(rawName)
  return {
    name: team.name,
    code: team.code || rawName,
    flag: team.flag || '🏳️',
    color: team.color || '#64748B',
  }
}

export function getMatchUpdates() {
  try {
    const updates = JSON.parse(localStorage.getItem(MATCH_UPDATES_KEY)) || []
    return Array.isArray(updates) ? updates : []
  } catch {
    return []
  }
}

export function saveMatchUpdates(updates) {
  const normalized = normalizeUpdates(updates)
  localStorage.setItem(MATCH_UPDATES_KEY, JSON.stringify(normalized))
  window.dispatchEvent(new CustomEvent('wc2026:match-updates', { detail: normalized }))
  return normalized
}

export function mergeMatchUpdates(matches = MATCHES_BASE_NORMALIZED, updates = getMatchUpdates()) {
  const byId = new Map(normalizeUpdates(updates).map(update => [update.id, update]))
  return matches.map(match => {
    const update = byId.get(match.id)
    if (!update) return match
    return {
      ...match,
      ...update,
      groupName: update.groupName ?? update.group ?? match.groupName,
      status: update.status || match.status,
    }
  })
}

export function getCurrentMatches() {
  return mergeMatchUpdates()
}

export async function fetchMatchUpdates() {
  const url = import.meta.env.VITE_MATCHES_FEED_URL
  if (!url) return { configured: false, updates: getMatchUpdates() }

  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Match feed returned ${response.status}`)
  }

  const data = await response.json()
  const updates = Array.isArray(data) ? data : data.matches || []
  return {
    configured: true,
    updated_at: data.updated_at || new Date().toISOString(),
    updates: saveMatchUpdates(updates),
  }
}

function normalizeUpdates(updates) {
  if (!Array.isArray(updates)) return []

  return updates
    .filter(update => update && update.id)
    .map(update => {
      const actualHome = getNullableNumber(update.actual_home ?? update.home_score)
      const actualAway = getNullableNumber(update.actual_away ?? update.away_score)
      const status = update.status || (actualHome == null || actualAway == null ? undefined : 'finished')

      return {
        ...update,
        id: String(update.id),
        ...(actualHome == null ? {} : { actual_home: actualHome }),
        ...(actualAway == null ? {} : { actual_away: actualAway }),
        ...(status ? { status } : {}),
        updated_at: update.updated_at || new Date().toISOString(),
      }
    })
}

function getNullableNumber(value) {
  if (value === '' || value == null) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export const MATCHES = getCurrentMatches()
