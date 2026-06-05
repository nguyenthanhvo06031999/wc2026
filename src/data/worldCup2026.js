const STAGE_LABELS = {
  all: 'Tất cả',
  group: 'Vòng bảng',
  round_of_32: 'Vòng 32 đội',
  round_of_16: 'Vòng 16 đội',
  quarter: 'Tứ kết',
  semi: 'Bán kết',
  third_place: 'Tranh hạng ba',
  final: 'Chung kết',
}

const STAGE_ORDER = ['group', 'round_of_32', 'round_of_16', 'quarter', 'semi', 'third_place', 'final']

const TEAM_INFO = {
  Mexico: ['Mexico', 'MEX', '🇲🇽'], 'South Africa': ['Nam Phi', 'RSA', '🇿🇦'],
  'South Korea': ['Hàn Quốc', 'KOR', '🇰🇷'], Czechia: ['Séc', 'CZE', '🇨🇿'],
  Canada: ['Canada', 'CAN', '🇨🇦'], 'Bosnia and Herzegovina': ['Bosnia & Herzegovina', 'BIH', '🇧🇦'],
  Qatar: ['Qatar', 'QAT', '🇶🇦'], Switzerland: ['Thụy Sĩ', 'SUI', '🇨🇭'],
  USA: ['Mỹ', 'USA', '🇺🇸'], Paraguay: ['Paraguay', 'PAR', '🇵🇾'],
  Australia: ['Úc', 'AUS', '🇦🇺'], Türkiye: ['Thổ Nhĩ Kỳ', 'TUR', '🇹🇷'],
  Brazil: ['Brazil', 'BRA', '🇧🇷'], Morocco: ['Morocco', 'MAR', '🇲🇦'],
  Haiti: ['Haiti', 'HAI', '🇭🇹'], Scotland: ['Scotland', 'SCO', '🏴'],
  Germany: ['Đức', 'GER', '🇩🇪'], Curaçao: ['Curaçao', 'CUW', '🇨🇼'],
  'Ivory Coast': ['Bờ Biển Ngà', 'CIV', '🇨🇮'], Ecuador: ['Ecuador', 'ECU', '🇪🇨'],
  Netherlands: ['Hà Lan', 'NED', '🇳🇱'], Japan: ['Nhật Bản', 'JPN', '🇯🇵'],
  Sweden: ['Thụy Điển', 'SWE', '🇸🇪'], Tunisia: ['Tunisia', 'TUN', '🇹🇳'],
  Belgium: ['Bỉ', 'BEL', '🇧🇪'], Egypt: ['Ai Cập', 'EGY', '🇪🇬'],
  Iran: ['Iran', 'IRN', '🇮🇷'], 'New Zealand': ['New Zealand', 'NZL', '🇳🇿'],
  Spain: ['Tây Ban Nha', 'ESP', '🇪🇸'], 'Cabo Verde': ['Cape Verde', 'CPV', '🇨🇻'],
  'Saudi Arabia': ['Saudi Arabia', 'KSA', '🇸🇦'], Uruguay: ['Uruguay', 'URU', '🇺🇾'],
  France: ['Pháp', 'FRA', '🇫🇷'], Senegal: ['Senegal', 'SEN', '🇸🇳'],
  Iraq: ['Iraq', 'IRQ', '🇮🇶'], Norway: ['Na Uy', 'NOR', '🇳🇴'],
  Argentina: ['Argentina', 'ARG', '🇦🇷'], Algeria: ['Algeria', 'ALG', '🇩🇿'],
  Austria: ['Áo', 'AUT', '🇦🇹'], Jordan: ['Jordan', 'JOR', '🇯🇴'],
  Portugal: ['Bồ Đào Nha', 'POR', '🇵🇹'], 'DR Congo': ['CHDC Congo', 'COD', '🇨🇩'],
  Uzbekistan: ['Uzbekistan', 'UZB', '🇺🇿'], Colombia: ['Colombia', 'COL', '🇨🇴'],
  England: ['Anh', 'ENG', '🏴'], Croatia: ['Croatia', 'CRO', '🇭🇷'],
  Ghana: ['Ghana', 'GHA', '🇬🇭'], Panama: ['Panama', 'PAN', '🇵🇦'],
}

