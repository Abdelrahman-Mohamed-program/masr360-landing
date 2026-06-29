import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { GAME_QUESTIONS, COUNTRIES } from '../utils/constants'
import {
  submitWaitlist,
  submitGame,
  fetchLeaderboard,
  getState,
  saveGameProgress,
  clearGameProgress,
  cachedDoc,
  lbEvents,
} from '../lib/api'
import { PharaohCrownIcon,ScarabIcon,CartoucheIcon,WasScepterIcon } from './EgyptianIcons'

const TOTAL_POSSIBLE = 300

/* ============================================
   WEB AUDIO — sound effects (no files needed)
   ============================================ */
function useGameAudio() {
  const ctxRef = useRef(null)
  const [soundOn, setSoundOn] = useState(true)

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }

  const playCorrect = useCallback(() => {
    if (!soundOn) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523, ctx.currentTime) // C5
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1) // E5
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2) // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.4)
    } catch { /* audio unavailable */ }
  }, [soundOn])

  const playWrong = useCallback(() => {
    if (!soundOn) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(200, ctx.currentTime)
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch { /* audio unavailable */ }
  }, [soundOn])

  return { soundOn, setSoundOn, playCorrect, playWrong }
}

/* ============================================
   CONFETTI BURST — gold particles
   ============================================ */
function ConfettiBurst() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: -100 - Math.random() * 200,
    rotate: Math.random() * 720 - 360,
    color: ['#F3AE1C', '#EFCF9E', '#22C55E', '#FFFFFF'][i % 4],
    size: 6 + Math.random() * 6,
    delay: Math.random() * 0.2,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30" aria-hidden="true">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ============================================
   CREDIT COUNTER — with bounce animation
   ============================================ */
function CreditCounter({ credits }) {
  const [bounce, setBounce] = useState(false)

  useEffect(() => {
    if (credits > 0) {
      setBounce(true)
      const t = setTimeout(() => setBounce(false), 400)
      return () => clearTimeout(t)
    }
  }, [credits])

  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-m360-card/80 border border-m360-gold/40"
      animate={bounce ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
    >
      <span className="text-base">🏆</span>
      <span className="font-heading text-m360-gold font-bold text-base tabular-nums">
        +{credits}
      </span>
    </motion.div>
  )
}

/* ============================================
   XP BAR — fills as credits earned (0 to 300)
   ============================================ */
function XpBar({ credits }) {
  const pct = Math.min((credits / TOTAL_POSSIBLE) * 100, 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="font-body text-[10px] text-m360-muted uppercase tracking-wider">XP</span>
        <span className="font-body text-[10px] text-m360-gold font-semibold">{credits} / {TOTAL_POSSIBLE}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-m360-card-alt overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-m360-gold via-m360-cream to-m360-gold"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ boxShadow: '0 0 8px rgba(243,174,28,0.5)' }}
        />
      </div>
    </div>
  )
}

/* ============================================
   QUESTION PILLS — glow gold when completed
   ============================================ */
