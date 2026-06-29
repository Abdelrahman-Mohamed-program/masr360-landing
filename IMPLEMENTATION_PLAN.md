# IMPLEMENTATION_PLAN.md — M360 Pre-Launch Landing Page

No code. Pure planning document. Read before building.

---

## 1. CONFIRMED DESIGN SYSTEM

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0B0B0B` | Page background, main canvas |
| Card BG | `#141414` | Elevated surfaces, cards |
| Card BG Alt | `#1A1A1A` | Alternating cards, form fields |
| Primary Gold | `#F3AE1C` | CTAs, headings, highlights, XP bars |
| Gold Dark | `#C8921B` | Gold hover state |
| Cream | `#EFCF9E` | Secondary accents, subtle highlights |
| Text Primary | `#FFFFFF` | Body text on dark |
| Text Muted | `#9CA3AF` | Captions, labels, secondary text |
| Text Gold | `#F3AE1C` | Accent text, links |
| Border Gold | `#F3AE1C` | Card borders (with opacity) |
| Border Subtle | `#2A2A2A` | Dividers, card outlines |
| Success | `#22C55E` | Correct answers, done status |
| Error | `#EF4444` | Wrong answers, errors |

**Typography:**
- Headings: `Cinzel` (Google Fonts — serif, Egyptian gravitas)
- Body: `Poppins` (Google Fonts — clean, modern, readable)
- Weights: 400 (body), 500 (medium), 600 (semibold), 700 (bold headings), 900 (hero)

**Spacing scale:** 4px base, 8/12/16/24/32/48/64/96/128

**Border radius:** 12px cards, 8px inputs, 9999px pills/buttons

**Background texture:** Subtle hieroglyphic pattern as repeating SVG background with very low opacity (~0.03-0.05) — applied to body or a fixed overlay

---

## 2. REACT COMPONENT TREE

```
src/
├── App.jsx                    # Root — single page scroll container
├── main.jsx                   # React entry point
├── index.css                  # Tailwind directives + global styles + font imports
├── components/
│   ├── Hero.jsx               # Section 1
│   ├── WhatIsM360.jsx         # Section 2
│   ├── Platform.jsx           # Section 3
│   ├── GameDemo.jsx           # Section 4
│   ├── Form.jsx               # Section 5 (multi-step)
│   ├── Leaderboard.jsx        # Section 6
│   ├── CurrentlyBuilding.jsx  # Section 7
│   └── Footer.jsx             # Section 8
├── hooks/
│   ├── useScrollProgress.js   # Custom hook for scroll-triggered reveals
│   └── useLocalStorage.js     # Leaderboard data persistence
├── context/
│   └── GameContext.jsx        # Shared state: credits, form data, leaderboard
└── utils/
    ├── constants.js           # Egyptian governorates list, questions, etc.
    └── leaderboard.js         # Pre-seeded fake entries, rank calculation
```

---

## 3. ALL 8 SECTIONS — EXACT CONTENT

### Section 1 — HERO
**Headline (animated reveal):** "Egypt. Every corner. One platform."
**Sub-headline:** "The first gamified tourism platform for Egypt is launching soon. Be here from the start."
**CTA 1:** "Secure My Spot" → scrolls to form section
**CTA 2:** "Explore the Website" → opens m360travel.com in new tab
**Badge (top-right, floating):** "Currently Building — Watch Us Grow"
**Background:** CSS-driven dark gradient with animated gold particles (no external image needed for performance). Optional: subtle Egyptian silhouette as pseudo-element.

### Section 2 — WHAT IS M360
**Layout:** Split screen (text left, visual right on desktop; stacked on mobile)
**Content:**
- "M = Masr = Egypt"
- "360 = Every angle. Every governorate. Every moment."
- "M360 = The complete Egyptian experience."
- One-liner: "27 governorates. Thousands of places. One game to discover them all."
- "Built by Egyptians, for Egyptians and the world."
**Visual:** Logo builds piece by piece as user scrolls into view (Framer Motion scroll-triggered).

