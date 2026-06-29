import mongoose from 'mongoose'

// Collection 2: SUBMISSIONS — the game + form answers, the completion flags,
// and the credits. One document per person, keyed by email (matches the
// waitlist's key so the two collections join on email).
//
// Every decision the frontend makes — "is the game complete?", "is the form
// complete?", "what are the credits?", "should we skip the waitlist form?" —
// is derived from THIS document's fields. The frontend never decides on its
// own; it reads these flags from the API response.

const suggestionField = { value: mongoose.Schema.Types.Mixed, suggestion: String }
const formDataSchema = new mongoose.Schema(
  {
    governorates: suggestionField,
    places: suggestionField,
    nightlife: suggestionField,
    marketplace: suggestionField,
    game: suggestionField,
    travelFrequency: suggestionField,
    frustration: suggestionField,
    premiumMembership: suggestionField,
    premiumPrice: Number,
    powerups: suggestionField,
    dailyOpen: suggestionField,
    logoImpression: suggestionField,
    colorsFeelEgypt: suggestionField,
    designRating: suggestionField,
    designRatingComment: String,
    missingFeature: suggestionField,
    removeSection: suggestionField,
    tips: suggestionField,
    joinCommunity: suggestionField,
    shareWithFriends: suggestionField,
    shareCount: suggestionField,
  },
  { _id: false }
)

const submissionSchema = new mongoose.Schema(
  {
    // Identity (denormalized from waitlist for fast reads / leaderboard).
    name:  { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    city:  { type: String, default: '' },
    ageRange: { type: String, default: '' },
    ip:    { type: String, default: '' },

    // Flags — the ONLY source of truth for "what has this user completed?".
    gameComplete: { type: Boolean, default: false, index: true },
    formComplete: { type: Boolean, default: false, index: true },

    // Credits — backend-computed, never trust the client.
    gameCredits:  { type: Number, default: 0, min: 0 },
    formCredits:  { type: Number, default: 0, min: 0 },
    totalCredits: { type: Number, default: 0, min: 0, index: true },

    // The raw game answers (for audit / re-scoring).
    gameAnswers: { type: [{ questionId: Number, answer: String }], default: [] },

    // The full product-research form responses. Only present after form submit.
    formData: { type: formDataSchema, default: undefined },

    submittedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

// Leaderboard query: top entries by totalCredits.
submissionSchema.index({ totalCredits: -1 })

export const Submission = mongoose.model('Submission', submissionSchema)