function QuestionPills({ currentIndex, completedIndices }) {
  const pills = [
    { label: 'Q1 · Easy', reward: '+50', difficulty: 'easy' },
    { label: 'Q2 · Medium', reward: '+100', difficulty: 'medium' },
    { label: 'Q3 · Challenge', reward: '+150', difficulty: 'challenge' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill, i) => {
        const isCompleted = completedIndices.includes(i)
        const isCurrent = i === currentIndex
        return (
          <motion.span
            key={i}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-300 ${
              isCompleted
                ? 'bg-m360-gold/20 text-m360-gold border border-m360-gold/50 shadow-[0_0_12px_rgba(243,174,28,0.3)]'
                : isCurrent
                  ? 'bg-m360-card-alt text-m360-cream border border-m360-cream/30'
                  : 'bg-m360-card-alt text-m360-muted/50 border border-m360-border'
            }`}
            animate={isCompleted ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {pill.label} {pill.reward}
          </motion.span>
        )
      })}
    </div>
  )
}

/* ============================================
   XP POPUP — floating on correct answer
   ============================================ */
function XpPopup({ amount }) {
  return (
    <motion.div
      className="absolute -top-8 left-1/2 -translate-x-1/2 font-heading text-m360-gold font-bold text-xl pointer-events-none z-20 drop-shadow-[0_0_8px_rgba(243,174,28,0.6)]"
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: 1, y: -40, scale: 1.2 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      +{amount} XP
    </motion.div>
  )
}

/* ============================================
   SOUND TOGGLE
   ============================================ */
function SoundToggle({ soundOn, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className="w-8 h-8 rounded-full bg-m360-card-alt border border-m360-border flex items-center justify-center cursor-pointer hover:border-m360-gold/50 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'}
    >
      {soundOn ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F3AE1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </motion.button>
  )
}

/* ============================================
   MULTIPLE CHOICE QUESTION
   ============================================ */
function MultipleChoiceQuestion({ question, onAnswer, playCorrect, playWrong }) {
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [cardFlash, setCardFlash] = useState(null) // 'correct' | 'wrong' | null

  const handleSelect = (option) => {
    if (showResult) return
    setSelected(option.id)
    const correct = !!option.correct
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setCardFlash('correct')
      playCorrect()
    } else {
      setCardFlash('wrong')
      playWrong()
    }

    setTimeout(() => setCardFlash(null), 600)

    setTimeout(() => {
      // Pass the chosen option id so the server can verify against its key.
      onAnswer(correct, question.reward, option.id)
    }, correct ? 1400 : 2800)
  }

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-body font-medium ${
          question.difficulty === 'easy'
            ? 'bg-m360-success/20 text-m360-success'
            : 'bg-m360-gold/20 text-m360-gold'
        }`}>
          {question.difficulty === 'easy' ? 'Q1 · Easy' : 'Q2 · Medium'}
        </span>
        <span className="font-heading text-m360-gold text-sm md:text-base font-bold drop-shadow-[0_0_8px_rgba(243,174,28,0.5)]">
          +{question.reward}
        </span>
      </div>

      <h3 className="font-heading text-xl md:text-2xl text-m360-text font-semibold leading-snug">
        {question.question}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option) => {
          const isSelected = selected === option.id
          const isCorrectOption = !!option.correct
          let stateClass = 'border-m360-border bg-m360-card-alt hover:border-m360-gold/50 hover:bg-m360-card'
          if (showResult) {
            if (isCorrectOption) {
              stateClass = 'border-m360-success bg-m360-success/15'
            } else if (isSelected && !isCorrectOption) {
              stateClass = 'border-m360-error bg-m360-error/15'
            } else {
              stateClass = 'border-m360-border bg-m360-card-alt opacity-50'
            }
          }

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={showResult}
              aria-label={`Option ${option.label}: ${option.text}`}
              className={`relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer disabled:cursor-default ${stateClass}`}
              whileHover={!showResult ? { scale: 1.02, y: -2 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              animate={
                showResult && isSelected && !isCorrectOption
                  ? { x: [0, -6, 6, -4, 4, 0] }
                  : showResult && isCorrectOption
                    ? { scale: [1, 1.02, 1] }
                    : {}
              }
              transition={{ duration: 0.4 }}
            >
              <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-sm ${
                showResult && isCorrectOption
                  ? 'bg-m360-success text-m360-bg'
                  : showResult && isSelected && !isCorrectOption
                    ? 'bg-m360-error text-white'
                    : 'bg-m360-card border border-m360-border text-m360-gold'
              }`}>
                {showResult && isCorrectOption ? '✓' : showResult && isSelected && !isCorrectOption ? '✕' : option.label}
              </span>
              <span className="font-body text-sm md:text-base text-m360-text">
                {option.text}
              </span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl border ${
              isCorrect
                ? 'bg-m360-success/10 border-m360-success/30'
                : 'bg-m360-error/10 border-m360-error/30'
            }`}
          >
            {isCorrect ? (
              <div className="flex items-start gap-2">
                <span className="text-m360-success text-lg">🎉</span>
                <div>
                  <p className="font-heading text-m360-success font-semibold text-sm">Correct! +{question.reward} credits earned</p>
                  <p className="font-body text-xs text-m360-muted mt-1">{question.fact}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <span className="text-m360-gold text-lg">💡</span>
                <div>
                  <p className="font-heading text-m360-gold font-semibold text-sm">Not quite — but here's the truth:</p>
                  <p className="font-body text-xs text-m360-muted mt-1">{question.fact}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ============================================
   UPLOAD QUESTION (Q3)
   ============================================ */
function UploadQuestion({ question, onAnswer }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }, [handleFile])

  const handleSubmit = () => {
    if (!file || submitted) return
    setSubmitted(true)
    // Challenge (Q3): any uploaded image earns the full reward. We send the
    // file name as the "answer" — presence is what matters server-side.
    setTimeout(() => onAnswer(true, question.reward, file?.name || 'uploaded'), 1200)
  }

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-m360-cream/20 text-m360-cream">
          Q3 · Challenge
        </span>
        <span className="font-heading text-m360-gold text-sm md:text-base font-bold drop-shadow-[0_0_8px_rgba(243,174,28,0.5)]">
          +{question.reward}
        </span>
      </div>

      <h3 className="font-heading text-xl md:text-2xl text-m360-text font-semibold leading-snug">
        {question.question}
      </h3>

      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-m360-gold bg-m360-gold/10'
            : submitted
              ? 'border-m360-success bg-m360-success/10'
              : preview
                ? 'border-m360-gold/50 bg-m360-card'
                : 'border-m360-border bg-m360-card-alt hover:border-m360-gold/40'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {preview ? (
          <div className="space-y-4">
            <div className="relative w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-m360-gold/30">
              <img src={preview} alt="Upload preview" width="384" height="192" className="w-full h-48 object-cover" />
              {submitted && (
                <motion.div
                  className="absolute inset-0 bg-m360-success/30 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-4xl">✅</span>
                </motion.div>
              )}
            </div>
            {submitted ? (
              <motion.p
                className="font-heading text-m360-success font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Submitted! +{question.reward} credits earned
              </motion.p>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-physical px-6 py-2.5 rounded-full bg-m360-gold text-m360-bg font-body font-semibold text-sm hover:bg-m360-gold/90 transition-colors cursor-pointer"
              >
                Submit Photo & Earn Credits
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-m360-gold/10 border border-m360-gold/30 flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
            <p className="font-body text-sm text-m360-muted">
              Drag & drop your photo here, or
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="btn-physical px-5 py-2 rounded-full border border-m360-gold/50 text-m360-gold font-body text-sm font-medium hover:bg-m360-gold/10 transition-colors cursor-pointer"
            >
              Choose File
            </button>
            <p className="font-body text-xs text-m360-muted/60">
              Any image works — your own photo, a saved one, anything!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ============================================
   LEADERBOARD ROW — single entry
   ============================================ */
function LeaderboardRow({ entry, index, maxCredits, isNew }) {
  return (
    <motion.div
      layout
      className={`leaderboard-row flex items-center gap-2 px-3 py-2 relative overflow-hidden ${
        isNew ? 'bg-m360-gold/15' : ''
      }`}
      initial={isNew ? { opacity: 0, height: 0, y: -20 } : { opacity: 1, height: 'auto' }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      transition={{
        layout: { type: 'spring', stiffness: 200, damping: 25 },
        opacity: { duration: 0.5, delay: isNew ? 0.1 : 0 },
        height: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: isNew ? 0.1 : 0 },
        y: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: isNew ? 0.1 : 0 },
      }}
    >
      {/* Gold flash sweep on new entry */}
      {isNew && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          initial={{ background: 'linear-gradient(90deg, transparent 0%, rgba(243,174,28,0.5) 50%, transparent 100%)', x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      )}

      {/* Pulsing gold border glow on new entry */}
      {isNew && (
        <motion.div
          className="absolute inset-0 pointer-events-none border border-m360-gold/70 z-20"
          initial={{ opacity: 0, boxShadow: '0 0 0px rgba(243,174,28,0)' }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0.5, 1, 0],
            boxShadow: [
              '0 0 0px rgba(243,174,28,0)',
              '0 0 20px rgba(243,174,28,0.6)',
              '0 0 10px rgba(243,174,28,0.3)',
              '0 0 20px rgba(243,174,28,0.6)',
              '0 0 0px rgba(243,174,28,0)',
            ],
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
      )}

      <span className={`font-heading text-xs w-5 text-center relative z-10 ${
        index === 0 ? 'text-m360-gold' : index === 1 ? 'text-m360-cream/80' : index === 2 ? 'text-m360-gold/50' : 'text-m360-muted/40'
      }`}>
        {index === 0 ? '👑' : index + 1}
      </span>
      <span className={`font-body text-xs flex-1 truncate relative z-10 ${
        isNew ? 'text-m360-gold font-semibold' : 'text-m360-text/80'
      }`}>
        {entry.name}
        {isNew && (
          <motion.span
            className="ml-1 text-[8px] px-1 py-0.5 rounded bg-m360-gold/20 text-m360-gold font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 400 }}
          >
            YOU
          </motion.span>
        )}
      </span>
      <div className="w-14 h-1 rounded-full bg-m360-card-alt overflow-hidden relative z-10">
        <motion.div
          className={`h-full rounded-full ${
            isNew ? 'bg-m360-gold' : 'bg-m360-gold/30'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${(entry.credits / maxCredits) * 100}%` }}
          transition={{ delay: isNew ? 0.7 : 0.2 + index * 0.04, duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className={`font-heading text-xs tabular-nums w-8 text-right relative z-10 ${
        isNew ? 'text-m360-gold' : 'text-m360-muted/60'
      }`}>
        {entry.credits}
      </span>
    </motion.div>
  )
}

/* ============================================
   INLINE LEADERBOARD
   ============================================ */
function InlineLeaderboard({ highlightEntry, compact = false }) {
  const [entries, setEntries] = useState([])
  // Name of the row that should play the "new entry" highlight animation.
  // Set when the current user's entry first appears or their credits jump.
  const [animatingId, setAnimatingId] = useState(null)
  const prevCreditsRef = useRef({}) // name → last-seen credits, to detect jumps

  // Load entries from the API. The leaderboard IS the submissions collection
  // sorted by totalCredits desc (server-side). We fall back to the cached
  // snapshot on network failure so the board still paints instantly.
  //
  // After loading, detect two things to trigger the highlight animation:
  //   (a) the current user's entry appeared on the board for the first time, or
  //   (b) the current user's credits jumped (e.g. form submit added 475).
  // We do NOT change the row key — the row stays mounted and animates in place.
  const loadEntries = useCallback(async () => {
    const limit = compact ? 8 : 12
    const fresh = await fetchLeaderboard(limit)
    const sorted = [...fresh]
      .sort((a, b) => b.credits - a.credits || a.name.localeCompare(b.name))
      .slice(0, limit)
    setEntries(sorted)

    const me = cachedDoc()
    // Match by email (unique). Fall back to name only if email is missing.
    const meId = me?.email || me?.name
    if (meId) {
      const found = sorted.find((e) =>
        e.email && me?.email ? e.email === me.email : e.name === me.name
      )
      const prevCredits = prevCreditsRef.current[meId]
      if (found) {
        // Trigger animation if: first time seeing them, OR credits changed.
        const creditsChanged = prevCredits !== undefined && prevCredits !== found.credits
        const isFirstAppearance = prevCredits === undefined
        prevCreditsRef.current[meId] = found.credits
        if (isFirstAppearance || creditsChanged) {
          setAnimatingId(found.email || found.name)
          setTimeout(() => setAnimatingId(null), 4000)
        }
      }
    }
    return sorted
  }, [compact])

  // Initial load.
  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  // Re-fetch when another component (form submit, game submit) notifies that
  // the leaderboard changed via lbEvents. loadEntries auto-detects credit
  // jumps and fires the highlight animation.
  useEffect(() => {
    lbEvents.addEventListener('lb', loadEntries)
    return () => lbEvents.removeEventListener('lb', loadEntries)
  }, [loadEntries])

  // Also trigger animation when the parent signals a new highlight (game end
  // or form submit from THIS page). This covers the case where the user just
  // submitted and the board hasn't refetched yet.
  const prevHighlightRef = useRef(null)
  useEffect(() => {
    if (highlightEntry && highlightEntry !== prevHighlightRef.current) {
      prevHighlightRef.current = highlightEntry
      setAnimatingId(highlightEntry.email || highlightEntry.name)
      setTimeout(() => setAnimatingId(null), 4000)
    }
  }, [highlightEntry])

  const maxCredits = entries.length > 0 ? entries[0].credits : 1

  return (
    <div className="rounded-2xl bg-m360-card border border-m360-gold/30 overflow-hidden">
      {/* Leaderboard heading */}
      <div className="px-4 py-4 border-b border-m360-border bg-m360-card-alt/50 text-center">
        <span className="text-2xl block mb-1">🏆</span>
        <h3 className="font-heading text-lg md:text-xl lg:text-2xl text-m360-gold font-bold">Egypt's Pre-Launch Rankings</h3>
        <p className="font-body text-xs md:text-sm text-m360-muted mt-1">Top 10 at launch get exclusive <span className="text-m360-cream">M360 perks</span>, badges, and <span className="text-m360-gold">early access</span></p>
      </div>
      <div className="px-4 py-2 border-b border-m360-border bg-m360-card-alt/30 flex items-center justify-between">
        <span className="font-body text-[10px] text-m360-muted">Top credit earners</span>
        <motion.span
          className="w-5 h-5 rounded-full bg-m360-gold/15 text-m360-gold text-[10px] font-bold flex items-center justify-center"
          key={entries.length}
          initial={{ scale: 1.4, backgroundColor: 'rgba(243,174,28,0.5)' }}
          animate={{ scale: 1, backgroundColor: 'rgba(243,174,28,0.15)' }}
          transition={{ duration: 0.4 }}
        >
          {entries.length}
        </motion.span>
      </div>
      <motion.div
        className="divide-y divide-m360-border/30"
        layout
      >
        <AnimatePresence initial={false} mode="popLayout">
          {entries.map((entry, i) => {
            // Highlight matches by email (unique), falls back to name.
            const isAnimating = animatingId === (entry.email || entry.name)
            return (
              <LeaderboardRow
                key={entry.email || entry.name}
                entry={entry}
                index={i}
                maxCredits={maxCredits}
                isNew={isAnimating}
              />
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ============================================
   RESULTS SCREEN — with inline waitlist form

   FLOW:
   - If user has NOT saved identity yet: show name/email form
   - On form submit: save identity + insert into leaderboard with game credits
     (This IS the credit-earning moment — they just finished the game)
   - If user already has identity (from form Step 0): show "Welcome" state
     and still trigger leaderboard insert/update with game credits + existing form credits
   ============================================ */
function ResultsScreen({ credits, answers, onHighlight }) {
  // User name for the welcome message — from the backend mirror, not context.
  const userName = cachedDoc()?.name || ''
  // The DISPLAYED game credits come from the backend doc (m360_doc) — the
  // single source of truth. The `credits` prop is only the local running
  // tally from an in-progress play session; on reload it's 0, so we must NOT
  // use it. The server scored the answers and saved gameCredits; that's what
  // we show. Fall back to the prop only when the doc has no gameCredits yet
  // (e.g. the instant before the server responds).
  const docGameCredits = cachedDoc()?.gameCredits || 0
  const displayCredits = docGameCredits > 0 ? docGameCredits : credits
  const pct = Math.round((displayCredits / TOTAL_POSSIBLE) * 100)

  const [status, setStatus] = useState('loading') // loading | needs_identity | claimed | done
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [ageRange, setAgeRange] = useState('')

  // On mount, the decision tree is driven entirely by the backend response:
  //   - no email in cache, or not in waitlist → needs_identity (show form)
  //   - in waitlist, game already complete  → done (skip straight to form)
  //   - in waitlist, game not complete, has identity → auto-submit with email
  //   - in waitlist, game not complete, no identity  → needs_identity
  //
  // m360_doc is the canonical backend mirror (written by applyResponse).
  // Everything flows from it — never from legacy localStorage keys.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const cached = cachedDoc()
      setStatus('loading')
      // Only call the server if we have a cached email to validate against.
      if (cached?.email) {
        try {
          const { doc: serverDoc } = await getState(cached.email)
          if (cancelled) return
          if (serverDoc) {
            setName(serverDoc.name || '')
            setEmail(serverDoc.email || '')
            setCountry(serverDoc.city || '')
            setAgeRange(serverDoc.ageRange || '')
            if (serverDoc.gameComplete) {
              setStatus('done')
              return
            }
            // Game not complete. If we have identity, auto-submit below.
            if (serverDoc.inWaitlist && serverDoc.name) {
              setStatus('needs_identity_filled')
              return
            }
          }
        } catch {
          // Network failure: fall through to cache-based decision below.
        }
      }
      if (cancelled) return
      // No usable server state — decide from the m360_doc cache alone.
      if (cached?.email && cached?.name) {
        setName(cached.name || '')
        setEmail(cached.email || '')
        setCountry(cached.city || '')
        setAgeRange(cached.ageRange || '')
        setStatus('claimed')
      } else {
        setStatus('needs_identity')
      }
    })()
    return () => { cancelled = true }
  }, [])

  // When identity is already present, submit the game with that identity.
  // Handles: user did stage-0 first, OR cache already has their name+email.
  useEffect(() => {
    if (status !== 'claimed' && status !== 'needs_identity_filled') return
    if (!email) return
    let cancelled = false
    ;(async () => {
      setSubmitting(true)
      try {
        const res = await submitGame({ email, name, city: country, ageRange, answers })
        if (cancelled) return
        onHighlight?.(res.doc)
      } catch (err) {
        // Surface the error — don't silently claim success when the game
        // wasn't actually recorded server-side.
        setError(err.message || 'Submission failed. Please try again.')
      } finally {
        if (!cancelled) {
          setSubmitting(false)
          setStatus('done')
        }
      }
    })()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  // Whenever we land in the 'done' state — whether from a fresh game-end OR
  // from a page reload where the server already says gameComplete — re-trigger
  // the leaderboard highlight + re-fetch so the current user's entry animates
  // on the board. Without this, a reload shows their credits but the
  // leaderboard never re-highlights them (the highlight only fired on the
  // original submit, which is now gone).
  useEffect(() => {
    if (status !== 'done') return
    const me = cachedDoc()
    if (!me) return
    onHighlight?.(me)
  }, [status, onHighlight])


  // Game-end form: captured identity for a never-seen user. Create the
  // waitlist identity first, then score the game against it.
  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your name')
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email')
    if (!country) return setError('Please select your country')
    if (!ageRange) return setError('Please select your age range')
    setError('')
    setSubmitting(true)
    try {
      // 1. Ensure membership (idempotent).
      await submitWaitlist({ name, email, city: country, ageRange })
      // 2. Score the game against this identity.
      const res = await submitGame({ email, name, city: country, ageRange, answers })
      onHighlight?.(res.doc)
      setStatus('done')
      // applyResponse (inside submitGame) already wrote m360_doc — the backend
      // response is the single source of truth. No other localStorage writes.
      clearGameProgress()
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [name, email, country, ageRange, answers, onHighlight])

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Trophy emblem */}
      <motion.div
        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "radial-gradient(circle, rgba(243,174,28,0.15) 0%, transparent 70%)" }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 120 }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="#F3AE1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="#F3AE1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 22h16" stroke="#F3AE1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" stroke="#F3AE1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" stroke="#F3AE1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" stroke="#F3AE1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(243,174,28,0.08)" />
          <motion.path d="M8 6h8" stroke="#EFCF9E" strokeWidth="0.75" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
        </svg>
      </motion.div>

      <h3 style={{ fontFamily: "'Cinzel', serif" }} className="text-xl md:text-2xl font-bold text-center">
        <span style={{ color: "#EFCF9E" }}>Challenge </span>
        <span style={{ background: "linear-gradient(135deg, #F3AE1C 0%, #EFCF9E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Complete</span>
      </h3>

      <div className="text-center">
        <motion.div
          className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold tabular-nums inline-block"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        >
          {displayCredits}
        </motion.div>
        <span className="font-body text-m360-muted text-sm"> / {TOTAL_POSSIBLE}</span>
      </div>

      <div className="max-w-xs mx-auto">
        <div className="h-2 w-full rounded-full bg-m360-card-alt overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-m360-gold to-m360-cream"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="font-body text-xs text-m360-muted mt-2 text-center">
          {displayCredits === TOTAL_POSSIBLE ? (
            <span className="text-m360-gold/90">Flawless. Every question answered perfectly.</span>
          ) : displayCredits >= 200 ? (
            <span className="text-m360-cream/70">Impressive knowledge. Egypt would be proud.</span>
          ) : displayCredits >= 100 ? (
            <span className="text-m360-cream/50">Solid run. You know your way around Egypt.</span>
          ) : (
            <span className="text-m360-muted/70">A good start. There is more to discover.</span>
          )}
        </p>
      </div>

      {/* Waitlist form — claim credits (skip if identity already saved via form) */}
      <AnimatePresence mode="wait">
        {status === 'needs_identity' && !submitting ? (
          <motion.div
            key="claim-form"
            className="mt-6 p-5 rounded-2xl bg-m360-card/80 border border-m360-gold/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h4 className="font-heading text-base md:text-lg text-m360-cream font-bold text-center mb-1">
              Your Name on the Leaderboard
            </h4>
            <p className="font-body text-xs text-m360-muted text-center mb-4">
              Enter your name & email to carve your <span className="text-m360-gold font-semibold">{credits} credits</span> onto the Pharaoh's leaderboard.
            </p>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-gold-focus w-full px-4 py-3 rounded-xl bg-m360-card-alt border border-m360-border text-m360-text font-body text-sm placeholder:text-m360-muted/50 transition-all duration-200"
              />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-gold-focus w-full px-4 py-3 rounded-xl bg-m360-card-alt border border-m360-border text-m360-text font-body text-sm placeholder:text-m360-muted/50 transition-all duration-200"
              />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-gold-focus w-full px-4 py-3 rounded-xl bg-m360-card-alt border border-m360-border text-m360-text font-body text-sm transition-all duration-200"
                aria-label="Your country"
              >
                <option value="">Where are you based? (Country)</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div>
                <p className="font-body text-xs text-m360-muted mb-2">Your age range</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Age range selection">
                  {['Under 18', '18–24', '25–34', '35–44', '45+'].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setAgeRange(age)}
                      role="radio"
                      aria-checked={ageRange === age}
                      className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all cursor-pointer ${
                        ageRange === age
                          ? 'bg-m360-gold text-m360-bg shadow-[0_0_12px_rgba(243,174,28,0.3)]'
                          : 'bg-m360-card-alt border border-m360-border text-m360-muted hover:border-m360-gold/50'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
              {error && (
                <p className="font-body text-xs text-red-400">{error}</p>
              )}
              <motion.button
                type="submit"
                className="btn-physical w-full px-6 py-3.5 rounded-xl bg-m360-gold text-m360-bg font-heading font-bold text-sm cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Carve My Name →
              </motion.button>
            </form>
            <p className="font-body text-[10px] text-m360-muted/50 text-center mt-3">
              We'll only email you when we launch. No spam, ever.
            </p>
          </motion.div>
        ) : status === 'loading' || submitting ? (
          <motion.div
            key="submitting"
            className="mt-6 p-5 rounded-2xl bg-m360-card/80 border border-m360-gold/30 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-block w-6 h-6 border-2 border-m360-gold/30 border-t-m360-gold rounded-full animate-spin mb-2" />
            <p className="font-body text-xs text-m360-muted">Securing your leaderboard spot…</p>
          </motion.div>
        ) : (
          <motion.div
            key="claimed"
            className="mt-6 p-5 rounded-2xl bg-m360-gold/10 border border-m360-gold/30 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="text-4xl mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
         <img src="../../../assets/svg.png" alt="" className="max-w-[80px] h-auto mx-auto" />

            </motion.div>
            <h4 className="font-heading text-lg md:text-xl text-m360-gold font-bold">
              Welcome on Board, Pharaoh!
            </h4>
            <p className="font-body text-xs text-m360-muted mt-2">
              <span className="text-m360-cream font-semibold">{name || userName}</span> — your name is carved in credits and rising on the leaderboard!
            </p>
            {/* Leaderboard entry animation */}
            <motion.div
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-m360-gold/20 border border-m360-gold/40"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.span
                className="text-m360-gold text-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  textShadow: [
                    '0 0 0px rgba(243,174,28,0)',
                    '0 0 12px rgba(243,174,28,0.6)',
                    '0 0 0px rgba(243,174,28,0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                🏆
              </motion.span>
              <span className="font-body text-xs text-m360-cream">Leaderboard entry secured</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ============================================
   PYRAMID SVG ICON
   ============================================ */
function PyramidIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pyramid-grad" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3AE1C" />
          <stop offset="1" stopColor="#C8921B" />
        </linearGradient>
      </defs>
      {/* Main pyramid */}
      <polygon points="32,4 60,56 4,56" fill="url(#pyramid-grad)" />
      {/* Left face shading */}
      <polygon points="32,4 4,56 32,56" fill="rgba(0,0,0,0.15)" />
      {/* Center line */}
      <line x1="32" y1="4" x2="32" y2="56" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      {/* Horizontal lines */}
      <line x1="20" y1="36" x2="44" y2="36" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      <line x1="26" y1="20" x2="38" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      {/* Sun */}
      <circle cx="48" cy="12" r="4" fill="#F3AE1C" opacity="0.6" />
    </svg>
  )
}

/* ============================================
   MAIN GAME DEMO COMPONENT
   ============================================ */
export default function GameDemo() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { soundOn, setSoundOn, playCorrect, playWrong } = useGameAudio()

  // Backend-driven "has this user completed the game?" gate. We read the
  // canonical m360_doc mirror; if the server says gameComplete, the Start
  // button is replaced with a "completed" note. This is a snapshot taken at
  // render time — the ResultsScreen re-validates against the server on mount.
  const hasPlayedGame = !!cachedDoc()?.gameComplete
  // User name for welcome messages — from the backend mirror, not localStorage.
  const userName = cachedDoc()?.name || ''

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [credits, setCredits] = useState(0)
  const creditsRef = useRef(0)
  // Raw user picks, sent to the backend for server-side scoring. We never
  // trust the client's own credit tally for the canonical record.
  const answersRef = useRef([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [showXpPopup, setShowXpPopup] = useState(false)
  // If the backend already says the game is done (cachedDoc), start in the
  // "game complete" state so the ResultsScreen renders on reload — which
  // re-validates against the server (getState) and re-animates the
  // leaderboard highlight. Without this, a returning user would just see the
  // static "completed" start screen and never get the animated end layout.
  const [gameComplete, setGameComplete] = useState(() => !!cachedDoc()?.gameComplete)
  const [hasStarted, setHasStarted] = useState(() => !!cachedDoc()?.gameComplete)
  const [completedIndices, setCompletedIndices] = useState([])
  const [spotlightPulse, setSpotlightPulse] = useState(false)
  const [highlightEntry, setHighlightEntry] = useState(null)
const handleHighlight = useCallback((doc) => {
  setHighlightEntry({ name: doc?.name, email: doc?.email, credits: doc?.totalCredits })
  fetchLeaderboard(12).catch(() => {})
}, [])
  const handleAnswer = useCallback((correct, reward, optionId) => {
    if (correct) {
      setShowConfetti(true)
      setShowXpPopup(true)
      setCredits((prev) => {
        const newVal = prev + reward
        creditsRef.current = newVal
        return newVal
      })
      setCompletedIndices((prev) => [...prev, currentQuestion])
      setSpotlightPulse(true)
      setTimeout(() => setShowConfetti(false), 1500)
      setTimeout(() => setShowXpPopup(false), 1000)
      setTimeout(() => setSpotlightPulse(false), 1000)
    }

    // Record this pick for server-side scoring. We store the option id/label
    // the user chose; the backend compares against its own answer key.
    answersRef.current = [
      ...answersRef.current,
      { questionId: GAME_QUESTIONS[currentQuestion]?.id, answer: optionId },
    ]
    // Persist progress so an unsubmitted game survives a tab close.
    saveGameProgress({ questionIndex: currentQuestion + 1, picks: answersRef.current })

    setTimeout(() => {
      if (currentQuestion < GAME_QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        // Game complete. The backend will flag gameComplete on the submission
        // response; we don't write any localStorage flag here.
        setGameComplete(true)
      }
    }, correct ? 1600 : 3000)
  }, [currentQuestion])

  const startGame = () => {
    // One-time trigger: don't allow replay if already played
    if (hasPlayedGame) return
    setHasStarted(true)
    setCurrentQuestion(0)
    setCredits(0)
    creditsRef.current = 0
    setGameComplete(false)
    setCompletedIndices([])
  }

  // If the form's step-0 auto-submits the game (user finished the game before
  // claiming identity), the backend flips gameComplete on m360_doc. GameDemo
  // doesn't know about that submit, so we subscribe to lbEvents and flip BOTH
  // hasStarted and gameComplete when the canonical doc says the game is done.
  // BOTH must be true for the render to show the ResultsScreen (game-end
  // layout) — the render gate is `hasStarted && gameComplete`. Without
  // hasStarted, the user would just see the static "completed" start screen
  // instead of the animated end layout with their scored credits.
  useEffect(() => {
    const handler = () => {
      if (cachedDoc()?.gameComplete) {
        setHasStarted(true)
        setGameComplete(true)
      }
    }
    lbEvents.addEventListener('lb', handler)
    return () => lbEvents.removeEventListener('lb', handler)
  }, [])

  const question = GAME_QUESTIONS[currentQuestion]

  return (
    <section
      id="game-demo"
      ref={sectionRef}
      className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden"
    >
      {/* Spotlight background glow */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${spotlightPulse ? 'opacity-100' : 'opacity-40'}`}
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 30% 50%, rgba(243,174,28,0.08) 0%, rgba(180,60,30,0.04) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Hieroglyphic ornaments flanking the heading */}
      <div className="absolute top-24 md:top-28 left-4 md:left-12 pointer-events-none select-none" aria-hidden="true">
        <motion.span
          className="text-m360-gold/[0.06] text-5xl md:text-6xl font-serif"
          initial={{ opacity: 0, x: -20, rotate: -10 }}
          animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >𓂀</motion.span>
      </div>
      <div className="absolute top-24 md:top-28 right-4 md:right-12 pointer-events-none select-none" aria-hidden="true">
        <motion.span
          className="text-m360-gold/[0.06] text-5xl md:text-6xl font-serif"
          initial={{ opacity: 0, x: 20, rotate: 10 }}
          animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >𓉴</motion.span>
      </div>

      {/* Section heading */}
      <motion.div
        className="text-center mb-10 md:mb-14 relative z-10"
        initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="font-body text-xs uppercase tracking-[0.25em] text-m360-gold mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Play the Demo
        </motion.p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold">
          <motion.span
            className="text-m360-gold"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >Prove You Know </motion.span>
          <motion.span
            className="text-m360-cream"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 120 }}
          >Egypt</motion.span>
        </h2>
        <motion.p
          className="mt-2 font-body text-sm md:text-base text-m360-muted max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <span className="text-m360-gold">3</span> questions · Up to <span className="text-m360-cream font-semibold">300 credits</span> · Secure your <span className="text-m360-gold">leaderboard spot</span>
        </motion.p>
        <motion.div
          className="mt-4 mx-auto rounded-full"
          style={{ height: 1, background: 'linear-gradient(90deg, transparent, #F3AE1C, transparent)' }}
          initial={{ width: 0 }}
          animate={isInView ? { width: 80 } : {}}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Main content: Game + Leaderboard side by side */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 relative z-10">
        {/* Game area — takes 3 cols */}
        <div className="lg:col-span-3">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(243,174,28,0.05)',
              border: '1px solid rgba(243,174,28,0.3)',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {showConfetti && <ConfettiBurst />}

            {/* HUD bar */}
            <div className="flex items-center justify-between p-4 border-b border-m360-gold/20 bg-m360-card-alt/50">
              <CreditCounter credits={credits} />
              <div className="flex items-center gap-2">
                {hasStarted && !gameComplete && (
                  <div className="flex-1 max-w-[140px]">
                    <XpBar credits={credits} />
                  </div>
                )}
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-m360-gold/25 font-body flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
                  Ramses
                </span>
                <SoundToggle soundOn={soundOn} onToggle={() => setSoundOn(!soundOn)} />
              </div>
            </div>

            {/* Question pills */}
            {hasStarted && !gameComplete && (
              <div className="px-4 pt-3">
                <QuestionPills currentIndex={currentQuestion} completedIndices={completedIndices} />
              </div>
            )}

            {/* Game content */}
            <div className="relative p-5 md:p-7 min-h-[380px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!hasStarted ? (
                  <motion.div
                    key="start"
                    className="text-center space-y-5 py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -40 }}
                  >
                    <PyramidIcon className="w-16 h-16 mx-auto" />
                    <h3 className="font-heading text-xl md:text-2xl text-m360-text font-bold">
                      The Ramses Challenge
                    </h3>
                    {hasPlayedGame ? (
                      <div className="space-y-3">
                        <p className="font-body text-sm text-m360-muted max-w-sm mx-auto">
                          You've already completed the challenge. Your credits are locked in on the leaderboard.
                        </p>
                        <motion.div
                          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-m360-gold/10 border border-m360-gold/30"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F3AE1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="font-body text-sm text-m360-cream/90">Challenge completed — credits secured</span>
                        </motion.div>
                      </div>
                    ) : (
                      <>
                        <p className="font-body text-sm text-m360-muted max-w-sm mx-auto">
                          Test your knowledge of the Pyramids of Giza. Earn up to <span className="text-m360-gold font-semibold">300 credits</span> and carve your name onto Egypt's first gamified leaderboard.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 text-xs font-body">
                          <span className="px-3 py-1.5 rounded-full bg-m360-card-alt border border-m360-border text-m360-gold/80">Q1 · Easy +50</span>
                          <span className="px-3 py-1.5 rounded-full bg-m360-card-alt border border-m360-border text-m360-gold/80">Q2 · Medium +100</span>
                          <span className="px-3 py-1.5 rounded-full bg-m360-card-alt border border-m360-cream/30 text-m360-cream/80">Q3 · Challenge +150</span>
                        </div>
                        <motion.button
                          onClick={startGame}
                          className="btn-physical px-8 py-4 rounded-full bg-m360-gold text-m360-bg font-heading font-bold text-base cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          animate={{
                            boxShadow: [
                              '0 0 25px rgba(243,174,28,0.4)',
                              '0 0 50px rgba(243,174,28,0.7)',
                              '0 0 25px rgba(243,174,28,0.4)',
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          Start the Game →
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                ) : gameComplete ? (
                  <ResultsScreen
                    key="results"
                    credits={credits}
                    answers={answersRef.current}
                   onHighlight={handleHighlight}
                  />
                ) : (
                  <div key={`q${currentQuestion}`} className="relative">
                    {showXpPopup && <XpPopup amount={question.reward} />}
                    {question.type === 'upload' ? (
                      <UploadQuestion
                        key={question.id}
                        question={question}
                        onAnswer={handleAnswer}
                      />
                    ) : (
                      <MultipleChoiceQuestion
                        key={question.id}
                        question={question}
                        onAnswer={handleAnswer}
                        playCorrect={playCorrect}
                        playWrong={playWrong}
                      />
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Sidebar: Leaderboard only — takes 2 cols */}
        <div className="lg:col-span-2">
          <InlineLeaderboard highlightEntry={highlightEntry} />
        </div>
      </div>
    </section>
  )
}
