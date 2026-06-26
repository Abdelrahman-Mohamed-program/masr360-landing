import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'

function PharaohIcon() {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 64 64"
      fill="none"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Nemes headcloth */}
      <path
        d="M16 28 Q16 14 32 12 Q48 14 48 28 L50 40 L14 40 Z"
        fill="#F3AE1C"
        stroke="#C9A227"
        strokeWidth="1"
      />
      {/* Headcloth drapes */}
      <path d="M14 40 L10 58 L18 56 L20 40" fill="#EFCF9E" stroke="#C9A227" strokeWidth="0.8" />
      <path d="M50 40 L54 58 L46 56 L44 40" fill="#EFCF9E" stroke="#C9A227" strokeWidth="0.8" />
      {/* Face */}
      <ellipse cx="32" cy="34" rx="10" ry="12" fill="#EFCF9E" />
      {/* Eyes */}
      <path d="M26 32 L30 33" stroke="#2A1A0A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 33 L38 32" stroke="#2A1A0A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Eye paint (kohl) */}
      <path d="M24 32 L30 33" stroke="#F3AE1C" strokeWidth="0.6" />
      <path d="M40 32 L34 33" stroke="#F3AE1C" strokeWidth="0.6" />
      {/* Beard */}
      <path d="M30 44 L32 54 L34 44" fill="#2A1A0A" stroke="#1a0f05" strokeWidth="0.5" />
      {/* Crown uraeus (cobra) */}
      <motion.path
        d="M32 12 Q30 8 32 4 Q34 8 32 12"
        fill="#F3AE1C"
        stroke="#C9A227"
        strokeWidth="0.8"
        animate={{ scale: [1, 1.1, 1], y: [0, -1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '32px 8px' }}
      />
    </motion.svg>
  )
}

export default function WelcomeBanner() {
  const { userName } = useGame()

  if (!userName) return null

  return (
    <motion.div
      className="fixed top-16 left-1/2 -translate-x-1/2 z-40"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-m360-card/95 backdrop-blur-md border border-m360-gold/40 shadow-[0_0_20px_rgba(243,174,28,0.15)]">
        <PharaohIcon />
        <span className="font-heading text-xs md:text-sm text-m360-gold font-semibold">
          Welcome on Board, Pharaoh!
        </span>
        <span className="font-body text-xs text-m360-cream/80 hidden sm:inline">
          — {userName}
        </span>
      </div>
    </motion.div>
  )
}
