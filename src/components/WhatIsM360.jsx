import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { EgyptianBorder, FloatingDots } from './EgyptianOrnaments'

const MORPH_SEQUENCE = [
  { text: 'M', meaning: 'Masr', color: '#F3AE1C' },
  { text: 'Masr', meaning: 'Egypt', color: '#F3AE1C' },
  { text: 'مصر', meaning: 'Egypt in Arabic', color: '#EFCF9E' },
  { text: 'Egypt', meaning: 'the land of pharaohs', color: '#F3AE1C' },
]

const TEXT_BLOCKS = [
  { label: 'M', value: 'Masr = Egypt', color: 'text-m360-gold' },
  { label: '360', value: 'Every angle. Every governorate. Every moment.', color: 'text-m360-cream' },
  { label: 'M360', value: 'The complete Egyptian experience.', color: 'text-m360-gold' },
]

const FOOTER_LINE = 'Built by Egyptians, for Egyptians and the world.'

const STATS = [
  { number: 27, label: 'Governorates', icon: '𓉴', color: 'text-m360-gold' },
  { number: 1000, label: 'Places', icon: '𓋹', suffix: '+', color: 'text-m360-cream' },
  { number: 1, label: 'Game to discover it all', icon: '𓂀', isHighlight: true, color: 'text-m360-gold' },
]

function AnimatedNumber({ number, delay, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 1400
    const steps = 30
    const increment = number / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= number) {
        setDisplay(number)
        clearInterval(interval)
      } else {
        setDisplay(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [isInView, number])

  return (
    <motion.span
      ref={ref}
      className="font-heading text-3xl md:text-4xl font-bold tabular-nums"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 120 }}
    >
      {display.toLocaleString()}{suffix}
    </motion.span>
  )
}

function StatsRow() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="relative py-4 md:py-6 max-w-xl mx-auto px-4">
      <div className="relative flex items-center justify-center gap-6 md:gap-10">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={stat.color}>
              <AnimatedNumber number={stat.number} delay={0.3 + i * 0.15} suffix={stat.suffix} />
            </div>
            <motion.p
              className={`mt-1 font-body text-[10px] md:text-xs ${
                stat.isHighlight ? 'text-m360-cream font-semibold' : 'text-m360-muted'
              }`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.3 }}
            >
              {stat.label}
            </motion.p>
            {/* Separator dot between items */}
            {i < STATS.length - 1 && (
              <span className="hidden md:block absolute top-1/2 -right-3 md:-right-5 w-1 h-1 rounded-full bg-m360-gold/30" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AutoMorphingText() {
  const containerRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const isInView = useInView(containerRef, { margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MORPH_SEQUENCE.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [isInView])

  const current = MORPH_SEQUENCE[currentIndex]

  return (
    <div ref={containerRef} className="relative h-28 md:h-32 flex flex-col items-center justify-center overflow-hidden">
      {/* Main morphing text with 360° beside it */}
      <div className="flex items-center gap-3 md:gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30, scale: 0.8, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.8, rotateX: 90 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold"
              style={{ color: current.color }}
              dir="auto"
            >
              {current.text}
            </span>
            <span className="font-body text-xs md:text-sm text-m360-muted mt-1 tracking-wide">
              {current.meaning}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* 360° static companion with subtle pulse */}
        <motion.span
          className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-m360-cream/70"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.95, 1.02, 0.95],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          360°
        </motion.span>
      </div>

      {/* Progress dots */}
      <div className="absolute -bottom-2 flex gap-1.5">
        {MORPH_SEQUENCE.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === currentIndex ? 20 : 6,
              backgroundColor: i === currentIndex ? '#F3AE1C' : '#2A2A2A',
            }}
            transition={{ duration: 0.3 }}
            style={{ height: 6 }}
          />
        ))}
      </div>
    </div>
  )
}

