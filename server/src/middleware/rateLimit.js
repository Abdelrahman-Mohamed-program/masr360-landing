import rateLimit from 'express-rate-limit'

// In-memory limiter. Fine for a single-instance deploy. If you later scale to
// multiple instances, swap this for a Redis-backed limiter (rate-limit-redis).
export const publicLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,              // 30 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again shortly.' },
})

export const leaderboardLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
})
