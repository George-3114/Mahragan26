import { ScoreScope } from '../common';

export enum ActivityType {
  Liturgy = 'liturgy',
  PsalmMemorization = 'psalm_memorization',
  HymnMemorization = 'hymn_memorization',
  Sports = 'sports',
  Quiz = 'quiz',
  Presentation = 'presentation',
  FlagCompetition = 'flag_competition',
  GeniusCompetition = 'genius_competition',
  Confession = 'confession',
  Volunteer = 'volunteer',
  General = 'general',
}

export enum ActivityStatus {
  Draft = 'draft',
  Upcoming = 'upcoming',
  Active = 'active',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export { ScoreScope as ActivityScope };
