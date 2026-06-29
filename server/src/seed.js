// Seed script: upserts the 10 pre-launch leaderboard entries into BOTH
// collections (waitlist identity + submission with credits). Run with
// `node src/seed.js` from the server/ directory.
import 'dotenv/config'
import { connectDB, disconnectDB } from './db.js'
import { Waitlist } from './models/Waitlist.js'
import { Submission } from './models/Submission.js'

const SEED_LEADERBOARD = [
  { name: 'A***d M.', city: 'Cairo',     credits: 850 },
  { name: 'S***a K.', city: 'Alexandria', credits: 775 },
  { name: 'M***l A.', city: 'Giza',       credits: 720 },
  { name: 'N***a H.', city: 'Luxor',      credits: 680 },
  { name: 'Y***n S.', city: 'Aswan',      credits: 625 },
  { name: 'L***a E.', city: 'Cairo',     credits: 590 },
  { name: 'K***l M.', city: 'Port Said',  credits: 540 },
  { name: 'J***s B.', city: 'Suez',       credits: 485 },
  { name: 'R***a F.', city: 'Mansoura',   credits: 430 },
  { name: 'T***s L.', city: 'Tanta',      credits: 380 },
]

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('[seed] MONGODB_URI is not set. Copy .env.example -> .env first.')
    process.exit(1)
  }
  await connectDB(process.env.MONGODB_URI)
  console.log('[seed] connected')

  for (const s of SEED_LEADERBOARD) {
    const email = `seed-${s.name.replace(/\W/g, '').toLowerCase()}@m360.seed`
    await Waitlist.findOneAndUpdate(
      { email },
      { $setOnInsert: { name: s.name, city: s.city, source: 'waitlist' } },
      { upsert: true, new: false }
    )
    await Submission.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          name: s.name,
          city: s.city,
          gameComplete: true,
          formComplete: true,
          gameCredits: s.credits,
          formCredits: 0,
          totalCredits: s.credits,
          submittedAt: new Date(),
        },
      },
      { upsert: true, new: false }
    )
  }

  const [wlCount, subCount] = await Promise.all([Waitlist.countDocuments(), Submission.countDocuments()])
  console.log(`[seed] done. waitlist=${wlCount}, submissions=${subCount}`)
  await disconnectDB()
}

run().catch((err) => {
  console.error('[seed] failed', err)
  process.exit(1)
})
