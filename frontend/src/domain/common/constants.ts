import type { Timestamp } from './entity.base';

export const FESTIVAL = {
  /** Current active festival season. Update annually. */
  CURRENT_YEAR: '2026',
  NAME: 'Mahragan',
  START_DATE: '2026-07-01T00:00:00.000Z' as Timestamp,
  END_DATE: '2026-08-31T23:59:59.999Z' as Timestamp,
} as const;

export const DOMAIN_LIMITS = {
  MAX_TEAM_SIZE: 15,
  MIN_TEAM_SIZE: 5,
  MAX_TEAMS: 12,
  MAX_SCORE_DESCRIPTION_LENGTH: 500,
  MAX_ANNOUNCEMENT_TITLE_LENGTH: 200,
  MAX_QUIZ_QUESTIONS: 50,
  MIN_QUIZ_QUESTIONS: 1,
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
