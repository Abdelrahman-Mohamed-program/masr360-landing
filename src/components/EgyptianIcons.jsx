// Custom Egyptian-themed icon set — replaces generic emoji throughout the gamification UI.
// All icons use currentColor so they inherit color from a parent text-* Tailwind class
// (e.g. <PharaohCrownIcon className="w-6 h-6 text-m360-gold" />).

export const PharaohCrownIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 18 L4 13 L7.5 8.5 L9.5 12.5 L12 5 L14.5 12.5 L16.5 8.5 L20 13 L20 18 Z"
      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"
    />
    <circle cx="12" cy="3.6" r="1.3" fill="currentColor" />
    <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="4" y1="20.2" x2="20" y2="20.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const ScarabIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6.5 Q12 3.5 15 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="9.5" y1="6" x2="7.8" y2="3.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <line x1="14.5" y1="6" x2="16.2" y2="3.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <ellipse cx="12" cy="14" rx="6.5" ry="6.2" stroke="currentColor" strokeWidth="1.4" />
    <line x1="12" y1="8" x2="12" y2="20" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6.5 11 Q5 12.5 6 14.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M6.5 16 Q5 17.2 6.3 18.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M17.5 11 Q19 12.5 18 14.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M17.5 16 Q19 17.2 17.7 18.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const EyeOfHorusIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10.3 L13 8.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M4 12 Q9.5 8.8 15 12 Q9.5 15.2 4 12 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="8.7" cy="12" r="1.7" fill="currentColor" />
    <path d="M4 12 Q2.3 14.3 4 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="9.8" y1="15" x2="9" y2="18.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CartoucheIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="12" rx="6" ry="6" stroke="currentColor" strokeWidth="1.5" />
    <line x1="12" y1="18" x2="12" y2="21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8.5" cy="12" r="1" fill="currentColor" />
    <circle cx="15.5" cy="12" r="1" fill="currentColor" />
    <line x1="12" y1="9.5" x2="12" y2="14.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const WasScepterIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="2.3" x2="9" y2="0.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="14" y1="2.3" x2="15" y2="0.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="4" r="2" fill="currentColor" />
    <line x1="12" y1="6" x2="12" y2="17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="17.5" x2="7.5" y2="21.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="12" y1="17.5" x2="16.5" y2="21.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
