import 'dotenv/config'
import { createApp } from './app.js'
import { connectDB, disconnectDB } from './db.js'

const PORT = Number(process.env.PORT) || 4000
const MONGODB_URI = process.env.MONGODB_URI

async function main() {
  if (!MONGODB_URI) {
    console.error('[server] MONGODB_URI is not set. Copy .env.example -> .env and fill it in.')
    process.exit(1)
  }

  await connectDB(MONGODB_URI)
  console.log('[server] connected to MongoDB')

  const app = createApp()
  const httpServer = app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`)
    console.log(`[server] CORS origins: ${process.env.CLIENT_ORIGIN || '*'}`)
  })

  const shutdown = async (sig) => {
    console.log(`[server] ${sig} received, shutting down`)
    httpServer.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main().catch((err) => {
  console.error('[server] failed to start', err)
  process.exit(1)
})
