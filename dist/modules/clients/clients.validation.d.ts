import { z } from 'zod';
export declare const GENDER_VALUES: readonly ["MALE", "FEMALE", "PREFER_NOT_TO_SAY", "NOT_PROVIDED"];
export declare const LANGUAGE_VALUES: readonly ["EN", "FR", "BOTH"];
export declare const HOLIDAY_PREF_VALUES: readonly ["CHRISTIAN", "MUSLIM", "BOTH", "NEUTRAL_ONLY", "NOT_PROVIDED"];
export declare const CLIENT_TYPE_VALUES: readonly ["VIP", "REGULAR", "NEW", "PROSPECT"];
export declare function normalizeGender(val?: string | null): string;
export declare function normalizeLanguage(val?: string | null): string;
export declare function normalizeHolidayPreference(val?: string | null): string;
export declare function normalizeClientType(val?: string | null): string;
export declare const createClientSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    whatsapp: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    quartier: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    birthday: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    anniversary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    gender: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    preferredLanguage: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    holidayPreference: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    clientType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    source: z.ZodOptional<z.ZodEnum<["DIRECT", "STAFF_REFERRAL", "CLIENT_REFERRAL"]>>;
    introducedByEmployeeId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">, z.ZodNull]>>;
    referredByClientId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    recommendedByName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    recommendedByPhone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    name: string;
    whatsapp?: string | null | undefined;
    quartier?: string | null | undefined;
    birthday?: string | null | undefined;
    anniversary?: string | null | undefined;
    gender?: string | null | undefined;
    preferredLanguage?: string | null | undefined;
    holidayPreference?: string | null | undefined;
    clientType?: string | null | undefined;
    source?: "DIRECT" | "STAFF_REFERRAL" | "CLIENT_REFERRAL" | undefined;
    introducedByEmployeeId?: string | null | undefined;
    referredByClientId?: string | null | undefined;
    recommendedByName?: string | null | undefined;
    recommendedByPhone?: string | null | undefined;
}, {
    phone: string;
    name: string;
    whatsapp?: string | null | undefined;
    quartier?: string | null | undefined;
    birthday?: string | null | undefined;
    anniversary?: string | null | undefined;
    gender?: string | null | undefined;
    preferredLanguage?: string | null | undefined;
    holidayPreference?: string | null | undefined;
    clientType?: string | null | undefined;
    source?: "DIRECT" | "STAFF_REFERRAL" | "CLIENT_REFERRAL" | undefined;
    introducedByEmployeeId?: string | null | undefined;
    referredByClientId?: string | null | undefined;
    recommendedByName?: string | null | undefined;
    recommendedByPhone?: string | null | undefined;
}>;
export declare const updateClientSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    whatsapp: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    quartier: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    birthday: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    anniversary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    gender: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    preferredLanguage: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    holidayPreference: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    clientType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE", "active", "inactive"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    lastServiceDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    phone?: string | undefined;
    isActive?: boolean | undefined;
    name?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "active" | "inactive" | undefined;
    whatsapp?: string | null | undefined;
    quartier?: string | null | undefined;
    birthday?: string | null | undefined;
    anniversary?: string | null | undefined;
    gender?: string | null | undefined;
    preferredLanguage?: string | null | undefined;
    holidayPreference?: string | null | undefined;
    clientType?: string | null | undefined;
    lastServiceDate?: string | null | undefined;
}, {
    phone?: string | undefined;
    isActive?: boolean | undefined;
    name?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "active" | "inactive" | undefined;
    whatsapp?: string | null | undefined;
    quartier?: string | null | undefined;
    birthday?: string | null | undefined;
    anniversary?: string | null | undefined;
    gender?: string | null | undefined;
    preferredLanguage?: string | null | undefined;
    holidayPreference?: string | null | undefined;
    clientType?: string | null | undefined;
    lastServiceDate?: string | null | undefined;
}>;
export declare const updateClientTypeSchema: z.ZodObject<{
    clientType: z.ZodEnum<["VIP", "REGULAR", "NEW", "PROSPECT"]>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    clientType: "VIP" | "REGULAR" | "NEW" | "PROSPECT";
    reason: string;
}, {
    clientType: "VIP" | "REGULAR" | "NEW" | "PROSPECT";
    reason: string;
}>;
export declare const updateClientPreferencesSchema: z.ZodObject<{
    gender: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    preferredLanguage: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    holidayPreference: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    gender?: string | null | undefined;
    preferredLanguage?: string | null | undefined;
    holidayPreference?: string | null | undefined;
}, {
    gender?: string | null | undefined;
    preferredLanguage?: string | null | undefined;
    holidayPreference?: string | null | undefined;
}>;
export declare const updateClientStatusSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE", "active", "inactive"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isActive?: boolean | undefined;
    status?: "ACTIVE" | "INACTIVE" | "active" | "inactive" | undefined;
}, {
    isActive?: boolean | undefined;
    status?: "ACTIVE" | "INACTIVE" | "active" | "inactive" | undefined;
}>;
export declare const addClientMediaSchema: z.ZodObject<{
    mediaType: z.ZodEnum<["BEFORE", "AFTER"]>;
    fileUrl: z.ZodString;
    note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    mediaType: "BEFORE" | "AFTER";
    fileUrl: string;
    note?: string | null | undefined;
}, {
    mediaType: "BEFORE" | "AFTER";
    fileUrl: string;
    note?: string | null | undefined;
}>;
export declare const clientQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    limit: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    search: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodString>;
    preferredLanguage: z.ZodOptional<z.ZodString>;
    holidayPreference: z.ZodOptional<z.ZodString>;
    clientType: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ALL", "ACTIVE", "INACTIVE", "all", "active", "inactive"]>>;
    isActive: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    introducedByEmployeeId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: string | number | undefined;
    search?: string | undefined;
    isActive?: string | boolean | undefined;
    status?: "ACTIVE" | "INACTIVE" | "active" | "inactive" | "ALL" | "all" | undefined;
    gender?: string | undefined;
    preferredLanguage?: string | undefined;
    holidayPreference?: string | undefined;
    clientType?: string | undefined;
    introducedByEmployeeId?: string | undefined;
    page?: string | number | undefined;
}, {
    limit?: string | number | undefined;
    search?: string | undefined;
    isActive?: string | boolean | undefined;
    status?: "ACTIVE" | "INACTIVE" | "active" | "inactive" | "ALL" | "all" | undefined;
    gender?: string | undefined;
    preferredLanguage?: string | undefined;
    holidayPreference?: string | undefined;
    clientType?: string | undefined;
    introducedByEmployeeId?: string | undefined;
    page?: string | number | undefined;
}>;
//# sourceMappingURL=clients.validation.d.ts.map