import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { clientIp } from './middleware/ip.js'
import { publicLimiter } from './middleware/rateLimit.js'
import { ValidationError } from './middleware/validate.js'
import visitRouter from './routes/visit.js'
import waitlistRouter from './routes/waitlist.js'
import gameRouter from './routes/gameSubmit.js'
import formRouter from './routes/formSubmit.js'
import leaderboardRouter from './routes/leaderboard.js'

export function createApp() {
  const app = express()
  const clientOrigins = (process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  app.use(clientIp)
  app.use(
    cors({
      origin: clientOrigins.length ? clientOrigins : '*',
      credentials: true,
    })
  )
  app.use(cookieParser())
  app.use(express.json({ limit: '512kb' }))

  app.get('/api/health', (_req, res) => res.json({ ok: true }))

  // Rate-limit the public-facing write endpoints.
  app.use('/api/visit', publicLimiter, visitRouter)
  app.use('/api/waitlist', publicLimiter, waitlistRouter)
  app.use('/api/game/submit', publicLimiter, gameRouter)
  app.use('/api/form/submit', publicLimiter, formRouter)
  app.use('/api/leaderboard', leaderboardRouter)

  // 404 for unknown /api routes.
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

  // Centralized error handler.
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const status = err.status || (err instanceof ValidationError ? 400 : 500)
    const payload = { error: err.message || 'Internal Server Error' }
    if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack
    res.status(status).json(payload)
  })

  return app
}
