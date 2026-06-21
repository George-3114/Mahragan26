/**
 * Festival domain layer — pure TypeScript types and business logic.
 *
 * Import from this barrel in application/infrastructure layers:
 *   import { Team, buildTeamLeaderboard, DEFAULT_SCORING_CONFIG } from '@/domain';
 *
 * MongoDB integration: implement ports in `domain/ports` without changing entities.
 */

export * from './common';
export * from './scoring';
export * from './teams';
export * from './team-members';
export * from './individual-scores';
export * from './team-scores';
export * from './activities';
export * from './attendance';
export * from './rewards';
export * from './announcements';
export * from './materials';
export * from './quizzes';
export * from './badges';
export * from './qr-sessions';
export * from './ports';

import { ActivityStatus } from './activities';

/** Cross-aggregate festival statistics derived from domain data. */
export interface FestivalStats {
  readonly festivalYear: string;
  readonly totalMembers: number;
  readonly totalTeams: number;
  readonly totalIndividualPoints: number;
  readonly totalTeamPoints: number;
  readonly activeActivities: number;
}

export function calculateFestivalStats(input: {
  festivalYear: string;
  members: readonly import('./team-members').TeamMember[];
  teams: readonly import('./teams').Team[];
  activities: readonly import('./activities').Activity[];
}): FestivalStats {
  const { festivalYear, members, teams, activities } = input;
  const activeActivities = activities.filter(
    (a) =>
      a.status === ActivityStatus.Active || a.status === ActivityStatus.Upcoming,
  ).length;

  return {
    festivalYear,
    totalMembers: members.length,
    totalTeams: teams.length,
    totalIndividualPoints: members.reduce((sum, m) => sum + m.totalPoints, 0),
    totalTeamPoints: teams.reduce((sum, t) => sum + t.totalPoints, 0),
    activeActivities,
  };
}
