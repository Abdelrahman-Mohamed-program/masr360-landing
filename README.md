# M360 — Egypt's Gamified Tourism Platform

The first gamified tourism platform for Egypt. Explore 27 governorates, discover places, and play to earn credits.

## Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool with HMR
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Animations and transitions
- **Formspree** — Form submissions

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_SITE_URL` | Your site URL (e.g., https://www.m360travel.com) |
| `VITE_CLOUDINARY_BASE_URL` | Cloudinary base URL for images |
| `VITE_FORMSPREE_ENDPOINT` | Formspree form endpoint |

## Project Structure

```
src/
├── components/     # React components
│   ├── Hero.jsx           # Landing hero section
│   ├── WhatIsM360.jsx     # Brand introduction
│   ├── Platform.jsx       # Platform features
│   ├── GameDemo.jsx       # Interactive game
│   ├── FormSection.jsx    # Multi-step survey form
│   ├── ErrorBoundary.jsx  # Error handling
│   └── ...
├── context/        # React context providers
├── hooks/          # Custom hooks
├── utils/          # Constants and utilities
├── config.js       # Centralized configuration
├── App.jsx         # Main app layout
└── main.jsx        # Entry point
```

## Design System

- **Background:** `#0B0B0B`
- **Gold:** `#F3AE1C`
- **Cream:** `#EFCF9E`
- **Muted:** `#9CA3AF`
- **Font (Headings):** Cinzel (serif)
- **Font (Body):** Poppins (sans-serif)

## Deployment

Build the project and deploy the `dist/` folder to any static hosting:

```bash
npm run build
```

Compatible with Vercel, Netlify, Cloudflare Pages, or any static file host.

## License

MIT
