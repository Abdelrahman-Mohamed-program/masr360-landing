import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { COUNTRIES } from '../utils/constants'
import { SITE_URL } from '../config'

/* ============================================
   FORM STEPS CONFIG — all 22 questions from brief
   Step 0 = required fields (name, email, country, age)
   ============================================ */
const FORM_STEPS = [
  {
    id: 'governorates',
    title: 'Governorates Explorer',
    question: 'How excited are you about exploring all 27 Egyptian governorates?',
    type: 'stars',
    link: `${SITE_URL}/discover`,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
    ),
  },
  {
    id: 'places',
    title: 'Places & Attractions',
    question: 'How useful is the Places & Attractions section for discovering hidden gems?',
    type: 'stars',
    link: `${SITE_URL}/places`,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
  },
  {
    id: 'nightlife',
    title: 'Nightlife & Events',
    question: 'How likely are you to use the Nightlife & Events guide?',
    type: 'stars',
    link: `${SITE_URL}/nights`,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
    ),
  },
  {
    id: 'marketplace',
    title: 'Local Products Marketplace',
    question: 'Would you buy authentic Egyptian products from local makers online?',
    type: 'stars',
    link: `${SITE_URL}/marketplace`,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
    ),
  },
  {
    id: 'game',
    title: 'The M360 Game',
    question: 'How excited are you about playing the M360 Game and earning real credits?',
    type: 'stars',
    link: null,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="15" y1="13" x2="15.01" y2="13" /><line x1="18" y1="11" x2="18.01" y2="11" /><rect x="2" y="6" width="20" height="12" rx="2" /></svg>
    ),
  },
  {
    id: 'travelFrequency',
    title: 'Travel Habits',
    question: 'How often do you travel within Egypt?',
    type: 'options',
    options: ['Never', '1–2 times a year', 'Monthly', 'Weekly'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>
    ),
  },
  {
    id: 'frustration',
    title: 'Pain Points',
    question: "What frustrates you most when trying to discover new places in Egypt?",
    type: 'text',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
    ),
  },
  {
    id: 'premiumMembership',
    title: 'Premium Membership',
    question: 'Would you pay for a premium M360 membership with exclusive perks?',
    type: 'options',
    options: ['Yes, definitely', 'Maybe', 'No'],
    showSlider: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" /></svg>
    ),
  },
  {
    id: 'powerups',
    title: 'In-Game Power-ups',
    question: 'Would you pay for in-game power-ups or hints to climb the leaderboard faster?',
    type: 'options',
    options: ['Yes', 'No', 'Maybe'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    ),
  },
  {
    id: 'dailyOpen',
    title: 'Daily Habit',
    question: 'What would make you open M360 every single day?',
    type: 'text',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
    ),
  },
  {
    id: 'logoImpression',
    title: 'Logo Impression',
    question: 'First impression of our logo?',
    type: 'options',
    options: ['Love it', 'Like it', 'Neutral', 'Needs work'],
    showLogo: true,
    showMiniLogo: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /><circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" /><path d="M12 2a10 10 0 1 0 10 10" /></svg>
    ),
  },
  {
    id: 'colorsFeelEgypt',
    title: 'Color Palette',
    question: 'Does this color palette feel like Egypt to you?',
    type: 'options',
    options: ['Yes, perfectly', 'Somewhat', 'Not really'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /><circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" /><path d="M12 2a10 10 0 1 0 10 10" /></svg>
    ),
  },
  {
    id: 'designRating',
    title: 'Design Feedback',
    question: "What's your overall impression of the website design?",
    type: 'stars',
    showComment: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
    ),
  },
  {
    id: 'missingFeature',
    title: 'Missing Feature',
    question: "What feature do you wish M360 had that isn't listed?",
    type: 'text',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></svg>
    ),
  },
  {
    id: 'removeSection',
    title: 'What to Remove',
    question: "Is there a section you'd remove or deprioritize?",
    type: 'checkboxes',
    options: ['Governorates Explorer', 'Places & Attractions', 'Nightlife & Events', 'Local Products Marketplace', 'The M360 Game', 'None, keep them all'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
    ),
  },
  {
    id: 'tips',
    title: 'Tips & Ideas',
    question: 'Any tips or ideas for the M360 team?',
    type: 'text',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    ),
  },
  {
    id: 'joinCommunity',
    title: 'Community',
    question: 'Would you join a WhatsApp or Telegram community for M360 early users?',
    type: 'options',
    options: ['Yes', 'No'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
  },
  {
    id: 'shareWithFriends',
    title: 'Share M360',
    question: 'Would you share M360 with friends right now?',
    type: 'options',
    options: ['Yes', 'No', 'After I see the full product'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
    ),
  },
  {
    id: 'shareCount',
    title: 'Referral Reach',
    question: 'How many friends would you tell about M360?',
    type: 'options',
    options: ['1–3', '4–10', 'More than 10'],
    conditional: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-8-8 18-2-8-8-2z" /></svg>
    ),
  },
]

