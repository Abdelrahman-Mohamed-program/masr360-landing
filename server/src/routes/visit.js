import { Router } from 'express'
import { Visit } from '../models/Visit.js'

const router = Router()

// POST /api/visit — analytics-only. Upserts a visit by IP.
router.post('/', async (req, res, next) => {
  try {
    const ip = req.clientIp || ''
    if (!ip) return res.json({ ok: true }) // nothing useful to record
    const userAgent = String(req.headers['user-agent'] || '').slice(0, 500)
    const path = req.body?.path ? String(req.body.path).slice(0, 200) : '/'

    const now = new Date()
    await Visit.findOneAndUpdate(
      { ip },
      [
        {
          $set: {
            ip: { $ifNull: ['$ip', ip] },
            firstSeen: { $ifNull: ['$firstSeen', now] },
            lastSeen: now,
            userAgent: userAgent,
            path: path,
            visits: { $add: [{ $ifNull: ['$visits', 0] }, 1] },
          },
        },
      ],
      { upsert: true, new: false }
    )
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
