import {
  FESTIVAL,
  Grade,
  TeamMemberRole,
  TeamMemberStatus,
  buildPaginatedResult,
  normalizePagination,
  type CreateInput,
  type PaginatedResult,
  type PaginationParams,
  type TeamMember,
  type TeamMemberFilter,
  type UpdateInput,
} from '../../../domain';
import type { TeamMemberRepositoryPort } from '../../../domain/ports';

const API_BASE = 'http://localhost:5001/api/users';

interface BackendUser {
  _id: string;
  fullName: string;
  username?: string;
  grade?: string;
  team?: string | { _id: string } | null;
  totalPoints?: number;
  createdAt: string;
  updatedAt: string;
}

function mapGrade(grade?: string): Grade {
  if (grade === 'Grade5') return Grade.Grade5;
  if (grade === 'Grade6') return Grade.Grade6;
  return Grade.Grade6;
}

function toGradeBackend(grade: Grade): string {
  return grade === Grade.Grade5 ? 'Grade5' : 'Grade6';
}

function resolveTeamId(team?: BackendUser['team']): string {
  if (!team) return '';
  if (typeof team === 'string') return team;
  return team._id;
}

function mapUserToTeamMember(user: BackendUser): TeamMember {
  return {
    id: user._id,
    userId: user._id,
    teamId: resolveTeamId(user.team),
    displayName: user.fullName,
    grade: mapGrade(user.grade),
    role: TeamMemberRole.Member,
    status: TeamMemberStatus.Active,
    totalPoints: user.totalPoints ?? 0,
    joinedAt: user.createdAt,
    festivalYear: FESTIVAL.CURRENT_YEAR,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function toCreatePayload(data: CreateInput<TeamMember>): Record<string, unknown> {
  const username =
    data.displayName.toLowerCase().replace(/\s+/g, '.').slice(0, 20) +
    Math.floor(Math.random() * 1000);

  return {
    fullName: data.displayName,
    username,
    password: 'ChangeMe123!',
    grade: toGradeBackend(data.grade),
    team: data.teamId || null,
  };
}

function toUpdatePayload(data: UpdateInput<TeamMember>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.displayName !== undefined) payload.fullName = data.displayName;
  if (data.grade !== undefined) payload.grade = toGradeBackend(data.grade);
  if (data.teamId !== undefined) payload.team = data.teamId || null;
  if (data.totalPoints !== undefined) payload.totalPoints = data.totalPoints;

  return payload;
}

async function fetchUsers(): Promise<BackendUser[]> {
  const response = await fetch(API_BASE);
  const result = await response.json();
  return result.data ?? [];
}

export class ApiTeamMemberRepository implements TeamMemberRepositoryPort {
  async findAll(filter?: TeamMemberFilter): Promise<TeamMember[]> {
    const members = (await fetchUsers()).map(mapUserToTeamMember);
    return this.applyFilter(members, filter);
  }

  async findById(id: string): Promise<TeamMember | null> {
    const members = await this.findAll();
    return members.find((member) => member.id === id) ?? null;
  }

  async findMany(
    filter?: TeamMemberFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<TeamMember>> {
    const params = normalizePagination(pagination);
    const filtered = await this.findAll(filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<TeamMember>): Promise<TeamMember> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCreatePayload(data)),
    });
    const result = await response.json();
    return mapUserToTeamMember(result.data);
  }

  async update(id: string, data: UpdateInput<TeamMember>): Promise<TeamMember | null> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toUpdatePayload(data)),
    });
    const result = await response.json();
    if (!result.data) return null;
    return mapUserToTeamMember(result.data);
  }

  async delete(id: string): Promise<boolean> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  }

  async count(filter?: TeamMemberFilter): Promise<number> {
    const members = await this.findAll(filter);
    return members.length;
  }

  async findByTeamId(teamId: string): Promise<TeamMember[]> {
    return this.findAll({ teamId });
  }

  async findByUserId(userId: string): Promise<TeamMember | null> {
    const members = await this.findAll({ userId });
    return members[0] ?? null;
  }

  private applyFilter(items: TeamMember[], filter?: TeamMemberFilter): TeamMember[] {
    if (!filter) return items;

    return items.filter((member) => {
      if (filter.festivalYear && member.festivalYear !== filter.festivalYear) return false;
      if (filter.teamId && member.teamId !== filter.teamId) return false;
      if (filter.userId && member.userId !== filter.userId) return false;
      if (filter.grade && member.grade !== filter.grade) return false;
      if (filter.status && member.status !== filter.status) return false;
      return true;
    });
  }
}
