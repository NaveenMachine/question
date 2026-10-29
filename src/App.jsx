import { useRef, useState } from 'react'
import { saveAnswer } from './supabase.js'

const bouquets = Array.from({ length: 30 }, () => ({
  left: Math.random() * 100,
  size: 1 + Math.random() * 1.5,
  duration: 6 + Math.random() * 6,
  delay: -Math.random() * 12,
}))
// re build
const fireworkEmojis = ['🥰', '🐶', '🚀', '🔥']
const FIREWORKS_MS = 30000
const PARTICLES_PER_BURST = 20

// Bursts are staggered so the last one finishes right as the 30s ends
function makeBursts() {
  return Array.from({ length: 50 }, () => {
    const size = 0.35 + Math.random() * 0.2
    return {
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      delay: Math.random() * (FIREWORKS_MS / 1000 - 1.5),
      particles: Array.from({ length: PARTICLES_PER_BURST }, (_, i) => {
        // Parametric heart curve; y is negated because screen y points down
        const t = (i / PARTICLES_PER_BURST) * 2 * Math.PI
        const x = 16 * Math.sin(t) ** 3
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
        return {
          emoji: fireworkEmojis[Math.floor(Math.random() * fireworkEmojis.length)],
          dx: x * size,
          dy: -y * size,
        }
      }),
    }
  })
}

function App() {
  const [saidYes, setSaidYes] = useState(false)
  const [saidNo, setSaidNo] = useState(false)
  const [fireworks, setFireworks] = useState(null)
  const timeout = useRef()

  function handleYes() {
    saveAnswer('yes')
    setSaidYes(true)
    setSaidNo(false)
    setFireworks({ id: Date.now(), bursts: makeBursts() })
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setFireworks(null), FIREWORKS_MS)
  }

  function handleNo() {
    saveAnswer('too soon')
    setSaidNo(true)
    setFireworks(null)
    clearTimeout(timeout.current)
  }

  return (
    <main>
      {saidNo && (
        <div className="too-soon" aria-hidden="true">
          🫪
        </div>
      )}
      {!saidYes && !saidNo && (
        <div className="confetti" aria-hidden="true">
          {bouquets.map((b, i) => (
            <span
              key={i}
              style={{
                left: `${b.left}%`,
                fontSize: `${b.size}rem`,
                animationDuration: `${b.duration}s`,
                animationDelay: `${b.delay}s`,
              }}
            >
              💐
            </span>
          ))}
        </div>
      )}
      {fireworks && (
        <div className="fireworks" key={fireworks.id} aria-hidden="true">
          {fireworks.bursts.map((burst, i) => (
            <div
              key={i}
              className="burst"
              style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
            >
              {burst.particles.map((p, j) => (
                <span
                  key={j}
                  style={{
                    '--dx': `${p.dx}rem`,
                    '--dy': `${p.dy}rem`,
                    animationDelay: `${burst.delay}s`,
                  }}
                >
                  {p.emoji}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
      <div className={saidYes || saidNo ? 'prompt answered' : 'prompt'}>
        <h1>Emily Gù will you be my girlfriend or whateva?</h1>
        <div className="answers">
          <button onClick={handleNo}>too soon🫪</button>
          <button onClick={handleYes}>yes🚀</button>
        </div>
      </div>
    </main>
  )
}

export default App
