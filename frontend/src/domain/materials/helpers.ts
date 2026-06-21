import type { Material } from './entity';
import {
  MATERIAL_CATEGORY_LABELS,
  MATERIAL_FILE_ICONS,
  MATERIAL_TYPE_LABELS,
} from './constants';
import { MaterialCategory, MaterialType } from './enums';

export function getMaterialTypeLabel(type: MaterialType): string {
  return MATERIAL_TYPE_LABELS[type];
}

export function getMaterialCategoryLabel(category: MaterialCategory): string {
  return MATERIAL_CATEGORY_LABELS[category];
}

export function getMaterialFileIcon(type: MaterialType): string {
  return MATERIAL_FILE_ICONS[type];
}

export function filterPublishedMaterials(materials: readonly Material[]): Material[] {
  return materials.filter((material) => material.isPublished);
}

export function filterMaterialsByCategory(
  materials: readonly Material[],
  category: MaterialCategory,
): Material[] {
  return materials.filter((material) => material.category === category);
}

export function searchMaterials(
  materials: readonly Material[],
  query: string,
): Material[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...materials];

  return materials.filter(
    (material) =>
      material.title.toLowerCase().includes(normalized) ||
      material.description.toLowerCase().includes(normalized) ||
      material.tags.some((tag) => tag.toLowerCase().includes(normalized)),
  );
}

export function sortMaterialsByDownloads(
  materials: readonly Material[],
  direction: 'asc' | 'desc' = 'desc',
): Material[] {
  return [...materials].sort((a, b) =>
    direction === 'desc'
      ? b.downloadCount - a.downloadCount
      : a.downloadCount - b.downloadCount,
  );
}
