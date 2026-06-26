import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60]"
      style={{ scaleX }}
    >
      <div className="h-full w-full bg-gradient-to-r from-m360-gold via-m360-cream to-m360-gold shadow-[0_0_8px_rgba(243,174,28,0.6)]" />
    </motion.div>
  )
}

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-m360-card border border-m360-gold/40 flex items-center justify-center text-m360-gold hover:bg-m360-gold hover:text-m360-base transition-colors cursor-pointer shadow-[0_0_20px_rgba(243,174,28,0.15)]"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 14V2M2 7l6-5 6 5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
