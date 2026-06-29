/**
 * Normalize the client IP from the request. Honours the X-Forwarded-For
 * header (set by most proxies/load-balancers including Atlas/Vercel/Render)
 * and falls back to req.ip / socket address.
 */
export function clientIp(req, _res, next) {
  const fwd = req.headers['x-forwarded-for']
  let ip
  if (typeof fwd === 'string' && fwd.length) {
    ip = fwd.split(',')[0].trim()
  } else if (Array.isArray(fwd) && fwd.length) {
    ip = fwd[0].trim()
  } else {
    ip = req.ip || req.socket?.remoteAddress || ''
  }
  // Strip IPv6 prefix (::ffff:127.0.0.1 -> 127.0.0.1)
  if (ip.startsWith('::ffff:')) ip = ip.slice(7)
  req.clientIp = ip
  next()
}
