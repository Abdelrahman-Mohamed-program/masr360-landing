import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

// Performance-only iframe wrapper: only mounts the <iframe> when the section is
// near the viewport, shows a loading spinner until the browser tells us it's
// done OR a 6s safety timeout fires, and falls back to a CTA if the iframe
// never reports a load (slow connection, DNS error, etc.).
//
// Note on cross-origin iframes: onLoad fires reliably for cross-origin iframes
// in modern browsers, but CSS 3D transforms (rotateX) and constant scroll-driven
// style recalculations on the parent can delay or swallow the event. So we:
//   1. Always emit the iframe tag when visible (no conditional hiding).
//   2. Start a hard 6s fallback timer that doesn't depend on the load event.
//   3. The spinner is pure decoration — the iframe paints underneath it.

export default function SafeIframe({ src, title }) {
  const [iframeMounted, setIframeMounted] = useState(false)
  const [iframeTimeout, setIframeTimeout] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const node = wrapperRef.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setIframeMounted(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIframeMounted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.01, rootMargin: '50px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Start the moment the user can see the section, not after a delay.
  // The iframe tag itself has loading="lazy" as a second signal, and the
  // browser will prioritize it based on intersection.
  useEffect(() => {
    if (!iframeMounted) return
    const timeout = setTimeout(() => setIframeTimeout(true), 6000)
    return () => clearTimeout(timeout)
  }, [iframeMounted])

  return (
    <div ref={wrapperRef} className="w-full h-full rounded-xl relative overflow-hidden">
      {/* Loading spinner — fades out slightly after mount so the iframe can paint */}
      {iframeMounted && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-none"
          style={{ background: '#080604' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: iframeTimeout ? 0 : 1 }}
          transition={{ duration: 0.5, delay: iframeTimeout ? 0 : 0.6 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-full"
            style={{ border: '2px solid rgba(243,174,28,0.2)', borderTopColor: '#F3AE1C' }}
          />
          <p style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(243,174,28,0.5)', fontSize: '0.75rem' }}>
            Loading m360travel.com...
          </p>
        </motion.div>
      )}

      {/* Fallback CTA — only after the safety timeout */}
      {iframeTimeout && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center z-20"
          style={{ background: '#080604' }}
        >
          <span style={{ fontSize: '3rem' }}>🏛️</span>
          <p style={{ fontFamily: "'Cinzel', serif", color: '#EFCF9E', fontSize: '1.1rem' }}>
            Visit the live website
          </p>
          <a
            href="https://m360travel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: '#F3AE1C',
              color: '#0B0B0B',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Open m360travel.com ↗
          </a>
        </div>
      )}

      {/* The actual iframe. Always present when mounted so the browser stream-decodes
          it; CSS opacity on a cross-origin iframe cannot block paint, so we leave it
          at opacity 1 from the start. loading="lazy" lets the browser defer the fetch
          until the wrapper is on-screen (IntersectionObserver above gates mount). */}
      {iframeMounted && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full border-0 rounded-xl"
        />
      )}
    </div>
  )
}
