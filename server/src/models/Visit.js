import mongoose from 'mongoose'

const visitSchema = new mongoose.Schema(
  {
    ip:       { type: String, required: true },
    userAgent: { type: String, default: '' },
    path:     { type: String, default: '/' },
    visits:   { type: Number, default: 1 },
    firstSeen: { type: Date, default: Date.now },
    lastSeen:  { type: Date, default: Date.now },
  },
  { timestamps: false }
)

// One document per IP — upsert keyed on ip.
visitSchema.index({ ip: 1 }, { unique: true })

export const Visit = mongoose.model('Visit', visitSchema)
