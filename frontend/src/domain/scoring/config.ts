import { CompetitionPlacement } from './enums';

export interface PlacementBonusConfig {
  readonly placement: CompetitionPlacement;
  readonly bonusPoints: number;
}

export interface ScoringConfiguration {
  readonly perfectQuizBonus: number;
  readonly quizPassingScorePercent: number;
  readonly perfectWeekRequiredDays: number;
  readonly attendancePointsPerSession: number;
  readonly placementBonuses: readonly PlacementBonusConfig[];
  readonly allowNegativeIndividualBalance: boolean;
  readonly allowNegativeTeamBalance: boolean;
}

export const DEFAULT_SCORING_CONFIG: ScoringConfiguration = {
  perfectQuizBonus: 20,
  quizPassingScorePercent: 50,
  perfectWeekRequiredDays: 5,
  attendancePointsPerSession: 100,
  placementBonuses: [
    { placement: CompetitionPlacement.First, bonusPoints: 100 },
    { placement: CompetitionPlacement.Second, bonusPoints: 50 },
    { placement: CompetitionPlacement.Third, bonusPoints: 25 },
  ],
  allowNegativeIndividualBalance: false,
  allowNegativeTeamBalance: false,
};

export const QUIZ_SCORING = {
  DEFAULT_TIME_LIMIT_MINUTES: 30,
  MIN_PASSING_SCORE_PERCENT: 50,
  PERFECT_SCORE_BONUS: 20,
} as const;

export const ATTENDANCE_SCORING = {
  POINTS_PER_LITURGY: 100,
  PERFECT_WEEK_BONUS: 150,
  PERFECT_WEEK_MIN_SESSIONS: 5,
} as const;
