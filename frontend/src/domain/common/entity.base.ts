/**
 * Core entity primitives shared across the festival domain.
 * IDs are strings to align with MongoDB ObjectId serialization at the infrastructure layer.
 */

export type EntityId = string;

/** ISO 8601 timestamp string used in domain transport; repositories may persist as Date. */
export type Timestamp = string;

export interface BaseEntity {
  readonly id: EntityId;
}

export interface AuditableEntity extends BaseEntity {
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface FestivalScopedEntity extends AuditableEntity {
  /** Festival season identifier, e.g. "2026". Enables multi-year data in one database. */
  readonly festivalYear: string;
}

/** Fields omitted when creating a new persisted entity. */
export type CreateInput<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'> &
  Partial<Pick<T, 'id'>>;

/** Partial update payload; infrastructure layers map this to MongoDB $set operations. */
export type UpdateInput<T extends BaseEntity> = Partial<Omit<T, 'id' | 'createdAt'>>;

/** Reference to another aggregate by ID — avoids embedding full documents. */
export interface EntityRef<T extends string = string> {
  readonly id: EntityId;
  readonly type: T;
}

export interface SoftDeletable {
  readonly isDeleted: boolean;
  readonly deletedAt?: Timestamp;
}

export interface Publishable {
  readonly isPublished: boolean;
  readonly publishedAt?: Timestamp;
}
