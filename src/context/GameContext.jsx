import { createContext, useContext, useMemo, useState, useCallback } from 'react'

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

// GameContext provides UI-state helpers only. All identity, credits, flags,
// and leaderboard data come from the backend response (m360_doc mirror).
export function GameProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

  // Reset only ephemeral UI state and progress caches. Does NOT touch
  // m360_doc or m360_lb (those are backend mirrors that survive a reset;
  // to "start over" the user would need a new email or an explicit server-side
  // delete which we don't implement yet).
  const resetGame = useCallback(() => {
    setCurrentStep(0)
    setFormData(INITIAL_FORM_DATA)
    setIsSubmitted(false)
    try {
      localStorage.removeItem('m360_game_progress')
      localStorage.removeItem('m360_form_progress')
    } catch {}
  }, [])

  const value = {
    currentStep,
    formData,
    isSubmitted,
    updateFormData,
    nextStep,
    goToStep,
    submitForm,
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
