import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

// Performance-only iframe wrapper: only mounts the <iframe> when the section is
// near the viewport, shows a loading spinner, and falls back to a CTA after 8s
// so the user never sees a blank box on slow connections. No logic/behavior change.

export default function SafeIframe({ src, title }) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [showIframe, setShowIframe] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    const node = iframeRef.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setShowIframe(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowIframe(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!showIframe) return
    const timeout = setTimeout(() => {
      if (!iframeLoaded) setIframeError(true)
    }, 8000)
    return () => clearTimeout(timeout)
  }, [showIframe, iframeLoaded])

  return (
    <div ref={iframeRef} className="w-full h-full rounded-xl relative overflow-hidden">
      {/* Loading state */}
      {showIframe && !iframeLoaded && !iframeError && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          style={{ background: '#080604' }}
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
        </div>
      )}

      {/* Fallback if iframe fails or times out */}
      {iframeError && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
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

      {/* Actual iframe — only renders when visible */}
      {showIframe && !iframeError && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          className="w-full h-full border-0 rounded-xl"
          style={{ opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeError(true)}
        />
      )}
    </div>
  )
}
