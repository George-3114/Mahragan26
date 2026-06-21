import {
  IndividualScoreCategory,
  PenaltyType,
  TeamScoreCategory,
} from './enums';

export interface ScoreCategoryDefinition {
  readonly category: IndividualScoreCategory | TeamScoreCategory | PenaltyType;
  readonly label: string;
  readonly defaultPoints: number;
  readonly description?: string;
}

export const INDIVIDUAL_SCORE_CATEGORIES: Readonly<
  Record<IndividualScoreCategory, ScoreCategoryDefinition>
> = {
  [IndividualScoreCategory.LiturgyAttendance]: {
    category: IndividualScoreCategory.LiturgyAttendance,
    label: 'Liturgy Attendance',
    defaultPoints: 100,
  },
  [IndividualScoreCategory.Confession]: {
    category: IndividualScoreCategory.Confession,
    label: 'Confession',
    defaultPoints: 250,
  },
  [IndividualScoreCategory.Participation]: {
    category: IndividualScoreCategory.Participation,
    label: 'Participation',
    defaultPoints: 50,
  },
  [IndividualScoreCategory.PsalmMemorization]: {
    category: IndividualScoreCategory.PsalmMemorization,
    label: 'Psalm Memorization',
    defaultPoints: 50,
  },
  [IndividualScoreCategory.OnlineQuiz]: {
    category: IndividualScoreCategory.OnlineQuiz,
    label: 'Online Quiz',
    defaultPoints: 50,
  },
  [IndividualScoreCategory.BringFriend]: {
    category: IndividualScoreCategory.BringFriend,
    label: 'Bring a Friend',
    defaultPoints: 100,
  },
  [IndividualScoreCategory.PerfectWeek]: {
    category: IndividualScoreCategory.PerfectWeek,
    label: 'Perfect Week',
    defaultPoints: 150,
  },
  [IndividualScoreCategory.Volunteer]: {
    category: IndividualScoreCategory.Volunteer,
    label: 'Volunteer Award',
    defaultPoints: 100,
  },
  [IndividualScoreCategory.EarlyAttendance]: {
    category: IndividualScoreCategory.EarlyAttendance,
    label: 'Early Attendance',
    defaultPoints: 25,
  },
  [IndividualScoreCategory.Custom]: {
    category: IndividualScoreCategory.Custom,
    label: 'Custom',
    defaultPoints: 0,
  },
};

export const TEAM_SCORE_CATEGORIES: Readonly<
  Record<TeamScoreCategory, ScoreCategoryDefinition>
> = {
  [TeamScoreCategory.Quiz]: {
    category: TeamScoreCategory.Quiz,
    label: 'Quiz Competition',
    defaultPoints: 50,
  },
  [TeamScoreCategory.LiturgyAttendance]: {
    category: TeamScoreCategory.LiturgyAttendance,
    label: 'Monthly Liturgy',
    defaultPoints: 100,
  },
  [TeamScoreCategory.FlagCompetition]: {
    category: TeamScoreCategory.FlagCompetition,
    label: 'Flag Competition',
    defaultPoints: 100,
  },
  [TeamScoreCategory.Presentation]: {
    category: TeamScoreCategory.Presentation,
    label: 'Presentation',
    defaultPoints: 100,
  },
  [TeamScoreCategory.GeniusCompetition]: {
    category: TeamScoreCategory.GeniusCompetition,
    label: 'Genius Competition',
    defaultPoints: 700,
  },
  [TeamScoreCategory.SportsCompetition]: {
    category: TeamScoreCategory.SportsCompetition,
    label: 'Sports Competition',
    defaultPoints: 600,
  },
  [TeamScoreCategory.HymnMemorization]: {
    category: TeamScoreCategory.HymnMemorization,
    label: 'Hymn Memorization',
    defaultPoints: 300,
  },
  [TeamScoreCategory.PsalmMemorization]: {
    category: TeamScoreCategory.PsalmMemorization,
    label: 'Psalm Memorization',
    defaultPoints: 100,
  },
  [TeamScoreCategory.BestBehavior]: {
    category: TeamScoreCategory.BestBehavior,
    label: 'Best Behavior Team',
    defaultPoints: 200,
  },
  [TeamScoreCategory.Custom]: {
    category: TeamScoreCategory.Custom,
    label: 'Custom',
    defaultPoints: 0,
  },
};

export const PENALTY_TYPES: Readonly<Record<PenaltyType, ScoreCategoryDefinition>> = {
  [PenaltyType.NoiseSmall]: {
    category: PenaltyType.NoiseSmall,
    label: 'Noise (-10)',
    defaultPoints: 10,
  },
  [PenaltyType.NoiseMedium]: {
    category: PenaltyType.NoiseMedium,
    label: 'Noise (-20)',
    defaultPoints: 20,
  },
  [PenaltyType.NoiseLarge]: {
    category: PenaltyType.NoiseLarge,
    label: 'Noise (-30)',
    defaultPoints: 30,
  },
  [PenaltyType.Misbehavior]: {
    category: PenaltyType.Misbehavior,
    label: 'Misbehavior (-50)',
    defaultPoints: 50,
  },
  [PenaltyType.MissingActivity]: {
    category: PenaltyType.MissingActivity,
    label: 'Missing Activity (-100)',
    defaultPoints: 100,
  },
  [PenaltyType.Custom]: {
    category: PenaltyType.Custom,
    label: 'Custom Penalty',
    defaultPoints: 0,
  },
};

/** Maps team score categories to denormalized team category breakdown keys. */
export const TEAM_CATEGORY_BREAKDOWN_KEYS = {
  [TeamScoreCategory.Quiz]: 'quiz',
  [TeamScoreCategory.LiturgyAttendance]: 'liturgy',
  [TeamScoreCategory.SportsCompetition]: 'sports',
  [TeamScoreCategory.HymnMemorization]: 'hymn',
  [TeamScoreCategory.PsalmMemorization]: 'psalm',
} as const;

export type TeamCategoryBreakdownKey =
  (typeof TEAM_CATEGORY_BREAKDOWN_KEYS)[keyof typeof TEAM_CATEGORY_BREAKDOWN_KEYS] | 'penalty';
