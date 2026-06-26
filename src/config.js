// Centralized configuration — all URLs and constants in one place

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.m360travel.com'
export const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL || 'https://res.cloudinary.com/dwh6drlr9/image/upload'
export const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/FORM_ID_PLACEHOLDER'

export const LOGO_URL = `${CLOUDINARY_BASE}/v1782426236/Logo_oeinar.jpg`
export const MINI_LOGO_URL = `${CLOUDINARY_BASE}/v1782426244/Mini-logo_rvz9zh.jpg`