const GROUP_MATCHES = [
  ['A', '2026-06-11', '3:00 PM', 'Mexico', 'South Africa', 'Mexico City Stadium'],
  ['A', '2026-06-11', '10:00 PM', 'South Korea', 'Czechia', 'Guadalajara Stadium'],
  ['B', '2026-06-12', '3:00 PM', 'Canada', 'Bosnia and Herzegovina', 'Toronto Stadium'],
  ['D', '2026-06-12', '9:00 PM', 'USA', 'Paraguay', 'Los Angeles Stadium'],
  ['B', '2026-06-13', '3:00 PM', 'Qatar', 'Switzerland', 'San Francisco Bay Area Stadium'],
  ['C', '2026-06-13', '6:00 PM', 'Brazil', 'Morocco', 'New York New Jersey Stadium'],
  ['C', '2026-06-13', '9:00 PM', 'Haiti', 'Scotland', 'Boston Stadium'],
  ['D', '2026-06-14', '12:00 AM', 'Australia', 'Türkiye', 'BC Place, Vancouver'],
  ['E', '2026-06-14', '1:00 PM', 'Germany', 'Curaçao', 'Houston Stadium'],
  ['F', '2026-06-14', '4:00 PM', 'Netherlands', 'Japan', 'Dallas Stadium'],
  ['E', '2026-06-14', '7:00 PM', 'Ivory Coast', 'Ecuador', 'Philadelphia Stadium'],
  ['F', '2026-06-14', '10:00 PM', 'Sweden', 'Tunisia', 'Monterrey Stadium'],
  ['H', '2026-06-15', '12:00 PM', 'Spain', 'Cabo Verde', 'Atlanta Stadium'],
  ['G', '2026-06-15', '3:00 PM', 'Belgium', 'Egypt', 'Seattle Stadium'],
  ['H', '2026-06-15', '6:00 PM', 'Saudi Arabia', 'Uruguay', 'Miami Stadium'],
  ['G', '2026-06-15', '9:00 PM', 'Iran', 'New Zealand', 'Los Angeles Stadium'],
  ['I', '2026-06-16', '3:00 PM', 'France', 'Senegal', 'New York New Jersey Stadium'],
  ['I', '2026-06-16', '6:00 PM', 'Iraq', 'Norway', 'Boston Stadium'],
  ['J', '2026-06-16', '9:00 PM', 'Argentina', 'Algeria', 'Kansas City Stadium'],
  ['J', '2026-06-17', '12:00 AM', 'Austria', 'Jordan', 'San Francisco Bay Area Stadium'],
  ['K', '2026-06-17', '1:00 PM', 'Portugal', 'DR Congo', 'Houston Stadium'],
  ['L', '2026-06-17', '4:00 PM', 'England', 'Croatia', 'Dallas Stadium'],
  ['L', '2026-06-17', '7:00 PM', 'Ghana', 'Panama', 'Toronto Stadium'],
  ['K', '2026-06-17', '10:00 PM', 'Uzbekistan', 'Colombia', 'Mexico City Stadium'],
  ['A', '2026-06-18', '12:00 PM', 'Czechia', 'South Africa', 'Atlanta Stadium'],
  ['B', '2026-06-18', '3:00 PM', 'Switzerland', 'Bosnia and Herzegovina', 'Los Angeles Stadium'],
  ['B', '2026-06-18', '6:00 PM', 'Canada', 'Qatar', 'BC Place, Vancouver'],
  ['A', '2026-06-18', '9:00 PM', 'Mexico', 'South Korea', 'Guadalajara Stadium'],
  ['D', '2026-06-19', '12:00 AM', 'Türkiye', 'Paraguay', 'San Francisco Bay Area Stadium'],
  ['D', '2026-06-19', '3:00 PM', 'USA', 'Australia', 'Seattle Stadium'],
  ['C', '2026-06-19', '6:00 PM', 'Scotland', 'Morocco', 'Boston Stadium'],
  ['C', '2026-06-19', '8:30 PM', 'Brazil', 'Haiti', 'Philadelphia Stadium'],
  ['F', '2026-06-20', '1:00 PM', 'Netherlands', 'Sweden', 'Houston Stadium'],
  ['E', '2026-06-20', '4:00 PM', 'Germany', 'Ivory Coast', 'Toronto Stadium'],
  ['E', '2026-06-20', '8:00 PM', 'Ecuador', 'Curaçao', 'Kansas City Stadium'],
  ['F', '2026-06-21', '12:00 AM', 'Tunisia', 'Japan', 'Monterrey Stadium'],
  ['H', '2026-06-21', '12:00 PM', 'Spain', 'Saudi Arabia', 'Atlanta Stadium'],
  ['G', '2026-06-21', '3:00 PM', 'Belgium', 'Iran', 'Los Angeles Stadium'],
  ['H', '2026-06-21', '6:00 PM', 'Uruguay', 'Cabo Verde', 'Miami Stadium'],
  ['G', '2026-06-21', '9:00 PM', 'New Zealand', 'Egypt', 'BC Place, Vancouver'],
  ['J', '2026-06-22', '1:00 PM', 'Argentina', 'Austria', 'Dallas Stadium'],
  ['I', '2026-06-22', '5:00 PM', 'France', 'Iraq', 'Philadelphia Stadium'],
  ['I', '2026-06-22', '8:00 PM', 'Norway', 'Senegal', 'New York New Jersey Stadium'],
  ['J', '2026-06-22', '11:00 PM', 'Jordan', 'Algeria', 'San Francisco Bay Area Stadium'],
  ['K', '2026-06-23', '1:00 PM', 'Portugal', 'Uzbekistan', 'Houston Stadium'],
  ['L', '2026-06-23', '4:00 PM', 'England', 'Ghana', 'Boston Stadium'],
  ['L', '2026-06-23', '7:00 PM', 'Panama', 'Croatia', 'Toronto Stadium'],
  ['K', '2026-06-23', '10:00 PM', 'Colombia', 'DR Congo', 'Guadalajara Stadium'],
  ['B', '2026-06-24', '3:00 PM', 'Switzerland', 'Canada', 'BC Place, Vancouver'],
  ['B', '2026-06-24', '3:00 PM', 'Bosnia and Herzegovina', 'Qatar', 'Seattle Stadium'],
  ['C', '2026-06-24', '6:00 PM', 'Scotland', 'Brazil', 'Miami Stadium'],
  ['C', '2026-06-24', '6:00 PM', 'Morocco', 'Haiti', 'Atlanta Stadium'],
  ['A', '2026-06-24', '9:00 PM', 'Czechia', 'Mexico', 'Mexico City Stadium'],
  ['A', '2026-06-24', '9:00 PM', 'South Africa', 'South Korea', 'Monterrey Stadium'],
  ['E', '2026-06-25', '4:00 PM', 'Curaçao', 'Ivory Coast', 'Philadelphia Stadium'],
  ['E', '2026-06-25', '4:00 PM', 'Ecuador', 'Germany', 'New York New Jersey Stadium'],
  ['F', '2026-06-25', '7:00 PM', 'Japan', 'Sweden', 'Dallas Stadium'],
  ['F', '2026-06-25', '7:00 PM', 'Tunisia', 'Netherlands', 'Kansas City Stadium'],
  ['D', '2026-06-25', '10:00 PM', 'Türkiye', 'USA', 'Los Angeles Stadium'],
  ['D', '2026-06-25', '10:00 PM', 'Paraguay', 'Australia', 'San Francisco Bay Area Stadium'],
  ['I', '2026-06-26', '3:00 PM', 'Norway', 'France', 'Boston Stadium'],
  ['I', '2026-06-26', '3:00 PM', 'Senegal', 'Iraq', 'Toronto Stadium'],
  ['H', '2026-06-26', '8:00 PM', 'Cabo Verde', 'Saudi Arabia', 'Houston Stadium'],
  ['H', '2026-06-26', '8:00 PM', 'Uruguay', 'Spain', 'Guadalajara Stadium'],
  ['G', '2026-06-26', '11:00 PM', 'Egypt', 'Iran', 'Seattle Stadium'],
  ['G', '2026-06-26', '11:00 PM', 'New Zealand', 'Belgium', 'BC Place, Vancouver'],
  ['L', '2026-06-27', '5:00 PM', 'Panama', 'England', 'New York New Jersey Stadium'],
  ['L', '2026-06-27', '5:00 PM', 'Croatia', 'Ghana', 'Philadelphia Stadium'],
  ['K', '2026-06-27', '7:30 PM', 'Colombia', 'Portugal', 'Miami Stadium'],
  ['K', '2026-06-27', '7:30 PM', 'DR Congo', 'Uzbekistan', 'Atlanta Stadium'],
  ['J', '2026-06-27', '10:00 PM', 'Algeria', 'Austria', 'Kansas City Stadium'],
  ['J', '2026-06-27', '10:00 PM', 'Jordan', 'Argentina', 'Dallas Stadium'],
]

