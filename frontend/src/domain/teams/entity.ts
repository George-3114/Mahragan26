import type { EntityId, FestivalScopedEntity } from '../common';
import type { TeamCategoryBreakdown } from '../scoring';
import { TeamStatus } from './enums';

export interface Team extends FestivalScopedEntity {
  readonly name: string;
  readonly color: string;
  readonly logoUrl?: string;
  readonly flagUrl?: string;
  readonly motto?: string;
  readonly description?: string;
  readonly status: TeamStatus;
  /** Denormalized count; source of truth is TeamMember collection. */
  readonly memberCount: number;
  /** Denormalized total; source of truth is TeamScore collection. */
  readonly totalPoints: number;
  /** Denormalized breakdown by competition category. */
  readonly categoryPoints: TeamCategoryBreakdown;
  readonly captainMemberId?: EntityId;
}

export interface TeamSummary {
  readonly id: EntityId;
  readonly name: string;
  readonly color: string;
  readonly totalPoints: number;
  readonly memberCount: number;
  readonly rank?: number;
}

export interface TeamLeaderboardEntry extends TeamSummary {
  readonly rank: number;
  readonly categoryPoints: TeamCategoryBreakdown;
}

export interface TeamFilter {
  readonly festivalYear?: string;
  readonly status?: TeamStatus;
  readonly search?: string;
}
