import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLottie } from 'lottie-react'
import Ankh from '../assets/Ankh.json'

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true)

  const lottie = useLottie({ animationData: Ankh, loop: false, autoplay: true }, { width: 44, height: 44 })

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Original was 1800ms but the logo delay was *also* 1.8s — meaning the logo
    // never actually appeared before the screen hid. Give the logo >0 room to
    // animate by extending total visible time slightly to 2400ms.
    const VISIBLE_MS = reduce ? 500 : 2400
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 600)
    }, VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-m360-bg flex items-center justify-center"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Big transparent logo watermark — the treasure reveal.
              Waits for ALL other animations to fully finish, then unfurls. */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
            animate={{ opacity: 0.1, scale: 1, filter: 'blur(1px)' }}
            transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="https://res.cloudinary.com/dwh6drlr9/image/upload/v1782426672/Screenshot_2026-06-26_at_1.31.05_AM_kzj2md.webp"
              alt=""
              className="w-72 h-72 md:w-96 md:h-96 object-contain"
            />
          </motion.div>

          <div className="text-center relative z-10">
            <div className="relative mx-auto flex items-center justify-center" style={{ width: 120, height: 110 }}>
              {/* Pyramid chamber — draws first (CSS stroke-draw, same as original) */}
              <svg
                width="120"
                height="110"
                viewBox="0 0 120 90"
                className="absolute inset-0 -top-2"
                fill="none"
              >
                <polygon
                  points="60,5 95,70 25,70"
                  fill="none"
                  stroke="#F3AE1C"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  className="animate-stroke-draw"
                />
              </svg>

              {/* Ankh lottie — centered inside the pyramid */}
              <motion.div
                className="absolute z-10"
                style={{
                  left: '32%',
                  top: '19%',
                  transform: 'translate(-50%, -50%)',
                  width: 48,
                  height: 48,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ width: 48, height: 48, flexShrink: 0 }}>
                  {lottie.View}
                </div>
              </motion.div>

              {/* M360 glyph below the chamber */}
              <motion.div
                className="absolute -bottom-1 left-0 right-0 text-center"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.3, ease: 'easeOut' }}
              >
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#F3AE1C',
                    letterSpacing: '0.15em',
                  }}
                >
                  M360
                </span>
              </motion.div>
            </div>

            <motion.p
              className="font-body text-xs text-m360-muted tracking-[0.3em] uppercase mt-10"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.4, ease: 'easeOut' }}
            >
              Loading Egypt
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
