import { useMemo } from 'react'

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 100}%`,
  size: 2 + (i % 3),
  duration: 10 + (i % 8) * 2,
  delay: (i * 1.3) % 12,
  opacity: 0.15 + (i % 4) * 0.05,
  drift: ((i % 5) - 2) * 10,
}))

export default function GoldDust() {
  const particles = useMemo(() => PARTICLES, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[2]" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="gold-dust"
          style={{
            left: p.left,
            bottom: '-10px',
            '--dust-size': `${p.size}px`,
            '--dust-duration': `${p.duration}s`,
            '--dust-delay': `${p.delay}s`,
            '--dust-opacity': p.opacity,
            '--dust-drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
