import {
  FESTIVAL,
  IndividualScoreCategory,
  PenaltyType,
  ScoreEntryType,
  buildPaginatedResult,
  normalizePagination,
  type CreateInput,
  type IndividualScore,
  type PaginatedResult,
  type PaginationParams,
  type ScoreFilter,
  type UpdateInput,
} from '../../../domain';
import type { IndividualScoreRepositoryPort } from '../../../domain/ports';

const API_BASE = 'http://localhost:5001/api/individual-scores';

interface BackendParticipant {
  _id: string;
  fullName?: string;
}

interface BackendAwardedBy {
  _id: string;
  fullName?: string;
}

interface BackendIndividualScore {
  _id: string;
  participant: string | BackendParticipant;
  category: string;
  points: number;
  description: string;
  awardedBy: string | BackendAwardedBy;
  createdAt: string;
  updatedAt: string;
}

const BACKEND_TO_CATEGORY: Record<string, IndividualScoreCategory | PenaltyType> = {
  LITURGY: IndividualScoreCategory.LiturgyAttendance,
  CONFESSION: IndividualScoreCategory.Confession,
  PARTICIPATION: IndividualScoreCategory.Participation,
  PSALM: IndividualScoreCategory.PsalmMemorization,
  GOOGLE_FORM: IndividualScoreCategory.OnlineQuiz,
  LEADER_OF_WEEK: IndividualScoreCategory.Custom,
  BONUS: IndividualScoreCategory.Custom,
  PENALTY: PenaltyType.Custom,
};

const CATEGORY_TO_BACKEND: Partial<Record<IndividualScoreCategory, string>> = {
  [IndividualScoreCategory.LiturgyAttendance]: 'LITURGY',
  [IndividualScoreCategory.Confession]: 'CONFESSION',
  [IndividualScoreCategory.Participation]: 'PARTICIPATION',
  [IndividualScoreCategory.PsalmMemorization]: 'PSALM',
  [IndividualScoreCategory.OnlineQuiz]: 'GOOGLE_FORM',
  [IndividualScoreCategory.BringFriend]: 'PARTICIPATION',
  [IndividualScoreCategory.PerfectWeek]: 'BONUS',
  [IndividualScoreCategory.Volunteer]: 'PARTICIPATION',
  [IndividualScoreCategory.EarlyAttendance]: 'LITURGY',
  [IndividualScoreCategory.Custom]: 'BONUS',
};

function resolveId(value: string | { _id: string }): string {
  return typeof value === 'string' ? value : value._id;
}

function mapCategory(category: string): IndividualScoreCategory | PenaltyType {
  return BACKEND_TO_CATEGORY[category] ?? IndividualScoreCategory.Custom;
}

function toBackendCategory(
  category: IndividualScoreCategory | PenaltyType,
  isPenalty: boolean,
): string {
  if (isPenalty) return 'PENALTY';
  if (category in CATEGORY_TO_BACKEND) {
    return CATEGORY_TO_BACKEND[category as IndividualScoreCategory] ?? 'BONUS';
  }
  return 'BONUS';
}

function mapIndividualScore(item: BackendIndividualScore): IndividualScore {
  const memberId = resolveId(item.participant);
  const isPenalty = item.category === 'PENALTY';

  return {
    id: item._id,
    memberId,
    userId: memberId,
    teamId: '',
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

function toCreatePayload(data: CreateInput<IndividualScore>): Record<string, unknown> {
  return {
    participantId: data.memberId,
    category: toBackendCategory(data.category, data.isPenalty),
    points: data.points,
    description: data.description,
  };
}

function toUpdatePayload(data: UpdateInput<IndividualScore>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.memberId !== undefined) payload.participantId = data.memberId;
  if (data.category !== undefined || data.isPenalty !== undefined) {
    const isPenalty = data.isPenalty ?? false;
    const category = data.category ?? IndividualScoreCategory.Custom;
    payload.category = toBackendCategory(category, isPenalty);
  }
  if (data.points !== undefined) payload.points = data.points;
  if (data.description !== undefined) payload.description = data.description;

  return payload;
}

async function fetchScores(): Promise<BackendIndividualScore[]> {
  const response = await fetch(API_BASE);
  const result = await response.json();
  return result.data ?? [];
}

export class ApiIndividualScoreRepository implements IndividualScoreRepositoryPort {
  async findAll(filter?: ScoreFilter): Promise<IndividualScore[]> {
    const scores = (await fetchScores()).map(mapIndividualScore);
    return this.applyFilter(scores, filter);
  }

  async findById(id: string): Promise<IndividualScore | null> {
    const scores = await this.findAll();
    return scores.find((score) => score.id === id) ?? null;
  }

  async findMany(
    filter?: ScoreFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<IndividualScore>> {
    const params = normalizePagination(pagination);
    const filtered = await this.findAll(filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<IndividualScore>): Promise<IndividualScore> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCreatePayload(data)),
    });
    const result = await response.json();
    return mapIndividualScore(result.data);
  }

  async update(id: string, data: UpdateInput<IndividualScore>): Promise<IndividualScore | null> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toUpdatePayload(data)),
    });
    const result = await response.json();
    if (!result.data) return null;
    return mapIndividualScore(result.data);
  }

  async delete(id: string): Promise<boolean> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  }

  async count(filter?: ScoreFilter): Promise<number> {
    const scores = await this.findAll(filter);
    return scores.length;
  }

  async findByMemberId(memberId: string): Promise<IndividualScore[]> {
    return this.findAll({ memberId });
  }

  async findByTeamId(teamId: string): Promise<IndividualScore[]> {
    return this.findAll({ teamId });
  }

  private applyFilter(items: IndividualScore[], filter?: ScoreFilter): IndividualScore[] {
    if (!filter) return items;

    return items.filter((score) => {
      if (filter.festivalYear && score.festivalYear !== filter.festivalYear) return false;
      if (filter.teamId && score.teamId !== filter.teamId) return false;
      if (filter.memberId && score.memberId !== filter.memberId) return false;
      if (filter.userId && score.userId !== filter.userId) return false;
      if (filter.category && score.category !== filter.category) return false;
      if (filter.entryType && score.entryType !== filter.entryType) return false;
      if (filter.activityId && score.activityId !== filter.activityId) return false;
      if (filter.isPenalty !== undefined && score.isPenalty !== filter.isPenalty) return false;
      return true;
    });
  }
}
