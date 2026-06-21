import {
  FESTIVAL,
  PenaltyType,
  ScoreEntryType,
  TeamScoreCategory,
  buildPaginatedResult,
  normalizePagination,
  type CreateInput,
  type PaginatedResult,
  type PaginationParams,
  type TeamScore,
  type TeamScoreFilter,
  type UpdateInput,
} from '../../../domain';
import type { TeamScoreRepositoryPort } from '../../../domain/ports';

const API_BASE = 'http://localhost:5001/api/team-scores';

interface BackendTeam {
  _id: string;
  name?: string;
}

interface BackendAwardedBy {
  _id: string;
  fullName?: string;
}

interface BackendTeamScore {
  _id: string;
  team: string | BackendTeam;
  category: string;
  points: number;
  description: string;
  awardedBy: string | BackendAwardedBy;
  createdAt: string;
  updatedAt: string;
}

const BACKEND_TO_CATEGORY: Record<string, TeamScoreCategory | PenaltyType> = {
  QUIZ: TeamScoreCategory.Quiz,
  MONTHLY_LITURGY: TeamScoreCategory.LiturgyAttendance,
  FLAG: TeamScoreCategory.FlagCompetition,
  PRESENTATION: TeamScoreCategory.Presentation,
  ABKARA: TeamScoreCategory.GeniusCompetition,
  ATTENDANCE: TeamScoreCategory.LiturgyAttendance,
  SPIRIT: TeamScoreCategory.BestBehavior,
  DISCIPLINE: PenaltyType.Custom,
  SPORTS: TeamScoreCategory.SportsCompetition,
  PSALM: TeamScoreCategory.PsalmMemorization,
  HYMN: TeamScoreCategory.HymnMemorization,
  TEAM_OF_TWO_WEEKS: TeamScoreCategory.Custom,
  BONUS: TeamScoreCategory.Custom,
  PENALTY: PenaltyType.Custom,
};

const CATEGORY_TO_BACKEND: Partial<Record<TeamScoreCategory, string>> = {
  [TeamScoreCategory.Quiz]: 'QUIZ',
  [TeamScoreCategory.LiturgyAttendance]: 'MONTHLY_LITURGY',
  [TeamScoreCategory.FlagCompetition]: 'FLAG',
  [TeamScoreCategory.Presentation]: 'PRESENTATION',
  [TeamScoreCategory.GeniusCompetition]: 'ABKARA',
  [TeamScoreCategory.SportsCompetition]: 'SPORTS',
  [TeamScoreCategory.HymnMemorization]: 'HYMN',
  [TeamScoreCategory.PsalmMemorization]: 'PSALM',
  [TeamScoreCategory.BestBehavior]: 'SPIRIT',
  [TeamScoreCategory.Custom]: 'BONUS',
};

function resolveId(value: string | { _id: string }): string {
  return typeof value === 'string' ? value : value._id;
}

function mapCategory(category: string): TeamScoreCategory | PenaltyType {
  return BACKEND_TO_CATEGORY[category] ?? TeamScoreCategory.Custom;
}

function toBackendCategory(
  category: TeamScoreCategory | PenaltyType,
  isPenalty: boolean,
): string {
  if (isPenalty) return 'PENALTY';
  if (category in CATEGORY_TO_BACKEND) {
    return CATEGORY_TO_BACKEND[category as TeamScoreCategory] ?? 'BONUS';
  }
  return 'BONUS';
}

function mapTeamScore(item: BackendTeamScore): TeamScore {
  const isPenalty = item.category === 'PENALTY' || item.category === 'DISCIPLINE';

  return {
    id: item._id,
    teamId: resolveId(item.team),
    category: mapCategory(item.category),
    entryType: isPenalty ? ScoreEntryType.Penalty : ScoreEntryType.Award,
    points: item.points,
    description: item.description,
    awardedById: resolveId(item.awardedBy),
    isPenalty,
    festivalYear: FESTIVAL.CURRENT_YEAR,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toCreatePayload(data: CreateInput<TeamScore>): Record<string, unknown> {
  return {
    teamId: data.teamId,
    category: toBackendCategory(data.category, data.isPenalty),
    points: data.points,
    description: data.description,
  };
}

function toUpdatePayload(data: UpdateInput<TeamScore>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.teamId !== undefined) payload.teamId = data.teamId;
  if (data.category !== undefined || data.isPenalty !== undefined) {
    const isPenalty = data.isPenalty ?? false;
    const category = data.category ?? TeamScoreCategory.Custom;
    payload.category = toBackendCategory(category, isPenalty);
  }
  if (data.points !== undefined) payload.points = data.points;
  if (data.description !== undefined) payload.description = data.description;

  return payload;
}

async function fetchScores(): Promise<BackendTeamScore[]> {
  const response = await fetch(API_BASE);
  const result = await response.json();
  return result.data ?? [];
}

export class ApiTeamScoreRepository implements TeamScoreRepositoryPort {
  async findAll(filter?: TeamScoreFilter): Promise<TeamScore[]> {
    const scores = (await fetchScores()).map(mapTeamScore);
    return this.applyFilter(scores, filter);
  }

  async findById(id: string): Promise<TeamScore | null> {
    const scores = await this.findAll();
    return scores.find((score) => score.id === id) ?? null;
  }

  async findMany(
    filter?: TeamScoreFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<TeamScore>> {
    const params = normalizePagination(pagination);
    const filtered = await this.findAll(filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<TeamScore>): Promise<TeamScore> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCreatePayload(data)),
    });
    const result = await response.json();
    return mapTeamScore(result.data);
  }

  async update(id: string, data: UpdateInput<TeamScore>): Promise<TeamScore | null> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toUpdatePayload(data)),
    });
    const result = await response.json();
    if (!result.data) return null;
    return mapTeamScore(result.data);
  }

  async delete(id: string): Promise<boolean> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  }

  async count(filter?: TeamScoreFilter): Promise<number> {
    const scores = await this.findAll(filter);
    return scores.length;
  }

  async findByTeamId(teamId: string): Promise<TeamScore[]> {
    return this.findAll({ teamId });
  }

  private applyFilter(items: TeamScore[], filter?: TeamScoreFilter): TeamScore[] {
    if (!filter) return items;

    return items.filter((score) => {
      if (filter.festivalYear && score.festivalYear !== filter.festivalYear) return false;
      if (filter.teamId && score.teamId !== filter.teamId) return false;
      if (filter.category && score.category !== filter.category) return false;
      if (filter.entryType && score.entryType !== filter.entryType) return false;
      if (filter.activityId && score.activityId !== filter.activityId) return false;
      if (filter.isPenalty !== undefined && score.isPenalty !== filter.isPenalty) return false;
      return true;
    });
  }
}
