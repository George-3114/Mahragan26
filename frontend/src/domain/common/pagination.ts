import { PAGINATION_DEFAULTS } from './constants';

export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
}

export interface PaginatedResult<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface SortParams<TField extends string = string> {
  readonly field: TField;
  readonly direction: 'asc' | 'desc';
}

export function normalizePagination(
  params: PaginationParams = {},
): Required<PaginationParams> {
  const page = Math.max(1, params.page ?? PAGINATION_DEFAULTS.PAGE);
  const limit = Math.min(
    PAGINATION_DEFAULTS.MAX_LIMIT,
    Math.max(1, params.limit ?? PAGINATION_DEFAULTS.LIMIT),
  );
  return { page, limit };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  params: Required<PaginationParams>,
): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  return {
    items,
    total,
    page: params.page,
    limit: params.limit,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPreviousPage: params.page > 1,
  };
}
