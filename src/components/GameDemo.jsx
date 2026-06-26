import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { GAME_QUESTIONS, PRESEEDED_LEADERBOARD } from '../utils/constants'

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
      onAnswer(correct, question.reward)
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
    setTimeout(() => onAnswer(true, question.reward), 1200)
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
              <img src={preview} alt="Upload preview" className="w-full h-48 object-cover" />
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
  const [animatingName, setAnimatingName] = useState(null)
  const [animCounter, setAnimCounter] = useState(0)
  const prevHighlightRef = useRef(null)
  const prevTriggerRef = useRef(0)
  const { leaderboardUpdateTrigger, userName } = useGame()

  // Load entries and deduplicate by name (stored entries override preseeded)
  const loadEntries = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('m360_leaderboard') || '[]')
      const map = new Map()
      // Preseeded first, stored overrides (stored = actual user data)
      for (const e of PRESEEDED_LEADERBOARD) {
        map.set(e.name, { ...e })
      }
      for (const e of stored) {
        const existing = map.get(e.name)
        if (!existing || e.credits > existing.credits) {
          map.set(e.name, { ...e })
        }
      }
      const combined = [...map.values()]
        .sort((a, b) => b.credits - a.credits || a.name.localeCompare(b.name))
        .slice(0, compact ? 8 : 12)
      setEntries(combined)
      return combined
    } catch {
      const fallback = [...PRESEEDED_LEADERBOARD].slice(0, compact ? 8 : 12)
      setEntries(fallback)
      return fallback
    }
  }, [compact])

  useEffect(() => {
    loadEntries()
  }, [highlightEntry, leaderboardUpdateTrigger, loadEntries])

  // Trigger animation when highlightEntry changes (game end or form submit)
  useEffect(() => {
    if (highlightEntry && highlightEntry !== prevHighlightRef.current) {
      prevHighlightRef.current = highlightEntry
      setAnimatingName(highlightEntry.name)
      setAnimCounter((c) => c + 1)
      const timer = setTimeout(() => setAnimatingName(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [highlightEntry])

  // Trigger animation when leaderboardUpdateTrigger changes (form final submit → position update)
  useEffect(() => {
    if (leaderboardUpdateTrigger > 0 && leaderboardUpdateTrigger !== prevTriggerRef.current && userName) {
      prevTriggerRef.current = leaderboardUpdateTrigger
      setAnimatingName(userName)
      setAnimCounter((c) => c + 1)
      const timer = setTimeout(() => setAnimatingName(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [leaderboardUpdateTrigger, userName])

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
          key={`count-${entries.length}-${animCounter}`}
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
            const isAnimating = animatingName === entry.name
            // Stable key: use name + position. Only include animCounter when animating to force remount
            const rowKey = `${entry.name}-${entry.credits}-${i}${isAnimating ? `-anim-${animCounter}` : ''}`
            return (
              <LeaderboardRow
                key={rowKey}
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
function ResultsScreen({ credits, onFormSubmit, onGameCreditsOnly }) {
  const { userName } = useGame()
  const pct = Math.round((credits / TOTAL_POSSIBLE) * 100)

  // Check if user already saved identity (from form Step 0 or previous game)
  const [identitySaved, setIdentitySaved] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
      return !!saved?.name  // Only true if NAME exists (identity fully saved)
    } catch { return false }
  })

  // Re-check identity from context (same-page sync: form Step 0 might submit while game is running)
  useEffect(() => {
    if (userName && !identitySaved) {
      setIdentitySaved(true)
      try {
        const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
        if (saved?.name) setName(saved.name)
        if (saved?.email) setEmail(saved.email)
      } catch {}
    }
  }, [userName, identitySaved])

  const [name, setName] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
      return saved?.name || ''
    } catch { return '' }
  })
  const [email, setEmail] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
      return saved?.email || ''
    } catch { return '' }
  })
  const [error, setError] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

  // If identity was already saved (user filled form first), auto-trigger leaderboard
  // This handles: form Step 0 → game → ResultsScreen should add game credits to leaderboard
  // IMPORTANT: Does NOT call markCompleted — user must still fill form questions
  useEffect(() => {
    if (identitySaved && !formSubmitted) {
      const savedName = name || userName
      if (savedName && onGameCreditsOnly) {
        // Only add game credits to leaderboard, do NOT mark as completed
        onGameCreditsOnly(savedName, email, credits)
      }
      setFormSubmitted(true)
    }
  }, [identitySaved, formSubmitted, name, userName, email, credits, onGameCreditsOnly])

  const handleFormSubmit = (e) => {
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
    setFormSubmitted(true)
    // User explicitly submits name/email → full submit (leaderboard + markCompleted)
    if (onFormSubmit) onFormSubmit(name, email, credits)
  }

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
          {credits}
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
          {credits === TOTAL_POSSIBLE ? (
            <span className="text-m360-gold/90">Flawless. Every question answered perfectly.</span>
          ) : credits >= 200 ? (
            <span className="text-m360-cream/70">Impressive knowledge. Egypt would be proud.</span>
          ) : credits >= 100 ? (
            <span className="text-m360-cream/50">Solid run. You know your way around Egypt.</span>
          ) : (
            <span className="text-m360-muted/70">A good start. There is more to discover.</span>
          )}
        </p>
      </div>

      {/* Waitlist form — claim credits (skip if identity already saved via form) */}
      <AnimatePresence mode="wait">
        {!formSubmitted && !identitySaved ? (
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
              👑
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
  const { markGamePlayed, markCompleted, hasPlayedGame, submitWaitlist, triggerLeaderboardInsert } = useGame()
  const { soundOn, setSoundOn, playCorrect, playWrong } = useGameAudio()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [credits, setCredits] = useState(0)
  const creditsRef = useRef(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showXpPopup, setShowXpPopup] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [completedIndices, setCompletedIndices] = useState([])
  const [spotlightPulse, setSpotlightPulse] = useState(false)
  const [highlightEntry, setHighlightEntry] = useState(null)

  const handleAnswer = useCallback((correct, reward) => {
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

    setTimeout(() => {
      if (currentQuestion < GAME_QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        setGameComplete(true)
        markGamePlayed()
        // Save game credits to a separate key so form can read them later
        try {
          localStorage.setItem('m360_game_credits', String(creditsRef.current))
        } catch {}
      }
    }, correct ? 1600 : 3000)
  }, [currentQuestion, markGamePlayed])

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
                    onFormSubmit={(name, email, gameCreditsEarned) => {
                      // FULL submit: user explicitly entered name/email → save everything + markCompleted
                      try {
                        const saved = JSON.parse(localStorage.getItem('m360_user') || 'null') || {}
                        const savedGameCredits = parseInt(localStorage.getItem('m360_game_credits') || '0', 10)
                        const previousFormCredits = saved.formCredits || 0
                        const bestGameCredits = Math.max(saved.gameCredits || 0, savedGameCredits, gameCreditsEarned)
                        const entry = {
                          name: name.trim(),
                          email: email.trim(),
                          city: saved.city || '',
                          ageRange: saved.ageRange || '',
                          gameCredits: bestGameCredits,
                          formCredits: previousFormCredits,
                          totalCredits: bestGameCredits + previousFormCredits,
                          source: 'game',
                          submittedAt: new Date().toISOString(),
                        }
                        localStorage.setItem('m360_user', JSON.stringify(entry))
                        try { localStorage.removeItem('m360_game_credits') } catch {}
                      } catch {}
                      submitWaitlist(name, email)
                      markCompleted()
                      // Update leaderboard with game credits only (form credits already there if any)
                      let totalCredits = gameCreditsEarned
                      try {
                        const lb = JSON.parse(localStorage.getItem('m360_leaderboard') || '[]')
                        const existing = lb.find((e) => e.name === name.trim())
                        if (existing) {
                          totalCredits = existing.credits + gameCreditsEarned
                        }
                      } catch {}
                      triggerLeaderboardInsert(name.trim(), totalCredits)
                      setHighlightEntry({ name: name.trim(), credits: totalCredits })
                    }}
                    onGameCreditsOnly={(name, email, gameCreditsEarned) => {
                      // AUTO submit: identity already exists → only add game credits to leaderboard
                      // Does NOT call markCompleted — user still needs to fill form questions
                      try {
                        const saved = JSON.parse(localStorage.getItem('m360_user') || 'null') || {}
                        const savedGameCredits = parseInt(localStorage.getItem('m360_game_credits') || '0', 10)
                        const bestGameCredits = Math.max(saved.gameCredits || 0, savedGameCredits, gameCreditsEarned)
                        const entry = {
                          name: saved.name || name.trim(),
                          email: saved.email || email.trim(),
                          city: saved.city || '',
                          ageRange: saved.ageRange || '',
                          gameCredits: bestGameCredits,
                          formCredits: saved.formCredits || 0,
                          totalCredits: bestGameCredits + (saved.formCredits || 0),
                          source: 'game',
                          submittedAt: new Date().toISOString(),
                        }
                        localStorage.setItem('m360_user', JSON.stringify(entry))
                        try { localStorage.removeItem('m360_game_credits') } catch {}
                      } catch {}
                      // Update leaderboard: add game credits to existing form entry
                      let totalCredits = gameCreditsEarned
                      try {
                        const lb = JSON.parse(localStorage.getItem('m360_leaderboard') || '[]')
                        const existing = lb.find((e) => e.name === (saved.name || name.trim()))
                        if (existing) {
                          totalCredits = existing.credits + gameCreditsEarned
                        }
                      } catch {}
                      triggerLeaderboardInsert(saved.name || name.trim(), totalCredits)
                      setHighlightEntry({ name: saved.name || name.trim(), credits: totalCredits })
                    }}
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
