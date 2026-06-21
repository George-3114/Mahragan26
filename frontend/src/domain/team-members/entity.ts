import type { EntityId, FestivalScopedEntity, Timestamp } from '../common';
import { Grade } from '../common';
import { TeamMemberRole, TeamMemberStatus } from './enums';

export interface TeamMember extends FestivalScopedEntity {
  readonly userId: EntityId;
  readonly teamId: EntityId;
  readonly displayName: string;
  readonly grade: Grade;
  readonly role: TeamMemberRole;
  readonly status: TeamMemberStatus;
  readonly profilePictureUrl?: string;
  readonly email?: string;
  /** Denormalized; source of truth is IndividualScore collection. */
  readonly totalPoints: number;
  readonly joinedAt: Timestamp;
}

export interface TeamMemberProfile {
  readonly id: EntityId;
  readonly userId: EntityId;
  readonly displayName: string;
  readonly grade: Grade;
  readonly teamId: EntityId;
  readonly totalPoints: number;
  readonly profilePictureUrl?: string;
}

export interface TopPerformer extends TeamMemberProfile {
  readonly rank: number;
}

export interface TeamMemberFilter {
  readonly festivalYear?: string;
  readonly teamId?: EntityId;
  readonly userId?: EntityId;
  readonly grade?: Grade;
  readonly status?: TeamMemberStatus;
}
