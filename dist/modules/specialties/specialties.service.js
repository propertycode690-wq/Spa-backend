"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtiesService = exports.SpecialtiesService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const errorHandler_1 = require("../../middleware/errorHandler");
const constants_1 = require("../../config/constants");
class SpecialtiesService {
    formatItem(item) {
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
    async getSpecialties() {
        try {
            const items = await database_1.default.specialty.findMany({
                orderBy: { name: 'asc' },
            });
            return items.map((s) => this.formatItem(s));
        }
        catch (e) {
            // Fallback in case raw query is needed with lowercase table name
            const rows = await database_1.default.$queryRawUnsafe('SELECT id, name, isActive, createdAt, updatedAt FROM `specialty` ORDER BY name ASC');
            return rows.map((r) => this.formatItem(r));
        }
    }
    async getSpecialtyById(id) {
        try {
            const item = await database_1.default.specialty.findUnique({
                where: { id },
            });
            if (!item) {
                throw new errorHandler_1.AppError('Specialty not found', constants_1.HTTP_STATUS.NOT_FOUND);
            }
            return this.formatItem(item);
        }
        catch (e) {
            if (e instanceof errorHandler_1.AppError)
                throw e;
            const rows = await database_1.default.$queryRawUnsafe('SELECT id, name, isActive, createdAt, updatedAt FROM `specialty` WHERE id = ? LIMIT 1', id);
            if (!rows || rows.length === 0) {
                throw new errorHandler_1.AppError('Specialty not found', constants_1.HTTP_STATUS.NOT_FOUND);
            }
            return this.formatItem(rows[0]);
        }
    }
    async createSpecialty(input) {
        const nameTrimmed = input.name.trim();
        if (!nameTrimmed) {
            throw new errorHandler_1.AppError('Specialty name is required', constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        // Duplicate specialty names blocked (case-insensitive check)
        const existing = await database_1.default.specialty.findFirst({
            where: { name: { equals: nameTrimmed } },
        });
        if (existing) {
            throw new errorHandler_1.AppError('A specialty with this name already exists', constants_1.HTTP_STATUS.CONFLICT);
        }
        const isActive = input.isActive !== undefined ? Boolean(input.isActive) : true;
        const created = await database_1.default.specialty.create({
            data: {
                name: nameTrimmed,
                isActive,
            },
        });
        return this.formatItem(created);
    }
    async updateSpecialty(id, input) {
        const existing = await this.getSpecialtyById(id);
        let name = existing.name;
        if (input.name !== undefined) {
            const nameTrimmed = input.name.trim();
            if (!nameTrimmed) {
                throw new errorHandler_1.AppError('Specialty name cannot be empty', constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            // Duplicate specialty names blocked
            const duplicate = await database_1.default.specialty.findFirst({
                where: {
                    name: { equals: nameTrimmed },
                    id: { not: id },
                },
            });
            if (duplicate) {
                throw new errorHandler_1.AppError('A specialty with this name already exists', constants_1.HTTP_STATUS.CONFLICT);
            }
            name = nameTrimmed;
        }
        let isActive = existing.isActive;
        if (input.isActive !== undefined) {
            isActive = Boolean(input.isActive);
        }
        else if (input.active !== undefined) {
            isActive = Boolean(input.active);
        }
        const updated = await database_1.default.specialty.update({
            where: { id },
            data: {
                name,
                isActive,
            },
        });
        // If specialty name was changed, cascade to services, stock, and staff profile specialties
        if (existing.name !== name) {
            try {
                await database_1.default.service.updateMany({
                    where: { category: existing.name },
                    data: { category: name },
                });
                await database_1.default.serviceStock.updateMany({
                    where: { category: existing.name },
                    data: { category: name },
                });
                const profiles = await database_1.default.staffProfile.findMany();
                for (const profile of profiles) {
                    let specs = [];
                    if (Array.isArray(profile.specialties)) {
                        specs = profile.specialties;
                    }
                    else if (typeof profile.specialties === 'string') {
                        try {
                            specs = JSON.parse(profile.specialties);
                        }
                        catch {
                            specs = [];
                        }
                    }
                    if (specs.includes(existing.name)) {
                        const updatedSpecs = specs.map((s) => (s === existing.name ? name : s));
                        await database_1.default.staffProfile.update({
                            where: { id: profile.id },
                            data: { specialties: updatedSpecs },
                        });
                    }
                }
            }
            catch (cascadeErr) {
                console.warn('Non-fatal error cascading specialty rename:', cascadeErr?.message);
            }
        }
        return this.formatItem(updated);
    }
    async deleteSpecialty(id) {
        const specialty = await this.getSpecialtyById(id);
        // Check if any active service uses this specialty category
        const servicesCount = await database_1.default.service.count({
            where: { category: specialty.name },
        });
        if (servicesCount > 0) {
            throw new errorHandler_1.AppError(`Cannot delete specialty "${specialty.name}" because it is currently assigned to ${servicesCount} service(s). Please deactivate it instead.`, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        // Clean up deleted specialty from staff profile specialties
        try {
            const profiles = await database_1.default.staffProfile.findMany();
            for (const profile of profiles) {
                let specs = [];
                if (Array.isArray(profile.specialties)) {
                    specs = profile.specialties;
                }
                else if (typeof profile.specialties === 'string') {
                    try {
                        specs = JSON.parse(profile.specialties);
                    }
                    catch {
                        specs = [];
                    }
                }
                if (specs.includes(specialty.name)) {
                    const updated = specs.filter((s) => s !== specialty.name);
                    await database_1.default.staffProfile.update({
                        where: { id: profile.id },
                        data: { specialties: updated },
                    });
                }
            }
        }
        catch (cleanupErr) {
            console.warn('Non-fatal error cleaning up deleted specialty from staff profiles:', cleanupErr?.message);
        }
        await database_1.default.specialty.delete({
            where: { id },
        });
    }
}
exports.SpecialtiesService = SpecialtiesService;
exports.specialtiesService = new SpecialtiesService();
//# sourceMappingURL=specialties.service.js.map