const TOTAL_FORM_CREDITS = FORM_STEPS.length * 25 // 450 credits

const SUGGESTION_PLACEHOLDER = 'Share your thoughts, ideas, or suggestions...'

/* ============================================
   STAR RATING — animated gold stars
   ============================================ */
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-3 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          className="p-1.5 cursor-pointer"
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.85 }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        >
          <motion.span
            className={`text-4xl md:text-5xl select-none ${
              star <= (hover || value) ? 'text-m360-gold' : 'text-m360-border'
            }`}
            animate={star <= value ? { scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.35, delay: star * 0.06 }}
            style={{ textShadow: star <= value ? '0 0 12px rgba(243,174,28,0.5)' : 'none' }}
          >
            ★
          </motion.span>
        </motion.button>
      ))}
      {value > 0 && (
        <motion.span
          className="font-body text-xs text-m360-gold ml-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className={value >= 4 ? 'text-m360-gold' : value === 3 ? 'text-m360-cream/60' : 'text-m360-muted/50'}>
            {value === 5 ? 'Loved it' : value === 4 ? 'Great' : value === 3 ? 'Fine' : value === 2 ? 'Meh' : 'Nope'}
          </span>
        </motion.span>
      )}
    </div>
  )
}

/* ============================================
   CREDIT POPUP — big satisfying animation
   ============================================ */
