import type { CreateInput, Material } from '../../domain';
import { MaterialCategory, MaterialType } from '../../domain';
import type { ApplicationContext } from '../context';

export interface UploadMaterialInput {
  title: string;
  description: string;
  type: MaterialType;
  category: MaterialCategory;
  fileUrl: string;
  tags?: string[];
  uploadedById: string;
}

export class MaterialService {
  constructor(private readonly ctx: ApplicationContext) {}

  async getAll(): Promise<Material[]> {
    return this.ctx.repositories.materials.findAll({ isPublished: true });
  }

  async getById(id: string): Promise<Material | null> {
    return this.ctx.repositories.materials.findById(id);
  }

  async uploadMaterial(input: UploadMaterialInput): Promise<Material> {
    const material = await this.ctx.repositories.materials.create({
      title: input.title,
      description: input.description,
      type: input.type,
      category: input.category,
      fileUrl: input.fileUrl,
      tags: input.tags ?? [],
      downloadCount: 0,
      isPublished: false,
      uploadedById: input.uploadedById,
    } as CreateInput<Material>);

    this.ctx.activityLog.add(`Material "${material.title}" uploaded`);
    this.ctx.notifyChange();
    return material;
  }

  async publishMaterial(id: string): Promise<Material | null> {
    const material = await this.ctx.repositories.materials.update(id, {
      isPublished: true,
      publishedAt: new Date().toISOString(),
    });
    if (material) {
      this.ctx.activityLog.add(`Material "${material.title}" published`);
      this.ctx.notifyChange();
    }
    return material;
  }

  async recordDownload(id: string): Promise<Material | null> {
    const material = await this.getById(id);
    if (!material || !material.isPublished) return null;

    const updated = await this.ctx.repositories.materials.update(id, {
      downloadCount: material.downloadCount + 1,
    });
    if (updated) {
      this.ctx.notifyChange();
    }
    return updated;
  }
}

export { MaterialType, MaterialCategory };
