import type { AuditableEntity, EntityId, Publishable } from '../common';
import { MaterialCategory, MaterialType } from './enums';

export interface Material extends AuditableEntity, Publishable {
  readonly title: string;
  readonly description: string;
  readonly type: MaterialType;
  readonly category: MaterialCategory;
  readonly fileUrl: string;
  readonly fileSizeBytes?: number;
  readonly tags: readonly string[];
  readonly downloadCount: number;
  readonly uploadedById: EntityId;
}

export interface MaterialSummary {
  readonly id: EntityId;
  readonly title: string;
  readonly type: MaterialType;
  readonly category: MaterialCategory;
  readonly downloadCount: number;
}

export interface MaterialFilter {
  readonly type?: MaterialType;
  readonly category?: MaterialCategory;
  readonly isPublished?: boolean;
  readonly tag?: string;
  readonly search?: string;
}
