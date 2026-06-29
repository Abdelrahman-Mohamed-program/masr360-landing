import { Router } from 'express'
import { Waitlist } from '../models/Waitlist.js'
import { Submission } from '../models/Submission.js'
import { topEntries, publicView } from '../leaderboard.js'
import { scoreAnswers, MAX_GAME_CREDITS } from '../game.js'
import { optionalString, optionalEmail, optionalAgeRange } from '../middleware/validate.js'

const router = Router()

// STATIC FORM CREDITS — the backend saves this exact number on form submit.
// Game credits are NOT static; they come from scoreAnswers() below.
const FORM_CREDITS = 475

// POST /api/game/submit
//   body: { email?, name?, city?, ageRange?, answers }
// Gate: none (anyone can play).
// Action: SCORE the answers (Q1:50, Q2:100, Q3:150 → max 300), save the
//   scored value, recompute total, flag gameComplete.
// Idempotent: re-submitting re-scores but never double-credits (keeps the
//   higher of the old and new score).
const submit = async (req, res, next) => {
  try {
    const emailRaw = optionalEmail(req.body, 'email') // may be '' → anonymous
    const name = optionalString(req.body, 'name', { maxLen: 80 })
    const city = optionalString(req.body, 'city', { maxLen: 120 })
    const ageRange = optionalAgeRange(req.body, 'ageRange')
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : []
    const ip = req.clientIp || ''

    // Ensure waitlist identity exists (only when we actually have an email).
    if (emailRaw) {
      await Waitlist.findOneAndUpdate(
        { email: emailRaw },
        { $setOnInsert: { name, email: emailRaw, city, ageRange, ip, source: 'game' }, $set: { updatedAt: new Date() } },
        { upsert: true }
      )
    }

    const email = emailRaw || `anon_${Date.now()}@m360.anon`

    // Load-or-create submission.
    const existing = await Submission.findOne({ email }).lean()
    const alreadyComplete = existing?.gameComplete === true

    // Score the answers. This is the ONLY source of game credits — never the
    // client's declared value. Max is 300 (all three right).
    const { credits: scoredGameCredits, breakdown } = scoreAnswers(answers)

    if (alreadyComplete) {
      // Idempotent: keep the higher of the stored score and the re-score.
      // If the new score is higher, persist it (re-earn the difference).
      const prevGameCredits = existing?.gameCredits || 0
      if (scoredGameCredits > prevGameCredits) {
        const gameCredits = scoredGameCredits
        const totalCredits = gameCredits + (existing?.formCredits || 0)
        const submissionDoc = await Submission.findOneAndUpdate(
          email ? { email } : {},
          { $set: { gameCredits, totalCredits, gameAnswers: answers, updatedAt: new Date() } },
          { upsert: true, new: true }
        ).lean()
        const waitlistDoc = emailRaw ? await Waitlist.findOne({ email: emailRaw }).lean() : null
        const leaderboard = await topEntries(10)
        return res.json({ doc: publicView(waitlistDoc, submissionDoc), changed: true, earned: gameCredits - prevGameCredits, leaderboard, breakdown })
      }
      // No improvement — return current state unchanged.
      const waitlistDoc = emailRaw ? await Waitlist.findOne({ email: emailRaw }).lean() : null
      const leaderboard = await topEntries(10)
      return res.json({ doc: publicView(waitlistDoc, existing), changed: false, earned: 0, leaderboard, breakdown })
    }

    // First completion — save the scored value.
    const formCredits = existing?.formCredits || 0
    const gameCredits = scoredGameCredits
    const totalCredits = gameCredits + formCredits

    const set = {
      gameComplete: true,
      gameAnswers: answers,
      gameCredits,
      formCredits,
      totalCredits,
      ip,
      submittedAt: existing?.submittedAt || new Date(),
    }
    if (name && !(existing?.name)) set.name = name
    if (city && !(existing?.city)) set.city = city
    if (ageRange && !(existing?.ageRange)) set.ageRange = ageRange

    const submissionDoc = await Submission.findOneAndUpdate(
      email ? { email } : {},
      { $set: set },
      { upsert: true, new: true }
    ).lean()

    const waitlistDoc = emailRaw ? await Waitlist.findOne({ email: emailRaw }).lean() : null
    const leaderboard = await topEntries(10)

    return res.json({ doc: publicView(waitlistDoc, submissionDoc), changed: true, earned: gameCredits, leaderboard, breakdown })
  } catch (err) {
    next(err)
  }
}

router.post('/', submit)

export default router
