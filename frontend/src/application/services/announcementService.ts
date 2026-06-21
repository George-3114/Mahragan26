import type { Announcement, CreateInput } from '../../domain';
import { AnnouncementPriority, AnnouncementType } from '../../domain';
import type { ApplicationContext } from '../context';

export interface PublishAnnouncementInput {
  title: string;
  content: string;
  type: AnnouncementType;
  priority?: AnnouncementPriority;
  authorId: string;
  targetTeamIds?: string[];
  expiresAt?: string;
}

export class AnnouncementService {
  constructor(private readonly ctx: ApplicationContext) {}

  async getPublished(): Promise<Announcement[]> {
    return this.ctx.repositories.announcements.findAll({ isPublished: true });
  }

  async getById(id: string): Promise<Announcement | null> {
    return this.ctx.repositories.announcements.findById(id);
  }

  async publishAnnouncement(input: PublishAnnouncementInput): Promise<Announcement> {
    const now = new Date().toISOString();
    const announcement = await this.ctx.repositories.announcements.create({
      title: input.title,
      content: input.content,
      type: input.type,
      priority: input.priority ?? AnnouncementPriority.Normal,
      authorId: input.authorId,
      targetTeamIds: input.targetTeamIds,
      expiresAt: input.expiresAt,
      isPublished: true,
      publishedAt: now,
    } as CreateInput<Announcement>);

    this.ctx.activityLog.add(`Announcement "${announcement.title}" published`);
    this.ctx.notifyChange();
    return announcement;
  }
}

export { AnnouncementType, AnnouncementPriority };
