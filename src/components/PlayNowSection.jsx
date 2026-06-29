import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { cachedDoc, lbEvents } from '../lib/api'
import EyeOfHorus from './EyeOfHorus'

export default function PlayNowSection() {
  // "Has played game" is a backend flag (gameComplete) — the single source of
  // truth. We re-read on lbEvents so the section hides the moment a game
  // submit flips the flag server-side.
  const [hasPlayedGame, setHasPlayedGame] = useState(() => !!cachedDoc()?.gameComplete)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  useEffect(() => {
    const refresh = () => setHasPlayedGame(!!cachedDoc()?.gameComplete)
    refresh()
    lbEvents.addEventListener('lb', refresh)
    return () => lbEvents.removeEventListener('lb', refresh)
  }, [])

  if (hasPlayedGame) return null

  const scrollToGame = () => {
    const gameSection = document.getElementById('game-demo')
    if (gameSection) gameSection.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(243,174,28,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Eye of Horus icon */}
        <motion.div
          className="mb-6 flex items-center justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <EyeOfHorus className="h-16 w-16 text-m360-gold" pulsed />
        </motion.div>

        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-m360-gold font-bold mb-4">
          Don't Just Watch — <span className="text-m360-cream">Play</span>
        </h2>

        <p className="font-body text-sm md:text-base text-m360-muted max-w-lg mx-auto mb-3">
          While others are still waiting, you could be <span className="text-m360-gold font-semibold">earning credits</span>, climbing the leaderboard, and securing <span className="text-m360-cream">exclusive perks</span> before M360 even launches.
        </p>

        <p className="font-body text-sm md:text-base text-m360-muted/70 max-w-md mx-auto mb-8">
          Take the Egypt Challenge. Answer 3 questions. Earn up to <span className="text-m360-cream font-semibold">300 credits</span>. Get your name on the board.
        </p>

        {/* Privilege callouts */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-m360-card border border-m360-gold/30"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <svg className="h-4 w-4 text-m360-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            <span className="font-body text-xs md:text-sm text-m360-cream font-medium">Early Access</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-m360-card border border-m360-gold/30"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <svg className="h-4 w-4 text-m360-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.45 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.45 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>
            <span className="font-body text-xs md:text-sm text-m360-cream font-medium">Leaderboard Priority</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-m360-card border border-m360-gold/30"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <svg className="h-4 w-4 text-m360-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
            <span className="font-body text-xs md:text-sm text-m360-cream font-medium">Launch Perks</span>
          </motion.div>
        </div>

        <motion.button
          onClick={scrollToGame}
          className="btn-physical px-10 py-4 rounded-full bg-m360-gold text-m360-bg font-heading font-bold text-base cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          animate={{
            boxShadow: [
              '0 0 25px rgba(243,174,28,0.3)',
              '0 0 50px rgba(243,174,28,0.6)',
              '0 0 25px rgba(243,174,28,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Play Now — Earn Your Spot →
        </motion.button>

        <p className="font-body text-xs text-m360-muted/50 mt-4">
          Takes less than 60 seconds. No signup needed to start.
        </p>
      </motion.div>
    </section>
  )
}
