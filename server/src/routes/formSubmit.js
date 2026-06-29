import { Router } from 'express'
import { Waitlist } from '../models/Waitlist.js'
import { Submission } from '../models/Submission.js'
import { topEntries, publicView } from '../leaderboard.js'
import { requireEmail } from '../middleware/validate.js'

const router = Router()

// STATIC CREDITS — the backend saves these exact numbers. No computation.
const FORM_CREDITS = 475
const GAME_CREDITS = 300

// POST /api/form/submit
//   body: { email, name?, city?, ageRange?, formData }
// Gate: user must be in the waitlist. That's it.
// Action: save formCredits = 475 (static), recompute total, flag formComplete.
// Idempotent: re-submitting won't double-credit.
const submit = async (req, res, next) => {
  try {
    const email = requireEmail(req.body, 'email')
    const name = req.body?.name ? String(req.body.name).trim().slice(0, 80) : ''
    const city = req.body?.city ? String(req.body.city).trim().slice(0, 120) : ''
    const ageRange = req.body?.ageRange ? String(req.body.ageRange).trim() : ''
    const formData = req.body?.formData && typeof req.body.formData === 'object' ? req.body.formData : {}
    const ip = req.clientIp || ''

    const waitlistDoc = await Waitlist.findOne({ email }).lean()
    if (!waitlistDoc) {
      return res.status(409).json({
        error: 'must-join-first',
        message: 'You must join the waitlist before submitting the form.',
      })
    }

    const existing = await Submission.findOne({ email }).lean()

    // Already done — idempotent. Return current state, no changes.
    if (existing?.formComplete) {
      const leaderboard = await topEntries(10)
      return res.json({ doc: publicView(waitlistDoc, existing), changed: false, earned: 0, leaderboard })
    }

    // Save the static form credits. gameCredits stays whatever it is (0 if the
    // user hasn't played, 300 if they have). total = game + 475.
    const gameCredits = existing?.gameCredits || 0
    const formCredits = FORM_CREDITS
    const totalCredits = gameCredits + formCredits

    const set = {
      formComplete: true,
      formCredits,
      totalCredits,
      formData,
      ip,
      submittedAt: existing?.submittedAt || new Date(),
    }
    if (name && !existing?.name) set.name = name
    if (city && !existing?.city) set.city = city
    if (ageRange && !existing?.ageRange) set.ageRange = ageRange

    const submissionDoc = await Submission.findOneAndUpdate(
      email ? { email } : {},
      { $set: set },
      { upsert: true, new: true }
    ).lean()

    const leaderboard = await topEntries(10)
    return res.json({ doc: publicView(waitlistDoc, submissionDoc), changed: true, earned: formCredits, leaderboard })
  } catch (err) {
    next(err)
  }
}

router.post('/', submit)

export default router
