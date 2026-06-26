import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GameProvider, useGame } from './context/GameContext'
import Hero from './components/Hero'
import WhatIsM360 from './components/WhatIsM360'
import Platform from './components/Platform'
import GameDemo from './components/GameDemo'
import StatBar from './components/StatBar'
import FloatingM360 from './components/FloatingM360'
import { ScrollProgressBar, BackToTop } from './components/ScrollUI'
import { EgyptianBorder, SectionDivider } from './components/EgyptianOrnaments'
import GoldDust from './components/GoldDust'
import FloatingNavbar from './components/FloatingNavbar'
import LoadingScreen from './components/LoadingScreen'
import WelcomeBanner from './components/WelcomeBanner'
import PlayNowSection from './components/PlayNowSection'
import FormSection from './components/FormSection'

function ReadyToExploreCTA() {
  return (
    <section id="footer" className="text-center px-4 md:px-8 py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(243,174,28,0.06) 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 style={{ fontFamily: "'Cinzel', serif" }} className="text-3xl md:text-5xl font-bold mb-5" >
            Ready to Explore <span style={{ background: "linear-gradient(135deg, #F3AE1C 0%, #EFCF9E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Egypt</span>?
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-[#EFCF9E]/50 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10">
            Be among the first to experience the complete Egyptian journey. Early members get exclusive perks, priority access, and a head start on the leaderboard.
          </p>
        </motion.div>
        <motion.button
          onClick={() => {
            const form = document.getElementById('form')
            if (form) form.scrollIntoView({ behavior: 'smooth' })
          }}
          className="btn-physical px-9 py-4 rounded-full font-bold text-base cursor-pointer relative overflow-hidden"
          style={{ fontFamily: "'Cinzel', serif", background: "linear-gradient(135deg, #F3AE1C 0%, #EFCF9E 100%)", color: "#0B0B0B", letterSpacing: "0.05em" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          animate={{
            boxShadow: [
              '0 0 24px rgba(243,174,28,0.35)',
              '0 0 56px rgba(243,174,28,0.7)',
              '0 0 24px rgba(243,174,28,0.35)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Secure My Spot →
        </motion.button>
      </div>
    </section>
  )
}

function BuildingSection() {
  const stages = [
    {
      label: "Governorates of Egypt",
      note: "27 governorates, fully mapped and live",
      done: true,
      live: true,
      href: "https://m360travel.com",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      ),
    },
    {
      label: "Places & Attractions",
      note: "Thousands of sites, from pyramids to hidden gems",
      done: true,
      live: true,
      href: "https://m360travel.com",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      label: "Nightlife & Events",
      note: "Cairo by night — curated and live",
      done: true,
      live: true,
      href: "https://m360travel.com",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
    {
      label: "Local Products Marketplace",
      note: "Egyptian craft, food, and goods — live",
      done: true,
      live: true,
      href: "https://m360travel.com",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      label: "The M360 Game",
      note: "Earn credits. Climb the throne. Coming soon",
      done: false,
      live: false,
      href: null,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" />
          <line x1="18" y1="11" x2="18.01" y2="11" />
          <rect x="2" y="6" width="20" height="12" rx="2" />
        </svg>
      ),
    },
    {
      label: "Full Launch",
      note: "The complete experience goes live",
      done: false,
      live: false,
      href: null,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      ),
    },
  ]
  const doneCount = stages.filter((s) => s.done).length
  const progress = Math.round((doneCount / stages.length) * 100)

  return (
    <section className="relative overflow-hidden">
      {/* Subtle hieroglyphic-pattern-like ornament — very faint */}
      <div className="absolute bottom-8 right-8 pointer-events-none select-none" aria-hidden="true" style={{ opacity: 0.025 }}>
        <svg width="180" height="180" viewBox="0 0 100 100" fill="#F3AE1C">
          <circle cx="50" cy="20" r="8" />
          <path d="M30 50 Q50 30 70 50 Q50 70 30 50Z" />
          <rect x="40" y="70" width="20" height="25" rx="2" />
          <line x1="50" y1="30" x2="50" y2="70" stroke="#F3AE1C" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F3AE1C]/20 bg-[#F3AE1C]/5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F3AE1C] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F3AE1C]" />
            </span>
            <span style={{ fontFamily: "'Poppins', sans-serif" }} className="text-[#F3AE1C] text-[11px] uppercase tracking-[0.2em] font-medium">Building in the Open</span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "#EFCF9E" }} className="mb-5">
            The Road to <span className="text-m360-gold">100%</span>
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif" }} className="font-body text-sm md:text-base text-m360-muted max-w-lg mx-auto leading-relaxed">
            Every week, a new piece of Egypt goes live. Track what's shipping, what's next, and <span className="text-m360-cream">be the first to know</span> when we hit full launch.
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-14 max-w-2xl mx-auto">
          <div className="flex justify-between items-end mb-3">
            <span style={{ fontFamily: "'Poppins', sans-serif" }} className="text-[#EFCF9E]/35 text-xs uppercase tracking-[0.15em]">Overall Progress</span>
            <motion.span
              style={{ fontFamily: "'Cinzel', serif", color: "#F3AE1C" }}
              className="text-2xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {progress}%
            </motion.span>
          </div>
          <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full relative"
              style={{ background: "linear-gradient(90deg, #F3AE1C 0%, #EFCF9E 100%)" }}
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Glow on the leading edge */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#EFCF9E]/40 to-transparent rounded-full" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-2">
            <span style={{ fontFamily: "'Poppins', sans-serif" }} className="text-[#EFCF9E]/20 text-[10px]">0%</span>
            <span style={{ fontFamily: "'Poppins', sans-serif" }} className="text-[#EFCF9E]/20 text-[10px]">100%</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-2 bottom-2 w-px md:left-[31px]" style={{ background: "linear-gradient(to bottom, rgba(243,174,28,0.3) 0%, rgba(243,174,28,0.05) 100%)" }} />

          <div className="space-y-2">
            {stages.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={`flex items-center gap-4 md:gap-6 rounded-xl px-4 py-4 md:px-5 md:py-5 transition-all duration-300 group relative ${item.done ? "bg-[#F3AE1C]/[0.04] border border-[#F3AE1C]/10 hover:border-[#F3AE1C]/25" : "bg-white/[0.015] border border-white/[0.04] hover:border-white/10"}`}>
                  {/* Node */}
                  <div className={`relative z-10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${item.done ? "bg-[#F3AE1C]/10 text-[#F3AE1C]" : i === doneCount ? "bg-amber-500/10 text-amber-400" : "bg-white/[0.03] text-white/20"}`}
                    style={item.done ? { boxShadow: "0 0 20px rgba(243,174,28,0.15)" } : i === doneCount ? { boxShadow: "0 0 20px rgba(247,191,70,0.12)" } : {}}
                  >
                    {item.done ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className={i === doneCount ? "" : "opacity-50"}>{item.icon}</span>
                    )}
                    {/* Active spinner for the "in progress" item */}
                    {i === doneCount && !item.done && (
                      <motion.div className="absolute inset-0 rounded-full border-2 border-transparent" style={{ borderTopColor: "#F3AE1C", borderRightColor: "rgba(243,174,28,0.2)" }} animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontFamily: "'Cinzel', serif" }} className={`text-sm md:text-base font-semibold truncate ${item.done ? "text-[#EFCF9E]" : i === doneCount ? "text-white/80" : "text-white/25"}`}>{item.label}</span>
                      {item.done && (
                        <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-[#F3AE1C]/10 text-[#F3AE1C]/80 border border-[#F3AE1C]/15" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.05em" }}>DONE</span>
                      )}
                      {i === doneCount && !item.done && (
                        <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400/90 border border-amber-500/15" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.05em" }}>IN PROGRESS</span>
                      )}
                    </div>
                    <p style={{ fontFamily: "'Poppins', sans-serif" }} className={`text-xs md:text-sm mt-1 ${item.done ? "text-[#EFCF9E]/40" : "text-white/20"}`}>{item.note}</p>
                  </div>

                  {/* Right side — status or link */}
                  <div className="flex-shrink-0">
                    {item.done && item.live ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-300 bg-[#22C55E]/[0.08] text-emerald-400 border border-emerald-500/15 hover:bg-[#22C55E]/15 hover:border-emerald-500/30" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                      Live
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover/link:opacity-90 group-hover/link:translate-x-px transition-all">
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </a>
                    ) : !item.done && i > doneCount ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/[0.03] text-white/15 border border-white/[0.04]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Locked
                      </span>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.6 }} className="text-center mt-14">
          <div className="inline-flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01]">
            <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-[#EFCF9E]/40 text-xs">Want to see what's coming next?</p>
            <a href="https://m360travel.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:gap-3" style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(135deg, #F3AE1C 0%, #EFCF9E 100%)", color: "#0B0B0B" }}>
              Visit the live site
              <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FooterSection() {
  const socials = [
    { label: "Instagram", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
    )},
    { label: "TikTok", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
    )},
    { label: "LinkedIn", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
    )},
    { label: "Facebook", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
    )},
  ]

  const values = ["Exploration", "Innovation", "Authenticity"]

  return (
    <footer className="relative bg-[#040302] overflow-hidden">
      {/* Animated top separator — unique double-line with glow pulse */}
      <motion.div className="relative h-px" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F3AE1C]/40 to-transparent" />
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F3AE1C]/60 to-transparent" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>

      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(12rem, 40vw, 28rem)", fontWeight: 900, color: "rgba(243,174,28,0.02)", lineHeight: 1, letterSpacing: "-0.05em" }}
        >M360</motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-20 pb-10">
        {/* Top brand + emblem row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          {/* Animated seal emblem */}
          <motion.div
            className="relative mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="md:hidden">
              <circle cx="28" cy="28" r="26" stroke="#F3AE1C" strokeWidth="0.5" opacity="0.3" />
              <circle cx="28" cy="28" r="20" stroke="url(#goldGrad)" strokeWidth="1" />
              <motion.circle cx="28" cy="28" r="20" stroke="#F3AE1C" strokeWidth="0.5" strokeDasharray="5 3" fill="none" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "28px 28px" }} />
              <text x="28" y="33" textAnchor="middle" fill="#F3AE1C" fontSize="14" fontFamily="Cinzel, serif" fontWeight="700">M</text>
              <defs>
                <linearGradient id="goldGrad" x1="8" y1="8" x2="48" y2="48"><stop stopColor="#F3AE1C" /><stop offset="1" stopColor="#EFCF9E" /></linearGradient>
              </defs>
            </svg>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="hidden md:block">
              <circle cx="36" cy="36" r="34" stroke="#F3AE1C" strokeWidth="0.5" opacity="0.2" />
              <motion.circle cx="36" cy="36" r="30" stroke="url(#goldGradMd)" strokeWidth="1" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }} />
              <motion.circle cx="36" cy="36" r="30" stroke="#F3AE1C" strokeWidth="0.4" strokeDasharray="3 4" fill="none" opacity="0.5" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "36px 36px" }} />
              <text x="36" y="42" textAnchor="middle" fill="#F3AE1C" fontSize="18" fontFamily="Cinzel, serif" fontWeight="700">M</text>
              <defs>
                <linearGradient id="goldGradMd" x1="6" y1="6" x2="66" y2="66"><stop stopColor="#F3AE1C" /><stop offset="1" stopColor="#EFCF9E" /></linearGradient>
              </defs>
            </svg>
            {/* Subtle glow behind the seal */}
            <div className="absolute inset-0 -z-10 blur-2xl rounded-full" style={{ background: "radial-gradient(circle, rgba(243,174,28,0.08) 0%, transparent 70%)" }} />
          </motion.div>

          <div className="flex items-center gap-5 md:gap-7 mb-2">
            <motion.img
              src="https://res.cloudinary.com/dwh6drlr9/image/upload/v1782426236/Logo_oeinar.jpg"
              alt="M360 Logo"
              className="w-12 md:w-14 h-12 md:h-14 object-contain rounded-xl border border-[#F3AE1C]/20 bg-black/30 p-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
            />
            <h3 style={{ fontFamily: "'Cinzel', serif", color: "#F3AE1C", fontSize: "2rem", fontWeight: 900, letterSpacing: "0.2em" }}>M360</h3>
            <motion.img
              src="https://res.cloudinary.com/dwh6drlr9/image/upload/v1782426244/Mini-logo_rvz9zh.jpg"
              alt="M360 Mini Logo"
              className="w-12 md:w-14 h-12 md:h-14 object-cover rounded-full border border-[#F3AE1C]/20 bg-black/30"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
            />
          </div>
          <motion.p
            style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(239,207,158,0.25)", fontSize: "0.85rem" }}
            dir="rtl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >مصر ٣٦٠</motion.p>
          <motion.p
            style={{ fontFamily: "'Poppins', sans-serif" }}
            className="text-m360-muted/60 text-sm leading-relaxed max-w-md mt-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >Built by Egyptian engineers and creators who believe Egypt deserves a world-class digital tourism experience.</motion.p>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="mb-10"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "center" }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-[#F3AE1C]/15 to-transparent" />
        </motion.div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-m360-gold/50 text-[10px] uppercase tracking-[0.25em] mb-5">Our Values</p>
            <div className="space-y-3">
              {values.map((v, i) => (
                <motion.div
                  key={v}
                  className="flex items-center gap-2.5 group cursor-default"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#F3AE1C]/30 group-hover:bg-[#F3AE1C] transition-colors duration-300 flex-shrink-0" />
                  <span style={{ fontFamily: "'Poppins', sans-serif" }} className="text-m360-muted/40 text-xs group-hover:text-m360-cream/70 transition-colors duration-300">{v}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-m360-gold/50 text-[10px] uppercase tracking-[0.25em] mb-5">Connect</p>
            <div className="space-y-3">
              <a href="https://m360travel.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-m360-muted/50 hover:text-m360-gold transition-colors duration-300 text-xs group" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                m360travel.com
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-70 group-hover:translate-x-0.5 -translate-y-0.5 transition-all duration-300"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
              </a>
              {socials.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-m360-muted/40 hover:text-m360-gold transition-colors duration-300 text-xs group"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ x: 3 }}
                >
                  <span className="flex-shrink-0 opacity-40 group-hover:opacity-90 transition-opacity duration-300">{s.icon}</span>
                  {s.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-m360-gold/50 text-[10px] uppercase tracking-[0.25em] mb-5">Contact</p>
            <a href="mailto:team@m360travel.com" className="group inline-flex items-center gap-2 text-m360-muted/50 hover:text-m360-gold text-xs transition-colors duration-300 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              team@m360travel.com
            </a>
            <div className="flex items-center gap-2 text-m360-muted/30 text-xs mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-50"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              Cairo, Egypt
            </div>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-m360-gold/50 text-[10px] uppercase tracking-[0.25em] mb-5">Legal</p>
            <div className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Preferences"].map((l, i) => (
                <a
                  key={l}
                  href="#"
                  className="block text-m360-muted/30 hover:text-m360-cream/60 transition-colors duration-300 text-xs"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >{l}</a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="pt-6 border-t border-white/[0.04]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p style={{ fontFamily: "'Poppins', sans-serif" }} className="text-m360-muted/25 text-xs">© 2025 Masr360. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-m360-muted/20 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <span>Egypt</span>
              <span className="text-[#F3AE1C]/30">·</span>
              <span>360</span>
              <span className="text-[#F3AE1C]/30">·</span>
              <span>M360</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

function AppContent() {
  const [loaded, setLoaded] = useState(false)
  const { userName } = useGame()

  // Always start at top on initial load / reload
  useEffect(() => {
    // Prevent browser scroll restoration so we always land at top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  const handleLoadComplete = useCallback(() => setLoaded(true), [])

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      <GoldDust />
      <FloatingNavbar />
      <ScrollProgressBar />
      <EgyptianBorder />
      <BackToTop />
      <WelcomeBanner />

      <main className="relative">
        <Hero loaded={loaded} />
        <SectionDivider />
        <WhatIsM360 />
        <SectionDivider />
        <StatBar />
        <SectionDivider />
        <Platform />
        <SectionDivider />
        <GameDemo />
        <SectionDivider />
        <FormSection />
        <SectionDivider />
        <PlayNowSection />
        <SectionDivider />
        <BuildingSection />
        <ReadyToExploreCTA />
        <FooterSection />
      </main>
    </>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App
