import { getCurrentMatches, resolveTeam } from '../data/matches'

const PARTICIPANT_KEY = 'wc2026.participant'
const PREDICTIONS_KEY = 'wc2026.predictions'
const SHEETS_WEBHOOK_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL

export function normalizePhone(phone = '') {
  return phone.replace(/[^\d+]/g, '').replace(/^00/, '+')
}

export function getParticipant() {
  try {
    return JSON.parse(localStorage.getItem(PARTICIPANT_KEY)) || null
  } catch {
    return null
  }
}

export function saveParticipant(profile) {
  const participant = {
    name: profile.name.trim(),
    phone: normalizePhone(profile.phone),
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(PARTICIPANT_KEY, JSON.stringify(participant))
  return participant
}

export function clearParticipant() {
  localStorage.removeItem(PARTICIPANT_KEY)
}

export function getAllPredictions() {
  try {
    return JSON.parse(localStorage.getItem(PREDICTIONS_KEY)) || []
  } catch {
    return []
  }
}

export function getPredictionsForPhone(phone) {
  const key = normalizePhone(phone)
  return getAllPredictions().filter(prediction => prediction.phone === key)
}

export async function savePrediction(participant, prediction) {
  const now = new Date().toISOString()
  const phone = normalizePhone(participant.phone)
  const nextPrediction = {
    ...prediction,
    phone,
    name: participant.name.trim(),
    predicted_home: Number(prediction.predicted_home),
    predicted_away: Number(prediction.predicted_away),
    updated_at: now,
  }
  const match = getCurrentMatches().find(item => item.id === nextPrediction.match_id)
  nextPrediction.points_earned = match ? scorePrediction(nextPrediction, match) : 0

  const predictions = getAllPredictions()
  const index = predictions.findIndex(item => item.phone === phone && item.match_id === prediction.match_id)
  const next = index >= 0
    ? predictions.map((item, itemIndex) => itemIndex === index ? { ...item, ...nextPrediction } : item)
    : [...predictions, nextPrediction]

  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(next))
  return {
    prediction: nextPrediction,
    sheetSync: await syncToSheets('prediction', nextPrediction),
  }
}

function outcome(home, away) {
  if (home === away) return 'D'
  return home > away ? 'H' : 'A'
}

export function scorePrediction(prediction, match) {
  if (typeof match.actual_home !== 'number' || typeof match.actual_away !== 'number') return 0
  const exact = prediction.predicted_home === match.actual_home && prediction.predicted_away === match.actual_away
  const correctOutcome = outcome(prediction.predicted_home, prediction.predicted_away) === outcome(match.actual_home, match.actual_away)
  return (correctOutcome ? 3 : 0) + (exact ? 2 : 0)
}

export function getRankings() {
  const byPhone = new Map()
  const matchesById = new Map(getCurrentMatches().map(match => [match.id, match]))

  getAllPredictions().forEach(prediction => {
    const match = matchesById.get(prediction.match_id)
    if (!match) return

    const current = byPhone.get(prediction.phone) || {
      phone: prediction.phone,
      name: prediction.name,
      total_points: 0,
      correct_results: 0,
      correct_scores: 0,
      predictions_count: 0,
      updated_at: prediction.updated_at,
    }
    const points = scorePrediction(prediction, match)
    const hasResult = typeof match.actual_home === 'number' && typeof match.actual_away === 'number'
    const exact = hasResult && prediction.predicted_home === match.actual_home && prediction.predicted_away === match.actual_away

    current.name = prediction.name
    current.total_points += points
    current.correct_results += points >= 3 ? 1 : 0
    current.correct_scores += exact ? 1 : 0
    current.predictions_count += 1
    current.updated_at = prediction.updated_at
    byPhone.set(prediction.phone, current)
  })

  return [...byPhone.values()]
    .sort((a, b) => b.total_points - a.total_points || b.correct_scores - a.correct_scores || b.predictions_count - a.predictions_count)
    .map((row, index) => ({ ...row, rank: index + 1, user_id: row.phone }))
}