### Section 3 — THE PLATFORM
**Layout:** Horizontal scroll on desktop, vertical stack on mobile. 5 animated cards.
**Card 1:** Governorates Explorer — "Explore all 27 Egyptian governorates..." — Badge: "Live — Static Preview" — Link: m360travel.com/governorates
**Card 2:** Places & Attractions — "Discover hidden gems..." — Badge: "Live — Static Preview" — Link: m360travel.com/places
**Card 3:** Nightlife & Events — "From rooftop lounges..." — Badge: "Live — Static Preview" — Link: m360travel.com/nightlife
**Card 4:** Local Products Marketplace — "Shop authentic Egyptian products..." — Badge: "Live — Static Preview" — Link: m360travel.com/products
**Card 5:** The M360 Game — "Answer challenges about Egypt..." — Badge: "In Development — Demo Below" (glowing, pulsing) — No link (scrolls to game section)

### Section 4 — GAME DEMO
**Layout:** Centered card with game HUD styling (dark, gold-bordered, XP bar top)
**HUD elements:** Credit counter (top-left, animates up), Progress bar (Question X/3, top)
**Q1 (Easy, MCQ):** "The Great Pyramid of Giza was built for which Pharaoh?" — A) Ramesses II B) Khufu (correct) C) Tutankhamun D) Cleopatra — +50 credits
**Q2 (Medium, MCQ):** "Approximately how tall is the Great Pyramid of Giza today?" — A) 100m B) 120m C) 138m (correct) D) 160m — +100 credits
**Q3 (Upload):** "Upload a photo of the Pyramids of Giza..." — File input, image preview, +150 credits on any upload
**Post-game gate:** Results screen showing total credits / 300. Message: "Your credits are waiting. Submit your email to claim them..." → email + name + submit (flows into Section 5)
**Correct answer feedback:** Confetti burst + XP popup animation
**Wrong answer feedback:** Kind educational message with correct fact

### Section 5 — FORM (Multi-step)
**Frame:** "Shape M360 Before It Launches"
**Progress:** Top bar showing step X of N, total credits earned so far
**Each step:** One question, "+25 credits earned" animation on completion
**Total potential:** "Earn up to 300 more credits" displayed at top

**Steps (in order):**
1. Full name (text input, required)
2. Email (email input, required)
3. City/Governorate (dropdown: 27 governorates + "Outside Egypt", required)
4. Age range (Under 18 / 18–24 / 25–34 / 35–44 / 45+, required)
5. Rate Governorates Explorer (1-5 stars)
6. Rate Places & Attractions (1-5 stars)
7. Rate Nightlife & Events (1-5 stars)
8. Rate Local Products Marketplace (1-5 stars)
9. Rate M360 Game (1-5 stars)
10. Travel frequency in Egypt (Never / 1-2x year / Monthly / Weekly)
11. Frustration discovering places (open text, short)
12. Would pay for premium membership (Yes / No / Maybe + slider 0-200 EGP if Yes/Maybe)
13. Would pay in-game power-ups (Yes / No / Maybe)
14. What would make you open M360 daily (open text, short)
15. First impression of logo (Love it / Like it / Neutral / Needs work)
16. Colors feel like Egypt (Yes, perfectly / Somewhat / Not really)
17. Overall design impression (1-5 stars + optional comment)
18. Missing feature (open text)
19. Section to remove (checkboxes: 4+1 sections + "None, keep them all")
20. Tips for M360 team (open text)
21. Join WhatsApp/Telegram community (Yes / No)
22. Share with friends (Yes / No / After I see full product)
23. If share: how many friends (1-3 / 4-10 / More than 10)

**Final submit:** Celebration screen → total credits tally + "You are currently #247 on Egypt's pre-launch leaderboard" (fake but believable rank)

### Section 6 — LEADERBOARD TEASER
**Layout:** Table/card list with ~10 pre-seeded entries + user's entry highlighted at bottom
**Pre-seeded entries:** Scrambled names (e.g., "A***d M." from Cairo — 850 credits), varied cities and credit amounts
**Message:** "At launch, the top 10 on Egypt's leaderboard get exclusive M360 perks, badges, and early access features."
**CTA:** "Invite a friend → Both earn +50 credits" (mailto or copy-link for now)

### Section 7 — CURRENTLY BUILDING
**Layout:** Progress tracker table with animated status indicators
| Feature | Status |
|---|---|
| Governorates Page | Done (Static) → Integration in progress |
| Places Page | Done (Static) → Integration in progress |
| Nightlife Page | Done (Static) → Integration in progress |
| Products Marketplace | Done (Static) → Integration in progress |
| The Game | In Development |
| Full Launch | Coming Soon |
**Link:** "See the website as it's being built →" (m360travel.com)
**Message:** "You're not waiting for us. You're building this with us."

