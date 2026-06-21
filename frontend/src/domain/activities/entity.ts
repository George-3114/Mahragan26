import type { EntityId, FestivalScopedEntity, Timestamp } from '../common';
import { ScoreScope } from '../common';
import { ActivityStatus, ActivityType } from './enums';

export interface Activity extends FestivalScopedEntity {
  readonly title: string;
  readonly description: string;
  readonly type: ActivityType;
  readonly status: ActivityStatus;
  readonly scope: ScoreScope;
  readonly scheduledAt: Timestamp;
  readonly endsAt?: Timestamp;
  readonly defaultPoints: number;
  readonly location?: string;
  readonly isMandatory: boolean;
  readonly createdById: EntityId;
}

export interface ActivitySummary {
  readonly id: EntityId;
  readonly title: string;
  readonly type: ActivityType;
  readonly status: ActivityStatus;
  readonly scheduledAt: Timestamp;
  readonly defaultPoints: number;
}

export interface ActivityFilter {
  readonly festivalYear?: string;
  readonly type?: ActivityType;
  readonly status?: ActivityStatus;
  readonly scope?: ScoreScope;
  readonly fromDate?: Timestamp;
  readonly toDate?: Timestamp;
}
