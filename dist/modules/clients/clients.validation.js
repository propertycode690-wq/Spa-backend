"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientQuerySchema = exports.addClientMediaSchema = exports.updateClientStatusSchema = exports.updateClientPreferencesSchema = exports.updateClientTypeSchema = exports.updateClientSchema = exports.createClientSchema = exports.CLIENT_TYPE_VALUES = exports.HOLIDAY_PREF_VALUES = exports.LANGUAGE_VALUES = exports.GENDER_VALUES = void 0;
exports.normalizeGender = normalizeGender;
exports.normalizeLanguage = normalizeLanguage;
exports.normalizeHolidayPreference = normalizeHolidayPreference;
exports.normalizeClientType = normalizeClientType;
const zod_1 = require("zod");
exports.GENDER_VALUES = ['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY', 'NOT_PROVIDED'];
exports.LANGUAGE_VALUES = ['EN', 'FR', 'BOTH'];
exports.HOLIDAY_PREF_VALUES = ['CHRISTIAN', 'MUSLIM', 'BOTH', 'NEUTRAL_ONLY', 'NOT_PROVIDED'];
exports.CLIENT_TYPE_VALUES = ['VIP', 'REGULAR', 'NEW', 'PROSPECT'];
function normalizeGender(val) {
    if (!val)
        return 'NOT_PROVIDED';
    const s = String(val).trim().toUpperCase().replace(/[\s\-]/g, '_');
    if (s === 'MALE' || s === 'M')
        return 'MALE';
    if (s === 'FEMALE' || s === 'F')
        return 'FEMALE';
    if (s === 'PREFER_NOT_TO_SAY' || s === 'PREFERNOTTOSAY')
        return 'PREFER_NOT_TO_SAY';
    return 'NOT_PROVIDED';
}
function normalizeLanguage(val) {
    if (!val)
        return 'FR';
    const s = String(val).trim().toUpperCase();
    if (s === 'EN' || s === 'ENGLISH' || s === 'ANGLAIS')
        return 'EN';
    if (s === 'BOTH' || s === 'LES_DEUX' || s === 'BILINGUAL')
        return 'BOTH';
    return 'FR';
}
function normalizeHolidayPreference(val) {
    if (!val)
        return 'NOT_PROVIDED';
    const s = String(val).trim().toUpperCase().replace(/[\s\-\/]/g, '_');
    if (s.includes('CHRISTIAN') || s.includes('CHRISTMAS') || s.includes('EASTER') || s.includes('NOEL') || s.includes('PAQUES'))
        return 'CHRISTIAN';
    if (s.includes('MUSLIM') || s.includes('EID') || s.includes('TABASKI') || s.includes('ISLAM'))
        return 'MUSLIM';
    if (s === 'BOTH' || s.includes('BOTH') || s.includes('TOUS'))
        return 'BOTH';
    if (s.includes('NEUTRAL') || s.includes('NEUTRE'))
        return 'NEUTRAL_ONLY';
    return 'NOT_PROVIDED';
}
function normalizeClientType(val) {
    if (!val)
        return 'PROSPECT';
    const s = String(val).trim().toUpperCase();
    if (s === 'VIP')
        return 'VIP';
    if (s === 'REGULAR' || s === 'HABITUE' || s === 'REGULIER')
        return 'REGULAR';
    if (s === 'NEW' || s === 'NOUVEAU')
        return 'NEW';
    return 'PROSPECT';
}
exports.createClientSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: 'Client name is required' }).min(1, 'Client name is required'),
    phone: zod_1.z.string({ required_error: 'Phone number is required' }).min(1, 'Phone number is required'),
    whatsapp: zod_1.z.string().optional().nullable(),
    quartier: zod_1.z.string().optional().nullable(),
    birthday: zod_1.z.string().optional().nullable(),
    anniversary: zod_1.z.string().optional().nullable(),
    gender: zod_1.z.string().optional().nullable(),
    preferredLanguage: zod_1.z.string().optional().nullable(),
    holidayPreference: zod_1.z.string().optional().nullable(),
    clientType: zod_1.z.string().optional().nullable(),
    source: zod_1.z.enum(['DIRECT', 'STAFF_REFERRAL', 'CLIENT_REFERRAL']).optional(),
    introducedByEmployeeId: zod_1.z.union([zod_1.z.string().uuid(), zod_1.z.literal(''), zod_1.z.null()]).optional(),
    referredByClientId: zod_1.z.string().uuid().optional().nullable(),
    recommendedByName: zod_1.z.string().optional().nullable(),
    recommendedByPhone: zod_1.z.string().optional().nullable(),
});
exports.updateClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name cannot be empty').optional(),
    phone: zod_1.z.string().min(1, 'Phone cannot be empty').optional(),
    whatsapp: zod_1.z.string().optional().nullable(),
    quartier: zod_1.z.string().optional().nullable(),
    birthday: zod_1.z.string().optional().nullable(),
    anniversary: zod_1.z.string().optional().nullable(),
    gender: zod_1.z.string().optional().nullable(),
    preferredLanguage: zod_1.z.string().optional().nullable(),
    holidayPreference: zod_1.z.string().optional().nullable(),
    clientType: zod_1.z.string().optional().nullable(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'active', 'inactive']).optional(),
    isActive: zod_1.z.boolean().optional(),
    lastServiceDate: zod_1.z.string().optional().nullable(),
});
exports.updateClientTypeSchema = zod_1.z.object({
    clientType: zod_1.z.enum(['VIP', 'REGULAR', 'NEW', 'PROSPECT'], {
        required_error: 'clientType is required (VIP, REGULAR, NEW, PROSPECT)',
    }),
    reason: zod_1.z.string({ required_error: 'Reason for changing client type is mandatory' }).min(3, 'Reason must be at least 3 characters'),
});
exports.updateClientPreferencesSchema = zod_1.z.object({
    gender: zod_1.z.string().optional().nullable(),
    preferredLanguage: zod_1.z.string().optional().nullable(),
    holidayPreference: zod_1.z.string().optional().nullable(),
});
exports.updateClientStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'active', 'inactive']).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.addClientMediaSchema = zod_1.z.object({
    mediaType: zod_1.z.enum(['BEFORE', 'AFTER'], { required_error: 'mediaType must be BEFORE or AFTER' }),
    fileUrl: zod_1.z.string({ required_error: 'fileUrl is required' }).min(1, 'fileUrl is required'),
    note: zod_1.z.string().optional().nullable(),
});
exports.clientQuerySchema = zod_1.z.object({
    page: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional(),
    limit: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional(),
    search: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    preferredLanguage: zod_1.z.string().optional(),
    holidayPreference: zod_1.z.string().optional(),
    clientType: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ALL', 'ACTIVE', 'INACTIVE', 'all', 'active', 'inactive']).optional(),
    isActive: zod_1.z.union([zod_1.z.boolean(), zod_1.z.string()]).optional(),
    introducedByEmployeeId: zod_1.z.string().optional(),
});
//# sourceMappingURL=clients.validation.js.map