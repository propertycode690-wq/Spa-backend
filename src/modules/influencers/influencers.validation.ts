import { z } from 'zod';

export const createInfluencerSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').trim(),
  phone: z.string().min(5, 'Valid phone number is required').trim(),
  instagram: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'PAUSED', 'BLOCKED']).default('ACTIVE'),
});

export const updateInfluencerSchema = z.object({
  name: z.string().min(2).trim().optional(),
  phone: z.string().min(5).trim().optional(),
  instagram: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'PAUSED', 'BLOCKED']).optional(),
});

export const createPromoCodeSchema = z.object({
  influencerId: z.string().uuid('Invalid influencer ID'),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6,8}$/, 'Promo code must be 6-8 uppercase alphanumeric characters (e.g. BELLA10)'),
  discountPercent: z.number().min(0).max(100, 'Discount percent must be between 0 and 100'),
  commissionPercent: z.number().min(0).max(100, 'Commission percent must be between 0 and 100'),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  maxUses: z.number().int().positive().optional().nullable(),
  allowRepeatClient: z.boolean().default(false),
  stackableWithVip: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updatePromoCodeSchema = z.object({
  discountPercent: z.number().min(0).max(100).optional(),
  commissionPercent: z.number().min(0).max(100).optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  maxUses: z.number().int().positive().optional().nullable(),
  allowRepeatClient: z.boolean().optional(),
  stackableWithVip: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const validatePromoCodeSchema = z.object({
  code: z.string().trim().toUpperCase(),
  clientId: z.string().uuid().optional().nullable(),
  clientPhone: z.string().optional().nullable(),
  subtotal: z.number().nonnegative(),
});

export const createPayoutSchema = z.object({
  influencerId: z.string().uuid('Invalid influencer ID'),
  amount: z.number().positive('Payout amount must be positive'),
  payoutMethod: z.enum(['MTN_MOMO', 'ORANGE_MONEY', 'BANK_TRANSFER']),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const reverseCommissionSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  reason: z.string().optional().nullable(),
  isPartial: z.boolean().default(false),
  refundedAmount: z.number().positive().optional(),
  totalInvoiceAmount: z.number().positive().optional(),
});
