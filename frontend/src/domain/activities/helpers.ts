import type { Timestamp } from '../common';
import { ACTIVITY_STATUS_TRANSITIONS, ACTIVITY_TYPE_LABELS } from './constants';
import type { Activity } from './entity';
import { ActivityStatus, ActivityType } from './enums';

export function getActivityTypeLabel(type: ActivityType): string {
  return ACTIVITY_TYPE_LABELS[type];
}

export function canTransitionActivityStatus(
  current: ActivityStatus,
  next: ActivityStatus,
): boolean {
  return ACTIVITY_STATUS_TRANSITIONS[current].includes(next);
}

export function isActivityUpcoming(activity: Activity, now: Timestamp = new Date().toISOString()): boolean {
  return (
    activity.status === ActivityStatus.Upcoming &&
    new Date(activity.scheduledAt).getTime() > new Date(now).getTime()
  );
}

export function isActivityActive(activity: Activity, now: Timestamp = new Date().toISOString()): boolean {
  if (activity.status !== ActivityStatus.Active) return false;
  const start = new Date(activity.scheduledAt).getTime();
  const end = activity.endsAt ? new Date(activity.endsAt).getTime() : Infinity;
  const current = new Date(now).getTime();
  return current >= start && current <= end;
}

export function filterUpcomingActivities(activities: readonly Activity[]): Activity[] {
  return activities
    .filter((a) => a.status === ActivityStatus.Upcoming || a.status === ActivityStatus.Active)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
}

export function filterActivitiesByType(
  activities: readonly Activity[],
  type: ActivityType,
): Activity[] {
  return activities.filter((activity) => activity.type === type);
}
