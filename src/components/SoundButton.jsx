import { useEffect, useRef, useState } from 'react'
import { SkipForward, Volume2, VolumeX } from 'lucide-react'
import { BACKGROUND_MUSIC_TRACKS } from '../data/backgroundMusic'

let sharedAudio

function getSharedAudio() {
  if (!sharedAudio) sharedAudio = new Audio()
  return sharedAudio
}

function getRandomTrackIndex(exceptIndex = -1) {
  if (BACKGROUND_MUSIC_TRACKS.length <= 1) return 0

  let nextIndex = exceptIndex
  while (nextIndex === exceptIndex) {
    nextIndex = Math.floor(Math.random() * BACKGROUND_MUSIC_TRACKS.length)
  }

  return nextIndex
}

export default function SoundButton() {
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [trackIndex, setTrackIndex] = useState(() => getRandomTrackIndex())
  const [hasError, setHasError] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const audioRef = useRef(getSharedAudio())

  const track = BACKGROUND_MUSIC_TRACKS[trackIndex]

  function playWithSound() {
    const audio = audioRef.current

    audio.muted = false
    setMuted(false)

    return audio.play().then(() => {
      setPlaying(true)
      setHasError(false)
      setAutoplayBlocked(false)
    })
  }

  function playMutedAfterAutoplayBlock() {
    const audio = audioRef.current

    audio.muted = true
    setMuted(true)
    setAutoplayBlocked(true)

    audio.play().then(() => {
      setPlaying(true)
    }).catch(() => {
      setPlaying(false)
    })
  }

  useEffect(() => {
    const audio = audioRef.current

    audio.volume = 0.28
    audio.muted = false
    audio.preload = 'auto'
    audio.src = track.src
    setHasError(false)
    setAutoplayBlocked(false)

    audio.play().then(() => {
      setPlaying(true)
      setMuted(false)
    }).catch(() => {
      playMutedAfterAutoplayBlock()
    })
  }, [track.src])

  useEffect(() => {
    const audio = audioRef.current
    audio.muted = muted
  }, [muted])

  useEffect(() => {
    const audio = audioRef.current

    function handleEnded() {
      nextTrack()
    }

    function handleError() {
      setHasError(true)
      nextTrack()
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    if (!autoplayBlocked) return undefined

    function startWithSound() {
      playWithSound().catch(() => {
        setPlaying(false)
        setAutoplayBlocked(true)
      })
    }

    window.addEventListener('pointerdown', startWithSound, { once: true })
    window.addEventListener('keydown', startWithSound, { once: true })

    return () => {
      window.removeEventListener('pointerdown', startWithSound)
      window.removeEventListener('keydown', startWithSound)
    }
  }, [autoplayBlocked])

  function nextTrack() {
    setTrackIndex((current) => getRandomTrackIndex(current))
  }

  function toggleMute() {
    if (autoplayBlocked || !playing) {
      playWithSound().catch(() => {
        setPlaying(false)
        setAutoplayBlocked(true)
      })
      return
    }

    setMuted((current) => !current)
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-lg px-2.5 py-2 shadow-2xl"
      style={{
        background: 'rgba(6,18,10,0.88)',
        border: '1px solid rgba(255,236,0,0.28)',
        backdropFilter: 'blur(16px)',
      }}>
      <button
        onClick={toggleMute}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-all"
        style={{
          background: playing && !muted ? 'rgba(255,236,0,0.18)' : 'rgba(255,255,255,0.06)',
          color: playing && !muted ? 'var(--c-gold)' : 'var(--c-muted)',
          border: '1px solid rgba(255,236,0,0.24)',
        }}
        title={autoplayBlocked ? 'Bật nhạc' : muted ? 'Bật tiếng' : 'Tắt tiếng'}>
        {playing && !muted ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      <div className="min-w-0 max-w-[180px] sm:max-w-[260px]">
        <div className="flex min-w-0 items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wider" style={{ color:'var(--c-muted)' }}>
          {playing && !muted ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>{hasError ? 'Không phát được bài này' : autoplayBlocked ? 'Chạm để nghe' : muted ? 'Tắt âm' : 'Nhạc nền'}</span>
        </div>
        <div className="truncate text-sm font-semibold text-white">{track.title}</div>
        <div className="truncate text-xs" style={{ color:'var(--c-muted)' }}>{track.artist}</div>
      </div>

      <button
        onClick={nextTrack}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-all"
        style={{
          background: 'rgba(255,255,255,0.06)',
          color: 'var(--c-gold)',
          border: '1px solid rgba(255,236,0,0.18)',
        }}
        title="Bai tiep theo">
        <SkipForward size={18} />
      </button>
    </div>
  )
}
