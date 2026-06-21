import { MaterialCategory, MaterialType } from './enums';

export const MATERIAL_TYPE_LABELS: Readonly<Record<MaterialType, string>> = {
  [MaterialType.Pdf]: 'PDF Document',
  [MaterialType.Ppt]: 'PowerPoint',
  [MaterialType.Image]: 'Image',
  [MaterialType.Video]: 'Video',
  [MaterialType.Hymn]: 'Hymn Sheet',
  [MaterialType.Other]: 'Other',
};

export const MATERIAL_CATEGORY_LABELS: Readonly<Record<MaterialCategory, string>> = {
  [MaterialCategory.Liturgy]: 'Liturgy',
  [MaterialCategory.Hymns]: 'Hymns',
  [MaterialCategory.Psalms]: 'Psalms',
  [MaterialCategory.Study]: 'Study',
  [MaterialCategory.General]: 'General',
};

export const MATERIAL_FILE_ICONS: Readonly<Record<MaterialType, string>> = {
  [MaterialType.Pdf]: 'file-text',
  [MaterialType.Ppt]: 'presentation',
  [MaterialType.Image]: 'image',
  [MaterialType.Video]: 'video',
  [MaterialType.Hymn]: 'music',
  [MaterialType.Other]: 'file',
};
