import type { EntityId, AuditableEntity, Publishable, Timestamp } from '../common';
import { RewardCategory, RewardRedemptionStatus } from './enums';

export interface Reward extends AuditableEntity, Publishable {
  readonly name: string;
  readonly description: string;
  readonly imageUrl?: string;
  readonly requiredPoints: number;
  readonly category: RewardCategory;
  readonly stock: number;
  readonly isActive: boolean;
}

export interface RewardRedemption extends AuditableEntity {
  readonly rewardId: EntityId;
  readonly memberId: EntityId;
  readonly userId: EntityId;
  readonly pointsSpent: number;
  readonly status: RewardRedemptionStatus;
  readonly fulfilledAt?: Timestamp;
  readonly fulfilledById?: EntityId;
}

export interface RewardSummary {
  readonly id: EntityId;
  readonly name: string;
  readonly requiredPoints: number;
  readonly category: RewardCategory;
  readonly stock: number;
  readonly isAvailable: boolean;
}

export interface RewardFilter {
  readonly category?: RewardCategory;
  readonly isActive?: boolean;
  readonly isPublished?: boolean;
  readonly maxRequiredPoints?: number;
}
