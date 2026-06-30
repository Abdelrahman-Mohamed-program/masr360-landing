import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// MagicUI-style morphing text — blur/opacity crossfade between words.
// Loops continuously through the `texts` array, swapping every `duration` ms.
export function MorphingText({
  texts,
  duration = 2500,
  className = '',
  ...props
}) {
  const [index, setIndex] = useState(0)
  const nodeRef = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    // Pause the loop when offscreen so it doesn't churn cycles in the background.
    if (!nodeRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(nodeRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView || texts.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length)
    }, duration)
    return () => clearInterval(id)
  }, [isInView, texts.length, duration])

  const current = texts[index]

  return (
    <span ref={nodeRef} className={`relative inline-block ${className}`} {...props}>
      {/* Desktop: full blur crossfade (unchanged). */}
      <AnimatePresence mode="wait">
        <motion.span
          key={`desktop-${index}`}
          className="inline-block whitespace-nowrap max-md:hidden"
          initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
      {/* Mobile: opacity-only crossfade — avoids expensive blur filter on low-end GPUs. */}
      <AnimatePresence mode="wait">
        <motion.span
          key={`mobile-${index}`}
          className="inline-block whitespace-nowrap md:hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
