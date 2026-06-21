import type {
  BaseEntity,
  CreateInput,
  EntityId,
  PaginatedResult,
  PaginationParams,
  UpdateInput,
} from '../../../domain';
import { buildPaginatedResult, normalizePagination } from '../../../domain';
import type { Repository } from '../../../domain/ports';

let idCounter = 1000;

export function nextId(): EntityId {
  idCounter += 1;
  return String(idCounter);
}

export function now(): string {
  return new Date().toISOString();
}

export class BaseMockRepository<T extends BaseEntity, TFilter = unknown>
  implements Repository<T, TFilter>
{
  protected items: T[];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  async findById(id: EntityId): Promise<T | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findAll(filter?: TFilter): Promise<T[]> {
    return this.applyFilter([...this.items], filter);
  }

  async findMany(
    filter?: TFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<T>> {
    const params = normalizePagination(pagination);
    const filtered = this.applyFilter([...this.items], filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<T>): Promise<T> {
    const timestamp = now();
    const entity = {
      ...data,
      id: data.id ?? nextId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    } as unknown as T;
    this.items.push(entity);
    return entity;
  }

  async update(id: EntityId, data: UpdateInput<T>): Promise<T | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = {
      ...this.items[index],
      ...data,
      updatedAt: now(),
    } as unknown as T;
    this.items[index] = updated;
    return updated;
  }

  async delete(id: EntityId): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  async count(filter?: TFilter): Promise<number> {
    return this.applyFilter(this.items, filter).length;
  }

  protected applyFilter(items: T[], _filter?: TFilter): T[] {
    return items;
  }
}
