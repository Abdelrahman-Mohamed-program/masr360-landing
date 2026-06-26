import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { EgyptianBorder, FloatingDots } from './EgyptianOrnaments'
import { SITE_URL } from '../config'

const CARDS = [
  {
    id: 'governorates',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
    ),
    title: 'Governorates Explorer',
    description:
      "Explore all 27 Egyptian governorates. From Alexandria's coast to Aswan's temples — every region has a story. We're mapping it all.",
    badge: 'Live — Static Preview',
    badgeStyle: 'bg-m360-success/20 text-m360-success border-m360-success/30',
    link: `${SITE_URL}/discover`,
    linkLabel: 'View Governorates →',
    img: '/places.png',
    imgAlt: 'Egyptian places and landmarks',
    accentColor: 'from-m360-gold/20 via-m360-gold/5 to-transparent',
    glowColor: 'rgba(243,174,28,0.15)',
    patternIcon: '𓉴',
  },
  {
    id: 'places',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
    title: 'Places & Attractions',
    description:
      "Discover hidden gems and iconic landmarks. Filter by category, location, and vibe. Egypt has more than the Pyramids — we'll prove it.",
    badge: 'Live — Static Preview',
    badgeStyle: 'bg-m360-success/20 text-m360-success border-m360-success/30',
    link: `${SITE_URL}/places`,
    linkLabel: 'View Places →',
    img: '/places.png',
    imgAlt: 'Places & Attractions preview',
    accentColor: 'from-m360-cream/15 via-m360-cream/5 to-transparent',
    glowColor: 'rgba(239,207,158,0.12)',
    patternIcon: '𓋹',
  },
  {
    id: 'nightlife',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
    ),
    title: 'Nightlife & Events',
    description:
      'From rooftop lounges in Cairo to cultural festivals in Luxor — your nights just got a guide.',
    badge: 'Live — Static Preview',
    badgeStyle: 'bg-m360-success/20 text-m360-success border-m360-success/30',
    link: `${SITE_URL}/nights`,
    linkLabel: 'View Nightlife →',
    img: '/home.png',
    imgAlt: 'Nightlife & Events preview',
    accentColor: 'from-purple-500/15 via-purple-500/5 to-transparent',
    glowColor: 'rgba(168,85,247,0.12)',
    patternIcon: '𓇳',
  },
  {
    id: 'marketplace',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
    ),
    title: 'Local Products Marketplace',
    description:
      'Shop authentic Egyptian products directly from local makers. Support local. Own a piece of Egypt.',
    badge: 'Live — Static Preview',
    badgeStyle: 'bg-m360-success/20 text-m360-success border-m360-success/30',
    link: `${SITE_URL}/marketplace`,
    linkLabel: 'View Marketplace →',
    img: '/marketplace.png',
    imgAlt: 'Local Products Marketplace preview',
    accentColor: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    glowColor: 'rgba(16,185,129,0.12)',
    patternIcon: '𓆣',
  },
  {
    id: 'game',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="15" y1="13" x2="15.01" y2="13" /><line x1="18" y1="11" x2="18.01" y2="11" /><rect x="2" y="6" width="20" height="12" rx="2" /></svg>
    ),
    title: 'The M360 Game',
    description:
      'Answer challenges about Egypt. Upload proof. Earn credits. Climb the leaderboard. Egypt becomes your playground.',
    badge: 'In Development — Demo Below ↓',
    badgeStyle: 'bg-m360-gold/20 text-m360-gold border-m360-gold/40',
    link: `${SITE_URL}/games`,
    linkLabel: 'View the Game →',
    scrollToGame: true,
    img: null,
    imgAlt: 'The M360 Game preview',
    accentColor: 'from-m360-gold/25 via-m360-gold/10 to-transparent',
    glowColor: 'rgba(243,174,28,0.2)',
    patternIcon: '𓂀',
  },
]

