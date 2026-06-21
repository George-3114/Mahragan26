import type { EntityId, Timestamp } from '../common';
import type { Announcement } from './entity';
import { AnnouncementPriority } from './enums';

const PRIORITY_WEIGHT: Record<AnnouncementPriority, number> = {
  [AnnouncementPriority.Low]: 1,
  [AnnouncementPriority.Normal]: 2,
  [AnnouncementPriority.High]: 3,
  [AnnouncementPriority.Urgent]: 4,
};

export function isAnnouncementVisible(
  announcement: Announcement,
  now: Timestamp = new Date().toISOString(),
): boolean {
  if (!announcement.isPublished) return false;
  if (announcement.expiresAt && new Date(announcement.expiresAt) < new Date(now)) {
    return false;
  }
  return true;
}

export function isAnnouncementForTeam(
  announcement: Announcement,
  teamId: EntityId,
): boolean {
  if (!announcement.targetTeamIds || announcement.targetTeamIds.length === 0) {
    return true;
  }
  return announcement.targetTeamIds.includes(teamId);
}

export function filterVisibleAnnouncements(
  announcements: readonly Announcement[],
  teamId?: EntityId,
  now?: Timestamp,
): Announcement[] {
  return announcements
    .filter((a) => isAnnouncementVisible(a, now))
    .filter((a) => (teamId ? isAnnouncementForTeam(a, teamId) : true));
}

export function sortAnnouncementsByPriority(
  announcements: readonly Announcement[],
): Announcement[] {
  return [...announcements].sort((a, b) => {
    const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
