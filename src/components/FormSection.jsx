import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FiShare, FiShare2, FiUserPlus } from "react-icons/fi";
import { COUNTRIES } from '../utils/constants'
import {
  submitWaitlist,
  submitForm,
  submitGame,
  getState,
  cachedDoc,
  fetchLeaderboard,
  readGameProgress,
  lbEvents,
} from '../lib/api'
import { SITE_URL } from '../config'

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

   FLOW (backend-driven):
   - On mount: read m360_doc. If doc.email exists and doc.inWaitlist → skip
     step 0 (identity already captured). If doc.formComplete → show success.
   - Step 0 (identity): POST /api/waitlist to capture identity server-side.
     Does NOT add credits or leaderboard.
   - Questions 1–N: each awards +25 local form credits (progress only).
   - Final submit: POST /api/form/submit → backend flags formComplete, awards
     formCredits, recomputes totalCredits. The response drives the success UI.
   - All credits, flags, and rank come from the backend response (m360_doc).
   ============================================ */
export default function FormSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  // Backend mirror — the single source of truth for identity, flags, credits.
  // We read it once on mount to seed the form; after each API call,
  // applyResponse updates localStorage and we re-read via refreshDoc().
  const [doc, setDoc] = useState(() => cachedDoc())

  // Re-read m360_doc from localStorage (called after each applyResponse).
  const refreshDoc = useCallback(() => setDoc(cachedDoc()), [])

  // ============================================
  // INITIAL STATE — derived from the backend mirror (m360_doc)
  // ============================================
  const [identityDone, setIdentityDone] = useState(() => {
    const d = cachedDoc()
    return !!(d?.email && d?.inWaitlist)
  })

  const [currentStep, setCurrentStep] = useState(() => {
    const d = cachedDoc()
    // Check if identity already completed (should skip step 0)
    const shouldSkipIdentity = d?.email && d?.inWaitlist

    if (shouldSkipIdentity) {
      // If identity done, always start at step 1 (after identity)
      return 1
    }

    // If identity not done, check for saved progress
    try {
      const savedProgress = localStorage.getItem('m360_form_progress')
      if (savedProgress !== null) {
        const parsed = parseInt(savedProgress, 10)
        if (!isNaN(parsed) && parsed >= 0) {
          return parsed
        }
      }
    } catch (e) {
      // Ignore storage errors - fall through to default
      console.warn('Failed to read form progress from localStorage:', e)
    }

    // Default: start at step 0 (identity) if no valid saved progress
    return 0
  })

  const [formData, setFormData] = useState(() => {
    const d = cachedDoc()
    if (d?.email) {
      return {
        name: d.name || '',
        email: d.email || '',
        city: d.city || '',
        ageRange: d.ageRange || '',
        premiumPrice: 50,
        shareWithFriends: '',
      }
    }
    return {
      name: '',
      email: '',
      city: '',
      ageRange: '',
      premiumPrice: 50,
      shareWithFriends: '',
    }
  })

  // Submitted state — from the backend mirror's formComplete flag. THIS is the
  // gate: once the server says the form is complete, we show the success UI
  // with credits from the response — never from local counters.
  const [isSubmitted, setIsSubmitted] = useState(() => !!cachedDoc()?.formComplete)

  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const totalSteps = FORM_STEPS.length + 1 // +1 for identity step
  // Progress bar = steps answered / total. Local (progress cache).
  const progress = Math.min(((currentStep + 1) / totalSteps) * 100, 100)

  // CREDITS — every displayed value comes straight from the backend doc
  // (m360_doc). The backend saves gameCredits=300 and formCredits=475 as
  // static numbers. The frontend does ZERO credit math — it only displays
  // what the server returns. Before the game is played, gameCredits=0; before
  // the form is submitted, formCredits=0. The "possible" maxima also come from
  // the doc (maxGameCredits=300, maxFormCredits=475).
  const gameCredits = doc?.gameCredits || 0
  const formCredits = doc?.formCredits || 0
  const totalCredits = doc?.totalCredits || 0
  const maxGameCredits = doc?.maxGameCredits || 300
  const maxFormCredits = doc?.maxFormCredits || 475

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Step-advance flourish — just shows a "+25 credits" popup. No API call, no
  // credit computation. The actual credit display is driven entirely by the
  // backend doc via the lbEvents subscription below.
  const triggerCreditAnimation = useCallback(() => {
    setShowCreditPopup(true)
    setTimeout(() => setShowCreditPopup(false), 1500)
  }, [])

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
  // SYNC: poll m360_doc after the game submits identity on the same page.
  // When the game-end flow calls submitGame → applyResponse, m360_doc gets
  // updated. We detect that and skip step 0 so the user doesn't re-enter
  // identity they just gave the game.
  // ============================================
  useEffect(() => {
    if (isSubmitted) return
    const fresh = cachedDoc()
    if (fresh?.email && fresh?.inWaitlist && !identityDone) {
      setIdentityDone(true)
      setCurrentStep(1)
      setFormData((prev) => ({
        ...prev,
        name: fresh.name || prev.name,
        email: fresh.email || prev.email,
        city: fresh.city || prev.city,
        ageRange: fresh.ageRange || prev.ageRange,
      }))
      setDoc(fresh)
    }
    if (fresh?.formComplete && !isSubmitted) {
      setIsSubmitted(true)
      setDoc(fresh)
    }
  }, [identityDone, isSubmitted])

  // ON EVERY RESPONSE that touches m360_doc (game submit in another component,
  // waitlist join, form submit from a different tab, etc.) we MUST re-read the
  // mirror and re-derive our entire display from the new doc. This is the
  // "after every response, update everything that uses the data" rule. Without
  // this, the hero credit counter stays stale at the value it held on mount.
  useEffect(() => {
    const onLb = () => {
      const fresh = cachedDoc()
      if (!fresh) return
      // Update identity gate + advance step 0 if the game captured identity.
      if (fresh.email && fresh.inWaitlist && !identityDone) {
        setIdentityDone(true)
        setCurrentStep(1)
        setFormData((prev) => ({
          ...prev,
          name: fresh.name || prev.name,
          email: fresh.email || prev.email,
          city: fresh.city || prev.city,
          ageRange: fresh.ageRange || prev.ageRange,
        }))
      }
      // If the server now says the form is complete, jump to success.
      if (fresh.formComplete && !isSubmitted) {
        setIsSubmitted(true)
      }
      // ALWAYS re-derive the credit display + every flag from the new doc.
      // The credit numbers (gameCredits, formCredits, totalCredits,
      // maxGameCredits, maxFormCredits) all live in the doc — so updating
      // doc here updates every credit display in this component at once.
      setDoc(fresh)
    }
    lbEvents.addEventListener('lb', onLb)
    return () => lbEvents.removeEventListener('lb', onLb)
  }, [identityDone, isSubmitted])

  // Step 0: identity only — POST /api/waitlist. Backend stores identity, no
  // flags/credits. On success, applyResponse writes m360_doc and we advance.
  const handleIdentitySubmit = useCallback(async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.city || !formData.ageRange) return
    setSubmitError('')
    setIsSubmitting(true)
    try {
      const res = await submitWaitlist({
        name: formData.name.trim(),
        email: formData.email.trim(),
        city: formData.city,
        ageRange: formData.ageRange,
      })
      // applyResponse already wrote m360_doc; refresh our local mirror.
      refreshDoc()
      setIdentityDone(true)

      // If the game was already played but not yet submitted against this
      // identity (e.g. user played the game first, then filled step-0 here),
      // auto-submit the game so credits post. The game answers are in the
      // progress cache (m360_game_progress).
      const docAfterWaitlist = cachedDoc()
      if (docAfterWaitlist && !docAfterWaitlist.gameComplete) {
        const progress = readGameProgress()
        if (progress.picks && progress.picks.length > 0) {
          try {
            const res = await submitGame({
              email: formData.email.trim(),
              name: formData.name.trim(),
              city: formData.city,
              ageRange: formData.ageRange,
              answers: progress.picks,
            })
            // Update doc directly from response (source of truth) so UI reflects
            // new game credits immediately. applyResponse already updated
            // localStorage and dispatched lbEvents.
            setDoc(res.doc)
          } catch {
            // Game submit failed — not critical for the form flow. The user can
            // still fill the form; they just won't see game credits yet.
          }
        }
      }
      // Refresh the leaderboard — this user may already have game credits
      // from another session, and the board should reflect that.
      fetchLeaderboard(12).catch(() => {})
      // Step 0 is identity — NOT a form field. No +25 credit animation.
      // Just advance to the first real question.
      setTimeout(() => {
        setCurrentStep(1)
      }, 200)
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, submitWaitlist, refreshDoc])

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

  // Track form progress in localStorage (for refresh recovery only - not used for calculations)
  useEffect(() => {
    // Only track progress if we're actively filling out the form (not submitted)
    if (!isSubmitted && currentStep > 0) {
      try {
        localStorage.setItem('m360_form_progress', String(currentStep))
      } catch (e) {
        // Ignore storage errors - progress tracking is non-essential
        console.warn('Failed to save form progress to localStorage:', e)
      }
    }

    // Cleanup on unmount
    return () => {
      // We don't remove the progress here as it's meant to persist for refresh recovery
    }
  }, [currentStep, isSubmitted])

  // Final submit: POST /api/form/submit. Backend validates waitlist membership
  // + gameComplete, flags formComplete, awards formCredits, recomputes
  // totalCredits. The response doc is the single source of truth for the
  // success screen — we do NOT compute or display credits locally.
  const handleFinalSubmit = useCallback(async () => {
    if (!formData.name.trim() || !formData.email.trim()) return
    setSubmitError('')
    setIsSubmitting(true)

    // formData payload: each step id → { value, suggestion }.
    const payloadFormData = Object.fromEntries(
      FORM_STEPS.map((s) => [
        s.id,
        {
          value: formData[s.id],
          suggestion: formData[`${s.id}Suggestion`],
        },
      ])
    )

    try {
      const res = await submitForm({
        email: formData.email.trim(),
        name: formData.name.trim(),
        city: formData.city,
        ageRange: formData.ageRange,
        formData: payloadFormData,
        // No formCredits hint. The backend is authoritative — it decides the
        // real formCredits from the filled fields in formData. We pass nothing;
        // it computes. The response formCredits is the only value we display.
      })

      // Update doc directly from response (source of truth) so UI reflects
      // new form credits and completion status immediately. applyResponse
      // already updated localStorage and dispatched lbEvents.
      setDoc(res.doc)
      setIsSubmitted(true)

      // Refresh the leaderboard cache so the inline board shows the new entry.
      fetchLeaderboard(12).catch(() => {})
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, submitForm, refreshDoc])

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
          {/* Credit summary — ALL values from the backend doc (m360_doc).
              Before submit: game credits are locked (from the game), form
              credits show as "pending" until the form is submitted. After
              submit: all three totals come straight from the backend response. */}
          <motion.div
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-m360-gold/10 border border-m360-gold/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <span className="font-body text-xs text-m360-muted">Credits:</span>
            <motion.span
              className="font-heading text-sm text-m360-gold font-bold"
              key={totalCredits}
              initial={{ scale: 1.3, color: '#EFCF9E' }}
              animate={{ scale: 1, color: '#F3AE1C' }}
              transition={{ duration: 0.4 }}
            >
              {totalCredits}
            </motion.span>
            <span className="font-body text-xs text-m360-muted">
              {isSubmitted ? (
                <>· Game {gameCredits} / Form {formCredits}</>
              ) : (
                <>/ {maxGameCredits + maxFormCredits} possible · form credits pending</>
              )}
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
                🏆 {totalCredits} / {maxGameCredits + maxFormCredits}
                {!isSubmitted && <span className="text-m360-muted font-normal"> pending</span>}
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
                  // Credits come from the backend response (m360_doc) — the
                  // single source of truth. Local form progress is NOT displayed
                  // here; only the server's authoritative totals are.
                  gameCredits={doc?.gameCredits || 0}
                  formCredits={doc?.formCredits || 0}
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
          <img src="/anums-removebg-preview.png" alt="" width="80" height="80" loading="lazy" className="max-w-[80px] h-auto mx-auto mb-2" />
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
        {step.id !== 'logoImpression' && step.id !== 'colorsFeelEgypt' && (
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-m360-gold/20 bg-m360-gold/5 text-m360-gold mb-3">
            {step.icon}
          </div>
        )}
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

      {/* Color palette display for colorsFeelEgypt question */}
      {step.id === 'colorsFeelEgypt' && (
        <div className="flex justify-center gap-3 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-[#F3AE1C] rounded mb-1"></div>
            <span className="text-xs text-m360-cream">Gold</span>
            <span className="text-xs text-m360-muted">#F3AE1C</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-[#EFCF9E] rounded mb-1"></div>
            <span className="text-xs text-m360-cream">Cream</span>
            <span className="text-xs text-m360-muted">#EFCF9E</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-[#0B0B0B] rounded mb-1"></div>
            <span className="text-xs text-m360-cream">Ebony</span>
            <span className="text-xs text-m360-muted">#0B0B0B</span>
          </div>
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
  // Calculate rank from the API leaderboard cache (m360_lb). This is the
  // authoritative board returned by the backend, not a client-side ledger.
  // We re-read the cache whenever lbEvents fires (form/game submit updated
  // m360_lb) so the rank updates once the fresh leaderboard arrives.
  // Match by EMAIL (unique) — not name, which can collide between users.
  const [rank, setRank] = useState('—')
  useEffect(() => {
    const recompute = () => {
      try {
        const lb = JSON.parse(localStorage.getItem('m360_lb') || '[]')
        const meId = email || name
        const idx = lb.findIndex((e) =>
          e.email && email ? e.email === email : e.name === name
        )
        setRank(idx >= 0 ? idx + 1 : '—')
      } catch { setRank('—') }
    }
    recompute()
    lbEvents.addEventListener('lb', recompute)
    return () => lbEvents.removeEventListener('lb', recompute)
  }, [name, email])

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
    <img
      src="/pharaoh.png"
      alt="Pharaoh"
      width="40"
      height="48"
      loading="lazy"
      className="h-10 md:h-12"
      style={{ filter: 'drop-shadow(0 0 20px rgba(243,174,28,0.5))' }}
    />
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
            <svg className="h-4 w-4 text-m360-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
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
           <svg className="h-10 w-10 text-m360-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.45 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.45 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>
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
          {copySuccess ? (

  <>

    ✅ Link Copied!

  </>

) : (

  <>

    <FiUserPlus className="inline mr-2 text-lg" />

    Summon Others to Compete

  </>

)}
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
