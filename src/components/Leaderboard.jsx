import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { cachedLeaderboard, fetchLeaderboard, lbEvents } from '../lib/api'

// The leaderboard is the backend's authoritative view (submissions sorted by
// totalCredits desc). We paint the cached snapshot instantly on mount, then
// refetch from the API. We ALSO subscribe to lbEvents — fired by
// applyResponse — so that when any component (form/game submit) updates
// m360_lb, we re-read it and refetch from the server.
function useLeaderboard() {
  const [entries, setEntries] = useState(() => cachedLeaderboard())

  const refetch = useCallback(() => {
    let alive = true
    fetchLeaderboard(12)
      .then((rows) => {
        if (alive && Array.isArray(rows)) setEntries(rows)
      })
      .catch(() => {/* keep cached snapshot on failure */})
    return () => { alive = false }
  }, [])

  // Initial fetch on mount.
  useEffect(() => {
    const cleanup = refetch()
    return cleanup
  }, [refetch])

  // Re-fetch whenever another component notifies that the leaderboard changed.
  useEffect(() => {
    const handler = () => refetch()
    lbEvents.addEventListener('lb', handler)
    return () => lbEvents.removeEventListener('lb', handler)
  }, [refetch])

  return entries
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-xl">👑</span>
  if (rank === 2) return <span className="text-lg">🥈</span>
  if (rank === 3) return <span className="text-lg">🥉</span>
  return (
    <span className="font-heading text-sm text-m360-muted font-bold w-6 text-center">
      {rank}
    </span>
  )
}

// Animated number that smoothly counts up when its value changes.
function AnimatedCredits({ value, className }) {
  return (
    <motion.span
      className={className}
      key={value}
      initial={{ scale: 1.2, color: '#EFCF9E' }}
      animate={{ scale: 1, color: '#F3AE1C' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {value}
    </motion.span>
  )
}

export default function Leaderboard({ highlightEntry }) {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const entries = useLeaderboard()
  const maxCredits = entries[0]?.credits || 1

  return (
    <section
      id="leaderboard"
      ref={sectionRef}
      className="relative py-20 md:py-32 px-4 md:px-8"
    >
      <div className="max-w-2xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="text-center mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="text-lg md:text-xl mb-1 block">🏆</span>
          <h2 className="font-heading text-xl md:text-2xl lg:text-3xl text-m360-gold font-bold">
            Egypt's Pre-Launch Rankings
          </h2>
          <p className="mt-2 font-body text-xs md:text-sm text-m360-muted max-w-md mx-auto">
            Top 10 at launch get exclusive M360 perks, badges, and early access.
          </p>
          <div className="mt-3 w-12 h-0.5 bg-m360-gold/40 mx-auto rounded-full" />
        </motion.div>

        {/* Leaderboard card */}
        <motion.div
          className="rounded-2xl bg-m360-card border border-m360-gold/30 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-m360-border bg-m360-card-alt/50 flex items-center justify-between">
            <span className="font-body text-xs text-m360-muted">Top credit earners</span>
            <span className="px-2 py-0.5 rounded-full bg-m360-gold/15 text-m360-gold text-[10px] font-body font-medium">
              {entries.length} players
            </span>
          </div>

          {/* Entries — AnimatePresence handles enter/exit when entries are
              added, removed, or re-ordered. Each entry is keyed by name (stable)
              so framer-motion tracks the same DOM node across re-renders and
              animates position + bar + credits smoothly. */}
          <div className="divide-y divide-m360-border/30">
            <AnimatePresence initial={false} mode="popLayout">
              {entries.map((entry, i) => {
                const credits = entry.totalCredits ?? entry.credits ?? 0
                // Key by email (unique), not name (collisions crash the list).
                const id = entry.email || entry.name
                const isHighlight = highlightEntry &&
                  entry.email && highlightEntry.email
                  ? entry.email === highlightEntry.email
                  : entry.name === highlightEntry.name
                return (
                  <motion.div
                    key={id}
                    layout
                    className={`relative flex items-center gap-2.5 px-4 py-2 ${
                      isHighlight ? 'bg-m360-gold/10' : ''
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{
                      opacity: { duration: 0.3 },
                      x: { duration: 0.3 },
                      layout: { type: 'spring', stiffness: 300, damping: 30 },
                      height: { duration: 0.3 },
                      marginBottom: { duration: 0.3 },
                      paddingTop: { duration: 0.3 },
                      paddingBottom: { duration: 0.3 },
                    }}
                  >
                    <RankBadge rank={i + 1} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-body text-sm truncate ${
                          isHighlight ? 'text-m360-gold font-semibold' : 'text-m360-text'
                        }`}>
                          {entry.name}
                        </span>
                        {isHighlight && (
                          <motion.span
                            className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-m360-gold/20 text-m360-gold font-bold uppercase tracking-wide"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          >
                            You
                          </motion.span>
                        )}
                      </div>
                      <div className="mt-1 w-full h-1 rounded-full bg-m360-card-alt overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            isHighlight
                              ? 'bg-gradient-to-r from-m360-gold to-m360-cream'
                              : i < 3
                                ? 'bg-m360-gold/50'
                                : 'bg-m360-gold/25'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((credits / maxCredits) * 100, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <AnimatedCredits
                      value={credits}
                      className={`font-heading text-sm font-bold tabular-nums w-12 text-right ${
                        isHighlight ? 'text-m360-gold' : i < 3 ? 'text-m360-cream' : 'text-m360-muted'
                      }`}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-m360-border bg-m360-card-alt/30 text-center">
            <p className="font-body text-[10px] text-m360-muted/70">
              ⚡ Top 10 unlock exclusive launch perks
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
