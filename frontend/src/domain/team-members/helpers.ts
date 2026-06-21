import type { EntityId } from '../common';
import { rankByPoints } from '../scoring';
import type { TeamMember, TopPerformer } from './entity';
import { TeamMemberRole, TeamMemberStatus } from './enums';
import { DOMAIN_LIMITS } from '../common';

export function isActiveMember(member: TeamMember): boolean {
  return member.status === TeamMemberStatus.Active;
}

export function isCaptain(member: TeamMember): boolean {
  return member.role === TeamMemberRole.Captain;
}

export function filterMembersByTeam(
  members: readonly TeamMember[],
  teamId: EntityId,
): TeamMember[] {
  return members.filter(
    (member) => member.teamId === teamId && isActiveMember(member),
  );
}

export function canAddMemberToTeam(
  currentMemberCount: number,
): boolean {
  return currentMemberCount < DOMAIN_LIMITS.MAX_TEAM_SIZE;
}

export function buildTopPerformers(
  members: readonly TeamMember[],
  limit = 10,
): TopPerformer[] {
  const active = members.filter(isActiveMember);
  const ranked = rankByPoints(
    active.map((member) => ({
      id: member.id,
      totalPoints: member.totalPoints,
      userId: member.userId,
      displayName: member.displayName,
      grade: member.grade,
      teamId: member.teamId,
      profilePictureUrl: member.profilePictureUrl,
    })),
  );

  return ranked.slice(0, limit).map((entry) => ({
    id: entry.id,
    userId: entry.userId,
    displayName: entry.displayName,
    grade: entry.grade,
    teamId: entry.teamId,
    totalPoints: entry.totalPoints,
    profilePictureUrl: entry.profilePictureUrl,
    rank: entry.rank,
  }));
}

export function findMemberByUserId(
  members: readonly TeamMember[],
  userId: EntityId,
): TeamMember | undefined {
  return members.find((member) => member.userId === userId && isActiveMember(member));
}
