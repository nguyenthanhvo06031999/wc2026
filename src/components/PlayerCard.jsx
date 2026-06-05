import messiPhoto from '../assets/players/messi.jpg'
import mbappePhoto from '../assets/players/mbappe.jpg'
import haalandPhoto from '../assets/players/haaland.jpg'
import ronaldoPhoto from '../assets/players/ronaldo.jpg'

const PLAYERS = [
  {
    name: 'Lionel Messi',
    short: 'MESSI',
    country: 'Argentina',
    flag: '🇦🇷',
    number: '10',
    stat: 'World Cup 2022 MVP',
    goals: '800+',
    role: 'Nhạc trưởng',
    image: messiPhoto,
    primary: '#74C7EC',
    accent: '#F7D66A',
    source: 'Wikimedia Commons / Tasnim News Agency',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lionel-Messi-Argentina-2022-FIFA-World-Cup.jpg',
  },
  {
    name: 'Kylian Mbappé',
    short: 'MBAPPÉ',
    country: 'Pháp',
    flag: '🇫🇷',
    number: '10',
    stat: 'Golden Boot 2022',
    goals: '300+',
    role: 'Tốc độ',
    image: mbappePhoto,
    primary: '#305CFF',
    accent: '#F43F5E',
    source: 'Wikimedia Commons / soccer.ru',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kylian_Mbapp%C3%A9_France.jpg',
  },
  {
    name: 'Erling Haaland',
    short: 'HAALAND',
    country: 'Na Uy',
    flag: '🇳🇴',
    number: '9',
    stat: 'Finisher hàng đầu',
    goals: '250+',
    role: 'Sát thủ',
    image: haalandPhoto,
    primary: '#00B8D9',
    accent: '#FF4D4D',
    source: 'Wikimedia Commons / Jacek Stanislawek',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Erling_Haaland_2023.jpg',
  },
  {
    name: 'Cristiano Ronaldo',
    short: 'RONALDO',
    country: 'Bồ Đào Nha',
    flag: '🇵🇹',
    number: '7',
    stat: '5x Ballon dOr',
    goals: '900+',
    role: 'Biểu tượng',
    image: ronaldoPhoto,
    primary: '#22C55E',
    accent: '#F43F5E',
    source: 'Wikimedia Commons / soccer.ru',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_Portugal.jpg',
  },
]

export { PLAYERS }

export default function PlayerCard({ player, index = 0 }) {
  const offsets = [0, -26, 14, -12]
  const rotation = [-5, 3, -2, 5]

  return (
    <article
      className="player-card player-card-photo"
      style={{
        '--card-primary': player.primary,
        '--card-accent': player.accent,
        '--card-offset': `${offsets[index] || 0}px`,
        '--card-rotate': `${rotation[index] || 0}deg`,
      }}
    >
      <img src={player.image} alt={`${player.name} playing football`} loading="lazy" />
      <div className="player-card-shade" />
      <div className="player-card-topline">
        <span>{player.flag} {player.country}</span>
        <strong>{player.short}</strong>
      </div>
      <div className="player-card-number">{player.number}</div>
      <div className="player-card-content">
        <span>{player.role}</span>
        <h3>{player.name}</h3>
        <div>
          <strong>{player.goals}</strong>
          <small>{player.stat}</small>
        </div>
      </div>
    </article>
  )
}
