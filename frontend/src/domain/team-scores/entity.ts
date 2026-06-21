import type { EntityId, FestivalScopedEntity } from '../common';
import {
  CompetitionPlacement,
  PenaltyType,
  ScoreEntryType,
  TeamScoreCategory,
} from '../scoring';

export interface TeamScore extends FestivalScopedEntity {
  readonly teamId: EntityId;
  readonly category: TeamScoreCategory | PenaltyType;
  readonly entryType: ScoreEntryType;
  readonly points: number;
  readonly description: string;
  readonly activityId?: EntityId;
  readonly placement?: CompetitionPlacement;
  readonly awardedById: EntityId;
  readonly isPenalty: boolean;
}

export interface TeamScoreSummary {
  readonly teamId: EntityId;
  readonly totalPoints: number;
  readonly penaltyTotal: number;
  readonly awardTotal: number;
  readonly entryCount: number;
}

export interface TeamScoreFilter {
  readonly festivalYear?: string;
  readonly teamId?: EntityId;
  readonly category?: TeamScoreCategory | PenaltyType;
  readonly entryType?: ScoreEntryType;
  readonly activityId?: EntityId;
  readonly isPenalty?: boolean;
}

export interface AwardTeamScoreInput {
  readonly teamId: EntityId;
  readonly category: TeamScoreCategory | PenaltyType;
  readonly entryType: ScoreEntryType;
  readonly points: number;
  readonly description: string;
  readonly activityId?: EntityId;
  readonly placement?: CompetitionPlacement;
  readonly awardedById: EntityId;
  readonly festivalYear: string;
}

export { CompetitionPlacement, TeamScoreCategory, PenaltyType, ScoreEntryType };
