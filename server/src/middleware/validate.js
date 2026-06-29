const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_AGE_RANGES = ['Under 18', '18–24', '25–34', '35–44', '45+']

export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.status = 400
  }
}

export function requireString(body, field, { maxLen = 200 } = {}) {
  const value = body?.[field]
  if (typeof value !== 'string' || !value.trim()) {
    throw new ValidationError(`Missing or invalid field: ${field}`)
  }
  const trimmed = value.trim()
  if (trimmed.length > maxLen) {
    throw new ValidationError(`Field too long: ${field}`)
  }
  return trimmed
}

export function optionalString(body, field, { maxLen = 200 } = {}) {
  const value = body?.[field]
  if (value === undefined || value === null || value === '') return ''
  if (typeof value !== 'string') throw new ValidationError(`Invalid field: ${field}`)
  const trimmed = value.trim()
  if (trimmed.length > maxLen) throw new ValidationError(`Field too long: ${field}`)
  return trimmed
}

export function requireEmail(body, field = 'email') {
  const email = requireString(body, field).toLowerCase()
  if (!EMAIL_RE.test(email)) throw new ValidationError('Invalid email address')
  return email
}

export function optionalEmail(body, field = 'email') {
  const value = body?.[field]
  if (value === undefined || value === null || value === '') return ''
  if (typeof value !== 'string') throw new ValidationError(`Invalid field: ${field}`)
  const trimmed = value.trim().toLowerCase()
  if (!EMAIL_RE.test(trimmed)) throw new ValidationError('Invalid email address')
  return trimmed
}

export function requireAgeRange(body, field = 'ageRange') {
  const value = requireString(body, field)
  if (!VALID_AGE_RANGES.includes(value)) throw new ValidationError('Invalid age range')
  return value
}

export function optionalAgeRange(body, field = 'ageRange') {
  const value = body?.[field]
  if (value === undefined || value === null || value === '') return ''
  if (typeof value !== 'string') throw new ValidationError(`Invalid field: ${field}`)
  const trimmed = value.trim()
  if (!VALID_AGE_RANGES.includes(trimmed)) throw new ValidationError('Invalid age range')
  return trimmed
}

export function requireAnswers(body, field = 'answers') {
  const value = body?.[field]
  if (!Array.isArray(value) || value.length === 0) {
    throw new ValidationError('answers must be a non-empty array')
  }
  return value.map((a) => ({
    questionId: Number(a?.questionId),
    answer: a?.answer === undefined || a?.answer === null ? '' : String(a.answer),
  }))
}

