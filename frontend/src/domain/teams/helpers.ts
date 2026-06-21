import type { EntityId } from '../common';
import {
  calculateTeamTotalFromBreakdown,
  createEmptyTeamCategoryBreakdown,
  rankByPoints,
  type TeamCategoryBreakdown,
} from '../scoring';
import type { Team, TeamLeaderboardEntry, TeamSummary } from './entity';
import { TeamStatus } from './enums';

export function toTeamSummary(team: Team): TeamSummary {
  return {
    id: team.id,
    name: team.name,
    color: team.color,
    totalPoints: team.totalPoints,
    memberCount: team.memberCount,
  };
}

export function isTeamActive(team: Team): boolean {
  return team.status === TeamStatus.Active;
}

export function recalculateTeamPoints(
  categoryPoints: TeamCategoryBreakdown,
): number {
  return calculateTeamTotalFromBreakdown(categoryPoints);
}

export function buildTeamLeaderboard(teams: readonly Team[]): TeamLeaderboardEntry[] {
  const activeTeams = teams.filter(isTeamActive);
  const ranked = rankByPoints(
    activeTeams.map((team) => ({
      id: team.id,
      totalPoints: team.totalPoints,
      name: team.name,
      color: team.color,
      memberCount: team.memberCount,
      categoryPoints: team.categoryPoints,
    })),
  );

  return ranked.map((entry) => ({
    id: entry.id,
    name: entry.name,
    color: entry.color,
    totalPoints: entry.totalPoints,
    memberCount: entry.memberCount,
    rank: entry.rank,
    categoryPoints: entry.categoryPoints,
  }));
}

export function findTeamById(teams: readonly Team[], teamId: EntityId): Team | undefined {
  return teams.find((team) => team.id === teamId);
}

export function createDefaultTeamCategoryPoints(): TeamCategoryBreakdown {
  return createEmptyTeamCategoryBreakdown();
}
