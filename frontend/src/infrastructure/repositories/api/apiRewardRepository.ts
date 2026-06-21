import {
  RewardCategory,
  buildPaginatedResult,
  normalizePagination,
  type CreateInput,
  type PaginatedResult,
  type PaginationParams,
  type Reward,
  type RewardFilter,
  type UpdateInput,
} from '../../../domain';
import type { RewardRepositoryPort } from '../../../domain/ports';

const API_BASE = 'http://localhost:5001/api/rewards';

interface BackendReward {
  _id: string;
  name: string;
  description?: string;
  cost?: number;
  quantity?: number;
  stock?: number;
  image?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapReward(item: BackendReward): Reward {
  return {
    id: item._id,
    name: item.name,
    description: item.description ?? '',
    imageUrl: item.image ?? '',
    requiredPoints: item.cost ?? item.quantity ?? 0,
    category: RewardCategory.Other,
    stock: item.stock ?? 0,
    isActive: item.isActive ?? true,
    isPublished: true,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toCreatePayload(data: CreateInput<Reward>): Record<string, unknown> {
  return {
    name: data.name,
    description: data.description,
    cost: data.requiredPoints,
    quantity: data.requiredPoints,
    stock: data.stock,
    image: data.imageUrl ?? '',
    isActive: data.isActive ?? true,
  };
}

function toUpdatePayload(data: UpdateInput<Reward>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.requiredPoints !== undefined) {
    payload.cost = data.requiredPoints;
    payload.quantity = data.requiredPoints;
  }
  if (data.stock !== undefined) payload.stock = data.stock;
  if (data.imageUrl !== undefined) payload.image = data.imageUrl;
  if (data.isActive !== undefined) payload.isActive = data.isActive;

  return payload;
}

async function fetchRewards(): Promise<BackendReward[]> {
  const response = await fetch(API_BASE);
  const result = await response.json();
  return result.data ?? [];
}

export class ApiRewardRepository implements RewardRepositoryPort {
  async findAll(filter?: RewardFilter): Promise<Reward[]> {
    const rewards = (await fetchRewards()).map(mapReward);
    return this.applyFilter(rewards, filter);
  }

  async findById(id: string): Promise<Reward | null> {
    const rewards = await this.findAll();
    return rewards.find((reward) => reward.id === id) ?? null;
  }

  async findMany(
    filter?: RewardFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Reward>> {
    const params = normalizePagination(pagination);
    const filtered = await this.findAll(filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<Reward>): Promise<Reward> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCreatePayload(data)),
    });
    const result = await response.json();
    return mapReward(result.data);
  }

  async update(id: string, data: UpdateInput<Reward>): Promise<Reward | null> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toUpdatePayload(data)),
    });
    const result = await response.json();
    if (!result.data) return null;
    return mapReward(result.data);
  }

  async delete(id: string): Promise<boolean> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  }

  async count(filter?: RewardFilter): Promise<number> {
    const rewards = await this.findAll(filter);
    return rewards.length;
  }

  private applyFilter(items: Reward[], filter?: RewardFilter): Reward[] {
    if (!filter) return items;

    return items.filter((reward) => {
      if (filter.category && reward.category !== filter.category) return false;
      if (filter.isActive !== undefined && reward.isActive !== filter.isActive) return false;
      if (filter.isPublished !== undefined && reward.isPublished !== filter.isPublished) {
        return false;
      }
      if (filter.maxRequiredPoints !== undefined && reward.requiredPoints > filter.maxRequiredPoints) {
        return false;
      }
      return true;
    });
  }
}
