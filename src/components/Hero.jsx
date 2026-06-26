import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

const WORDS = ['Egypt.', 'Every', 'corner.', 'One', 'platform.']

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: 2 + (i % 4),
  duration: 6 + (i % 5) * 2,
  delay: (i * 0.4) % 4,
  driftX: 10 + (i % 3) * 8,
  driftY: 15 + (i % 4) * 10,
}))

const TITLE_CHARS = 'M360'.split('')

const headlineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {PARTICLES.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </div>
  )
}

function Particle({ left, top, size, duration, delay, driftX, driftY }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 20, damping: 20 })
  const springY = useSpring(y, { stiffness: 20, damping: 20 })

  const translateX = useTransform(springX, (v) => v)
  const translateY = useTransform(springY, (v) => v)

  return (
    <motion.div
      className="absolute rounded-full bg-m360-gold/30 will-change-transform"
      style={{
        left,
        top,
        width: size,
        height: size,
        x: translateX,
        y: translateY,
      }}
      animate={{
        x: [-driftX, driftX, -driftX],
        y: [-driftY, driftY, -driftY],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

function Badge() {
  return (
    <motion.div
      className="absolute top-4 right-4 md:top-6 md:right-6 z-20"
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 100, damping: 15 }}
    >
      <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full bg-m360-card/80 backdrop-blur-sm border border-m360-gold/20 text-m360-cream text-xs md:text-sm font-body">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-m360-gold opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-m360-gold" />
        </span>
        <span>Currently Building — Watch Us Grow</span>
      </div>
    </motion.div>
  )
}

function BigM360() {
  return (
    <div
      className="leading-none tracking-tight text-center mb-6 md:mb-8"
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 'clamp(4rem, 14vw, 10rem)',
        fontWeight: 900,
        color: '#C9A227',
        textShadow: '0 0 80px rgba(243,174,28,0.3), 0 0 40px rgba(243,174,28,0.15)',
      }}
    >
      {TITLE_CHARS.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 70, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.55 + i * 0.13, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}

function Headline() {
  return (
    <motion.h1
      className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-center text-m360-gold"
      variants={headlineVariants}
      initial="hidden"
      animate="visible"
    >
      {WORDS.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  )
}

function Subheadline() {
  return (
    <motion.p
      className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-m360-muted font-body text-center max-w-2xl mx-auto px-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6, ease: 'easeOut' }}
    >
      The first <span className="text-m360-cream">gamified tourism platform</span> for <span className="text-m360-gold font-semibold">Egypt</span> is launching soon. Be here from the start.
    </motion.p>
  )
}

function CTAs() {
  const scrollToForm = () => {
    const formSection = document.getElementById('form')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        onClick={scrollToForm}
        className="btn-physical w-full sm:w-auto px-8 py-3.5 rounded-full bg-m360-gold text-m360-bg font-body font-semibold text-base md:text-lg shadow-[0_0_20px_rgba(243,174,28,0.3)] hover:shadow-[0_0_30px_rgba(243,174,28,0.5)] transition-shadow duration-300 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(243,174,28,0.3)',
            '0 0 35px rgba(243,174,28,0.5)',
            '0 0 20px rgba(243,174,28,0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Secure My Spot
      </motion.button>

      <motion.a
        href="https://www.m360travel.com"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-physical w-full sm:w-auto px-8 py-3.5 rounded-full border border-m360-gold/50 text-m360-gold font-body font-semibold text-base md:text-lg text-center hover:bg-m360-gold/10 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Explore the Website
      </motion.a>
    </motion.div>
  )
}

function HeroContent() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20"
    >
      <Particles />
      <BigM360 />
      <Headline />
      <Subheadline />
      <CTAs />
    </motion.div>
  )
}

function ScrollHint() {
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.0, duration: 0.8 }}
    >
      <span className="font-body text-[10px] uppercase tracking-[0.25em] text-m360-muted/50">Scroll</span>
      <motion.div
        className="w-5 h-8 rounded-full border border-m360-gold/40 flex items-start justify-center pt-1.5"
        animate={{ boxShadow: ['0 0 0 rgba(243,174,28,0)', '0 0 12px rgba(243,174,28,0.3)', '0 0 0 rgba(243,174,28,0)'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="w-1 h-1.5 rounded-full bg-m360-gold/70"
          animate={{ y: [0, 8, 0], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}

function PyramidSilhouettes() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-40 md:h-56 pointer-events-none z-[5]" aria-hidden="true">
      <div
        className="absolute bottom-0 left-[15%] w-32 md:w-48 h-24 md:h-36 bg-m360-bg/80"
        style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
      />
      <div
        className="absolute bottom-0 left-[35%] w-24 md:w-36 h-18 md:h-28 bg-m360-bg/60"
        style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
      />
      <div
        className="absolute bottom-0 right-[20%] w-20 md:w-28 h-14 md:h-20 bg-m360-bg/70"
        style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
      />
      <div
        className="absolute bottom-0 right-[38%] w-12 md:w-16 h-8 md:h-12 bg-m360-bg/50"
        style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
      />
    </div>
  )
}

function HeroBackground() {
  const parallaxRef = useRef(null)

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <ParallaxPhoto ref={parallaxRef} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-m360-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0515]/40 via-transparent to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(243,174,28,0.15) 0%, rgba(180,120,20,0.08) 40%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 30% 80%, rgba(200,100,30,0.1) 0%, transparent 60%)',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent" />
    </div>
  )
}

function ParallaxPhoto({ ref }) {
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -80])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <motion.div
      ref={ref}
      style={{ y, scale }}
      className="absolute inset-0 will-change-transform"
    >
      <div
        className="absolute inset-0 bg-center bg-cover scale-110"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1678038592492-d73c063bb9e2?w=1920&h=1080&fit=crop&auto=format&q=80)',
        }}
      />
    </motion.div>
  )
}

export default function Hero({ loaded = true }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setReady(true), 200)
      return () => clearTimeout(t)
    }
  }, [loaded])

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-m360-bg"
    >
      <HeroBackground />
      {ready && (
        <>
          <Badge />
          <HeroContent />
          <PyramidSilhouettes />
          <ScrollHint />
        </>
      )}
    </section>
  )
}