import type { AuditableEntity, EntityId, Timestamp } from '../common';
import { BadgeCategory, BadgeCriteriaType } from './enums';

export interface BadgeCriteria {
  readonly type: BadgeCriteriaType;
  readonly threshold?: number;
  readonly activityType?: string;
  readonly description?: string;
}

export interface Badge extends AuditableEntity {
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly category: BadgeCategory;
  readonly pointsBonus: number;
  readonly criteria: BadgeCriteria;
  readonly isActive: boolean;
}

export interface MemberBadge extends AuditableEntity {
  readonly badgeId: EntityId;
  readonly memberId: EntityId;
  readonly userId: EntityId;
  readonly earnedAt: Timestamp;
  readonly awardedById?: EntityId;
  readonly notes?: string;
}

export interface BadgeSummary {
  readonly id: EntityId;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly category: BadgeCategory;
  readonly pointsBonus: number;
}

export interface BadgeEligibilityContext {
  readonly memberId: EntityId;
  readonly totalPoints: number;
  readonly rank?: number;
  readonly attendanceStreak?: number;
  readonly perfectQuizCount?: number;
  readonly teamRank?: number;
}

export interface BadgeFilter {
  readonly category?: BadgeCategory;
  readonly isActive?: boolean;
}