const KNOCKOUT_MATCHES = [
  ['round_of_32', '2026-06-28', '3:00 PM', 'Nhì bảng A', 'Nhì bảng B', 'Los Angeles Stadium'],
  ['round_of_32', '2026-06-29', '1:00 PM', 'Nhất bảng C', 'Nhì bảng F', 'Houston Stadium'],
  ['round_of_32', '2026-06-29', '4:30 PM', 'Nhất bảng E', 'Đội hạng ba tốt nhất A/B/C/D/F', 'Boston Stadium'],
  ['round_of_32', '2026-06-29', '9:00 PM', 'Nhất bảng F', 'Nhì bảng C', 'Monterrey Stadium'],
  ['round_of_32', '2026-06-30', '1:00 PM', 'Nhì bảng E', 'Nhì bảng I', 'Dallas Stadium'],
  ['round_of_32', '2026-06-30', '5:00 PM', 'Nhất bảng I', 'Đội hạng ba tốt nhất C/D/F/G/H', 'New York New Jersey Stadium'],
  ['round_of_32', '2026-06-30', '9:00 PM', 'Nhất bảng A', 'Đội hạng ba tốt nhất C/E/F/H/I', 'Mexico City Stadium'],
  ['round_of_32', '2026-07-01', '12:00 PM', 'Nhất bảng L', 'Đội hạng ba tốt nhất E/H/I/J/K', 'Atlanta Stadium'],
  ['round_of_32', '2026-07-01', '4:00 PM', 'Nhất bảng G', 'Đội hạng ba tốt nhất A/E/H/I/J', 'Seattle Stadium'],
  ['round_of_32', '2026-07-01', '8:00 PM', 'Nhất bảng D', 'Đội hạng ba tốt nhất B/E/F/I/J', 'San Francisco Bay Area Stadium'],
  ['round_of_32', '2026-07-02', '3:00 PM', 'Nhất bảng H', 'Nhì bảng J', 'Los Angeles Stadium'],
  ['round_of_32', '2026-07-02', '7:00 PM', 'Nhì bảng K', 'Nhì bảng L', 'Toronto Stadium'],
  ['round_of_32', '2026-07-02', '11:00 PM', 'Nhất bảng B', 'Đội hạng ba tốt nhất E/F/G/I/J', 'BC Place, Vancouver'],
  ['round_of_32', '2026-07-03', '2:00 PM', 'Nhì bảng D', 'Nhì bảng G', 'Dallas Stadium'],
  ['round_of_32', '2026-07-03', '6:00 PM', 'Nhất bảng J', 'Nhì bảng H', 'Miami Stadium'],
  ['round_of_32', '2026-07-03', '9:30 PM', 'Nhất bảng K', 'Đội hạng ba tốt nhất D/E/I/J/L', 'Kansas City Stadium'],
  ['round_of_16', '2026-07-04', '1:00 PM', 'Thắng M73', 'Thắng M75', 'Houston Stadium'],
  ['round_of_16', '2026-07-04', '5:00 PM', 'Thắng M74', 'Thắng M77', 'Philadelphia Stadium'],
  ['round_of_16', '2026-07-05', '4:00 PM', 'Thắng M76', 'Thắng M78', 'New York New Jersey Stadium'],
  ['round_of_16', '2026-07-05', '8:00 PM', 'Thắng M79', 'Thắng M80', 'Mexico City Stadium'],
  ['round_of_16', '2026-07-06', '3:00 PM', 'Thắng M83', 'Thắng M84', 'Dallas Stadium'],
  ['round_of_16', '2026-07-06', '8:00 PM', 'Thắng M81', 'Thắng M82', 'Seattle Stadium'],
  ['round_of_16', '2026-07-07', '12:00 PM', 'Thắng M86', 'Thắng M88', 'Atlanta Stadium'],
  ['round_of_16', '2026-07-07', '4:00 PM', 'Thắng M85', 'Thắng M87', 'BC Place, Vancouver'],
  ['quarter', '2026-07-09', '4:00 PM', 'Thắng M89', 'Thắng M90', 'Boston Stadium'],
  ['quarter', '2026-07-10', '3:00 PM', 'Thắng M93', 'Thắng M94', 'Los Angeles Stadium'],
  ['quarter', '2026-07-11', '5:00 PM', 'Thắng M91', 'Thắng M92', 'Miami Stadium'],
  ['quarter', '2026-07-11', '9:00 PM', 'Thắng M95', 'Thắng M96', 'Kansas City Stadium'],
  ['semi', '2026-07-14', '3:00 PM', 'Thắng M97', 'Thắng M98', 'Dallas Stadium'],
  ['semi', '2026-07-15', '3:00 PM', 'Thắng M99', 'Thắng M100', 'Atlanta Stadium'],
  ['third_place', '2026-07-18', '5:00 PM', 'Thua M101', 'Thua M102', 'Miami Stadium'],
  ['final', '2026-07-19', '3:00 PM', 'Thắng M101', 'Thắng M102', 'New York New Jersey Stadium'],
]

