// Thin fetch wrapper + universal response handler for the M360 API.
//
// The backend is the source of truth for all submission state. The frontend
// keeps localStorage as a *progress cache* (so a game/form survive a page
// close or a cross-browser switch), but every UI decision is re-derived from
// the API response — never from localStorage alone.
//
// Every mutating response has the shape:
//   { doc, changed, earned, leaderboard }
// where doc is the canonical waitlist document for this person:
//   { name, email, city, ageRange, gameComplete, formComplete,
//     gameCredits, formCredits, totalCredits, maxGameCredits, maxFormCredits }

const BASE = import.meta.env.VITE_API_URL || ''

function readCached(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

async function request(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }
  if (!res.ok) {
    const err = new Error(data?.error || data?.message || `Request failed (${res.status})`)
    err.status = res.status
    err.code = data?.error
    err.payload = data
    throw err
  }
  return data
}

/**
 * Apply a server response to localStorage and return the normalized object.
 * The returned shape is stable across waitlist/game/form responses:
 *   { doc, changed, earned, leaderboard }
 */
export function applyResponse(res) {
  const doc = res?.doc || null
  const changed = !!res?.changed
  const earned = typeof res?.earned === 'number' ? res.earned : 0
  const leaderboard = Array.isArray(res?.leaderboard) ? res.leaderboard : null

  if (doc) {
    try { localStorage.setItem('m360_doc', JSON.stringify(doc)) } catch {}
  }
  if (leaderboard) {
    try { localStorage.setItem('m360_lb', JSON.stringify(leaderboard)) } catch {}
    notifyLeaderboardChanged()
  }
  return { doc, changed, earned, leaderboard }
}

// --- public API calls ---------------------------------------------------

// Page load / visitor analytics. Fire-and-forget.
export async function trackVisit(path = '/') {
  return request('/api/visit', { path }).catch(() => null)
}

// GET /api/waitlist/state?email=...
export async function getState(email) {
  if (!email) return { doc: readCached('m360_doc') }
  try {
    return await request(`/api/waitlist/state?email=${encodeURIComponent(email)}`)
  } catch {
    return { doc: readCached('m360_doc') }
  }
}

// POST /api/waitlist — identity-only upsert.
export async function submitWaitlist({ name, email, city, ageRange }) {
  const res = await request('/api/waitlist', { name, email, city, ageRange })
  return applyResponse(res)
}

// POST /api/game/submit — flag gameComplete, save gameCredits=300 (static).
export async function submitGame({ email, name, city, ageRange, answers }) {
  const res = await request('/api/game/submit', { email, name, city, ageRange, answers })
  return applyResponse(res)
}

// POST /api/form/submit — flag formComplete, save formCredits=475 (static).
export async function submitForm({ email, name, city, ageRange, formData }) {
  const res = await request('/api/form/submit', { email, name, city, ageRange, formData })
  return applyResponse(res)
}

// GET /api/leaderboard — current top entries sorted totalCredits desc.
// Deduped: concurrent calls share a single in-flight promise.
let _lbInFlight = null
export async function fetchLeaderboard(limit = 12) {
  if (_lbInFlight) return _lbInFlight
  _lbInFlight = (async () => {
    try {
      const data = await request(`/api/leaderboard?limit=${limit}`)
      const entries = Array.isArray(data?.entries) ? data.entries : []
      try { localStorage.setItem('m360_lb', JSON.stringify(entries)) } catch {}
      notifyLeaderboardChanged()
      return entries
    } catch {
      const cached = readCached('m360_lb')
      return Array.isArray(cached) ? cached : []
    } finally {
      _lbInFlight = null
    }
  })()
  return _lbInFlight
}

// Cached leaderboard (instant paint on mount).
export function cachedLeaderboard() {
  const cached = readCached('m360_lb')
  return Array.isArray(cached) ? cached : []
}

// Leaderboard refresh event.
export const lbEvents = new EventTarget()
export function notifyLeaderboardChanged() {
  lbEvents.dispatchEvent(new CustomEvent('lb'))
}

// Cached waitlist doc — the canonical backend mirror.
export function cachedDoc() {
  return readCached('m360_doc')
}

// Reset the cached backend mirror.
export function resetDoc() {
  try { localStorage.removeItem('m360_doc') } catch {}
  try { localStorage.removeItem('m360_lb') } catch {}
}

// --- progress caches (unsubmitted work, survives tab close) -------------

export function saveGameProgress({ questionIndex = 0, picks = [] } = {}) {
  try { localStorage.setItem('m360_game_progress', JSON.stringify({ questionIndex, picks })) } catch {}
}

export function readGameProgress() {
  return readCached('m360_game_progress') || { questionIndex: 0, picks: [] }
}

export function clearGameProgress() {
  try { localStorage.removeItem('m360_game_progress') } catch {}
}

export function saveFormProgress({ currentStep = 0, formData = {} } = {}) {
  try { localStorage.setItem('m360_form_progress', JSON.stringify({ currentStep, formData })) } catch {}
}

export function readFormProgress() {
  return readCached('m360_form_progress') || { currentStep: 0, formData: {} }
}

export function clearFormProgress() {
  try { localStorage.removeItem('m360_form_progress') } catch {}
}
