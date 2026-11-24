import { z } from 'zod';

export const GENDER_VALUES = ['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY', 'NOT_PROVIDED'] as const;
export const LANGUAGE_VALUES = ['EN', 'FR', 'BOTH'] as const;
export const HOLIDAY_PREF_VALUES = ['CHRISTIAN', 'MUSLIM', 'BOTH', 'NEUTRAL_ONLY', 'NOT_PROVIDED'] as const;
export const CLIENT_TYPE_VALUES = ['VIP', 'REGULAR', 'NEW', 'PROSPECT'] as const;

export function normalizeGender(val?: string | null): string {
  if (!val) return 'NOT_PROVIDED';
  const s = String(val).trim().toUpperCase().replace(/[\s\-]/g, '_');
  if (s === 'MALE' || s === 'M') return 'MALE';
  if (s === 'FEMALE' || s === 'F') return 'FEMALE';
  if (s === 'PREFER_NOT_TO_SAY' || s === 'PREFERNOTTOSAY') return 'PREFER_NOT_TO_SAY';
  return 'NOT_PROVIDED';
}

export function normalizeLanguage(val?: string | null): string {
  if (!val) return 'FR';
  const s = String(val).trim().toUpperCase();
  if (s === 'EN' || s === 'ENGLISH' || s === 'ANGLAIS') return 'EN';
  if (s === 'BOTH' || s === 'LES_DEUX' || s === 'BILINGUAL') return 'BOTH';
  return 'FR';
}

export function normalizeHolidayPreference(val?: string | null): string {
  if (!val) return 'NOT_PROVIDED';
  const s = String(val).trim().toUpperCase().replace(/[\s\-\/]/g, '_');
  if (s.includes('CHRISTIAN') || s.includes('CHRISTMAS') || s.includes('EASTER') || s.includes('NOEL') || s.includes('PAQUES')) return 'CHRISTIAN';
  if (s.includes('MUSLIM') || s.includes('EID') || s.includes('TABASKI') || s.includes('ISLAM')) return 'MUSLIM';
  if (s === 'BOTH' || s.includes('BOTH') || s.includes('TOUS')) return 'BOTH';
  if (s.includes('NEUTRAL') || s.includes('NEUTRE')) return 'NEUTRAL_ONLY';
  return 'NOT_PROVIDED';
}

export function normalizeClientType(val?: string | null): string {
  if (!val) return 'PROSPECT';
  const s = String(val).trim().toUpperCase();
  if (s === 'VIP') return 'VIP';
  if (s === 'REGULAR' || s === 'HABITUE' || s === 'REGULIER') return 'REGULAR';
  if (s === 'NEW' || s === 'NOUVEAU') return 'NEW';
  return 'PROSPECT';
}

export const createClientSchema = z.object({
  name: z.string({ required_error: 'Client name is required' }).min(1, 'Client name is required'),
  phone: z.string({ required_error: 'Phone number is required' }).min(1, 'Phone number is required'),
  whatsapp: z.string().optional().nullable(),
  quartier: z.string().optional().nullable(),
  birthday: z.string().optional().nullable(),
  anniversary: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  preferredLanguage: z.string().optional().nullable(),
  holidayPreference: z.string().optional().nullable(),
  clientType: z.string().optional().nullable(),
  source: z.enum(['DIRECT', 'STAFF_REFERRAL', 'CLIENT_REFERRAL']).optional(),
  introducedByEmployeeId: z.union([z.string().uuid(), z.literal(''), z.null()]).optional(),
  referredByClientId: z.string().uuid().optional().nullable(),
  recommendedByName: z.string().optional().nullable(),
  recommendedByPhone: z.string().optional().nullable(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  phone: z.string().min(1, 'Phone cannot be empty').optional(),
  whatsapp: z.string().optional().nullable(),
  quartier: z.string().optional().nullable(),
  birthday: z.string().optional().nullable(),
  anniversary: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  preferredLanguage: z.string().optional().nullable(),
  holidayPreference: z.string().optional().nullable(),
  clientType: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'active', 'inactive']).optional(),
  isActive: z.boolean().optional(),
  lastServiceDate: z.string().optional().nullable(),
});

export const updateClientTypeSchema = z.object({
  clientType: z.enum(['VIP', 'REGULAR', 'NEW', 'PROSPECT'], {
    required_error: 'clientType is required (VIP, REGULAR, NEW, PROSPECT)',
  }),
  reason: z.string({ required_error: 'Reason for changing client type is mandatory' }).min(3, 'Reason must be at least 3 characters'),
});

export const updateClientPreferencesSchema = z.object({
  gender: z.string().optional().nullable(),
  preferredLanguage: z.string().optional().nullable(),
  holidayPreference: z.string().optional().nullable(),
});

export const updateClientStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'active', 'inactive']).optional(),
  isActive: z.boolean().optional(),
});

export const addClientMediaSchema = z.object({
  mediaType: z.enum(['BEFORE', 'AFTER'], { required_error: 'mediaType must be BEFORE or AFTER' }),
  fileUrl: z.string({ required_error: 'fileUrl is required' }).min(1, 'fileUrl is required'),
  note: z.string().optional().nullable(),
});

export const clientQuerySchema = z.object({
  page: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional(),
  search: z.string().optional(),
  gender: z.string().optional(),
  preferredLanguage: z.string().optional(),
  holidayPreference: z.string().optional(),
  clientType: z.string().optional(),
  status: z.enum(['ALL', 'ACTIVE', 'INACTIVE', 'all', 'active', 'inactive']).optional(),
  isActive: z.union([z.boolean(), z.string()]).optional(),
  introducedByEmployeeId: z.string().optional(),
});