### Section 8 — FOOTER (Connect With Us)
**Content:**
- Linktree link (placeholder — actual URL from company book)
- Social links: Instagram, TikTok, LinkedIn, Facebook (placeholders)
- "M360 is built by a team of Egyptian engineers and creators who believe Egypt deserves a world-class digital tourism experience."
- Email: placeholder (from company report)
- "© 2025 Masr360. All rights reserved."

---

## 4. FRAMER MOTION ANIMATION PLAN

### Global
- **Page-level:** Smooth scroll behavior, no layout shift on section enter
- **Scroll progress indicator:** Thin gold bar at very top of viewport (0→100%)

### Section 1 — Hero
- **Headline:** Letter-by-letter or word-by-word reveal on mount (staggerChildren, opacity + y offset)
- **Sub-headline:** Fade-in after headline completes (delay based on headline length)
- **CTAs:** Scale-in with subtle glow pulse on mount (after sub-headline)
- **Badge:** Slide-in from right with bounce easing
- **Background particles:** Continuous floating animation (useMotionValue + useTransform for subtle drift)
- **On scroll out:** Parallax — hero content fades + scales down as user scrolls away

### Section 2 — What Is M360
- **Container:** Fade-in on scroll into view (useInView trigger)
- **Logo build:** As user scrolls through section, logo pieces animate in (scroll-linked: useScroll + useTransform to drive opacity/position of each piece)
- **Text blocks:** Staggered slide-up reveal (each line triggers as previous finishes)

### Section 3 — Platform Cards
- **Desktop:** Horizontal scroll with snap points. Each card scales up slightly as it enters center of viewport.
- **Mobile:** Vertical stack, each card slides in from alternating sides (left/right) on scroll
- **Card 5 (Game):** Pulsing gold border animation (box-shadow keyframes) to draw attention
- **Status badges:** Gentle pulse on "In Development" badge

### Section 4 — Game Demo
- **Entrance:** Card scales up from 0.9 → 1 with opacity fade (dramatic reveal)
- **Question transition:** Current question slides left + fades out, new question slides in from right
- **Correct answer:** Confetti burst (particle system or CSS animation), credit counter animates up, green flash on card
- **Wrong answer:** Gentle shake on wrong option, correct option highlights green, educational message fades in below
- **Upload (Q3):** Drag-over state with gold border glow, preview appears with scale-in animation
- **Results screen:** Number counter animation (0 → total credits over 1.5s), text reveals sequentially

### Section 5 — Form
- **Step transition:** Current step slides up + fades out, new step slides up from below (like turning a page)
- **Progress bar:** Smooth width transition between steps
- **Credit earned popup:** "+25 credits" floats up and fades out after each step completion
- **Star rating:** Stars fill with scale pop on selection
- **Final submit:** Full-screen celebration overlay, confetti, number tally animation, leaderboard rank reveal with count-up

### Section 6 — Leaderboard
- **Entry reveal:** Each row slides in from left with stagger delay
- **User's entry:** Gold highlight background, subtle pulse to draw eye
- **Credit amounts:** Count-up animation on scroll into view

### Section 7 — Currently Building
- **Status indicators:** Each row's status icon animates in (checkmark draws itself, spinner rotates, etc.)
- **Progress bars:** Animated fill from 0 to current percentage on scroll into view

### Section 8 — Footer
- **Simple fade-in** on scroll into view
- **Social icons:** Hover scale + gold color transition

---

## 5. ASSET INVENTORY

All files found in `assets/`:

| File | Size | Type | Notes |
|------|------|------|-------|
| `Home.webp` | 4.8 MB | Screenshot | Live homepage of m360travel.com |
| `Marketplace.webp` | 3.0 MB | Screenshot | Products marketplace page |
| `places.webp` | 3.5 MB | Screenshot | Places & attractions page |
| `M360 Book.pdf` | 16.6 MB | Document | Company report (contact, social, team, Linktree URL) |
| `M360 GL.pdf` | 867 KB | Document | Design system / brand guidelines |
| `Mini-logo.jpeg` | 108 KB | Logo | Small logo variant |
| `logo.jpeg` | 104 KB | Logo | Primary logo |

**Note:** Per instructions, image files are NOT read/analyzed. Design system is locked from the provided brief and confirmed palette above. PDFs contain contact info, social links, and team details to be extracted by the developer at build time (poppler not available for automated extraction).

---

## 6. BUILD ORDER

Build in this order — each step is independently testable before moving on.