function AnimatedLogoImage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="relative w-full max-w-sm mx-auto flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-m360-gold/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-m360-cream/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      {/* Glow pulse behind image */}
      <motion.div
        className="absolute inset-[15%] rounded-full bg-m360-gold/10 blur-2xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* The image */}
      <motion.div
        className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-m360-gold/40 shadow-[0_0_40px_rgba(243,174,28,0.2)]"
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/images.webp"
          alt="M360 Logo"
          className="w-full h-full object-cover"
        />
        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Orbiting "360" badge */}
      <motion.div
        className="absolute -top-2 -right-2 md:top-0 md:right-0 px-3 py-1.5 rounded-full bg-m360-card border border-m360-cream/30 shadow-[0_0_15px_rgba(239,207,158,0.2)]"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 120 }}
      >
        <span className="font-heading text-sm md:text-base font-bold text-m360-cream">360°</span>
      </motion.div>

      {/* Orbiting dot */}
      <motion.div
        className="absolute top-2 -left-3 md:-left-4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.4 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-m360-gold"
          animate={{
            y: [-4, 4, -4],
            boxShadow: ['0 0 0 rgba(243,174,28,0)', '0 0 12px rgba(243,174,28,0.6)', '0 0 0 rgba(243,174,28,0)'],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      <motion.div
        className="absolute bottom-4 -right-2 md:bottom-2 md:-right-6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-m360-cream/60"
          animate={{
            y: [4, -4, 4],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  )
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.5,
    },
  },
}

const blockVariants = {
  hidden: { opacity: 0, x: -40, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const headingVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const charVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function TextContent() {
  return (
    <motion.div
      className="space-y-6 md:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {TEXT_BLOCKS.map((block, i) => (
        <motion.div
          key={block.label}
          variants={blockVariants}
          className="flex items-start gap-4 md:gap-6"
        >
          <span className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold ${block.color} shrink-0`}>
            {block.label}
          </span>
          <span className="font-body text-base md:text-lg lg:text-xl text-m360-text leading-relaxed pt-1">
            {block.value}
          </span>
        </motion.div>
      ))}

      <motion.p
        variants={blockVariants}
        className="font-body text-sm md:text-base text-m360-muted pt-2"
      >
        Built by <span className="text-m360-cream font-medium">Egyptians</span>, for <span className="text-m360-gold font-medium">the world</span>.
      </motion.p>
    </motion.div>
  )
}

export default function WhatIsM360() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="what-is-m360"
      ref={sectionRef}
      className="relative py-20 md:py-32 px-4 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* Background ornaments */}
      <FloatingDots count={8} />
      <EgyptianBorder className="max-w-6xl mx-auto" />

      {/* Section heading — character-by-character reveal */}
      <motion.div
        className="text-center mb-8 md:mb-12 relative z-10"
        variants={headingVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-m360-gold font-bold">
          {'What is '.split('').map((char, i) => (
            <motion.span key={`h-${i}`} variants={charVariants} className="inline-block">
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
          <span className="text-m360-cream">
            {'M360'.split('').map((char, i) => (
              <motion.span key={`h-m360-${i}`} variants={charVariants} className="inline-block">
                {char}
              </motion.span>
            ))}
          </span>
          <motion.span variants={charVariants} className="inline-block">?</motion.span>
        </h2>
        <motion.div
          className="mt-3 h-0.5 bg-m360-gold/40 mx-auto rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: 64 } : {}}
          transition={{ delay: 1.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Auto-morphing text showcase */}
      <div className="max-w-2xl mx-auto mb-8 md:mb-12 relative z-10">
        <AutoMorphingText />
      </div>

      {/* Dramatic stats row: 27 • 1000+ • OOH ONE GAME */}
      <StatsRow />

      {/* Split screen content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
        {/* Left: text content */}
        <TextContent />

        {/* Right: animated logo image */}
        <AnimatedLogoImage />
      </div>
    </section>
  )
}
