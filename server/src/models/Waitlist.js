import mongoose from 'mongoose'

// Collection 1: WAITLIST — identity only. One document per person, keyed by
// email. This is the "are you in the system?" record. It does NOT hold
// credits, flags, or form answers — those live in the submissions collection.
const waitlistSchema = new mongoose.Schema(
  {
    name:      { type: String, default: '' },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    city:      { type: String, default: '' }, // holds a COUNTRY name — keep the key, matches the existing wire format
    ageRange:  { type: String, default: '', enum: ['', 'Under 18', '18–24', '25–34', '35–44', '45+'] },
    ip:        { type: String, default: '' },
    source:    { type: String, enum: ['game', 'form', 'waitlist'], default: 'waitlist' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const Waitlist = mongoose.model('Waitlist', waitlistSchema)
