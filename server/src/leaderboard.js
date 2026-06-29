import { Submission } from './models/Submission.js'

// The leaderboard IS the submissions collection: top entries sorted by
// totalCredits descending. A user only appears once they have credits from a
// completed submission.
export async function topEntries(limit = 10) {
  // Only show entries that have a name — anonymous game submitters (empty
  // name) are hidden until they claim their identity via the waitlist. This
  // keeps the leaderboard from showing blank rows.
  const rows = await Submission.find({ totalCredits: { $gt: 0 }, name: { $ne: '' } })
    .sort({ totalCredits: -1, name: 1 })
    .limit(limit)
    .lean()

  return rows.map((r) => ({
    name: r.name,
    email: r.email,
    city: r.city,
    credits: r.totalCredits,
    gameComplete: r.gameComplete,
    formComplete: r.formComplete,
  }))
}

// Shape returned to the frontend. This is the single source of truth the
// client mirrors into localStorage and branches every UI decision on.
export function publicView(waitlistDoc, submissionDoc) {
  const sub = submissionDoc || {}
  return {
    // Identity: submission is the denormalized source for fast reads, but
    // fall back to the waitlist when the submission field is empty (e.g. an
    // anonymous game submit that later gets claimed via the waitlist).
    name: sub.name || waitlistDoc?.name || '',
    email: sub.email || waitlistDoc?.email || '',
    city: sub.city || waitlistDoc?.city || '',
    ageRange: sub.ageRange || waitlistDoc?.ageRange || '',
    ip: sub.ip || waitlistDoc?.ip || '',
    // Membership + flags + credits.
    inWaitlist: !!waitlistDoc,
    gameComplete: !!sub.gameComplete,
    formComplete: !!sub.formComplete,
    gameCredits: sub.gameCredits || 0,
    formCredits: sub.formCredits || 0,
    totalCredits: sub.totalCredits || 0,
    // Static maxima — the frontend shows "X / maxFormCredits possible" and
    // "X / maxGameCredits possible" straight from the doc. No local constants.
    maxFormCredits: 475,
    maxGameCredits: 300,
    formData: sub.formData || null,
    submittedAt: sub.submittedAt || null,
  }
}
