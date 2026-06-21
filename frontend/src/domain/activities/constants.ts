import { ActivityStatus, ActivityType } from './enums';

export const ACTIVITY_TYPE_LABELS: Readonly<Record<ActivityType, string>> = {
  [ActivityType.Liturgy]: 'Liturgy',
  [ActivityType.PsalmMemorization]: 'Psalm Memorization',
  [ActivityType.HymnMemorization]: 'Hymn Memorization',
  [ActivityType.Sports]: 'Sports',
  [ActivityType.Quiz]: 'Quiz',
  [ActivityType.Presentation]: 'Presentation',
  [ActivityType.FlagCompetition]: 'Flag Competition',
  [ActivityType.GeniusCompetition]: 'Genius Competition',
  [ActivityType.Confession]: 'Confession',
  [ActivityType.Volunteer]: 'Volunteer',
  [ActivityType.General]: 'General',
};

export const ACTIVITY_STATUS_TRANSITIONS: Readonly<
  Record<ActivityStatus, readonly ActivityStatus[]>
> = {
  [ActivityStatus.Draft]: [ActivityStatus.Upcoming, ActivityStatus.Cancelled],
  [ActivityStatus.Upcoming]: [ActivityStatus.Active, ActivityStatus.Cancelled],
  [ActivityStatus.Active]: [ActivityStatus.Completed, ActivityStatus.Cancelled],
  [ActivityStatus.Completed]: [],
  [ActivityStatus.Cancelled]: [],
};
