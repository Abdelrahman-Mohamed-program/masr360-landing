import { motion } from 'framer-motion'

export default function PharaohIcon() {
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
