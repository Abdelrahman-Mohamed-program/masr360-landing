import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 600)
    }, 1800)
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
          {/* Big transparent logo watermark behind everything */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="https://res.cloudinary.com/dwh6drlr9/image/upload/v1782426672/Screenshot_2026-06-26_at_1.31.05_AM_kzj2md.png"
              alt=""
              className="w-72 h-72 md:w-96 md:h-96 object-contain"
              style={{ opacity: 0.08, filter: 'blur(1px)' }}
            />
          </motion.div>

          <div className="text-center relative z-10">
            {/* Animated SVG logo */}
            <svg
              width="120"
              height="90"
              viewBox="0 0 120 90"
              className="mx-auto"
            >
              {/* Pyramid shape */}
              <motion.polygon
                points="60,5 95,70 25,70"
                fill="none"
                stroke="#F3AE1C"
                strokeWidth="2"
                className="animate-stroke-draw"
              />
              {/* Inner pyramid lines */}
              <motion.line
                x1="60" y1="5" x2="60" y2="70"
                stroke="#F3AE1C"
                strokeWidth="1"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                style={{ animation: 'stroke-draw 1.5s ease-out 0.4s forwards' }}
              />
              <motion.path
                d="M47 42 L73 42"
                stroke="#F3AE1C"
                strokeWidth="1"
                fill="none"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                style={{ animation: 'stroke-draw 1.5s ease-out 0.8s forwards' }}
              />

              {/* M360 text below pyramid */}
              <motion.text
                x="60" y="87"
                textAnchor="middle"
                fill="#F3AE1C"
                fontSize="13"
                fontFamily="Cinzel, serif"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                M360
              </motion.text>
            </svg>

            <motion.p
              className="font-body text-xs text-m360-muted tracking-[0.3em] uppercase mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              Loading Egypt
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
