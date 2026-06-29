import { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function HieroglyphicPattern({ className = '' }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="hieroglyphs" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Eye of Horus */}
          <path d="M40 20 C25 20 15 30 15 40 C15 50 25 60 40 60 C55 60 65 50 65 40 C65 30 55 20 40 20Z" stroke="#F3AE1C" strokeWidth="1" fill="none" />
          <path d="M40 28 L40 52" stroke="#F3AE1C" strokeWidth="0.8" />
          <circle cx="40" cy="40" r="4" fill="#F3AE1C" opacity="0.5" />

          {/* Ankh */}
          <g transform="translate(60, 10)">
            <ellipse cx="0" cy="0" rx="5" ry="7" stroke="#F3AE1C" strokeWidth="0.8" fill="none" />
            <line x1="0" y1="7" x2="0" y2="22" stroke="#F3AE1C" strokeWidth="0.8" />
            <line x1="-5" y1="14" x2="5" y2="14" stroke="#F3AE1C" strokeWidth="0.8" />
          </g>

          {/* Scarab */}
          <ellipse cx="20" cy="70" rx="8" ry="5" stroke="#F3AE1C" strokeWidth="0.6" fill="none" />
          <circle cx="20" cy="67" r="2" fill="#F3AE1C" opacity="0.4" />

          {/* Lotus */}
          <g transform="translate(50, 65)">
            <path d="M0 10 Q-5 5 0 0 Q5 5 0 10Z" stroke="#F3AE1C" strokeWidth="0.6" fill="none" />
            <path d="M0 10 Q-8 6 -3 1 Q-2 5 0 10Z" stroke="#F3AE1C" strokeWidth="0.5" fill="none" />
            <path d="M0 10 Q8 6 3 1 Q2 5 0 10Z" stroke="#F3AE1C" strokeWidth="0.5" fill="none" />
          </g>

          {/* Sun disk */}
          <circle cx="70" cy="40" r="6" stroke="#F3AE1C" strokeWidth="0.6" fill="none" />
          <circle cx="70" cy="40" r="2" fill="#F3AE1C" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#hieroglyphs)" />
    </svg>
  )
}

export function PyramidSilhouette({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.path
        d="M100 10 L180 110 L20 110 Z"
        stroke="rgba(243,174,28,0.12)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M100 10 L100 110"
        stroke="rgba(243,174,28,0.06)"
        strokeWidth="0.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export function EgyptianBorder({ className = '' }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg className="absolute top-0 left-0 w-16 h-16 text-m360-gold/20" viewBox="0 0 64 64" fill="none">
        <path d="M0 0 L20 0 L20 4 L4 4 L4 20 L0 20 Z" fill="currentColor" />
        <path d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z" fill="currentColor" opacity="0.5" />
      </svg>
      <svg className="absolute top-0 right-0 w-16 h-16 text-m360-gold/20 rotate-90" viewBox="0 0 64 64" fill="none">
        <path d="M0 0 L20 0 L20 4 L4 4 L4 20 L0 20 Z" fill="currentColor" />
        <path d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z" fill="currentColor" opacity="0.5" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-16 h-16 text-m360-gold/20 -rotate-90" viewBox="0 0 64 64" fill="none">
        <path d="M0 0 L20 0 L20 4 L4 4 L4 20 L0 20 Z" fill="currentColor" />
        <path d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z" fill="currentColor" opacity="0.5" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-16 h-16 text-m360-gold/20 rotate-180" viewBox="0 0 64 64" fill="none">
        <path d="M0 0 L20 0 L20 4 L4 4 L4 20 L0 20 Z" fill="currentColor" />
        <path d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  )
}

export function FloatingDots({ count = 6, className = '' }) {
  const dots = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${15 + (i * 73) % 70}%`,
    y: `${10 + (i * 41) % 80}%`,
    size: 2 + (i % 3),
    duration: 4 + (i % 4) * 2,
    delay: i * 0.5,
  })), [count])

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-m360-gold/20"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export function SectionDivider() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <div ref={ref} className="flex items-center justify-center py-4" aria-hidden="true">
      <motion.div
        className="h-px w-16 bg-gradient-to-r from-transparent to-m360-gold/30"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="mx-3 w-1.5 h-1.5 rotate-45 border border-m360-gold/40"
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, rotate: 45, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="h-px w-16 bg-gradient-to-l from-transparent to-m360-gold/30"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

export function HieroglyphicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Pyramid silhouettes — left side */}
      <svg
        className="absolute bottom-0 left-0 w-[40vw] max-w-[600px] opacity-[0.06]"
        viewBox="0 0 600 400"
        fill="none"
        preserveAspectRatio="xMinYMax meet"
      >
        <path d="M50 380 L250 80 L350 380 Z" stroke="#F3AE1C" strokeWidth="1.2" fill="rgba(243,174,28,0.04)" />
        <path d="M180 380 L320 140 L420 380 Z" stroke="#F3AE1C" strokeWidth="0.8" fill="rgba(243,174,28,0.02)" />
        <path d="M320 380 L440 200 L540 380 Z" stroke="#F3AE1C" strokeWidth="0.6" fill="rgba(243,174,28,0.015)" />
        {/* Sun */}
        <circle cx="500" cy="60" r="30" stroke="#F3AE1C" strokeWidth="0.8" fill="none" opacity="0.5" />
        <circle cx="500" cy="60" r="18" stroke="#F3AE1C" strokeWidth="0.5" fill="none" opacity="0.4" />
      </svg>

      {/* Pyramid silhouettes — right side */}
      <svg
        className="absolute bottom-0 right-0 w-[35vw] max-w-[500px] opacity-[0.05]"
        viewBox="0 0 500 350"
        fill="none"
        preserveAspectRatio="xMaxYMax meet"
      >
        <path d="M450 330 L280 60 L150 330 Z" stroke="#EFCF9E" strokeWidth="1" fill="rgba(239,207,158,0.03)" />
        <path d="M350 330 L220 130 L120 330 Z" stroke="#EFCF9E" strokeWidth="0.7" fill="rgba(239,207,158,0.02)" />
      </svg>

      {/* Hieroglyphic pattern — top center */}
      <svg
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] opacity-[0.025]"
        viewBox="0 0 500 500"
        fill="none"
      >
        <defs>
          <pattern id="bg-hieroglyphs" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <text x="10" y="30" fontSize="24" fill="#F3AE1C" opacity="0.6">𓂀</text>
            <text x="60" y="70" fontSize="20" fill="#F3AE1C" opacity="0.5">𓉴</text>
            <text x="20" y="80" fontSize="18" fill="#EFCF9E" opacity="0.4">𓋹</text>
            <text x="70" y="30" fontSize="22" fill="#F3AE1C" opacity="0.5">𓆣</text>
            <text x="40" y="55" fontSize="16" fill="#EFCF9E" opacity="0.3">𓇳</text>
          </pattern>
        </defs>
        <rect width="500" height="500" fill="url(#bg-hieroglyphs)" />
      </svg>

      {/* Subtle radial glow behind center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-m360-gold/[0.02] blur-3xl" />
    </div>
  )
}