function CreditPopup({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            scale: [0.5, 1.3, 1.1, 1.1, 1],
            y: [0, -10, -40, -80, -120],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <span
            className="font-heading text-3xl md:text-4xl font-bold text-m360-gold whitespace-nowrap"
            style={{ textShadow: '0 0 30px rgba(243,174,28,0.8), 0 0 60px rgba(243,174,28,0.4)' }}
          >
            +25 credits
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ============================================
   CONFETTI BURST — final celebration
   ============================================ */
function ConfettiBurst() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 800,
    y: -200 - Math.random() * 400,
    rotate: Math.random() * 720 - 360,
    color: ['#F3AE1C', '#EFCF9E', '#22C55E', '#FFFFFF', '#C8921B', '#EF4444'][i % 6],
    size: 5 + Math.random() * 8,
    delay: Math.random() * 0.6,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 2.5, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ============================================
   MAIN FORM SECTION

   FLOW:
   - Step 0 (identity): saves name/email/country/age to localStorage + waitlist.
     Does NOT add to leaderboard (no credits yet).
     Does NOT call markCompleted.
   - Questions 1–19: each awards +25 credits
   - Final submit: inserts/updates leaderboard with total credits + triggers animation
   - If user already has m360_user (from game ResultsScreen), Step 0 is skipped
   ============================================ */
export default function FormSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const {
    gameCredits,
    formCredits,
    addFormCredits,
    userSubmitted,
    userName,
    triggerLeaderboardInsert,
    triggerLeaderboardUpdate,
    submitWaitlist,
    markCompleted,
  } = useGame()

  // ============================================
  // INITIAL STATE — read from localStorage for persistence across reloads
  // ============================================
  const [identityDone, setIdentityDone] = useState(() => {
    try { return !!localStorage.getItem('m360_user') } catch { return false }
  })

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      if (localStorage.getItem('m360_user')) return 1 // skip step 0 if identity exists
    } catch {}
    return 0
  })

  const [formData, setFormData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
      if (saved) {
        return {
          name: saved.name || '',
          email: saved.email || '',
          city: saved.city || '',
          ageRange: saved.ageRange || '',
          premiumPrice: 50,
          shareWithFriends: '',
        }
      }
    } catch {}
    return {
      name: '',
      email: '',
      city: '',
      ageRange: '',
      premiumPrice: 50,
      shareWithFriends: '',
    }
  })

  // Restore form credits from localStorage on mount (survives reloads)
  const [localFormCredits, setLocalFormCredits] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
      if (saved?.formCredits && saved.formCredits > 0) return saved.formCredits
    } catch {}
    return 0
  })

  // Restore submitted state from localStorage (survives reloads)
  // NOTE: m360_form_submitted is separate from m360_completed (game)
  const [isSubmitted, setIsSubmitted] = useState(() => {
    try {
      const formSubmitted = localStorage.getItem('m360_form_submitted')
      const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
      if (formSubmitted && saved && saved.name) {
        return true
      }
    } catch {}
    return false
  })

  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const totalSteps = FORM_STEPS.length + 1 // +1 for identity step
  const progress = Math.min(((currentStep + 1) / totalSteps) * 100, 100)
  const totalEarned = gameCredits + localFormCredits

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const triggerCreditAnimation = useCallback(() => {
    setShowCreditPopup(true)
    addFormCredits(25)
    setLocalFormCredits((prev) => {
      const newVal = prev + 25
      // Persist to localStorage so credits survive page reload
      try {
        const saved = JSON.parse(localStorage.getItem('m360_user') || 'null') || {}
        saved.formCredits = newVal
        saved.totalCredits = (saved.gameCredits || 0) + newVal
        localStorage.setItem('m360_user', JSON.stringify(saved))
      } catch {}
      return newVal
    })
    setTimeout(() => setShowCreditPopup(false), 1500)
  }, [addFormCredits])

  const goToNext = useCallback(() => {
    triggerCreditAnimation()
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
    }, 400)
  }, [triggerCreditAnimation])

  const goToPrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  // ============================================
  // SYNC: When game submits identity (same-page, no refresh), update form state
  // ============================================
  useEffect(() => {
    if (userSubmitted && userName && !isSubmitted) {
      try {
        const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
        if (saved) {
          setIdentityDone(true)
          setCurrentStep(1)
          setFormData((prev) => ({
            ...prev,
            name: saved.name || prev.name,
            email: saved.email || prev.email,
            city: saved.city || prev.city,
            ageRange: saved.ageRange || prev.ageRange,
          }))
        }
      } catch {}
    }
  }, [userSubmitted, userName, isSubmitted])

  // ============================================
  // SYNC: Form is submitted only if m360_form_submitted is set
  // (separate from m360_completed which is set by the game)
  // ============================================
  useEffect(() => {
    if (isSubmitted) return
    try {
      const formDone = localStorage.getItem('m360_form_submitted')
      const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
      if (formDone && saved?.name) {
        setIsSubmitted(true)
      }
    } catch {}
  }, [isSubmitted, userSubmitted, userName])

  // Step 0: identity only — save to localStorage + waitlist, NO leaderboard, NO credits
  const handleIdentitySubmit = useCallback(() => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.city || !formData.ageRange) return

    // Preserve any gameCredits if the game already ran (edge case: game → form Step 0)
    let existingGameCredits = 0
    try {
      const prev = JSON.parse(localStorage.getItem('m360_user') || 'null')
      existingGameCredits = prev?.gameCredits || 0
      // Also check m360_game_credits (saved on game complete before name submission)
      const gameCreditsOnly = parseInt(localStorage.getItem('m360_game_credits') || '0', 10)
      if (gameCreditsOnly > existingGameCredits) {
        existingGameCredits = gameCreditsOnly
      }
    } catch {}

    const entry = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      city: formData.city,
      ageRange: formData.ageRange,
      gameCredits: existingGameCredits,
      formCredits: 0,
      source: 'form',
      submittedAt: new Date().toISOString(),
    }

    // Save identity (same as game ResultsScreen's submitWaitlist)
    submitWaitlist(entry.name, entry.email)
    try {
      localStorage.setItem('m360_identity_done', 'true')
      // Save full entry so game can read formCredits later
      localStorage.setItem('m360_user', JSON.stringify(entry))
      // Clean up temporary game credits key (now that identity is saved properly)
      localStorage.removeItem('m360_game_credits')
    } catch {}

    setIdentityDone(true)
    // Advance to first question with credit animation
    triggerCreditAnimation()
    setTimeout(() => {
      setCurrentStep(1)
    }, 400)
  }, [formData, submitWaitlist, triggerCreditAnimation])

  // Compute current step data and conditional visibility
  const showShareCountStep = formData.shareWithFriends === 'Yes'
  const currentStepData = currentStep === 0 ? null : FORM_STEPS[currentStep - 1]
  const isConditionalHidden = currentStep > 0 && currentStepData?.conditional && !showShareCountStep

  // Auto-skip conditional hidden steps — never render "Skipping..."
  // Use ref for handleFinalSubmit to avoid stale closure in this effect
  const handleFinalSubmitRef = useRef(null)
  useEffect(() => {
    // handleFinalSubmit is defined below — this effect just triggers a re-render
    // when isConditionalHidden changes, and the ref is updated after render
  }, [])

  useEffect(() => {
    if (isConditionalHidden && !isSubmitted) {
      if (currentStep < totalSteps - 1) {
        triggerCreditAnimation()
        const timer = setTimeout(() => {
          setCurrentStep((prev) => prev + 1)
        }, 400)
        return () => clearTimeout(timer)
      } else {
        // Last step is conditional & hidden → submit
        // Read from a ref that's updated after each render
        if (handleFinalSubmitRef.current) {
          handleFinalSubmitRef.current()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isConditionalHidden, isSubmitted])

  // Final submit: ALL questions answered → insert/update leaderboard with full credits
  const handleFinalSubmit = useCallback(async () => {
    if (!formData.name.trim() || !formData.email.trim()) return
    setIsSubmitting(true)

    // Read game credits from: (1) context, (2) m360_user.gameCredits, (3) m360_game_credits (saved on game complete)
    let effectiveGameCredits = gameCredits
    try {
      const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
      if (saved?.gameCredits && saved.gameCredits > effectiveGameCredits) {
        effectiveGameCredits = saved.gameCredits
      }
      // Also check m360_game_credits (set when game finishes, before user submits name)
      const gameCreditsOnly = parseInt(localStorage.getItem('m360_game_credits') || '0', 10)
      if (gameCreditsOnly > effectiveGameCredits) {
        effectiveGameCredits = gameCreditsOnly
      }
    } catch {}

    const totalCredits = effectiveGameCredits + localFormCredits

    // Update saved user with full data + credits
    const entry = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      city: formData.city,
      ageRange: formData.ageRange,
      gameCredits: effectiveGameCredits,
      formCredits: localFormCredits,
      totalCredits,
      source: 'form',
      submittedAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem('m360_user', JSON.stringify(entry))
    } catch {}

    // Insert or update on leaderboard with FULL credits
    if (userSubmitted && userName) {
      triggerLeaderboardUpdate(formData.name.trim(), totalCredits)
    } else {
      triggerLeaderboardInsert(formData.name.trim(), totalCredits)
    }

    // Mark as fully completed — prevents game replay
    markCompleted()
    // Mark form specifically as submitted (separate from game completion)
    try { localStorage.setItem('m360_form_submitted', 'true') } catch {}

    // Submit to Formspree
    try {
      await fetch('https://formspree.io/f/FORM_ID_PLACEHOLDER', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...entry,
          formData: Object.fromEntries(
            FORM_STEPS.map((s) => [
              s.id,
              {
                value: formData[s.id],
                suggestion: formData[`${s.id}Suggestion`],
              },
            ])
          ),
        }),
      })
    } catch {
      // Formspree not configured — data saved locally
    }

    setIsSubmitting(false)
    setIsSubmitted(true)
  }, [formData, gameCredits, localFormCredits, userSubmitted, userName, triggerLeaderboardInsert, triggerLeaderboardUpdate, markCompleted])

  // Keep ref in sync with latest handleFinalSubmit (for auto-skip effect)
  useEffect(() => {
    handleFinalSubmitRef.current = handleFinalSubmit
  }, [handleFinalSubmit])

  const copyLink = () => {
    navigator.clipboard.writeText(SITE_URL)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2500)
  }

  const handleNextWrapper = () => {
    if (currentStep < totalSteps - 1) {
      goToNext()
    } else {
      handleFinalSubmit()
    }
  }

  return (
    <section
      id="form"
      ref={sectionRef}
      className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden"
    >
      <CreditPopup show={showCreditPopup} />
      {isSubmitted && <ConfettiBurst />}

      <div className="max-w-2xl mx-auto">
        {/* Hieroglyphic ornaments */}
        <div className="absolute top-24 md:top-28 left-4 md:left-12 pointer-events-none select-none" aria-hidden="true">
          <motion.span
            className="text-m360-gold/[0.05] text-5xl md:text-6xl font-serif"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >𓋹</motion.span>
        </div>
        <div className="absolute top-24 md:top-28 right-4 md:right-12 pointer-events-none select-none" aria-hidden="true">
          <motion.span
            className="text-m360-gold/[0.05] text-5xl md:text-6xl font-serif"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >𓆣</motion.span>
        </div>

        {/* Section header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
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
            Shape M360
          </motion.p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold">
            <motion.span
              className="text-m360-cream"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >Before It </motion.span>
            <motion.span
              className="text-m360-gold"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 120 }}
            >Launches</motion.span>
          </h2>
          <motion.p
            className="mt-3 font-body text-sm text-m360-muted max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Your voice builds this platform. Every answer earns you{' '}
            <span className="text-m360-gold font-semibold">+25 credits</span> and shapes what M360 becomes.
          </motion.p>
          <motion.p
            className="mt-2 font-body text-[10px] text-m360-muted/50"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Credits are earned by answering questions from start to finish.
          </motion.p>
          {/* Animated divider line */}
          <motion.div
            className="mt-5 mx-auto rounded-full"
            style={{ height: 1, background: 'linear-gradient(90deg, transparent, #F3AE1C, transparent)' }}
            initial={{ width: 0 }}
            animate={isInView ? { width: 100 } : {}}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Animated credit goal */}
          <motion.div
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-m360-gold/10 border border-m360-gold/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <span className="font-body text-xs text-m360-muted">Total credits:</span>
            <motion.span
              className="font-heading text-sm text-m360-gold font-bold"
              key={totalEarned}
              initial={{ scale: 1.3, color: '#EFCF9E' }}
              animate={{ scale: 1, color: '#F3AE1C' }}
              transition={{ duration: 0.4 }}
            >
              {totalEarned}
            </motion.span>
            <span className="font-body text-xs text-m360-muted">
              / {gameCredits + TOTAL_FORM_CREDITS} possible
            </span>
          </motion.div>
          <div className="mt-4 w-20 h-0.5 bg-m360-gold/40 mx-auto rounded-full" />
        </motion.div>

        {/* Form card */}
        <motion.div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(243,174,28,0.03)',
            border: '1px solid rgba(243,174,28,0.15)',
            boxShadow: '0 0 40px rgba(243,174,28,0.05)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Progress bar */}
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-xs text-m360-muted">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="font-heading text-xs text-m360-gold font-semibold">
                🏆 {totalEarned} credits
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-m360-card-alt overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-m360-gold via-m360-cream to-m360-gold"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ boxShadow: '0 0 8px rgba(243,174,28,0.4)' }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="px-6 pb-6 min-h-[340px]">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 30, scale: 0.97, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, scale: 0.97, filter: 'blur(3px)' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {currentStep === 0 ? (
                    <RequiredFieldsStep
                      formData={formData}
                      updateField={updateField}
                      onNext={handleIdentitySubmit}
                    />
                  ) : isConditionalHidden ? (
                    /* Render nothing while useEffect auto-advances */
                    <div className="flex items-center justify-center py-12">
                      <motion.div
                        className="w-6 h-6 border-2 border-m360-gold/40 border-t-m360-gold rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                  ) : (
                    <QuestionStep
                      step={currentStepData}
                      formData={formData}
                      updateField={updateField}
                      onNext={handleNextWrapper}
                      onPrev={goToPrev}
                      isLast={currentStep === totalSteps - 1}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </motion.div>
              ) : (
                <SuccessStep
                  key="success"
                  name={formData.name}
                  email={formData.email}
                  gameCredits={gameCredits}
                  formCredits={localFormCredits}
                  onCopy={copyLink}
                  copySuccess={copySuccess}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================
   STEP 0 — IDENTITY (name, email, country, age)
   Saves user to early access database. Does NOT add credits or leaderboard.
   Credits note shown to set expectations.
   ============================================ */
function RequiredFieldsStep({ formData, updateField, onNext }) {
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    if (!formData.city) {
      setError('Please select your country')
      return
    }
    if (!formData.ageRange) {
      setError('Please select your age range')
      return
    }
    setError('')
    onNext()
  }

  const inputClass =
    'w-full px-4 py-3.5 rounded-xl bg-m360-card-alt border border-m360-border text-m360-text font-body text-sm placeholder:text-m360-muted/50 transition-all duration-200 focus:outline-none focus:border-m360-gold focus:shadow-[0_0_0_3px_rgba(243,174,28,0.2)]'

  return (
    <div className="space-y-5 py-4">
      <div className="text-center mb-6">
        <motion.div
          className="text-4xl mb-3"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
        >
          🏛️
        </motion.div>
        <h3 className="font-heading text-lg md:text-xl text-m360-cream font-bold">
          Your Name in the Hall of Pharaohs
        </h3>
        <p className="font-body text-xs text-m360-muted mt-2 max-w-sm mx-auto">
          Enter your details to enter the realm. Complete the questions below and your name rises onto the Masr360 leaderboard.
        </p>
        <p className="font-body text-[10px] text-m360-muted/50 mt-1">
          Credits are earned by answering questions — not by signing up.
        </p>
      </div>

      <input
        type="text"
        placeholder="Your name (Arabic or English)"
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        className={inputClass}
        aria-label="Your name"
        aria-required="true"
      />
      <input
        type="email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        className={inputClass}
        aria-label="Your email address"
        aria-required="true"
      />
      <select
        value={formData.city}
        onChange={(e) => updateField('city', e.target.value)}
        className={inputClass}
        aria-label="Your country"
        aria-required="true"
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
              onClick={() => updateField('ageRange', age)}
              role="radio"
              aria-checked={formData.ageRange === age}
              className={`px-4 py-2.5 rounded-full text-xs font-body font-medium transition-all cursor-pointer ${
                formData.ageRange === age
                  ? 'bg-m360-gold text-m360-bg shadow-[0_0_12px_rgba(243,174,28,0.3)]'
                  : 'bg-m360-card-alt border border-m360-border text-m360-muted hover:border-m360-gold/50'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="font-body text-xs text-m360-error" role="alert">{error}</p>}

      <motion.button
        type="button"
        onClick={handleNext}
        className="btn-physical w-full px-6 py-4 rounded-xl bg-m360-gold text-m360-bg font-heading font-bold text-sm cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Enter the Realm →
      </motion.button>
    </div>
  )
}

/* ============================================
   QUESTION STEP — handles stars, options, text, checkboxes
   ============================================ */
function QuestionStep({ step, formData, updateField, onNext, onPrev, isLast, isSubmitting }) {
  const [localValue, setLocalValue] = useState(formData[step.id] || (step.type === 'checkboxes' ? [] : ''))
  const [comment, setComment] = useState(formData[`${step.id}Comment`] || '')
  const [suggestion, setSuggestion] = useState(formData[`${step.id}Suggestion`] || '')
  const [error, setError] = useState('')

  const handleNext = () => {
    if (step.type === 'stars' && !localValue) {
      setError('Pick a rating to continue')
      return
    }
    if (step.type === 'options' && !localValue) {
      setError('Pick an option to continue')
      return
    }
    if (step.type === 'checkboxes' && localValue.length === 0) {
      setError('Select at least one option')
      return
    }
    if (step.type === 'text' && !localValue.trim()) {
      setError('Please share your thoughts before continuing')
      return
    }
    setError('')
    updateField(step.id, localValue)
    if (step.showComment) {
      updateField(`${step.id}Comment`, comment)
    }
    updateField(`${step.id}Suggestion`, suggestion)
    onNext()
  }

  const handleCheckbox = (option) => {
    setLocalValue((prev) => {
      if (option === 'None, keep them all') return ['None, keep them all']
      const filtered = prev.filter((v) => v !== 'None, keep them all')
      return filtered.includes(option)
        ? filtered.filter((v) => v !== option)
        : [...filtered, option]
    })
  }

  return (
    <div className="space-y-5 py-4">
      {/* Step header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-m360-gold/20 bg-m360-gold/5 text-m360-gold mb-3">
          {step.icon}
        </div>
        <h3 className="font-heading text-base md:text-lg text-m360-cream font-bold">
          {step.question}
        </h3>
        {step.link && (
          <a
            href={step.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 font-body text-xs text-m360-gold/70 hover:text-m360-gold transition-colors"
          >
            See this section on m360travel.com →
          </a>
        )}
      </div>

      {/* Logo displays for logo impression question */}
      {(step.showLogo || step.showMiniLogo) && (
        <div className="flex justify-center gap-4">
          {step.showLogo && (
            <img
              src='https://res.cloudinary.com/dwh6drlr9/image/upload/v1782426236/Logo_oeinar.jpg'
              alt="M360 Logo"
              width="112"
              height="112"
              loading="lazy"
              className="w-28 h-28 object-contain rounded-2xl border border-m360-gold/30 bg-m360-card-alt p-2"
            />
          )}
          {step.showMiniLogo && (
            <img
              src="https://res.cloudinary.com/dwh6drlr9/image/upload/v1782426244/Mini-logo_rvz9zh.jpg"
              alt="M360 Mini Logo"
              width="112"
              height="112"
              loading="lazy"
              className="w-28 h-28 object-cover rounded-full border border-m360-gold/30 bg-m360-card-alt"
            />
          )}
        </div>
      )}

      {/* Stars */}
      {step.type === 'stars' && (
        <StarRating value={localValue} onChange={setLocalValue} />
      )}

      {/* Options */}
      {step.type === 'options' && (
        <div className="space-y-2">
          {step.options.map((option) => (
            <motion.button
              key={option}
              type="button"
              onClick={() => {
                setLocalValue(option)
                if (step.id === 'shareWithFriends') updateField('shareWithFriends', option)
              }}
              className={`w-full text-left px-4 py-3.5 rounded-xl font-body text-sm transition-all cursor-pointer ${
                localValue === option
                  ? 'bg-m360-gold/15 border-2 border-m360-gold text-m360-gold shadow-[0_0_12px_rgba(243,174,28,0.15)]'
                  : 'bg-m360-card-alt border-2 border-m360-border text-m360-muted hover:border-m360-gold/40'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      )}

      {/* Text */}
      {step.type === 'text' && (
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full px-4 py-3.5 rounded-xl bg-m360-card-alt border border-m360-border text-m360-text font-body text-sm placeholder:text-m360-muted/50 transition-all duration-200 focus:outline-none focus:border-m360-gold focus:shadow-[0_0_0_3px_rgba(243,174,28,0.2)] resize-none"
        />
      )}

      {/* Checkboxes */}
      {step.type === 'checkboxes' && (
        <div className="space-y-2">
          {step.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleCheckbox(option)}
              className={`w-full text-left px-4 py-3 rounded-xl font-body text-sm transition-all cursor-pointer flex items-center gap-3 ${
                localValue.includes(option)
                  ? 'bg-m360-gold/15 border-2 border-m360-gold text-m360-gold'
                  : 'bg-m360-card-alt border-2 border-m360-border text-m360-muted hover:border-m360-gold/40'
              }`}
            >
              <span
                className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  localValue.includes(option)
                    ? 'bg-m360-gold border-m360-gold'
                    : 'border-m360-border'
                }`}
              >
                {localValue.includes(option) && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1" stroke="#0B0B0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Optional comment for design rating */}
      {step.showComment && localValue && (
        <motion.textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any additional thoughts? (optional)"
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-m360-card-alt border border-m360-border text-m360-text font-body text-sm placeholder:text-m360-muted/50 transition-all duration-200 focus:outline-none focus:border-m360-gold focus:shadow-[0_0_0_3px_rgba(243,174,28,0.2)] resize-none"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Opinion / suggestion box — always visible, generic placeholder */}
      <div className="pt-1">
        <label className="font-body text-xs text-m360-muted/70 mb-1.5 block">
          💭 Anything specific? (optional)
        </label>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder={SUGGESTION_PLACEHOLDER}
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-m360-card-alt/70 border border-m360-border/60 text-m360-text font-body text-sm placeholder:text-m360-muted/40 transition-all duration-200 focus:outline-none focus:border-m360-gold/50 focus:shadow-[0_0_0_2px_rgba(243,174,28,0.1)] resize-none"
        />
      </div>

      {/* Premium membership slider */}
      {step.showSlider && (localValue === 'Yes, definitely' || localValue === 'Maybe') && (
        <motion.div
          className="p-5 rounded-xl bg-m360-card-alt border border-m360-gold/30"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <label className="font-body text-sm text-m360-cream block mb-3">
            How much would you pay per month?{' '}
            <span className="text-m360-gold font-bold text-lg">{formData.premiumPrice} EGP</span>
          </label>
          <input
            type="range"
            min="0"
            max="200"
            step="10"
            value={formData.premiumPrice}
            onChange={(e) => updateField('premiumPrice', Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #F3AE1C 0%, #F3AE1C ${(formData.premiumPrice / 200) * 100}%, #1A1A1A ${(formData.premiumPrice / 200) * 100}%, #1A1A1A 100%)`,
            }}
          />
          <div className="flex justify-between mt-2">
            <span className="font-body text-[10px] text-m360-muted">0 EGP</span>
            <span className="font-body text-[10px] text-m360-muted">200 EGP</span>
          </div>
        </motion.div>
      )}

      {error && <p className="font-body text-xs text-m360-error" role="alert">{error}</p>}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="button"
          onClick={onPrev}
          className="px-5 py-3 rounded-xl border border-m360-border text-m360-muted font-body text-sm hover:border-m360-gold/50 hover:text-m360-cream transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ← Back
        </motion.button>
        <motion.button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="btn-physical flex-1 px-6 py-3.5 rounded-xl bg-m360-gold text-m360-bg font-heading font-bold text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : isLast ? 'Rise on the Leaderboard →' : 'Continue →'}
        </motion.button>
      </div>
    </div>
  )
}

