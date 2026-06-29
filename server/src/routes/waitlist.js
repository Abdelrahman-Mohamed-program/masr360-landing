import { Router } from 'express'
import { Waitlist } from '../models/Waitlist.js'
import { Submission } from '../models/Submission.js'
import { publicView } from '../leaderboard.js'
import { optionalString, optionalEmail, optionalAgeRange } from '../middleware/validate.js'

const router = Router()

// GET /api/waitlist/state?email=...
// The canonical "what is the current state of this user?" call. The frontend
// hits this on every stage (on mount, on scroll into the form, on game end)
// whenever localStorage has an email. It returns the merged waitlist +
// submission view — and the frontend branches ALL decisions on the response.
const state = async (req, res, next) => {
  try {
    const email = String(req.query.email || '').toLowerCase()
    if (!email) return res.json({ doc: null })

    const [waitlistDoc, submissionDoc] = await Promise.all([
      Waitlist.findOne({ email }).lean(),
      Submission.findOne({ email }).lean(),
    ])
    return res.json({ doc: publicView(waitlistDoc, submissionDoc) })
  } catch (err) {
    next(err)
  }
}

// POST /api/waitlist — identity-only upsert. Creates the waitlist record and
// an empty submission shell (so the user exists in both collections). Does
// NOT touch flags or credits. Idempotent on email.
const create = async (req, res, next) => {
  try {
    const name = optionalString(req.body, 'name')
    const email = optionalEmail(req.body, 'email')
    const city = optionalString(req.body, 'city', { maxLen: 120 })
    const ageRange = optionalAgeRange(req.body, 'ageRange')
    const ip = req.clientIp || ''

    // Upsert waitlist (identity only). IP is always stored so we can audit
    // which device each identity was claimed from; most-recent-IP wins since
    // a legitimate user may join from a different network later.
    const waitlistDoc = await Waitlist.findOneAndUpdate(
      { email },
      {
        $setOnInsert: { name, email, city, ageRange, source: 'waitlist' },
        $set: { ip, updatedAt: new Date() },
      },
      { upsert: true, new: true }
    ).lean()

    // Ensure a submission shell exists (no flags, no credits yet).
    // $setOnInsert only sets these fields on create — so if this user already
    // has a submission (e.g. an anonymous game that was just claimed by this
    // waitlist call), the empty identity fields would stay empty. Set them on
    // the submission too, but ONLY if they are currently blank — we never
    // overwrite an already-captured name/city/ageRange (identity is filled
    // once and sticks).
    const submissionDoc = await Submission.findOneAndUpdate(
      { email },
      {
        $set: { ip },
        $setOnInsert: { name, email, city, ageRange, submittedAt: new Date() },
      },
      { upsert: true, new: true }
    ).lean()

    const hadBlankIdentity = !submissionDoc.name || !submissionDoc.city
    if (hadBlankIdentity && (name || city || ageRange)) {
      const set = {}
      if (name && !submissionDoc.name) set.name = name
      if (city && !submissionDoc.city) set.city = city
      if (ageRange && !submissionDoc.ageRange) set.ageRange = ageRange
      if (Object.keys(set).length > 0) {
        await Submission.updateOne({ email }, { $set: set })
        Object.assign(submissionDoc, set)
      }
    }

    return res.json({ doc: publicView(waitlistDoc, submissionDoc), changed: false, earned: 0 })
  } catch (err) {
    if (err?.code === 11000) {
      // Race: someone created between our findOneAndUpdate and the upsert.
      try {
        const [waitlistDoc, submissionDoc] = await Promise.all([
          Waitlist.findOne({ email: req.body?.email?.toLowerCase?.() }).lean(),
          Submission.findOne({ email: req.body?.email?.toLowerCase?.() }).lean(),
        ])
        if (waitlistDoc || submissionDoc) {
          return res.json({ doc: publicView(waitlistDoc, submissionDoc), changed: false, earned: 0 })
        }
      } catch {}
    }
    next(err)
  }
}

router.get('/state', state)
router.post('/', create)

export default router
