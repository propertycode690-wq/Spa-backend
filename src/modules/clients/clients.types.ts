import { ClientSource, MediaType } from '@prisma/client';

export type ClientGender = 'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY' | 'NOT_PROVIDED';
export type ClientPreferredLanguage = 'EN' | 'FR' | 'BOTH';
export type ClientHolidayPreference = 'CHRISTIAN' | 'MUSLIM' | 'BOTH' | 'NEUTRAL_ONLY' | 'NOT_PROVIDED';
export type ClientType = 'VIP' | 'REGULAR' | 'NEW' | 'PROSPECT';

export interface CreateClientInput {
  name: string;
  phone: string;
  whatsapp?: string | null;
  quartier?: string | null;
  birthday?: string | null;
  anniversary?: string | null;
  gender?: ClientGender | string | null;
  preferredLanguage?: ClientPreferredLanguage | string | null;
  holidayPreference?: ClientHolidayPreference | string | null;
  clientType?: ClientType | string | null;
  source?: ClientSource;
  introducedByEmployeeId?: string | null;
  referredByClientId?: string | null;
  recommendedByName?: string | null;
  recommendedByPhone?: string | null;
}

export interface UpdateClientInput {
  name?: string;
  phone?: string;
  whatsapp?: string | null;
  quartier?: string | null;
  birthday?: string | null;
  anniversary?: string | null;
  gender?: ClientGender | string | null;
  preferredLanguage?: ClientPreferredLanguage | string | null;
  holidayPreference?: ClientHolidayPreference | string | null;
  clientType?: ClientType | string | null;
  status?: 'ACTIVE' | 'INACTIVE' | 'active' | 'inactive' | string;
  isActive?: boolean;
  lastServiceDate?: string | Date | null;
}

export interface UpdateClientTypeInput {
  clientType: ClientType;
  reason: string;
}

export interface ClassificationResult {
  clientId: string;
  clientName: string;
  oldType: string;
  newType: string;
  reason: string;
  totalSpend: number;
  paidVisits: number;
  daysSinceLastVisit: number | null;
  actionTaken: 'UPGRADED' | 'DOWNGRADED' | 'MAINTAINED' | 'PROTECTED_VIP';
}

export interface UpdateClientPreferencesInput {
  gender?: ClientGender | string | null;
  preferredLanguage?: ClientPreferredLanguage | string | null;
  holidayPreference?: ClientHolidayPreference | string | null;
}

export interface AddClientMediaInput {
  mediaType: MediaType;
  fileUrl: string;
  note?: string | null;
}

export interface ClientQueryFilter {
  page?: number | string;
  limit?: number | string;
  search?: string;
  status?: string;
  gender?: string;
  preferredLanguage?: string;
  holidayPreference?: string;
  clientType?: string;
  isActive?: boolean | string;
  introducedByEmployeeId?: string | null;
}

export interface AuthContextUser {
  id: string;
  role: string;
}
