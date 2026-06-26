# LANDING_PAGE_BRIEF.md
# Masr360 (M360) — Pre-Launch Landing Page Brief

---

## [CONTEXT — READ EVERYTHING BEFORE WRITING A SINGLE LINE OF CODE]

You are building a pre-launch landing page for Masr360 (M360) — a gamified Egyptian tourism platform. This is NOT a regular landing page. It needs to be so visually stunning, culturally rich, and interactive that users scroll the entire thing, play a mini game, and submit their email before the platform even launches. Every section must feel intentional, cinematic, and uniquely Egyptian while being unmistakably modern and tech-forward.

---

## 🏢 WHO IS MASR360?

Masr360 (brand name: M360) is a gamified tourism and discovery platform built for Egypt. The name breaks down as:
- M360 = Masr 360 = مصر ٣٦٠ = Egypt 360 — a complete, all-around experience of Egypt.

The platform lets users:
- Explore Egyptian governorates
- Discover places & attractions
- Experience nightlife & events
- Shop local products
- Play a game that rewards them with real credits for knowing Egypt

The website is live at m360travel.com and is currently in integration phase — all main pages exist with static data (Governorates, Places, Nightlife, Products) but are not yet interactive or purchasable. The game is in development. Users who visit the link can see the website being built in real time — they are witnessing the birth of M360 from day one.

---

## 🎨 DESIGN SYSTEM — USE THIS EXACTLY

The designer will provide: logo files, color palette, design system screenshots, and the company report PDF. Before coding anything, the AI must ask for and ingest these assets. The landing page design must be derived directly from the M360 website's existing design language. Do not invent a design system — extract it from the provided assets.

**General direction while assets load:**

- **Vibe:** Warm Egyptian cultural identity fused with premium modern tech. Think: Duolingo energy × National Geographic depth × AAA game reveal cinematic quality.
- **Typography:** Bold, confident headings. Clean readable body. Arabic-influenced decorative touches where appropriate (not overdone).
- **Animations:** Smooth, scroll-triggered, purposeful. No gimmicks. Every animation should make the user feel like they are being invited somewhere special.
- **Feel:** The user should feel like they discovered something before everyone else.

---

## 🗂️ LANDING PAGE STRUCTURE — SECTION BY SECTION

Build the page as one long scroll. No separate routes. Each section flows into the next like chapters of a story.

---

### SECTION 1 — THE HERO (First impression, make it hit hard)

- Full-screen cinematic hero. Background: a slow-motion or parallax visual of iconic Egypt (Pyramids of Giza, Nile, desert dunes, Cairo skyline at night — use high quality imagery or CSS-driven visuals if no video is provided).
- Large headline reveals letter by letter or word by word on load:
  - "Egypt. Every corner. One platform." or "مصر ٣٦٠ — M360" — use the brand name revelation as the headline moment.
- Sub-headline: "The first gamified tourism platform for Egypt is launching soon. Be here from the start."
- Two CTAs side by side:
  - "Secure My Spot" → smooth scrolls to email form section
  - "Explore the Website" → opens m360travel.com in new tab
- Floating badge top-right: "🚧 Currently Building — Watch Us Grow"
- Animated particle or shimmer effect in the background (sand particles, light rays, or subtle map grid lines).

---

### SECTION 2 — WHAT IS M360? (The identity reveal)

- Split screen or timeline-style explanation:
  - M = Masr = مصر = Egypt
  - 360 = Every angle. Every governorate. Every moment.
  - M360 = The complete Egyptian experience.
- Animate the logo building itself piece by piece as the user scrolls into this section.
- One-liner: "27 governorates. Thousands of places. One game to discover them all."
- Mention: built by Egyptians, for Egyptians and the world.

---

### SECTION 3 — THE PLATFORM (Walk them through what's coming)

Present each of the 4 main sections as individual animated cards or horizontal scroll panels. Each card should feel like a mini-reveal:

**Card 1 — 🗺️ Governorates Explorer**
- "Explore all 27 Egyptian governorates. From Alexandria's coast to Aswan's temples — every region has a story. We're mapping it all."
- Status badge: "Live — Static Preview" (link opens that page on m360travel.com)

**Card 2 — 📍 Places & Attractions**
- "Discover hidden gems and iconic landmarks. Filter by category, location, and vibe. Egypt has more than the Pyramids — we'll prove it."
- Status badge: "Live — Static Preview"

**Card 3 — 🌙 Nightlife & Events**
- "From rooftop lounges in Cairo to cultural festivals in Luxor — your nights just got a guide."
- Status badge: "Live — Static Preview"

