import { BadgeCategory } from './enums';

export const BADGE_CATEGORY_LABELS: Readonly<Record<BadgeCategory, string>> = {
  [BadgeCategory.TopPerformer]: 'Top Performer',
  [BadgeCategory.TeamChampion]: 'Team Champion',
  [BadgeCategory.AttendanceStreak]: 'Attendance Streak',
  [BadgeCategory.QuizMaster]: 'Quiz Master',
  [BadgeCategory.PsalmHero]: 'Psalm Hero',
  [BadgeCategory.HymnHero]: 'Hymn Hero',
  [BadgeCategory.Volunteer]: 'Volunteer',
  [BadgeCategory.Special]: 'Special',
};

export const DEFAULT_BADGE_COLORS: readonly string[] = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#6366F1',
  '#EC4899',
  '#14B8A6',
  '#8B5CF6',
];
