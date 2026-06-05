import { useState, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function SoundButton() {
  const [playing, setPlaying] = useState(false)
  const ctxRef = useRef(null)
  const gainRef = useRef(null)
  const timerRef = useRef(null)

  function note(ctx, gain, freq, start, dur) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.connect(g); g.connect(gain)
    osc.frequency.value = freq
    osc.type = 'triangle'
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(0.35, start + 0.02)
    g.gain.linearRampToValueAtTime(0, start + dur - 0.05)
    osc.start(start); osc.stop(start + dur)
  }

  function playLoop(ctx, gain) {
    const t = ctx.currentTime
    const melody = [523, 659, 784, 1047, 784, 659, 784, 1047, 523, 659, 784]
    const times  = [0, .2, .35, .5, .7, .9, 1.1, 1.3, 1.5, 1.7, 1.9]
    melody.forEach((f, i) => note(ctx, gain, f, t + times[i], 0.25))
    timerRef.current = setTimeout(() => {
      if (gainRef.current) playLoop(ctx, gain)
    }, 2200)
  }

  function toggle() {
    if (!playing) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const gain = ctx.createGain(); gain.gain.value = 0.15; gain.connect(ctx.destination)
      ctxRef.current = ctx; gainRef.current = gain
      playLoop(ctx, gain)
      setPlaying(true)
    } else {
      clearTimeout(timerRef.current)
      gainRef.current?.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.1)
      gainRef.current = null
      setPlaying(false)
    }
  }

  return (
    <button onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all"
      style={{
        background: 'rgba(255,215,0,0.15)',
        border: '1.5px solid rgba(255,215,0,0.4)',
        backdropFilter: 'blur(8px)',
      }}
      title={playing ? 'Tắt nhạc' : 'Bật nhạc'}>
      {playing ? <Volume2 size={20} className="text-gold" /> : <VolumeX size={20} className="text-muted" />}
    </button>
  )
}
