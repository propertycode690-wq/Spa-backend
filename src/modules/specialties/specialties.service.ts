import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { HTTP_STATUS } from '../../config/constants';
import { SpecialtyResponse, CreateSpecialtyInput, UpdateSpecialtyInput } from './specialties.types';

export class SpecialtiesService {
  private formatItem(item: any): SpecialtyResponse {
    const isActive = Boolean(item.isActive);
    return {
      id: String(item.id),
      name: String(item.name),
      isActive,
      active: isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async getSpecialties(): Promise<SpecialtyResponse[]> {
    try {
      const items = await prisma.specialty.findMany({
        orderBy: { name: 'asc' },
      });
      return items.map((s) => this.formatItem(s));
    } catch (e: any) {
      // Fallback in case raw query is needed with lowercase table name
      const rows = await prisma.$queryRawUnsafe<any[]>(
        'SELECT id, name, isActive, createdAt, updatedAt FROM `specialty` ORDER BY name ASC'
      );
      return rows.map((r) => this.formatItem(r));
    }
  }

  async getSpecialtyById(id: string): Promise<SpecialtyResponse> {
    try {
      const item = await prisma.specialty.findUnique({
        where: { id },
      });
      if (!item) {
        throw new AppError('Specialty not found', HTTP_STATUS.NOT_FOUND);
      }
      return this.formatItem(item);
    } catch (e: any) {
      if (e instanceof AppError) throw e;
      const rows = await prisma.$queryRawUnsafe<any[]>(
        'SELECT id, name, isActive, createdAt, updatedAt FROM `specialty` WHERE id = ? LIMIT 1',
        id
      );
      if (!rows || rows.length === 0) {
        throw new AppError('Specialty not found', HTTP_STATUS.NOT_FOUND);
      }
      return this.formatItem(rows[0]);
    }
  }

  async createSpecialty(input: CreateSpecialtyInput): Promise<SpecialtyResponse> {
    const nameTrimmed = input.name.trim();
    if (!nameTrimmed) {
      throw new AppError('Specialty name is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Duplicate specialty names blocked (case-insensitive check)
    const existing = await prisma.specialty.findFirst({
      where: { name: { equals: nameTrimmed } },
    });
    if (existing) {
      throw new AppError('A specialty with this name already exists', HTTP_STATUS.CONFLICT);
    }

    const isActive = input.isActive !== undefined ? Boolean(input.isActive) : true;

    const created = await prisma.specialty.create({
      data: {
        name: nameTrimmed,
        isActive,
      },
    });

    return this.formatItem(created);
  }

  async updateSpecialty(id: string, input: UpdateSpecialtyInput): Promise<SpecialtyResponse> {
    const existing = await this.getSpecialtyById(id);

    let name = existing.name;
    if (input.name !== undefined) {
      const nameTrimmed = input.name.trim();
      if (!nameTrimmed) {
        throw new AppError('Specialty name cannot be empty', HTTP_STATUS.BAD_REQUEST);
      }

      // Duplicate specialty names blocked
      const duplicate = await prisma.specialty.findFirst({
        where: {
          name: { equals: nameTrimmed },
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new AppError('A specialty with this name already exists', HTTP_STATUS.CONFLICT);
      }
      name = nameTrimmed;
    }

    let isActive = existing.isActive;
    if (input.isActive !== undefined) {
      isActive = Boolean(input.isActive);
    } else if (input.active !== undefined) {
      isActive = Boolean(input.active);
    }

    const updated = await prisma.specialty.update({
      where: { id },
      data: {
        name,
        isActive,
      },
    });

    // If specialty name was changed, cascade to services, stock, and staff profile specialties
    if (existing.name !== name) {
      try {
        await prisma.service.updateMany({
          where: { category: existing.name },
          data: { category: name },
        });

        await prisma.serviceStock.updateMany({
          where: { category: existing.name },
          data: { category: name },
        });

        const profiles = await prisma.staffProfile.findMany();
        for (const profile of profiles) {
          let specs: string[] = [];
          if (Array.isArray(profile.specialties)) {
            specs = profile.specialties as string[];
          } else if (typeof profile.specialties === 'string') {
            try { specs = JSON.parse(profile.specialties); } catch { specs = []; }
          }
          if (specs.includes(existing.name)) {
            const updatedSpecs = specs.map((s) => (s === existing.name ? name : s));
            await prisma.staffProfile.update({
              where: { id: profile.id },
              data: { specialties: updatedSpecs },
            });
          }
        }
      } catch (cascadeErr: any) {
        console.warn('Non-fatal error cascading specialty rename:', cascadeErr?.message);
      }
    }

    return this.formatItem(updated);
  }

  async deleteSpecialty(id: string): Promise<void> {
    const specialty = await this.getSpecialtyById(id);

    // Check if any active service uses this specialty category
    const servicesCount = await prisma.service.count({
      where: { category: specialty.name },
    });
    if (servicesCount > 0) {
      throw new AppError(
        `Cannot delete specialty "${specialty.name}" because it is currently assigned to ${servicesCount} service(s). Please deactivate it instead.`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Clean up deleted specialty from staff profile specialties
    try {
      const profiles = await prisma.staffProfile.findMany();
      for (const profile of profiles) {
        let specs: string[] = [];
        if (Array.isArray(profile.specialties)) {
          specs = profile.specialties as string[];
        } else if (typeof profile.specialties === 'string') {
          try { specs = JSON.parse(profile.specialties); } catch { specs = []; }
        }
        if (specs.includes(specialty.name)) {
          const updated = specs.filter((s) => s !== specialty.name);
          await prisma.staffProfile.update({
            where: { id: profile.id },
            data: { specialties: updated },
          });
        }
      }
    } catch (cleanupErr: any) {
      console.warn('Non-fatal error cleaning up deleted specialty from staff profiles:', cleanupErr?.message);
    }

    await prisma.specialty.delete({
      where: { id },
    });
  }
}

export const specialtiesService = new SpecialtiesService();
