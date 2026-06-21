import type { EntityId, AuditableEntity, Publishable, Timestamp } from '../common';
import { AnnouncementPriority, AnnouncementType } from './enums';

export interface Announcement extends AuditableEntity, Publishable {
  readonly title: string;
  readonly content: string;
  readonly type: AnnouncementType;
  readonly priority: AnnouncementPriority;
  readonly authorId: EntityId;
  readonly expiresAt?: Timestamp;
  readonly targetTeamIds?: readonly EntityId[];
}

export interface AnnouncementSummary {
  readonly id: EntityId;
  readonly title: string;
  readonly type: AnnouncementType;
  readonly priority: AnnouncementPriority;
  readonly publishedAt?: Timestamp;
}

export interface AnnouncementFilter {
  readonly type?: AnnouncementType;
  readonly priority?: AnnouncementPriority;
  readonly isPublished?: boolean;
  readonly teamId?: EntityId;
}
