"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseCommissionSchema = exports.createPayoutSchema = exports.validatePromoCodeSchema = exports.updatePromoCodeSchema = exports.createPromoCodeSchema = exports.updateInfluencerSchema = exports.createInfluencerSchema = void 0;
const zod_1 = require("zod");
exports.createInfluencerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must have at least 2 characters').trim(),
    phone: zod_1.z.string().min(5, 'Valid phone number is required').trim(),
    instagram: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    status: zod_1.z.enum(['ACTIVE', 'PAUSED', 'BLOCKED']).default('ACTIVE'),
});
exports.updateInfluencerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).trim().optional(),
    phone: zod_1.z.string().min(5).trim().optional(),
    instagram: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    status: zod_1.z.enum(['ACTIVE', 'PAUSED', 'BLOCKED']).optional(),
});
exports.createPromoCodeSchema = zod_1.z.object({
    influencerId: zod_1.z.string().uuid('Invalid influencer ID'),
    code: zod_1.z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z0-9]{6,8}$/, 'Promo code must be 6-8 uppercase alphanumeric characters (e.g. BELLA10)'),
    discountPercent: zod_1.z.number().min(0).max(100, 'Discount percent must be between 0 and 100'),
    commissionPercent: zod_1.z.number().min(0).max(100, 'Commission percent must be between 0 and 100'),
    startDate: zod_1.z.string().optional().nullable(),
    endDate: zod_1.z.string().optional().nullable(),
    maxUses: zod_1.z.number().int().positive().optional().nullable(),
    allowRepeatClient: zod_1.z.boolean().default(false),
    stackableWithVip: zod_1.z.boolean().default(false),
    isActive: zod_1.z.boolean().default(true),
});
exports.updatePromoCodeSchema = zod_1.z.object({
    discountPercent: zod_1.z.number().min(0).max(100).optional(),
    commissionPercent: zod_1.z.number().min(0).max(100).optional(),
    startDate: zod_1.z.string().optional().nullable(),
    endDate: zod_1.z.string().optional().nullable(),
    maxUses: zod_1.z.number().int().positive().optional().nullable(),
    allowRepeatClient: zod_1.z.boolean().optional(),
    stackableWithVip: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.validatePromoCodeSchema = zod_1.z.object({
    code: zod_1.z.string().trim().toUpperCase(),
    clientId: zod_1.z.string().uuid().optional().nullable(),
    clientPhone: zod_1.z.string().optional().nullable(),
    subtotal: zod_1.z.number().nonnegative(),
});
exports.createPayoutSchema = zod_1.z.object({
    influencerId: zod_1.z.string().uuid('Invalid influencer ID'),
    amount: zod_1.z.number().positive('Payout amount must be positive'),
    payoutMethod: zod_1.z.enum(['MTN_MOMO', 'ORANGE_MONEY', 'BANK_TRANSFER']),
    reference: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.reverseCommissionSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().uuid('Invalid invoice ID'),
    reason: zod_1.z.string().optional().nullable(),
    isPartial: zod_1.z.boolean().default(false),
    refundedAmount: zod_1.z.number().positive().optional(),
    totalInvoiceAmount: zod_1.z.number().positive().optional(),
});
//# sourceMappingURL=influencers.validation.js.map