**Card 4 — 🛍️ Local Products Marketplace**
- "Shop authentic Egyptian products directly from local makers. Support local. Own a piece of Egypt."
- Status badge: "Live — Static Preview"

**Card 5 — 🎮 The M360 Game (Coming Soon)**
- "Answer challenges about Egypt. Upload proof. Earn credits. Climb the leaderboard. Egypt becomes your playground."
- Status badge: "In Development — Demo Below ↓" (glowing, pulsing badge)

Each card links to the corresponding live static page on m360travel.com so users can peek at the real website right now.

---

### SECTION 4 — THE GAME DEMO (The dopamine section — make this unforgettable)

This is the most important section. It must feel like a real game, not a form. Build a fully functional 3-question interactive mini-game about the Pyramids of Giza.

**Game UI Requirements:**
- Styled exactly like the M360 game will look on the actual platform (dark themed, gamified, XP bars, credit counters, animated feedback).
- Show a credit counter at the top: starts at 0, animates up as the user earns points.
- Show a progress bar: Question 1 of 3.
- Each correct answer triggers a satisfying animation (confetti burst, XP popup, sound optional).
- Wrong answers show a kind educational response with the correct fact.

**The 3 Questions:**

**Question 1 (Easy — Multiple Choice):**
- "The Great Pyramid of Giza was built for which Pharaoh?"
- Options: A) Ramesses II  B) Khufu (Cheops) ✅  C) Tutankhamun  D) Cleopatra
- Reward: +50 credits on correct answer.

**Question 2 (Medium — Multiple Choice):**
- "Approximately how tall is the Great Pyramid of Giza today?"
- Options: A) 100 meters  B) 120 meters  C) 138 meters ✅  D) 160 meters
- Reward: +100 credits on correct answer.

**Question 3 (Upload Challenge):**
- "Upload a photo of the Pyramids of Giza (your own photo or a saved one) to earn your bonus credits and prove you've been there — or that you're ready to go!"
- File upload input, accepts image files.
- On upload: show a preview of the image with a "✅ Submitted! +150 credits earned" animation.
- Reward: +150 credits automatically on any upload (no validation needed for demo).

**After Question 3 — Gate the Credits:**

Show a results screen:
- Total credits earned: [X] / 300
- Big message: "Your credits are waiting. Submit your email to claim them and secure your spot on Egypt's first leaderboard at launch."
- Email input + name input + submit button → this flows directly into the form section below (or submits inline).
- If they skip the game and go straight to the form, they earn 0 game credits (show this difference clearly to incentivize playing).

---

### SECTION 5 — THE FORM (Data collection + feedback — make it feel like a reward, not a survey)

Frame this as: "Shape M360 Before It Launches" — the user's opinion matters and they earn extra credits for every answer.

