import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function FloatingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(false)
  const { userName } = useGame()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100)
      setVisible(window.scrollY > 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Main navigation"
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? 'bg-m360-bg/90 backdrop-blur-md border-b border-m360-gold/20'
              : 'bg-transparent'
          }`}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
            {/* Logo */}
            <a href="#hero" className="font-heading text-lg md:text-xl text-m360-gold font-bold tracking-wider">
              M360
            </a>

            {/* User name badge */}
            {userName && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-m360-gold/10 border border-m360-gold/30">
                <span className="text-xs">👑</span>
                <span className="font-body text-xs text-m360-cream font-medium">{userName}</span>
              </div>
            )}

            <div className="flex-1" />

            {/* CTA */}
            <motion.button
              onClick={() => {
                const form = document.getElementById('form')
                if (form) form.scrollIntoView({ behavior: 'smooth' })
                else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
              }}
              className="px-5 py-2 rounded-full bg-m360-gold text-m360-bg font-heading font-bold text-xs md:text-sm cursor-pointer animate-button-pulse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Secure My Spot
            </motion.button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
