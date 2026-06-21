export enum IndividualScoreCategory {
  LiturgyAttendance = 'liturgy_attendance',
  Confession = 'confession',
  Participation = 'participation',
  PsalmMemorization = 'psalm_memorization',
  OnlineQuiz = 'online_quiz',
  BringFriend = 'bring_friend',
  PerfectWeek = 'perfect_week',
  Volunteer = 'volunteer',
  EarlyAttendance = 'early_attendance',
  Custom = 'custom',
}

export enum TeamScoreCategory {
  Quiz = 'quiz',
  LiturgyAttendance = 'liturgy_attendance',
  FlagCompetition = 'flag_competition',
  Presentation = 'presentation',
  GeniusCompetition = 'genius_competition',
  SportsCompetition = 'sports_competition',
  HymnMemorization = 'hymn_memorization',
  PsalmMemorization = 'psalm_memorization',
  BestBehavior = 'best_behavior',
  Custom = 'custom',
}

export enum PenaltyType {
  NoiseSmall = 'noise_small',
  NoiseMedium = 'noise_medium',
  NoiseLarge = 'noise_large',
  Misbehavior = 'misbehavior',
  MissingActivity = 'missing_activity',
  Custom = 'custom',
}

export enum ScoreEntryType {
  Award = 'award',
  Penalty = 'penalty',
  Adjustment = 'adjustment',
  Bonus = 'bonus',
}

export enum CompetitionPlacement {
  First = 1,
  Second = 2,
  Third = 3,
}
