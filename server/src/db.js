import mongoose from 'mongoose'

let connectingPromise = null

export async function connectDB(uri) {
  if (mongoose.connection.readyState === 1) return mongoose.connection
  if (connectingPromise) return connectingPromise

  mongoose.set('strictQuery', true)
  connectingPromise = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then(() => mongoose.connection)
    .finally(() => { connectingPromise = null })

  return connectingPromise
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}
