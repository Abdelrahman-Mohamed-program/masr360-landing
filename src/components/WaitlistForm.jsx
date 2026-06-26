import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

export default function WaitlistForm() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    setError('')

    const entry = {
      name: name.trim(),
      email: email.trim(),
      source: 'waitlist',
      submittedAt: new Date().toISOString(),
    }
    try {
      const existing = JSON.parse(localStorage.getItem('m360_waitlist') || '[]')
      existing.push(entry)
      localStorage.setItem('m360_waitlist', JSON.stringify(existing))
      localStorage.setItem('m360_user', JSON.stringify(entry))
    } catch {
      // localStorage unavailable
    }

    setSubmitted(true)
  }

  return (
    <section
      id="form"
      ref={sectionRef}
      className="relative py-20 md:py-32 px-4 md:px-8"
    >
      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              {/* Section heading */}
              <motion.div
                className="text-center mb-8 md:mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-m360-gold font-bold">
                  Join the Waitlist
                </h2>
                <p className="mt-3 font-body text-sm md:text-base text-m360-muted max-w-md mx-auto">
                  Be first in line when M360 launches. Early members get exclusive access, priority perks, and a head start on the leaderboard.
                </p>
                <div className="mt-4 w-16 h-0.5 bg-m360-gold/40 mx-auto rounded-full" />
              </motion.div>

              {/* Form card */}
              <motion.div
                className="rounded-2xl bg-m360-card border border-m360-gold/30 p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Privilege callouts */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: '⚡', label: 'Early Access' },
                    { icon: '🏆', label: 'Priority Placement' },
                    { icon: '🎁', label: 'Exclusive Perks' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      className="text-center p-3 rounded-xl bg-m360-card-alt/50 border border-m360-border"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    >
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className="font-body text-[10px] md:text-xs text-m360-cream font-medium">{item.label}</div>
                    </motion.div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-gold-focus w-full px-4 py-3.5 rounded-xl bg-m360-card-alt border border-m360-border text-m360-text font-body text-sm placeholder:text-m360-muted/50 transition-all duration-200"
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-gold-focus w-full px-4 py-3.5 rounded-xl bg-m360-card-alt border border-m360-border text-m360-text font-body text-sm placeholder:text-m360-muted/50 transition-all duration-200"
                  />
                  {error && (
                    <p className="font-body text-xs text-m360-error">{error}</p>
                  )}
                  <motion.button
                    type="submit"
                    className="btn-physical w-full px-6 py-4 rounded-xl bg-m360-gold text-m360-bg font-heading font-bold text-base cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(243,174,28,0.3)',
                        '0 0 40px rgba(243,174,28,0.6)',
                        '0 0 20px rgba(243,174,28,0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Get Early Access →
                  </motion.button>
                </form>

                <p className="font-body text-xs text-m360-muted/60 text-center mt-4">
                  We'll only email you when we launch. No spam, ever.
                </p>
              </motion.div>

              {/* Play game CTA */}
              <motion.div
                className="mt-6 p-5 rounded-2xl bg-m360-card-alt/50 border border-m360-border text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <p className="font-body text-sm text-m360-muted mb-3">
                  Want to <span className="text-m360-cream font-semibold">earn credits</span> and <span className="text-m360-gold font-semibold">climb the leaderboard</span> before launch?
                </p>
                <motion.button
                  onClick={() => {
                    const gameSection = document.getElementById('game-demo')
                    if (gameSection) gameSection.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-m360-gold/50 text-m360-gold font-body font-semibold text-sm hover:bg-m360-gold/10 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>🎮</span>
                  Play the Game Now — Earn Your Spot
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="text-center py-12 space-y-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="text-6xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                ✅
              </motion.div>

              <h3 className="font-heading text-2xl md:text-3xl text-m360-gold font-bold">
                You're In!
              </h3>

              <p className="font-body text-sm md:text-base text-m360-muted max-w-md mx-auto">
                <span className="text-m360-cream font-semibold">{name}</span>, you're on the waitlist. We'll email you at <span className="text-m360-gold">{email}</span> the moment M360 launches.
              </p>

              <motion.div
                className="p-4 rounded-xl bg-m360-gold/10 border border-m360-gold/30 max-w-sm mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="font-body text-xs text-m360-muted">
                  ⚡ <span className="text-m360-cream">Pro tip:</span> Play the game to earn credits and secure your spot on the leaderboard before everyone else.
                </p>
              </motion.div>

              <motion.button
                onClick={() => {
                  const gameSection = document.getElementById('game-demo')
                  if (gameSection) gameSection.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-m360-gold text-m360-bg font-heading font-bold text-sm cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(243,174,28,0.3)',
                    '0 0 35px rgba(243,174,28,0.6)',
                    '0 0 20px rgba(243,174,28,0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                🎮 Play the Game — Earn Your Spot Now
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
