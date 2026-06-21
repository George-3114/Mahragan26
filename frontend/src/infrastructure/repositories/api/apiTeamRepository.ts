import {
  FESTIVAL,
  TeamStatus,
  buildPaginatedResult,
  createEmptyTeamCategoryBreakdown,
  normalizePagination,
  type CreateInput,
  type PaginatedResult,
  type PaginationParams,
  type Team,
  type TeamCategoryBreakdown,
  type TeamFilter,
  type UpdateInput,
} from '../../../domain';
import type { TeamRepositoryPort } from '../../../domain/ports';

const API_BASE = 'http://localhost:5001/api/teams';

interface BackendCategoryPoints {
  liturgy?: number;
  hymns?: number;
  sports?: number;
  quizzes?: number;
  attendance?: number;
}

interface BackendTeam {
  _id: string;
  name: string;
  color?: string;
  logoUrl?: string;
  flagUrl?: string;
  motto?: string;
  description?: string;
  memberCount?: number;
  totalPoints?: number;
  categoryPoints?: BackendCategoryPoints;
  festivalYear?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

function mapCategoryPoints(points?: BackendCategoryPoints): TeamCategoryBreakdown {
  const empty = createEmptyTeamCategoryBreakdown();
  if (!points) return empty;

  return {
    quiz: points.quizzes ?? empty.quiz,
    liturgy: points.liturgy ?? empty.liturgy,
    sports: points.sports ?? empty.sports,
    hymn: points.hymns ?? empty.hymn,
    psalm: empty.psalm,
    penalty: empty.penalty,
  };
}

function mapTeam(item: BackendTeam): Team {
  return {
    id: item._id,
    name: item.name,
    color: item.color ?? '#3B82F6',
    logoUrl: item.logoUrl || undefined,
    flagUrl: item.flagUrl || undefined,
    motto: item.motto || undefined,
    description: item.description || undefined,
    status: (item.status as TeamStatus) ?? TeamStatus.Active,
    memberCount: item.memberCount ?? 0,
    totalPoints: item.totalPoints ?? 0,
    categoryPoints: mapCategoryPoints(item.categoryPoints),
    festivalYear: item.festivalYear ?? FESTIVAL.CURRENT_YEAR,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

async function fetchTeams(): Promise<BackendTeam[]> {
  const response = await fetch(API_BASE);
  const result = await response.json();
  return result.data ?? [];
}

export class ApiTeamRepository implements TeamRepositoryPort {
  async findByFestivalYear(festivalYear: string): Promise<Team[]> {
    const teams = await this.findAll();
    return teams.filter((team) => team.festivalYear === festivalYear);
  }

  async findAll(_filter?: TeamFilter): Promise<Team[]> {
    const teams = (await fetchTeams()).map(mapTeam);
    return this.applyFilter(teams, _filter);
  }

  async findById(id: string): Promise<Team | null> {
    const response = await fetch(`${API_BASE}/${id}`);
    const result = await response.json();
    if (!result.data) {
      const teams = await this.findAll();
      return teams.find((team) => team.id === id) ?? null;
    }
    return mapTeam(result.data);
  }

  async findMany(
    filter?: TeamFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Team>> {
    const params = normalizePagination(pagination);
    const filtered = await this.findAll(filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<Team>): Promise<Team> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return mapTeam(result.data);
  }

  async update(id: string, data: UpdateInput<Team>): Promise<Team | null> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.data) return null;
    return mapTeam(result.data);
  }

  async delete(id: string): Promise<boolean> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  }

  async count(filter?: TeamFilter): Promise<number> {
    const teams = await this.findAll(filter);
    return teams.length;
  }

  private applyFilter(items: Team[], filter?: TeamFilter): Team[] {
    if (!filter) return items;

    return items.filter((team) => {
      if (filter.festivalYear && team.festivalYear !== filter.festivalYear) return false;
      if (filter.status && team.status !== filter.status) return false;
      if (filter.search && !team.name.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }
}
