import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

const MORPH_SEQUENCE = [
  { text: 'M', sub: 'the letter' },
  { text: 'Masr', sub: 'Arabic for Egypt' },
  { text: 'مصر', sub: 'Egypt in Arabic' },
  { text: 'Egypt', sub: 'the land of pharaohs' },
  { text: '360°', sub: 'every angle' },
  { text: 'M360', sub: 'your complete experience' },
]

function MorphingText({ item }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.text}
        className="text-center"
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.9 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="font-heading text-2xl md:text-3xl font-bold text-gradient-gold leading-none" dir="auto">
          {item.text}
        </div>
        <div className="mt-1 font-body text-[10px] md:text-xs text-m360-muted leading-tight">
          {item.sub}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function ProgressDots({ index, total }) {
  return (
    <div className="flex flex-col items-center gap-1.5 mt-3">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          animate={{
            backgroundColor: i === index ? '#F3AE1C' : '#2A2A2A',
            scale: i === index ? 1.3 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}

function useMotionValueState(motionValue) {
  const [value, setValue] = useState(Math.round(motionValue.get()))
  useEffect(() => {
    const unsubscribe = motionValue.on('change', (v) => {
      const rounded = Math.round(v)
      setValue((prev) => (prev !== rounded ? rounded : prev))
    })
    return unsubscribe
  }, [motionValue])
  return value
}

export default function FloatingM360() {
  const { scrollYProgress } = useScroll()

  const rawIndex = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.5, 0.7, 0.85],
    [0, 1, 2, 3, 4, 5]
  )
  const smoothIndex = useSpring(rawIndex, { stiffness: 80, damping: 20 })
  const currentIndex = useMotionValueState(smoothIndex)
  const currentItem = MORPH_SEQUENCE[currentIndex] || MORPH_SEQUENCE[0]

  return (
    <motion.aside
      className="hidden lg:flex fixed left-6 xl:left-10 top-1/2 -translate-y-1/2 z-40 flex-col items-center pointer-events-none"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      {/* Decorative top line */}
      <div className="w-px h-12 bg-gradient-to-b from-transparent to-m360-gold/40 mb-3" />

      {/* Main pill */}
      <div className="relative px-3 py-4 rounded-2xl bg-m360-card/80 backdrop-blur-md border border-m360-gold/20 shadow-[0_0_30px_rgba(243,174,28,0.08)]">
        {/* Glow ring */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-m360-gold/20 via-transparent to-m360-gold/10 pointer-events-none" />

        <MorphingText item={currentItem} />
        <ProgressDots index={currentIndex} total={MORPH_SEQUENCE.length} />
      </div>

      {/* Decorative bottom line */}
      <div className="w-px h-12 bg-gradient-to-b from-m360-gold/40 to-transparent mt-3" />

      {/* Side label */}
      <div className="mt-2 font-body text-[9px] uppercase tracking-[0.2em] text-m360-muted/40" style={{ writingMode: 'vertical-rl' }}>
        M360
      </div>
    </motion.aside>
  )
}