**Form Design:**
- Multi-step form (one question per screen/card, not one long page). Progress bar at top.
- Each completed question shows: "+25 credits earned" animation.
- Total potential credits from form: displayed at the top as a goal (e.g., "Earn up to 300 more credits").
- Final submit = animated celebration screen with total credits tally and leaderboard position teaser: "You are currently #[X] on Egypt's pre-launch leaderboard." (show a fake but believable rank like #247 that makes them feel early).

**Required Fields (always):**
- Full name (Arabic or English)
- Email address
- City / Governorate (dropdown of all 27 Egyptian governorates + "Outside Egypt")
- Age range (Under 18 / 18–24 / 25–34 / 35–44 / 45+)

**Form Questions — Rate Each M360 Section (1–5 stars or emoji scale):**
- How excited are you about the Governorates Explorer?
- How useful is the Places & Attractions section for you?
- How likely are you to use the Nightlife & Events guide?
- Would you buy from the Local Products Marketplace?
- How excited are you about the M360 Game specifically?

**Behavioral & Monetization Questions:**
- How often do you travel within Egypt? (Never / 1–2x year / Monthly / Weekly)
- What frustrates you most about discovering places in Egypt? (Open text — short)
- Would you pay for a premium M360 membership? (Yes / No / Maybe — with "How much?" slider if Yes/Maybe: 0–200 EGP/month)
- Would you pay for in-game power-ups or hints in the M360 game? (Yes / No / Maybe)
- What would make you open M360 every single day? (Open text — short)

**Design & Identity Feedback:**
- Show the M360 logo and ask: "First impression of our logo?" (Love it / Like it / Neutral / Needs work)
- Show the color palette and ask: "Does this feel like Egypt to you?" (Yes, perfectly / Somewhat / Not really)
- Show a screenshot of one of the website pages and ask: "What's your overall impression of the design?" (1–5 stars + optional comment)

**What's Missing Questions:**
- What feature do you wish M360 had that isn't listed? (Open text)
- Is there a section you'd remove or deprioritize? (Checkboxes of the 4+1 sections + "None, keep them all")
- Any tips or ideas for the M360 team? (Open text)

**Willingness to Engage:**
- Would you join a WhatsApp/Telegram community for M360 early users? (Yes / No)
- Would you share M360 with friends right now? (Yes / No / After I see the full product)
- If yes to sharing, how many friends would you tell? (1–3 / 4–10 / More than 10)

---

### SECTION 6 — THE LEADERBOARD TEASER

- Show a live-updating (or simulated) leaderboard:
  - Top entries with scrambled names (e.g., "A***d M." from Cairo — 850 credits)
  - User's own entry at the bottom, highlighted
- Message: "At launch, the top 10 on Egypt's leaderboard get exclusive M360 perks, badges, and early access features."
- CTA: "Invite a friend → Both earn +50 credits" (referral mechanic, even if just mailto or copy-link for now)

---

### SECTION 7 — CURRENTLY BUILDING (Transparency = trust)

Show a live progress tracker of M360's development:

| Feature | Status |
|---|---|
| Governorates Page | ✅ Done (Static) → 🔄 Integration in progress |
| Places Page | ✅ Done (Static) → 🔄 Integration in progress |
| Nightlife Page | ✅ Done (Static) → 🔄 Integration in progress |
| Products Marketplace | ✅ Done (Static) → 🔄 Integration in progress |
| The Game | 🚧 In Development |
| Full Launch | 🎯 Coming Soon |

- Animated building/construction aesthetic (subtle, not cartoonish).
- Link to m360travel.com prominently: "See the website as it's being built →"
- Message: "You're not waiting for us. You're building this with us."

---

### SECTION 8 — CONNECT WITH US (Footer area)

- Embed the Linktree link prominently (the actual Linktree URL will be provided from the company book PDF).
- Social links (Instagram, TikTok, LinkedIn, Facebook — URLs from Linktree/report).
- Small about line: "M360 is built by a team of Egyptian engineers and creators who believe Egypt deserves a world-class digital tourism experience."
- Email: team contact from the company report.
- Copyright: © 2025 Masr360. All rights reserved.

---

## ⚙️ TECHNICAL REQUIREMENTS

- **Single HTML file** with embedded CSS and JS. Must be deployable immediately on Vercel, Netlify, or any static host.
- **Form backend:** Use Formspree (formspree.io). All form submissions must be stored and retrievable. Include the submission timestamp, all answers, credits earned from game, credits earned from form, and referral source if any.
- **Email list:** Every email submission goes to a single collection point. Use Formspree free tier.
- **Photo upload (game Q3):** Store locally in browser for demo purposes (no backend needed for the photo itself — just display preview and grant credits).
- **Leaderboard:** Simulated with localStorage — store the user's name, email, and credits. Show a realistic-looking leaderboard with ~10 pre-seeded fake entries + the user's real entry.
- **Animations:** Use GSAP CDN. Scroll-triggered reveals on every section.
- **Mobile first:** Must be fully responsive. Most Egyptian users will be on mobile.
- **Performance:** Hero section must load fast. Lazy load images. No animation should cause jank on mid-range Android phones.
- **Arabic support:** At minimum, the brand name in Arabic (مصر ٣٦٠) must render correctly. RTL support for any Arabic text snippets.

---

## 📦 ASSETS PROVIDED

Check the assets/ folder for:
- Logo files (PNG/SVG — light and dark versions)
- Color palette (extract exact hex codes)
- Design system screenshots (typography, components, spacing)
- Company report PDF (contains contact info, social links, team info, Linktree URL)
- Screenshots of the live website (m360travel.com pages)

Extract everything from these files before writing any code. Do not invent colors, fonts, or brand elements.

---

## 🎯 SUCCESS METRICS

This landing page is successful if:

1. A user who has never heard of M360 scrolls the entire page in one session
2. They play all 3 game questions
3. They submit the full form with their email
4. They leave feeling like they are part of the M360 story from day one
5. The M360 team collects: email, name, city, age, willingness to pay, feature ratings, open feedback, and game performance — for every submission

Build with that standard. Every design decision, animation, and copy line should serve those 5 outcomes.
