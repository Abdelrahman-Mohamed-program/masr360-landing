import { createContext, useContext, useState, useCallback } from 'react'

const GameContext = createContext(null)

const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  city: '',
  ageRange: '',
  ratingGovernorates: 0,
  ratingPlaces: 0,
  ratingNightlife: 0,
  ratingMarketplace: 0,
  ratingGame: 0,
  travelFrequency: '',
  frustration: '',
  wouldPayMembership: '',
  membershipPrice: 0,
  wouldPayPowerups: '',
  dailyOpenReason: '',
  logoImpression: '',
  colorsFeelEgypt: '',
  designRating: 0,
  designComment: '',
  missingFeature: '',
  removeSection: [],
  tips: '',
  joinCommunity: '',
  shareWithFriends: '',
  shareCount: '',
}

export function GameProvider({ children }) {
  const [credits, setCredits] = useState(0)
  const [gameCredits, setGameCredits] = useState(0)
  const [formCredits, setFormCredits] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasPlayedGame, setHasPlayedGame] = useState(() => {
    try { return !!localStorage.getItem('m360_has_played') } catch { return false }
  })
  const [userName, setUserName] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('m360_user') || 'null')
      return user?.name || ''
    } catch { return '' }
  })
  const [userSubmitted, setUserSubmitted] = useState(() => {
    try { return !!localStorage.getItem('m360_user') } catch { return false }
  })
  const [leaderboardEntryAnimation, setLeaderboardEntryAnimation] = useState(false)
  const [leaderboardUpdateTrigger, setLeaderboardUpdateTrigger] = useState(0)

  const triggerLeaderboardInsert = useCallback((name, credits) => {
    try {
      const lb = JSON.parse(localStorage.getItem('m360_leaderboard') || '[]')
      const existing = lb.findIndex((e) => e.name === name)
      if (existing >= 0) {
        // Update if new credits are higher
        if (credits > lb[existing].credits) {
          lb[existing].credits = credits
        }
      } else {
        lb.push({ name, credits })
      }
      // Always re-sort by credits descending, then by name for stable order
      lb.sort((a, b) => b.credits - a.credits || a.name.localeCompare(b.name))
      localStorage.setItem('m360_leaderboard', JSON.stringify(lb))
    } catch {}
    setLeaderboardEntryAnimation(true)
    setLeaderboardUpdateTrigger((prev) => prev + 1)
  }, [])

  const triggerLeaderboardUpdate = useCallback((name, newTotal) => {
    try {
      const lb = JSON.parse(localStorage.getItem('m360_leaderboard') || '[]')
      const idx = lb.findIndex((e) => e.name === name)
      if (idx >= 0) {
        lb[idx].credits = newTotal
      } else {
        // Entry doesn't exist yet — insert it
        lb.push({ name, credits: newTotal })
      }
      // Always re-sort by credits descending, then by name for stable order
      lb.sort((a, b) => b.credits - a.credits || a.name.localeCompare(b.name))
      localStorage.setItem('m360_leaderboard', JSON.stringify(lb))
    } catch {}
    setLeaderboardUpdateTrigger((prev) => prev + 1)
  }, [])

  const addCredits = useCallback((amount) => {
    setCredits((prev) => prev + amount)
  }, [])

  const addGameCredits = useCallback((amount) => {
    setGameCredits((prev) => prev + amount)
    setCredits((prev) => prev + amount)
  }, [])

  const markGamePlayed = useCallback(() => {
    setHasPlayedGame(true)
    try { localStorage.setItem('m360_has_played', 'true') } catch {}
  }, [])

  // Mark user as fully completed (played game OR filled form) — one-time trigger
  const markCompleted = useCallback(() => {
    try { localStorage.setItem('m360_completed', 'true') } catch {}
  }, [])

  const hasCompleted = useCallback(() => {
    try { return !!localStorage.getItem('m360_completed') } catch { return false }
  }, [])

  const submitWaitlist = useCallback((name, email) => {
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
    } catch {}
    setUserName(name.trim())
    setUserSubmitted(true)
  }, [])

  const addFormCredits = useCallback((amount) => {
    setFormCredits((prev) => prev + amount)
    setCredits((prev) => prev + amount)
  }, [])

  const updateFormData = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1)
  }, [])

  const goToStep = useCallback((step) => {
    setCurrentStep(step)
  }, [])

  const submitForm = useCallback(() => {
    setIsSubmitted(true)
  }, [])

  const resetGame = useCallback(() => {
    setCredits(0)
    setGameCredits(0)
    setFormCredits(0)
    setCurrentStep(0)
    setFormData(INITIAL_FORM_DATA)
    setIsSubmitted(false)
    setHasPlayedGame(false)
    setUserName('')
    setUserSubmitted(false)
    setLeaderboardEntryAnimation(false)
    try {
      localStorage.removeItem('m360_has_played')
      localStorage.removeItem('m360_user')
      localStorage.removeItem('m360_completed')
      localStorage.removeItem('m360_identity_done')
      localStorage.removeItem('m360_form_submitted')
    } catch {}
  }, [])

  const value = {
    credits,
    gameCredits,
    formCredits,
    currentStep,
    formData,
    isSubmitted,
    hasPlayedGame,
    userName,
    userSubmitted,
    leaderboardEntryAnimation,
    leaderboardUpdateTrigger,
    triggerLeaderboardInsert,
    triggerLeaderboardUpdate,
    addCredits,
    addGameCredits,
    addFormCredits,
    updateFormData,
    nextStep,
    goToStep,
    submitForm,
    markGamePlayed,
    markCompleted,
    hasCompleted,
    submitWaitlist,
    setLeaderboardEntryAnimation,
    resetGame,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
