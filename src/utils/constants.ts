/**
 * Application-wide constants
 */

// Performance thresholds
export const PERFORMANCE = {
  SCROLL_THRESHOLD: 400,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  IMAGE_INTERSECTION_MARGIN: '50px',
  ANIMATION_DURATION: 700,
} as const;

// Cache durations (in milliseconds)
export const CACHE_TIME = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 10 * 60 * 1000, // 10 minutes
  VERY_LONG: 30 * 60 * 1000, // 30 minutes
} as const;

// API endpoints
export const API_ENDPOINTS = {
  WAITLIST: '/waitlist',
  AMBASSADOR: '/ambassador',
  STORES: '/stores',
} as const;

// Social media links
export const SOCIAL_LINKS = {
  LINKEDIN: 'https://www.linkedin.com/company/greenhunt',
  INSTAGRAM: 'https://www.instagram.com/greenhuntstoopingapp/',
  TWITTER: 'https://x.com/StoopingApp',
  YOUTUBE: 'https://www.youtube.com/@GreenHuntStoopingApp',
  TIKTOK: 'https://www.tiktok.com/@greenhuntstoopingapp',
} as const;

// App metadata
export const APP_META = {
  NAME: 'GreenHunt',
  TAGLINE: 'Make or save money - Save the Planet',
  DESCRIPTION: 'Easiest and most fun way to do Stooping in your city. Find or share free discarded stuff. Avoid stuff from becoming waste taking photos and earn rewards',
  EMAIL: 'hello@greenhunt.net',
  DOMAIN: 'https://greenhunt.net',
} as const;

// Animation variants
export const ANIMATION_VARIANTS = {
  FADE_UP: 'fade-up',
  FADE_IN: 'fade-in',
  SCALE_IN: 'scale-in',
  SLIDE_RIGHT: 'slide-right',
  SLIDE_LEFT: 'slide-left',
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;
