const SHEET_NAMES = {
  participant: 'Participants',
  prediction: 'Predictions',
  rankings: 'Rankings',
}

const SHEET_HEADERS = {
  Participants: [
    'updated_at',
    'name',
    'phone',
  ],
  Predictions: [
    'updated_at',
    'name',
    'phone',
    'match_id',
    'predicted_home',
    'predicted_away',
    'points_earned',
  ],
  Rankings: [
    'rank',
    'name',
    'phone',
    'total_points',
    'correct_results',
    'correct_scores',
    'predictions_count',
    'updated_at',
  ],
}

function doGet(e) {
  if (e?.parameter?.cleanup === 'participants') {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    dedupeParticipants(getSheet(ss, SHEET_NAMES.participant))
    rebuildRankings(ss)
    return jsonResponse({
      ok: true,
      cleaned: 'participants',
    })
  }

  return jsonResponse({
    ok: true,
    service: 'worldcup-sheets-webhook',
    accepts: ['participant', 'prediction'],
    cleanup: '?cleanup=participants',
  })
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}')
  const type = body.type || 'prediction'
  const payload = body.payload || {}
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = getSheet(ss, SHEET_NAMES[type] || 'Events')

  if (type === 'participant') {
    upsertParticipant(sheet, payload)
    rebuildRankings(ss)
  } else if (type === 'prediction') {
    upsertPrediction(sheet, payload)
    rebuildRankings(ss)
  } else {
    sheet.appendRow([new Date(), type, JSON.stringify(payload)])
  }

  return jsonResponse({ ok: true })
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}

function getSheet(ss, name) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SHEET_HEADERS[name] || ['created_at', 'type', 'payload'])
  } else if (SHEET_HEADERS[name]) {
    sheet.getRange(1, 1, 1, SHEET_HEADERS[name].length).setValues([SHEET_HEADERS[name]])
  }
  return sheet
}

function upsertParticipant(sheet, participant) {
  const phone = normalizePhone(participant.phone)
  if (!phone) return

  const row = findRowByValue(sheet, 3, phone)
  const values = [
    participant.updated_at || new Date().toISOString(),
    participant.name || '',
    phone,
  ]

  if (row) {
    sheet.getRange(row, 1, 1, values.length).setValues([values])
  } else {
    sheet.appendRow(values)
  }
  dedupeParticipants(sheet)
}

function upsertPrediction(sheet, prediction) {
  const phone = normalizePhone(prediction.phone)
  const matchId = prediction.match_id || ''
  if (!phone || !matchId) return

  const row = findPredictionRow(sheet, phone, matchId)
  const values = [
    prediction.updated_at || new Date().toISOString(),
    prediction.name || '',
    phone,
    matchId,
    prediction.predicted_home ?? '',
    prediction.predicted_away ?? '',
    Number(prediction.points_earned || 0),
  ]

  if (row) {
    sheet.getRange(row, 1, 1, values.length).setValues([values])
  } else {
    sheet.appendRow(values)
  }
  removeDuplicatePredictionRows(sheet, phone, matchId)
}

function rebuildRankings(ss) {
  const participantsSheet = getSheet(ss, SHEET_NAMES.participant)
  const predictionsSheet = getSheet(ss, SHEET_NAMES.prediction)
  const rankingsSheet = getSheet(ss, SHEET_NAMES.rankings)
  const byPhone = {}

  readRows(participantsSheet).forEach(row => {
    const phone = normalizePhone(row[2])
    if (!phone) return
    byPhone[phone] = {
      name: row[1] || '',
      phone,
      total_points: 0,
      correct_results: 0,
      correct_scores: 0,
      predictions_count: 0,
      updated_at: row[0] || '',
    }
  })

  readRows(predictionsSheet).forEach(row => {
    const phone = normalizePhone(row[2])
    if (!phone) return
    const points = Number(row[6] || 0)
    const current = byPhone[phone] || {
      name: row[1] || '',
      phone,
      total_points: 0,
      correct_results: 0,
      correct_scores: 0,
      predictions_count: 0,
      updated_at: row[0] || '',
    }

    current.name = row[1] || current.name
    current.total_points += points
    current.correct_results += points >= 3 ? 1 : 0
    current.correct_scores += points >= 5 ? 1 : 0
    current.predictions_count += 1
    current.updated_at = row[0] || current.updated_at
    byPhone[phone] = current
  })

  const rankingRows = Object.keys(byPhone)
    .map(phone => byPhone[phone])
    .sort((a, b) => (
      b.total_points - a.total_points ||
      b.correct_scores - a.correct_scores ||
      b.predictions_count - a.predictions_count ||
      String(a.name).localeCompare(String(b.name))
    ))
    .map((row, index) => [
      index + 1,
      row.name,
      row.phone,
      row.total_points,
      row.correct_results,
      row.correct_scores,
      row.predictions_count,
      row.updated_at,
    ])

  rankingsSheet.clearContents()
  rankingsSheet.appendRow(SHEET_HEADERS.Rankings)
  if (rankingRows.length > 0) {
    rankingsSheet.getRange(2, 1, rankingRows.length, SHEET_HEADERS.Rankings.length).setValues(rankingRows)
  }
}

function readRows(sheet) {
  const lastRow = sheet.getLastRow()
  const lastColumn = sheet.getLastColumn()
  if (lastRow < 2 || lastColumn < 1) return []
  return sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues()
}

function findRowByValue(sheet, column, value) {
  const rows = readRows(sheet)
  for (let index = 0; index < rows.length; index += 1) {
    if (String(rows[index][column - 1]) === String(value)) {
      return index + 2
    }
  }
  return null
}

function findPredictionRow(sheet, phone, matchId) {
  const rows = readRows(sheet)
  for (let index = 0; index < rows.length; index += 1) {
    if (normalizePhone(rows[index][2]) === phone && String(rows[index][3]) === String(matchId)) {
      return index + 2
    }
  }
  return null
}

function dedupeParticipants(sheet) {
  const rows = readRows(sheet)
  const byPhone = {}

  rows.forEach(row => {
    const phone = normalizePhone(row[2])
    if (!phone) return

    const current = byPhone[phone]
    const next = [
      row[0] || '',
      row[1] || '',
      phone,
    ]

    if (!current || compareDates(next[0], current[0]) >= 0) {
      byPhone[phone] = next
    }
  })

  const dedupedRows = Object.keys(byPhone)
    .map(phone => byPhone[phone])
    .sort((a, b) => String(a[1]).localeCompare(String(b[1])) || String(a[2]).localeCompare(String(b[2])))

  sheet.clearContents()
  sheet.appendRow(SHEET_HEADERS.Participants)
  if (dedupedRows.length > 0) {
    sheet.getRange(2, 1, dedupedRows.length, SHEET_HEADERS.Participants.length).setValues(dedupedRows)
  }
}

function removeDuplicatePredictionRows(sheet, phone, matchId) {
  const rows = readRows(sheet)
  const matches = []
  rows.forEach((row, index) => {
    if (normalizePhone(row[2]) === phone && String(row[3]) === String(matchId)) {
      matches.push(index + 2)
    }
  })
  matches.slice(1).reverse().forEach(rowNumber => sheet.deleteRow(rowNumber))
}

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '').replace(/^00/, '+')
}

function compareDates(a, b) {
  const left = new Date(a).getTime()
  const right = new Date(b).getTime()
  if (Number.isNaN(left) && Number.isNaN(right)) return 0
  if (Number.isNaN(left)) return -1
  if (Number.isNaN(right)) return 1
  return left - right
}
