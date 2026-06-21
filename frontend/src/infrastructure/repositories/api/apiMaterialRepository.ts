import {
  MaterialCategory,
  MaterialType,
  buildPaginatedResult,
  normalizePagination,
  type CreateInput,
  type Material,
  type MaterialFilter,
  type PaginatedResult,
  type PaginationParams,
  type UpdateInput,
} from '../../../domain';
import type { MaterialRepositoryPort } from '../../../domain/ports';

const API_BASE = 'http://localhost:5001/api/materials';

interface BackendMaterial {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  fileUrl: string;
  downloads?: number;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapMaterialCategory(category?: string): MaterialCategory {
  const normalized = category?.toLowerCase();
  if (normalized === 'liturgy') return MaterialCategory.Liturgy;
  if (normalized === 'hymns') return MaterialCategory.Hymns;
  if (normalized === 'psalms') return MaterialCategory.Psalms;
  if (normalized === 'study') return MaterialCategory.Study;
  return MaterialCategory.General;
}

function toBackendCategory(category: MaterialCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function mapMaterial(item: BackendMaterial): Material {
  return {
    id: item._id,
    title: item.title,
    description: item.description ?? '',
    type: MaterialType.Other,
    category: mapMaterialCategory(item.category),
    fileUrl: item.fileUrl,
    tags: [],
    downloadCount: item.downloads ?? 0,
    isPublished: item.isPublished ?? true,
    publishedAt: item.isPublished !== false ? item.createdAt : undefined,
    uploadedById: '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toCreatePayload(data: CreateInput<Material>): Record<string, unknown> {
  return {
    title: data.title,
    description: data.description,
    category: toBackendCategory(data.category),
    fileUrl: data.fileUrl,
    isPublished: data.isPublished ?? true,
  };
}

function toUpdatePayload(data: UpdateInput<Material>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.category !== undefined) payload.category = toBackendCategory(data.category);
  if (data.fileUrl !== undefined) payload.fileUrl = data.fileUrl;
  if (data.isPublished !== undefined) payload.isPublished = data.isPublished;

  return payload;
}

async function fetchMaterials(): Promise<BackendMaterial[]> {
  const response = await fetch(API_BASE);
  const result = await response.json();
  return result.data ?? [];
}

export class ApiMaterialRepository implements MaterialRepositoryPort {
  async findAll(filter?: MaterialFilter): Promise<Material[]> {
    const materials = (await fetchMaterials()).map(mapMaterial);
    return this.applyFilter(materials, filter);
  }

  async findById(id: string): Promise<Material | null> {
    const materials = await this.findAll();
    return materials.find((material) => material.id === id) ?? null;
  }

  async findMany(
    filter?: MaterialFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Material>> {
    const params = normalizePagination(pagination);
    const filtered = await this.findAll(filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<Material>): Promise<Material> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCreatePayload(data)),
    });
    const result = await response.json();
    return mapMaterial(result.data);
  }

  async update(id: string, data: UpdateInput<Material>): Promise<Material | null> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toUpdatePayload(data)),
    });
    const result = await response.json();
    if (!result.data) return null;
    return mapMaterial(result.data);
  }

  async delete(id: string): Promise<boolean> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  }

  async count(filter?: MaterialFilter): Promise<number> {
    const materials = await this.findAll(filter);
    return materials.length;
  }

  private applyFilter(items: Material[], filter?: MaterialFilter): Material[] {
    if (!filter) return items;

    return items.filter((material) => {
      if (filter.isPublished !== undefined && material.isPublished !== filter.isPublished) {
        return false;
      }
      if (filter.category && material.category !== filter.category) return false;
      if (filter.type && material.type !== filter.type) return false;
      if (filter.tag && !material.tags.includes(filter.tag)) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        if (
          !material.title.toLowerCase().includes(q) &&
          !material.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }
}
