// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
} as const;

// Routes configuration
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',

  // Child routes
  TEAMS: '/teams',
  TEAM_DETAIL: '/teams/:id',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
  MATERIALS: '/materials',
  QUIZZES: '/quizzes',
  QUIZ_DETAIL: '/quizzes/:id',
  REWARDS: '/rewards',
  ANNOUNCEMENTS: '/announcements',
  MY_SCORES: '/my-scores',
  MY_TEAM: '/my-team',
  ATTENDANCE: '/attendance',
  QR_SCAN: '/qr-scan',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_TEAMS: '/admin/teams',
  ADMIN_INDIVIDUALS: '/admin/individuals',
  ADMIN_ATTENDANCE: '/admin/attendance',
  ADMIN_QR_SESSIONS: '/admin/qr-sessions',
  ADMIN_TEAM_SCORES: '/admin/team-scores',
  ADMIN_INDIVIDUAL_SCORES: '/admin/individual-scores',
  ADMIN_PENALTIES: '/admin/penalties',
  ADMIN_ANNOUNCEMENTS: '/admin/announcements',
  ADMIN_MATERIALS: '/admin/materials',
  ADMIN_REWARDS: '/admin/rewards',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Quiz configuration
export const QUIZ_CONFIG = {
  DEFAULT_TIME_LIMIT: 30, // minutes
  PERFECT_SCORE_BONUS: 20,
  PASSING_SCORE: 50,
} as const;

// Festival dates
export const FESTIVAL_DATES = {
  START: new Date('2024-07-01'),
  END: new Date('2024-08-31'),
} as const;
