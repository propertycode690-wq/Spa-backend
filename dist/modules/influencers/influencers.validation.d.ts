import { z } from 'zod';
export declare const createInfluencerSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    instagram: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<["ACTIVE", "PAUSED", "BLOCKED"]>>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    name: string;
    status: "ACTIVE" | "PAUSED" | "BLOCKED";
    notes?: string | null | undefined;
    instagram?: string | null | undefined;
}, {
    phone: string;
    name: string;
    status?: "ACTIVE" | "PAUSED" | "BLOCKED" | undefined;
    notes?: string | null | undefined;
    instagram?: string | null | undefined;
}>;
export declare const updateInfluencerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    instagram: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "PAUSED", "BLOCKED"]>>;
}, "strip", z.ZodTypeAny, {
    phone?: string | undefined;
    name?: string | undefined;
    status?: "ACTIVE" | "PAUSED" | "BLOCKED" | undefined;
    notes?: string | null | undefined;
    instagram?: string | null | undefined;
}, {
    phone?: string | undefined;
    name?: string | undefined;
    status?: "ACTIVE" | "PAUSED" | "BLOCKED" | undefined;
    notes?: string | null | undefined;
    instagram?: string | null | undefined;
}>;
export declare const createPromoCodeSchema: z.ZodObject<{
    influencerId: z.ZodString;
    code: z.ZodString;
    discountPercent: z.ZodNumber;
    commissionPercent: z.ZodNumber;
    startDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    maxUses: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    allowRepeatClient: z.ZodDefault<z.ZodBoolean>;
    stackableWithVip: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
    code: string;
    influencerId: string;
    discountPercent: number;
    commissionPercent: number;
    allowRepeatClient: boolean;
    stackableWithVip: boolean;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    maxUses?: number | null | undefined;
}, {
    code: string;
    influencerId: string;
    discountPercent: number;
    commissionPercent: number;
    isActive?: boolean | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    maxUses?: number | null | undefined;
    allowRepeatClient?: boolean | undefined;
    stackableWithVip?: boolean | undefined;
}>;
export declare const updatePromoCodeSchema: z.ZodObject<{
    discountPercent: z.ZodOptional<z.ZodNumber>;
    commissionPercent: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    maxUses: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    allowRepeatClient: z.ZodOptional<z.ZodBoolean>;
    stackableWithVip: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isActive?: boolean | undefined;
    discountPercent?: number | undefined;
    commissionPercent?: number | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    maxUses?: number | null | undefined;
    allowRepeatClient?: boolean | undefined;
    stackableWithVip?: boolean | undefined;
}, {
    isActive?: boolean | undefined;
    discountPercent?: number | undefined;
    commissionPercent?: number | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    maxUses?: number | null | undefined;
    allowRepeatClient?: boolean | undefined;
    stackableWithVip?: boolean | undefined;
}>;
export declare const validatePromoCodeSchema: z.ZodObject<{
    code: z.ZodString;
    clientId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    clientPhone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    subtotal: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    code: string;
    subtotal: number;
    clientId?: string | null | undefined;
    clientPhone?: string | null | undefined;
}, {
    code: string;
    subtotal: number;
    clientId?: string | null | undefined;
    clientPhone?: string | null | undefined;
}>;
export declare const createPayoutSchema: z.ZodObject<{
    influencerId: z.ZodString;
    amount: z.ZodNumber;
    payoutMethod: z.ZodEnum<["MTN_MOMO", "ORANGE_MONEY", "BANK_TRANSFER"]>;
    reference: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    influencerId: string;
    payoutMethod: "MTN_MOMO" | "ORANGE_MONEY" | "BANK_TRANSFER";
    notes?: string | null | undefined;
    reference?: string | null | undefined;
}, {
    amount: number;
    influencerId: string;
    payoutMethod: "MTN_MOMO" | "ORANGE_MONEY" | "BANK_TRANSFER";
    notes?: string | null | undefined;
    reference?: string | null | undefined;
}>;
export declare const reverseCommissionSchema: z.ZodObject<{
    invoiceId: z.ZodString;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isPartial: z.ZodDefault<z.ZodBoolean>;
    refundedAmount: z.ZodOptional<z.ZodNumber>;
    totalInvoiceAmount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    invoiceId: string;
    isPartial: boolean;
    reason?: string | null | undefined;
    refundedAmount?: number | undefined;
    totalInvoiceAmount?: number | undefined;
}, {
    invoiceId: string;
    reason?: string | null | undefined;
    isPartial?: boolean | undefined;
    refundedAmount?: number | undefined;
    totalInvoiceAmount?: number | undefined;
}>;
//# sourceMappingURL=influencers.validation.d.ts.map