function csvEscape(value) {
  const text = value == null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function downloadCsv(filename, headers, rows) {
  const csv = [headers, ...rows].map(row => row.map(csvEscape).join(',')).join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function htmlEscape(value) {
  return csvEscape(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function getMatchExportRows() {
  const predictions = getAllPredictions()
  const predictionsByMatch = new Map()
  predictions.forEach(prediction => {
    const list = predictionsByMatch.get(prediction.match_id) || []
    list.push(prediction)
    predictionsByMatch.set(prediction.match_id, list)
  })

  return getCurrentMatches().flatMap(match => {
    const home = resolveTeam(match.home)
    const away = resolveTeam(match.away)
    const matchPredictions = predictionsByMatch.get(match.id) || [null]
    return matchPredictions.map(prediction => [
      match.id,
      match.stage,
      match.groupName || '',
      match.match_time,
      match.venue,
      home.name,
      away.name,
      match.actual_home ?? '',
      match.actual_away ?? '',
      match.status,
      prediction?.name || '',
      prediction?.phone || '',
      prediction?.predicted_home ?? '',
      prediction?.predicted_away ?? '',
      prediction ? scorePrediction(prediction, match) : '',
      prediction?.updated_at || '',
    ])
  })
}

export function downloadMatchResultsCsv() {
  const headers = [
    'match_id', 'stage', 'group', 'match_time', 'venue', 'home_team', 'away_team',
    'actual_home', 'actual_away', 'status', 'member_name', 'phone', 'predicted_home',
    'predicted_away', 'points', 'updated_at',
  ]
  downloadCsv('worldcup-match-results.csv', headers, getMatchExportRows())
}

export function downloadRankingsCsv() {
  const headers = ['rank', 'member_name', 'phone', 'total_points', 'correct_results', 'correct_scores', 'predictions_count', 'updated_at']
  const rows = getRankings().map(row => [
    row.rank,
    row.name,
    row.phone,
    row.total_points,
    row.correct_results,
    row.correct_scores,
    row.predictions_count,
    row.updated_at,
  ])
  downloadCsv('worldcup-member-rankings.csv', headers, rows)
}

export function downloadExcelWorkbook() {
  const matchHeaders = [
    'match_id', 'stage', 'group', 'match_time', 'venue', 'home_team', 'away_team',
    'actual_home', 'actual_away', 'status', 'member_name', 'phone', 'predicted_home',
    'predicted_away', 'points', 'updated_at',
  ]
  const rankingHeaders = ['rank', 'member_name', 'phone', 'total_points', 'correct_results', 'correct_scores', 'predictions_count', 'updated_at']
  const rankingRows = getRankings().map(row => [
    row.rank,
    row.name,
    row.phone,
    row.total_points,
    row.correct_results,
    row.correct_scores,
    row.predictions_count,
    row.updated_at,
  ])

  const table = (title, headers, rows) => `
    <h2>${htmlEscape(title)}</h2>
    <table border="1">
      <thead><tr>${headers.map(header => `<th>${htmlEscape(header)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${htmlEscape(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
  `
  const workbook = `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        ${table('Match Results', matchHeaders, getMatchExportRows())}
        <br>
        ${table('Member Rankings', rankingHeaders, rankingRows)}
      </body>
    </html>
  `

  downloadBlob('worldcup-results-and-rankings.xls', workbook, 'application/vnd.ms-excel;charset=utf-8;')
}

export async function syncToSheets(type, payload) {
  if (!SHEETS_WEBHOOK_URL) {
    return { configured: false, ok: false, verified: false, error: 'Missing VITE_SHEETS_WEBHOOK_URL' }
  }

  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, payload }),
    })
    return { configured: true, ok: true, verified: false }
  } catch (error) {
    return { configured: true, ok: false, verified: false, error: error instanceof Error ? error.message : 'Unknown sync error' }
  }
}
