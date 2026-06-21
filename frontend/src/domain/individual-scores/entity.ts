import type { EntityId, FestivalScopedEntity } from '../common';
import {
  IndividualScoreCategory,
  PenaltyType,
  ScoreEntryType,
  type CompetitionPlacement,
} from '../scoring';

export interface IndividualScore extends FestivalScopedEntity {
  readonly memberId: EntityId;
  readonly userId: EntityId;
  readonly teamId: EntityId;
  readonly category: IndividualScoreCategory | PenaltyType;
  readonly entryType: ScoreEntryType;
  readonly points: number;
  readonly description: string;
  readonly activityId?: EntityId;
  readonly quizId?: EntityId;
  readonly awardedById: EntityId;
  readonly isPenalty: boolean;
}

export interface IndividualScoreSummary {
  readonly memberId: EntityId;
  readonly totalPoints: number;
  readonly penaltyTotal: number;
  readonly awardTotal: number;
  readonly entryCount: number;
}

export interface ScoreFilter {
  readonly festivalYear?: string;
  readonly teamId?: EntityId;
  readonly memberId?: EntityId;
  readonly userId?: EntityId;
  readonly category?: IndividualScoreCategory | PenaltyType;
  readonly entryType?: ScoreEntryType;
  readonly activityId?: EntityId;
  readonly isPenalty?: boolean;
}

/** Input for awarding a new individual score entry. */
export interface AwardIndividualScoreInput {
  readonly memberId: EntityId;
  readonly userId: EntityId;
  readonly teamId: EntityId;
  readonly category: IndividualScoreCategory | PenaltyType;
  readonly entryType: ScoreEntryType;
  readonly points: number;
  readonly description: string;
  readonly activityId?: EntityId;
  readonly quizId?: EntityId;
  readonly awardedById: EntityId;
  readonly festivalYear: string;
}

export type { CompetitionPlacement };