function parseEasternDate(date, time) {
  const [, hourRaw, minuteRaw, period] = time.match(/(\d+):(\d+) (AM|PM)/)
  let hour = Number(hourRaw)
  const minute = Number(minuteRaw)
  if (period === 'AM' && hour === 12) hour = 0
  if (period === 'PM' && hour !== 12) hour += 12
  return new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00-04:00`)
}

function getTeam(rawName) {
  const [name, code, flag] = TEAM_INFO[rawName] || [rawName, '', '']
  return { name, code, flag }
}

function buildMatches() {
  const groupMatches = GROUP_MATCHES.map(([group, date, time, home, away, venue], index) => ({
    id: `M${String(index + 1).padStart(3, '0')}`,
    stage: 'group',
    group,
    date,
    time,
    home,
    away,
    venue,
  }))

  const knockoutMatches = KNOCKOUT_MATCHES.map(([stage, date, time, home, away, venue], index) => ({
    id: `M${index + 73}`,
    stage,
    group: '',
    date,
    time,
    home,
    away,
    venue,
  }))

  return [...groupMatches, ...knockoutMatches]
}

export const MATCHES_BASE = buildMatches()


export { STAGE_LABELS, STAGE_ORDER, parseEasternDate, getTeam }

export function resolveTeam(rawName) {
  const team = getTeam(rawName)
  return { ...team, color: team.color || '#64748B' }
}

export const MATCHES = MATCHES_BASE
