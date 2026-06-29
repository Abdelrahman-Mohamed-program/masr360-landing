import { Router } from 'express'
import { topEntries } from '../leaderboard.js'
import { leaderboardLimiter } from '../middleware/rateLimit.js'

const router = Router()

// GET /api/leaderboard?limit=10 — top entries from the submissions collection
// sorted by totalCredits desc.
router.get('/', leaderboardLimiter, async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10))
    const entries = await topEntries(limit)
    res.json({ entries })
  } catch (err) {
    next(err)
  }
})

export default router
