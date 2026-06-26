import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { target: 27, suffix: '', label: 'Governorates', icon: '𓉴' },
  { target: 1000, suffix: '+', label: 'Places', icon: '𓋹' },
  { target: 1, suffix: '', label: 'Game to Rule Them All', icon: '𓂀' },
]

function AnimatedCounter({ target, suffix, isInView }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 40
    const increment = target / steps
    let current = 0
    let step = 0
    const interval = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [isInView, target])

  return (
    <span className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-m360-gold tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function StatBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      ref={ref}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-m360-gold/5 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <AnimatedCounter target={stat.target} suffix={stat.suffix} isInView={isInView} />
              <p className="font-body text-xs md:text-sm text-m360-muted mt-2 uppercase tracking-wider">
                {stat.label}
              </p>

              {/* Separator between items (desktop) */}
              {i < STATS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-px h-12 bg-m360-gold/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
