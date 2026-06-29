import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cachedDoc, lbEvents } from '../lib/api'
import PharaohIcon from '../components/PharaohIcon'

export default function WelcomeBanner() {
  // Welcome message driven by the backend response (m360_doc).
  const [userName, setUserName] = useState(() => cachedDoc()?.name || '')
  useEffect(() => {
    const refresh = () => setUserName(cachedDoc()?.name || '')
    refresh()
    lbEvents.addEventListener('lb', refresh)
    return () => lbEvents.removeEventListener('lb', refresh)
  }, [])

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
