import type { EntityId } from '../common';
import { ScoreScope } from '../common';
import {
  IndividualScoreCategory,
  PenaltyType,
  ScoreEntryType,
  TeamScoreCategory,
} from './enums';
import {
  INDIVIDUAL_SCORE_CATEGORIES,
  PENALTY_TYPES,
  TEAM_SCORE_CATEGORIES,
  type TeamCategoryBreakdownKey,
} from './categories';
import {
  DEFAULT_SCORING_CONFIG,
  type ScoringConfiguration,
} from './config';
import { CompetitionPlacement } from './enums';

export interface ScoreLineItem {
  readonly points: number;
  readonly isPenalty: boolean;
}

export interface TeamCategoryBreakdown {
  readonly quiz: number;
  readonly liturgy: number;
  readonly sports: number;
  readonly hymn: number;
  readonly psalm: number;
  readonly penalty: number;
}

const TEAM_CATEGORY_MAP: Partial<
  Record<TeamScoreCategory, TeamCategoryBreakdownKey>
> = {
  [TeamScoreCategory.Quiz]: 'quiz',
  [TeamScoreCategory.LiturgyAttendance]: 'liturgy',
  [TeamScoreCategory.SportsCompetition]: 'sports',
  [TeamScoreCategory.HymnMemorization]: 'hymn',
  [TeamScoreCategory.PsalmMemorization]: 'psalm',
};

export function createEmptyTeamCategoryBreakdown(): TeamCategoryBreakdown {
  return {
    quiz: 0,
    liturgy: 0,
    sports: 0,
    hymn: 0,
    psalm: 0,
    penalty: 0,
  };
}

export function getCategoryLabel(
  category: IndividualScoreCategory | TeamScoreCategory | PenaltyType,
): string {
  if (category in INDIVIDUAL_SCORE_CATEGORIES) {
    return INDIVIDUAL_SCORE_CATEGORIES[category as IndividualScoreCategory].label;
  }
  if (category in TEAM_SCORE_CATEGORIES) {
    return TEAM_SCORE_CATEGORIES[category as TeamScoreCategory].label;
  }
  if (category in PENALTY_TYPES) {
    return PENALTY_TYPES[category as PenaltyType].label;
  }
  return category;
}

export function getDefaultPoints(
  category: IndividualScoreCategory | TeamScoreCategory | PenaltyType,
): number {
  if (category in INDIVIDUAL_SCORE_CATEGORIES) {
    return INDIVIDUAL_SCORE_CATEGORIES[category as IndividualScoreCategory]
      .defaultPoints;
  }
  if (category in TEAM_SCORE_CATEGORIES) {
    return TEAM_SCORE_CATEGORIES[category as TeamScoreCategory].defaultPoints;
  }
  if (category in PENALTY_TYPES) {
    return PENALTY_TYPES[category as PenaltyType].defaultPoints;
  }
  return 0;
}

export function resolveSignedPoints(
  points: number,
  entryType: ScoreEntryType,
): number {
  if (entryType === ScoreEntryType.Penalty) {
    return -Math.abs(points);
  }
  return Math.abs(points);
}

export function sumScorePoints(items: readonly ScoreLineItem[]): number {
  return items.reduce(
    (total, item) => total + (item.isPenalty ? -Math.abs(item.points) : item.points),
    0,
  );
}

export function calculateNetPoints(
  items: readonly ScoreLineItem[],
  config: ScoringConfiguration = DEFAULT_SCORING_CONFIG,
  scope: ScoreScope = ScoreScope.Individual,
): number {
  const net = sumScorePoints(items);
  const allowNegative =
    scope === ScoreScope.Team
      ? config.allowNegativeTeamBalance
      : config.allowNegativeIndividualBalance;
  return allowNegative ? net : Math.max(0, net);
}

export function aggregateTeamCategoryBreakdown(
  entries: readonly {
    category: TeamScoreCategory;
    points: number;
    isPenalty: boolean;
  }[],
): TeamCategoryBreakdown {
  const breakdown: Record<keyof TeamCategoryBreakdown, number> = {
    quiz: 0,
    liturgy: 0,
    sports: 0,
    hymn: 0,
    psalm: 0,
    penalty: 0,
  };

  for (const entry of entries) {
    const signedPoints = entry.isPenalty ? -Math.abs(entry.points) : entry.points;
    const key = TEAM_CATEGORY_MAP[entry.category];

    if (key) {
      breakdown[key] += signedPoints;
      continue;
    }

    if (entry.isPenalty) {
      breakdown.penalty += Math.abs(entry.points);
    }
  }

  return breakdown;
}

export function calculateTeamTotalFromBreakdown(
  breakdown: TeamCategoryBreakdown,
): number {
  const gross =
    breakdown.quiz +
    breakdown.liturgy +
    breakdown.sports +
    breakdown.hymn +
    breakdown.psalm;
  return Math.max(0, gross - breakdown.penalty);
}

export function getPlacementBonus(
  placement: CompetitionPlacement,
  config: ScoringConfiguration = DEFAULT_SCORING_CONFIG,
): number {
  const match = config.placementBonuses.find((b) => b.placement === placement);
  return match?.bonusPoints ?? 0;
}

export interface RankedEntity {
  readonly id: EntityId;
  readonly totalPoints: number;
}

export interface RankedResult<T extends RankedEntity> {
  readonly entity: T;
  readonly rank: number;
}

export function rankByPoints<T extends RankedEntity>(
  entities: readonly T[],
): Array<T & { rank: number }> {
  const sorted = [...entities].sort((a, b) => b.totalPoints - a.totalPoints);
  let currentRank = 0;
  let previousPoints: number | null = null;

  return sorted.map((entity, index) => {
    if (previousPoints === null || entity.totalPoints !== previousPoints) {
      currentRank = index + 1;
      previousPoints = entity.totalPoints;
    }
    return { ...entity, rank: currentRank };
  });
}

export function isValidScorePoints(points: number): boolean {
  return Number.isFinite(points) && points >= 0;
}

export function calculateQuizScorePercent(
  correctCount: number,
  totalQuestions: number,
): number {
  if (totalQuestions <= 0) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
}

export function isQuizPassing(
  scorePercent: number,
  config: ScoringConfiguration = DEFAULT_SCORING_CONFIG,
): boolean {
  return scorePercent >= config.quizPassingScorePercent;
}

export function calculateQuizAwardPoints(
  scorePercent: number,
  maxPoints: number,
  config: ScoringConfiguration = DEFAULT_SCORING_CONFIG,
): number {
  if (!isQuizPassing(scorePercent, config)) return 0;
  const base = Math.round((scorePercent / 100) * maxPoints);
  const bonus = scorePercent === 100 ? config.perfectQuizBonus : 0;
  return base + bonus;
}
