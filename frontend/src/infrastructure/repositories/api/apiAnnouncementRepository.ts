import {
  AnnouncementPriority,
  AnnouncementType,
  buildPaginatedResult,
  normalizePagination,
  type Announcement,
  type AnnouncementFilter,
  type CreateInput,
  type PaginatedResult,
  type PaginationParams,
  type UpdateInput,
} from '../../../domain';
import type { AnnouncementRepositoryPort } from '../../../domain/ports';

const API_BASE = 'http://localhost:5001/api/announcements';

interface BackendAnnouncement {
  _id: string;
  title: string;
  content: string;
  priority?: string;
  isPublished?: boolean;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

function mapAnnouncement(item: BackendAnnouncement): Announcement {
  return {
    id: item._id,
    title: item.title,
    content: item.content,
    type: AnnouncementType.General,
    priority: (item.priority as AnnouncementPriority) ?? AnnouncementPriority.Normal,
    authorId: item.author ?? '',
    isPublished: item.isPublished ?? true,
    publishedAt: item.isPublished !== false ? item.createdAt : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toCreatePayload(data: CreateInput<Announcement>): Record<string, unknown> {
  return {
    title: data.title,
    content: data.content,
    priority: data.priority,
    isPublished: data.isPublished ?? true,
    author: data.authorId || undefined,
  };
}

function toUpdatePayload(data: UpdateInput<Announcement>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.content !== undefined) payload.content = data.content;
  if (data.priority !== undefined) payload.priority = data.priority;
  if (data.isPublished !== undefined) payload.isPublished = data.isPublished;
  if (data.authorId !== undefined) payload.author = data.authorId || undefined;

  return payload;
}

async function fetchAnnouncements(): Promise<BackendAnnouncement[]> {
  const response = await fetch(API_BASE);
  const result = await response.json();
  return result.data ?? [];
}

export class ApiAnnouncementRepository implements AnnouncementRepositoryPort {
  async findAll(filter?: AnnouncementFilter): Promise<Announcement[]> {
    const announcements = (await fetchAnnouncements()).map(mapAnnouncement);
    return this.applyFilter(announcements, filter);
  }

  async findById(id: string): Promise<Announcement | null> {
    const announcements = await this.findAll();
    return announcements.find((announcement) => announcement.id === id) ?? null;
  }

  async findMany(
    filter?: AnnouncementFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Announcement>> {
    const params = normalizePagination(pagination);
    const filtered = await this.findAll(filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<Announcement>): Promise<Announcement> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCreatePayload(data)),
    });
    const result = await response.json();
    return mapAnnouncement(result.data);
  }

  async update(id: string, data: UpdateInput<Announcement>): Promise<Announcement | null> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toUpdatePayload(data)),
    });
    const result = await response.json();
    if (!result.data) return null;
    return mapAnnouncement(result.data);
  }

  async delete(id: string): Promise<boolean> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  }

  async count(filter?: AnnouncementFilter): Promise<number> {
    const announcements = await this.findAll(filter);
    return announcements.length;
  }

  private applyFilter(items: Announcement[], filter?: AnnouncementFilter): Announcement[] {
    if (!filter) return items;

    return items.filter((announcement) => {
      if (filter.type && announcement.type !== filter.type) return false;
      if (filter.priority && announcement.priority !== filter.priority) return false;
      if (filter.isPublished !== undefined && announcement.isPublished !== filter.isPublished) {
        return false;
      }
      if (filter.teamId && announcement.targetTeamIds?.length) {
        return announcement.targetTeamIds.includes(filter.teamId);
      }
      return true;
    });
  }
}