### Phase 0 — Project Setup
1. Initialize Vite + React project
2. Install dependencies: `framer-motion`, `tailwindcss`, `react`
3. Configure Tailwind with custom M360 theme (colors, fonts, spacing)
4. Set up `index.html` with Google Fonts (Cinzel + Poppins)
5. Create `index.css` with Tailwind directives, base styles, hieroglyphic texture
6. Create folder structure (components/, hooks/, context/, utils/)

### Phase 1 — Shell + Context
1. `App.jsx` — Basic scroll container with all 8 section placeholders
2. `GameContext.jsx` — Shared state (credits, current form step, form data, leaderboard)
3. `constants.js` — Governorates list, game questions, pre-seeded leaderboard entries
4. `useScrollProgress.js` — Custom hook for scroll-triggered animations
5. `useLocalStorage.js` — Leaderboard persistence

### Phase 2 — Hero (Section 1)
- Build `Hero.jsx` with headline reveal animation
- Implement particle/shimmer background
- Add CTAs with scroll-to-form functionality
- Floating badge top-right
- Test on mobile — ensure headline doesn't overflow, CTAs stack vertically

### Phase 3 — What Is M360 (Section 2)
- Build `WhatIsM360.jsx` with split-screen layout
- Implement scroll-triggered logo build animation
- Staggered text reveals
- Mobile: stack vertically

### Section 4 — Platform Cards (Section 3)
- Build `Platform.jsx` with 5 cards
- Desktop: horizontal scroll with snap
- Mobile: vertical stack with alternating slide-in
- Pulsing badge on Card 5
- Link each card to m360travel.com pages

### Phase 5 — Game Demo (Section 4)
- Build `GameDemo.jsx` with full game logic
- Implement 3 questions (2 MCQ + 1 upload)
- Credit counter with animation
- Correct/wrong answer feedback
- Confetti/particle effect on correct
- Upload preview + credit grant
- Results screen → gate to form

### Section 6 — Multi-Step Form (Section 5)
- Build `Form.jsx` with all 23 steps
- Progress bar at top
- Step transitions (slide)
- Input validation
- Credit earned animation per step
- Formspree integration for submission
- Final celebration screen with rank reveal

### Section 7 — Leaderboard (Section 6)
- Build `Leaderboard.jsx`
- Pre-seeded entries + user entry from localStorage
- Highlight user row
- Count-up animations
- Referral CTA (mailto/copy link)

### Section 8 — Currently Building (Section 7)
- Build `CurrentlyBuilding.jsx`
- Animated status indicators
- Progress tracker table
- Link to m360travel.com

### Section 9 — Footer (Section 8)
- Build `Footer.jsx`
- Social links, Linktree, about line, copyright

### Phase 10 — Polish
- Scroll progress bar at top of viewport
- Section transition smoothing
- Mobile testing — all sections on 375px viewport
- Performance audit — lazy load, no jank
- Arabic text rendering check (مصر ٣٦٠)
- Formspree end-to-end test submission
- Leaderboard localStorage persistence test

---

## FORM INTEGRATION DETAILS

**Formspree setup:**
1. Create form at formspree.io → get form ID
2. Form action: `https://formspree.io/f/{FORM_ID}`
3. Method: POST
4. Fields include: name, email, city, age, all 23 form step values, game credits, form credits, total credits, timestamp
5. Hidden field for referral source (from URL params or session)

**localStorage schema:**
```json
{
  "m360_user": {
    "name": "Ahmed M.",
    "email": "ahmed@example.com",
    "credits": 450,
    "gameCredits": 150,
    "formCredits": 300,
    "submittedAt": "2025-01-15T10:30:00Z",
    "leaderboardRank": 247
  },
  "m360_leaderboard": [
    { "name": "A***d M.", "city": "Cairo", "credits": 850 },
    ...9 more entries...
  ]
}
```

---

## PERFORMANCE TARGETS

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- No layout shift (CLS = 0)
- Animations run at 60fps on mid-range Android (test on Chrome DevTools performance throttling)
- Hero loads without any external images (CSS-only visuals)
- Total bundle < 200KB gzipped (code-split if needed)

---

## RESPONSIVE BREAKPOINTS

- Mobile: 320px–639px (primary target — most Egyptian users)
- Tablet: 640px–1023px
- Desktop: 1024px+

Mobile-first CSS. Test at 375px (iPhone SE) and 390px (iPhone 12/13/14) primarily.
