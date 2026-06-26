import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function PlayNowSection() {
  const { hasPlayedGame } = useGame()

  if (hasPlayedGame) return null
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

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
        {/* Pyramid icon */}
        <motion.div
          className="text-5xl mb-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🏛️
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
          {[
            { icon: '⚡', text: 'Early Access' },
            { icon: '🏆', text: 'Leaderboard Priority' },
            { icon: '🎁', text: 'Launch Perks' },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-m360-card border border-m360-gold/30"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-body text-xs md:text-sm text-m360-cream font-medium">{item.text}</span>
            </motion.div>
          ))}
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