/* ============================================
   SUCCESS STEP — Pharaoh's welcome screen
   ============================================ */
function SuccessStep({ name, email, gameCredits, formCredits, onCopy, copySuccess }) {
  const total = gameCredits + formCredits
  // Calculate rank from localStorage leaderboard
  const rank = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem('m360_user') || 'null')
      const lb = JSON.parse(localStorage.getItem('m360_leaderboard') || '[]')
      const idx = lb.findIndex((e) => e.name === (saved?.name || name))
      return idx >= 0 ? idx + 1 : '—'
    } catch { return '—' }
  })()

  return (
    <motion.div
      className="relative text-center py-6 md:py-10 space-y-7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative top ornament */}
      <motion.div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full bg-gradient-to-r from-transparent via-m360-gold/60 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />

      {/* Pharaoh crown icon with glow */}
      <motion.div
        className="relative inline-block"
        initial={{ scale: 0, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
      >
        <div className="text-5xl md:text-6xl" style={{ filter: 'drop-shadow(0 0 20px rgba(243,174,28,0.5))' }}>
          👑
        </div>
        {/* Rotating glow ring */}
        <motion.div
          className="absolute inset-0 -m-3 rounded-full border border-m360-gold/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ borderStyle: 'dashed' }}
        />
      </motion.div>

      {/* Welcome message */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-m360-gold/70 mb-2">
          The sands have spoken
        </p>
        <h3 className="font-heading text-2xl md:text-3xl text-m360-cream font-bold leading-tight">
          You now lead the <span className="text-gradient-gold">M360</span> ship,
        </h3>
        <h3 className="font-heading text-2xl md:text-3xl text-m360-gold font-bold mt-1">
          Pharaoh {name}.
        </h3>
      </motion.div>

      {/* Decorative divider */}
      <motion.div
        className="flex items-center justify-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-m360-gold/50" />
        <span className="text-m360-gold/60 text-sm">◆</span>
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-m360-gold/50" />
      </motion.div>

      {/* Body message */}
      <motion.div
        className="max-w-sm mx-auto space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <p className="font-body text-sm text-m360-cream/90 leading-relaxed">
          Your voice has shaped what M360 will become. Every answer you gave carries weight in building something extraordinary for Egypt's future of travel.
        </p>
        <p className="font-body text-xs text-m360-muted">
          Thank you for your time, your insights, and your trust.
        </p>
      </motion.div>

      {/* Credits earned card */}
      <motion.div
        className="relative p-5 rounded-2xl max-w-xs mx-auto overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(243,174,28,0.08) 0%, rgba(243,174,28,0.02) 100%)',
          border: '1px solid rgba(243,174,28,0.25)',
        }}
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.75 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-m360-gold/5 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
        />
        <div className="relative">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-m360-gold/60 mb-3">
            Credits secured
          </p>
          <div className="space-y-2.5 font-body text-sm">
            <div className="flex justify-between items-center">
              <span className="text-m360-muted">Game</span>
              <span className="text-m360-cream font-medium">{gameCredits}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-m360-muted">Form</span>
              <span className="text-m360-cream font-medium">{formCredits}</span>
            </div>
            <div className="border-t border-m360-gold/20 pt-3 flex justify-between items-center">
              <span className="text-m360-cream font-semibold text-sm">Total Earned</span>
              <motion.span
                className="text-m360-gold font-bold text-2xl font-heading"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: 'spring', stiffness: 200 }}
                style={{ textShadow: '0 0 20px rgba(243,174,28,0.5)' }}
              >
                {total}
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Early access privilege */}
      <motion.div
        className="max-w-xs mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="p-4 rounded-xl bg-m360-gold/5 border border-m360-gold/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.span
              className="text-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ⚡
            </motion.span>
            <p className="font-heading text-sm text-m360-gold font-bold">
              Early Access Privileges
            </p>
          </div>
          <p className="font-body text-xs text-m360-muted leading-relaxed">
            You'll be among the first to step inside M360 when we launch. Watch your inbox — <span className="text-m360-cream/80">{email}</span> — for your exclusive invitation.
          </p>
        </div>
      </motion.div>

      {/* Leaderboard rank */}
      <motion.div
        className="max-w-xs mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-m360-card-alt/50 border border-m360-border/50">
          <span className="text-xl">🏆</span>
          <div className="text-left">
            <p className="font-heading text-sm text-m360-cream font-bold">
              Your name is carved at Rank #{rank} on the pre-launch leaderboard
            </p>
            <p className="font-body text-[10px] text-m360-muted">
              Top 10 receive exclusive perks, badges & priority access
            </p>
          </div>
        </div>
      </motion.div>

      {/* Share CTA */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-m360-gold/40 text-m360-gold font-body font-semibold text-sm hover:bg-m360-gold/10 hover:border-m360-gold/60 transition-all cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {copySuccess ? '✅ Link Copied!' : '🔗 Summon Others to Compete'}
        </motion.button>
        <p className="font-body text-[10px] text-m360-muted/50">
          The more friends you summon, the higher you rise on the leaderboard.
        </p>
      </motion.div>

      {/* Bottom ornament */}
      <motion.div
        className="flex items-center justify-center gap-2 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        <div className="w-8 h-px bg-m360-gold/30" />
        <span className="text-m360-gold/40 text-xs">𓂀</span>
        <div className="w-8 h-px bg-m360-gold/30" />
      </motion.div>
    </motion.div>
  )
}
