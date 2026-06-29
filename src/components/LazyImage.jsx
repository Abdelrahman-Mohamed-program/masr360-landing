import { useState, useRef, useEffect } from 'react'

// Performance-only image wrapper: lazy-loads via IntersectionObserver (in addition
// to native loading="lazy"), shows a shimmer skeleton while loading, fades the
// image in smoothly, and renders a gold fallback on error. No logic/behavior change.

export default function LazyImage({ src, alt, className, style, imgRef, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(false)
  const internalRef = useRef(null)
  const ref = imgRef || internalRef

  useEffect(() => {
    // Observe the wrapper div (always in the DOM) instead of the img, so we can
    // trigger the network fetch the moment the image is near the viewport.
    const node = internalRef.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={internalRef} className="relative overflow-hidden" style={style}>
      {/* Shimmer skeleton shown while loading and not errored */}
      {!loaded && !error && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              'linear-gradient(90deg, rgba(243,174,28,0.04) 0%, rgba(243,174,28,0.08) 50%, rgba(243,174,28,0.04) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            backgroundColor: 'rgba(243,174,28,0.05)',
          }}
        />
      )}
      {inView && (
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={className}
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            ...style,
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          {...rest}
        />
      )}
      {/* Error state — show gold placeholder */}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(243,174,28,0.05)', border: '1px solid rgba(243,174,28,0.1)' }}
        >
          <span style={{ color: 'rgba(243,174,28,0.3)', fontSize: '2rem' }}>🏛️</span>
        </div>
      )}
    </div>
  )
}