function PlatformCard({ card, index }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })

  const direction = index % 2 === 0 ? -60 : 60

  return (
    <motion.article
      ref={cardRef}
      aria-labelledby={`platform-card-${index}-title`}
      className="relative flex-shrink-0 w-[85vw] sm:w-[380px] md:w-[420px] rounded-2xl overflow-hidden bg-m360-card border border-m360-border group"
      initial={{ opacity: 0, x: direction, scale: 0.92, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      {/* Gold border flash on reveal */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-m360-gold/0 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 0.6, 0], borderColor: ['rgba(243,174,28,0)', 'rgba(243,174,28,0.4)', 'rgba(243,174,28,0)'] } : {}}
        transition={{ duration: 1.2, delay: index * 0.12, ease: 'easeOut' }}
      />
      {/* Image area */}
      <div className="relative h-48 md:h-52 overflow-hidden">
        {/* Gradient placeholder */}
        <div className={`absolute inset-0 bg-gradient-to-br ${card.accentColor}`} />

        {/* Egyptian hieroglyphic watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl md:text-8xl text-m360-gold/10 font-serif select-none">
            {card.patternIcon}
          </span>
        </div>

        {/* Image if provided */}
        {card.img && (
          <>
            <img
              src={card.img}
              alt={card.imgAlt}
              width="420"
              height="208"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay for readability + blend with theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-m360-bg/90 via-m360-bg/40 to-m360-bg/30" />
          </>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-medium border backdrop-blur-sm ${card.badgeStyle} ${
              card.id === 'game' ? 'animate-pulse' : ''
            }`}
          >
            {card.id === 'game' && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-m360-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-m360-gold" />
              </span>
            )}
            {card.badge}
          </span>
        </div>

        {/* Card number */}
        <div className="absolute top-3 right-3 font-heading text-xs text-m360-muted/40">
          0{index + 1}/05
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5 md:p-6">
        <h3 id={`platform-card-${index}-title`} className="font-heading text-lg md:text-xl font-bold text-m360-text mb-2 flex items-center gap-2.5">
          <span className="text-m360-gold/70">{card.icon}</span>
          {card.title}
        </h3>
        <p className="font-body text-sm md:text-base text-m360-muted leading-relaxed mb-4">
          {card.description}
        </p>

        {/* Link / CTA */}
        <div className="flex flex-col gap-2">
          {card.link && (
            <a
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-body text-sm font-medium text-m360-gold hover:text-m360-cream transition-colors duration-200"
            >
              {card.linkLabel}
            </a>
          )}
          {card.scrollToGame && (
            <button
              onClick={() => {
                const gameSection = document.getElementById('game-demo')
                if (gameSection) gameSection.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-1 font-body text-sm font-medium text-m360-gold hover:text-m360-cream transition-colors duration-200 cursor-pointer"
            >
              Play the Demo ↓
            </button>
          )}
        </div>
      </div>

      {/* Hover glow border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none border border-m360-gold/0 group-hover:border-m360-gold/40 transition-all duration-300"
        style={{ boxShadow: 'inset 0 0 0 0 rgba(243,174,28,0)' }}
        whileHover={{
          boxShadow: `inset 0 0 30px ${card.glowColor}`,
        }}
      />
    </motion.article>
  )
}

function CardCarousel() {
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    const maxScroll = scrollWidth - clientWidth
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0)
  }

  const scrollBy = (direction) => {
    if (!containerRef.current) return
    const cardWidth = containerRef.current.clientWidth * 0.8
    containerRef.current.scrollBy({ left: direction * cardWidth, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Scrollable container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-5 lg:gap-6 overflow-x-auto pb-4 px-4 md:px-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CARDS.map((card, i) => (
          <div key={card.id} className="snap-start">
            <PlatformCard card={card} index={i} />
          </div>
        ))}
      </div>

      {/* Navigation arrows (desktop) */}
      <div className="hidden md:flex items-center justify-center gap-3 mt-6">
        <button
          onClick={() => scrollBy(-1)}
          className="w-10 h-10 rounded-full border border-m360-border bg-m360-card flex items-center justify-center text-m360-gold hover:border-m360-gold/50 hover:bg-m360-card-alt transition-all cursor-pointer"
          aria-label="Scroll left"
        >
          ←
        </button>

        {/* Progress bar */}
        <div className="w-48 h-1.5 rounded-full bg-m360-card-alt overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-m360-gold"
            animate={{ width: `${Math.max(10, scrollProgress * 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <button
          onClick={() => scrollBy(1)}
          className="w-10 h-10 rounded-full border border-m360-border bg-m360-card flex items-center justify-center text-m360-gold hover:border-m360-gold/50 hover:bg-m360-card-alt transition-all cursor-pointer"
          aria-label="Scroll right"
        >
          →
        </button>
      </div>

      {/* Mobile scroll dots */}
      <div className="flex md:hidden items-center justify-center gap-1.5 mt-4">
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            className="w-1.5 h-1.5 rounded-full bg-m360-border"
          />
        ))}
      </div>
    </div>
  )
}

export default function Platform() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      id="platform"
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background ornaments */}
      <FloatingDots count={6} />

      {/* Section heading */}
      <motion.div
        className="text-center mb-12 md:mb-16 px-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-m360-gold font-bold">
          The <span className="text-m360-cream">Platform</span>
        </h2>
        <p className="mt-3 font-body text-sm md:text-base text-m360-muted max-w-xl mx-auto">
          Everything <span className="text-m360-gold font-semibold">M360</span> is building for <span className="text-m360-cream">Egypt</span>. Peek at what's live right now.
        </p>
        <div className="mt-4 w-16 h-0.5 bg-m360-gold/40 mx-auto rounded-full" />
      </motion.div>

      {/* Independent scrollable card carousel */}
      <CardCarousel />
    </section>
  )
}
