"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.influencersService = exports.InfluencersService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../../middleware/errorHandler");
const constants_1 = require("../../config/constants");
const logger_1 = require("../../utils/logger");
const whatsapp_adapter_1 = require("../whatsapp/whatsapp.adapter");
function normalizePhone(p) {
    if (!p)
        return '';
    return p.replace(/[\s\-\+\(\)]/g, '').toLowerCase();
}
class InfluencersService {
    // -------------------------------------------------------------
    // INFLUENCER MANAGEMENT
    // -------------------------------------------------------------
    async createInfluencer(data) {
        const existing = await database_1.default.influencer.findUnique({
            where: { phone: data.phone.trim() },
        });
        if (existing) {
            throw new errorHandler_1.AppError('An influencer with this phone number already exists', constants_1.HTTP_STATUS.CONFLICT);
        }
        return database_1.default.influencer.create({
            data: {
                name: data.name.trim(),
                phone: data.phone.trim(),
                instagram: data.instagram ? data.instagram.trim() : null,
                notes: data.notes ? data.notes.trim() : null,
                status: data.status || client_1.InfluencerStatus.ACTIVE,
            },
            include: {
                promoCodes: true,
            },
        });
    }
    async getInfluencers(status) {
        const where = {};
        if (status)
            where.status = status;
        const influencers = await database_1.default.influencer.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                promoCodes: true,
                commissions: {
                    select: {
                        id: true,
                        commissionAmount: true,
                        reversedAmount: true,
                        status: true,
                    },
                },
                payouts: {
                    select: {
                        id: true,
                        amount: true,
                        payoutMethod: true,
                        paidAt: true,
                    },
                },
                referredClients: {
                    select: { id: true },
                },
            },
        });
        return influencers.map((inf) => {
            // Calculate financial ledger aggregates
            const totalEarned = inf.commissions
                .filter((c) => c.status !== client_1.InfluencerCommissionStatus.REVERSED)
                .reduce((sum, c) => sum + (Number(c.commissionAmount) - Number(c.reversedAmount)), 0);
            const totalPaidOut = inf.payouts.reduce((sum, p) => sum + Number(p.amount), 0);
            const availableBalance = Math.max(0, totalEarned - totalPaidOut);
            return {
                id: inf.id,
                name: inf.name,
                phone: inf.phone,
                instagram: inf.instagram,
                status: inf.status,
                notes: inf.notes,
                createdAt: inf.createdAt,
                promoCodes: inf.promoCodes,
                totalReferredClients: inf.referredClients.length,
                totalEarned,
                totalPaidOut,
                availableBalance,
            };
        });
    }
    async getInfluencerById(id) {
        const influencer = await database_1.default.influencer.findUnique({
            where: { id },
            include: {
                promoCodes: {
                    include: {
                        usages: {
                            include: {
                                client: { select: { id: true, name: true, phone: true } },
                                invoice: { select: { id: true, invoiceNumber: true, total: true, date: true } },
                            },
                        },
                    },
                },
                commissions: {
                    include: {
                        invoice: { select: { id: true, invoiceNumber: true, total: true, date: true } },
                        client: { select: { id: true, name: true, phone: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                payouts: {
                    include: {
                        paidBy: { select: { id: true, email: true, staffProfile: { select: { name: true } } } },
                    },
                    orderBy: { paidAt: 'desc' },
                },
                referredClients: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        clientType: true,
                        totalEligibleSpend: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!influencer) {
            throw new errorHandler_1.AppError('Influencer not found', constants_1.HTTP_STATUS.NOT_FOUND);
        }
        const totalEarned = influencer.commissions
            .filter((c) => c.status !== client_1.InfluencerCommissionStatus.REVERSED)
            .reduce((sum, c) => sum + (Number(c.commissionAmount) - Number(c.reversedAmount)), 0);
        const totalPaidOut = influencer.payouts.reduce((sum, p) => sum + Number(p.amount), 0);
        const availableBalance = Math.max(0, totalEarned - totalPaidOut);
        return {
            ...influencer,
            totalEarned,
            totalPaidOut,
            availableBalance,
        };
    }
    async updateInfluencer(id, data) {
        const influencer = await database_1.default.influencer.findUnique({ where: { id } });
        if (!influencer) {
            throw new errorHandler_1.AppError('Influencer not found', constants_1.HTTP_STATUS.NOT_FOUND);
        }
        return database_1.default.influencer.update({
            where: { id },
            data: {
                name: data.name ? data.name.trim() : undefined,
                phone: data.phone ? data.phone.trim() : undefined,
                instagram: data.instagram !== undefined ? data.instagram : undefined,
                notes: data.notes !== undefined ? data.notes : undefined,
                status: data.status || undefined,
            },
            include: { promoCodes: true },
        });
    }
    // -------------------------------------------------------------
    // PROMO CODE MANAGEMENT
    // -------------------------------------------------------------
    async createPromoCode(data) {
        const influencer = await database_1.default.influencer.findUnique({
            where: { id: data.influencerId },
        });
        if (!influencer) {
            throw new errorHandler_1.AppError('Influencer not found', constants_1.HTTP_STATUS.NOT_FOUND);
        }
        const codeClean = data.code.trim().toUpperCase();
        const existing = await database_1.default.promoCode.findUnique({
            where: { code: codeClean },
        });
        if (existing) {
            throw new errorHandler_1.AppError(`Promo code "${codeClean}" already exists`, constants_1.HTTP_STATUS.CONFLICT);
        }
        return database_1.default.promoCode.create({
            data: {
                influencerId: data.influencerId,
                code: codeClean,
                discountPercent: new client_1.Prisma.Decimal(data.discountPercent),
                commissionPercent: new client_1.Prisma.Decimal(data.commissionPercent),
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
                maxUses: data.maxUses ?? null,
                allowRepeatClient: Boolean(data.allowRepeatClient),
                stackableWithVip: Boolean(data.stackableWithVip),
                isActive: data.isActive ?? true,
            },
            include: {
                influencer: true,
            },
        });
    }
    async getPromoCodes(influencerId) {
        const where = {};
        if (influencerId)
            where.influencerId = influencerId;
        return database_1.default.promoCode.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                influencer: {
                    select: { id: true, name: true, phone: true, instagram: true, status: true },
                },
                _count: {
                    select: { usages: true, referredClients: true },
                },
            },
        });
    }
    async updatePromoCode(id, data) {
        const promo = await database_1.default.promoCode.findUnique({ where: { id } });
        if (!promo) {
            throw new errorHandler_1.AppError('Promo code not found', constants_1.HTTP_STATUS.NOT_FOUND);
        }
        return database_1.default.promoCode.update({
            where: { id },
            data: {
                discountPercent: data.discountPercent !== undefined ? new client_1.Prisma.Decimal(data.discountPercent) : undefined,
                commissionPercent: data.commissionPercent !== undefined ? new client_1.Prisma.Decimal(data.commissionPercent) : undefined,
                startDate: data.startDate !== undefined ? (data.startDate ? new Date(data.startDate) : null) : undefined,
                endDate: data.endDate !== undefined ? (data.endDate ? new Date(data.endDate) : null) : undefined,
                maxUses: data.maxUses !== undefined ? data.maxUses : undefined,
                allowRepeatClient: data.allowRepeatClient !== undefined ? data.allowRepeatClient : undefined,
                stackableWithVip: data.stackableWithVip !== undefined ? data.stackableWithVip : undefined,
                isActive: data.isActive !== undefined ? data.isActive : undefined,
            },
            include: { influencer: true },
        });
    }
    // -------------------------------------------------------------
    // POS PROMO CODE VALIDATION
    // -------------------------------------------------------------
    async validatePromoCode(input) {
        const codeClean = (input.code || '').trim().toUpperCase();
        if (!codeClean) {
            return { valid: false, message: 'Promo code is required' };
        }
        const promo = await database_1.default.promoCode.findUnique({
            where: { code: codeClean },
            include: { influencer: true },
        });
        if (!promo) {
            return { valid: false, message: `Promo code "${codeClean}" does not exist` };
        }
        if (!promo.isActive) {
            return { valid: false, message: `Promo code "${codeClean}" is inactive` };
        }
        if (promo.influencer.status !== client_1.InfluencerStatus.ACTIVE) {
            return { valid: false, message: `Influencer account is currently ${promo.influencer.status.toLowerCase()}` };
        }
        // Expiry and Date Range check
        const now = new Date();
        if (promo.startDate && now < promo.startDate) {
            return { valid: false, message: `Promo code "${codeClean}" is not active yet (starts ${promo.startDate.toISOString().split('T')[0]})` };
        }
        if (promo.endDate) {
            const endOfDay = new Date(promo.endDate);
            endOfDay.setHours(23, 59, 59, 999);
            if (now > endOfDay) {
                return { valid: false, message: `Promo code "${codeClean}" has expired` };
            }
        }
        // Usage limit check
        if (promo.maxUses !== null && promo.currentUses >= promo.maxUses) {
            return { valid: false, message: `Promo code "${codeClean}" has reached its maximum usage limit (${promo.maxUses})` };
        }
        // Fetch client details if clientId or clientPhone provided
        let client = null;
        if (input.clientId) {
            client = await database_1.default.client.findUnique({ where: { id: input.clientId } });
        }
        else if (input.clientPhone) {
            client = await database_1.default.client.findFirst({
                where: {
                    OR: [{ phone: input.clientPhone }, { whatsapp: input.clientPhone }],
                },
            });
        }
        // Self-Referral Prevention: Marketer phone != Client phone
        const clientPhoneNorm = normalizePhone(input.clientPhone || client?.phone || client?.whatsapp);
        const marketerPhoneNorm = normalizePhone(promo.influencer.phone);
        if (clientPhoneNorm && marketerPhoneNorm && (clientPhoneNorm === marketerPhoneNorm || clientPhoneNorm.includes(marketerPhoneNorm) || marketerPhoneNorm.includes(clientPhoneNorm))) {
            return {
                valid: false,
                message: 'Self-referral is forbidden: Influencer cannot use their own promo code',
            };
        }
        // Duplicate client usage check (unless allowRepeatClient is true)
        if (client && !promo.allowRepeatClient) {
            const priorUsage = await database_1.default.promoCodeUsage.findFirst({
                where: {
                    promoCodeId: promo.id,
                    clientId: client.id,
                },
            });
            if (priorUsage) {
                return {
                    valid: false,
                    message: 'This client has already used this promo code (one-time use per customer)',
                };
            }
        }
        // VIP Stacking Validation
        const isVipClient = client && client.clientType === 'VIP';
        if (isVipClient && !promo.stackableWithVip) {
            return {
                valid: false,
                message: 'This promo code cannot be stacked with VIP client benefits unless enabled by admin',
                isStackableWithVip: false,
            };
        }
        const subtotal = Math.max(0, input.subtotal || 0);
        const discountRate = Number(promo.discountPercent);
        const discountAmount = Math.round((subtotal * discountRate) / 100);
        const netAmount = Math.max(0, subtotal - discountAmount);
        return {
            valid: true,
            promoCode: {
                id: promo.id,
                code: promo.code,
                discountPercent: discountRate,
                commissionPercent: Number(promo.commissionPercent),
                stackableWithVip: promo.stackableWithVip,
                influencerId: promo.influencer.id,
                influencerName: promo.influencer.name,
                influencerPhone: promo.influencer.phone,
            },
            discountAmount,
            netAmount,
            isStackableWithVip: promo.stackableWithVip,
        };
    }
    // -------------------------------------------------------------
    // APPLY PROMO CODE TO INVOICE & PERMANENT REFERRAL ATTRIBUTION
    // -------------------------------------------------------------
    async applyPromoCodeToInvoice(invoiceId, promoCodeString, tx) {
        const db = tx || database_1.default;
        const invoice = await db.invoice.findUnique({
            where: { id: invoiceId },
            include: { client: true },
        });
        if (!invoice) {
            throw new errorHandler_1.AppError('Invoice not found', constants_1.HTTP_STATUS.NOT_FOUND);
        }
        const validation = await this.validatePromoCode({
            code: promoCodeString,
            clientId: invoice.clientId || undefined,
            clientPhone: invoice.clientPhone || undefined,
            subtotal: Number(invoice.subtotal),
        });
        if (!validation.valid || !validation.promoCode) {
            throw new errorHandler_1.AppError(validation.message || 'Invalid promo code', constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        const promo = await db.promoCode.findUnique({
            where: { id: validation.promoCode.id },
            include: { influencer: true },
        });
        if (!promo)
            throw new errorHandler_1.AppError('Promo code not found', constants_1.HTTP_STATUS.NOT_FOUND);
        const discountAmount = validation.discountAmount || 0;
        const newTotal = Math.max(0, Number(invoice.subtotal) - discountAmount);
        // 1. Update Invoice with promo details
        const updatedInvoice = await db.invoice.update({
            where: { id: invoiceId },
            data: {
                promoCodeId: promo.id,
                promoDiscount: new client_1.Prisma.Decimal(discountAmount),
                discount: new client_1.Prisma.Decimal(discountAmount),
                total: new client_1.Prisma.Decimal(newTotal),
            },
        });
        // 2. Increment promo current uses
        await db.promoCode.update({
            where: { id: promo.id },
            data: { currentUses: { increment: 1 } },
        });
        // 3. Record PromoCodeUsage if client exists
        if (invoice.clientId) {
            await db.promoCodeUsage.create({
                data: {
                    promoCodeId: promo.id,
                    invoiceId: invoice.id,
                    clientId: invoice.clientId,
                    discountAmount: new client_1.Prisma.Decimal(discountAmount),
                },
            });
            // 4. Permanent first referral attribution: Tag client.referredByPromoCodeId
            // Only set if not already referred by another promo code (first code only, permanent)
            if (!invoice.client?.referredByPromoCodeId) {
                await db.client.update({
                    where: { id: invoice.clientId },
                    data: {
                        referredByPromoCodeId: promo.id,
                        referredByInfluencerId: promo.influencerId,
                    },
                });
            }
        }
        return updatedInvoice;
    }
    // -------------------------------------------------------------
    // INFLUENCER COMMISSION GENERATION (ON PAID INVOICES ONLY)
    // -------------------------------------------------------------
    async generateCommissionForInvoice(invoiceId, tx) {
        const db = tx || database_1.default;
        const invoice = await db.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                promoCode: { include: { influencer: true } },
                client: true,
            },
        });
        if (!invoice || !invoice.promoCodeId || !invoice.promoCode) {
            return null; // No promo code applied
        }
        // STRICT RULE: Only PAID invoices generate commission!
        if (invoice.status !== client_1.InvoiceStatus.PAID) {
            logger_1.logger.info(`[Influencers] Invoice ${invoice.invoiceNumber} is not PAID yet. Commission will be generated upon full payment.`);
            return null;
        }
        // Duplicate check: Prevent duplicate commission for same (invoice, promoCode)
        const existingCommission = await db.influencerCommission.findUnique({
            where: {
                invoiceId_promoCodeId: {
                    invoiceId: invoice.id,
                    promoCodeId: invoice.promoCodeId,
                },
            },
        });
        if (existingCommission) {
            logger_1.logger.info(`[Influencers] Commission already exists for Invoice ${invoice.invoiceNumber}`);
            return existingCommission;
        }
        // Client must exist for attribution
        if (!invoice.clientId) {
            logger_1.logger.warn(`[Influencers] Walk-in invoice ${invoice.invoiceNumber} has no linked client, skipping influencer commission.`);
            return null;
        }
        // Calculation: Commission = Final Price after discount x Commission %
        const basePaidAmount = Number(invoice.total);
        const commissionRate = Number(invoice.promoCode.commissionPercent);
        const commissionAmount = Math.round((basePaidAmount * commissionRate) / 100);
        const commission = await db.influencerCommission.create({
            data: {
                influencerId: invoice.promoCode.influencerId,
                promoCodeId: invoice.promoCodeId,
                invoiceId: invoice.id,
                clientId: invoice.clientId,
                basePaidAmount: new client_1.Prisma.Decimal(basePaidAmount),
                commissionRate: new client_1.Prisma.Decimal(commissionRate),
                commissionAmount: new client_1.Prisma.Decimal(commissionAmount),
                status: client_1.InfluencerCommissionStatus.APPROVED,
            },
        });
        logger_1.logger.info(`[Influencers] Generated commission of ${commissionAmount} FCFA (${commissionRate}%) for Influencer ${invoice.promoCode.influencer.name} on Invoice ${invoice.invoiceNumber}`);
        // Auto-WhatsApp marketer on each use (bilingual Douala support)
        this.sendInfluencerUsageNotification({
            influencerName: invoice.promoCode.influencer.name,
            influencerPhone: invoice.promoCode.influencer.phone,
            promoCode: invoice.promoCode.code,
            invoiceNumber: invoice.invoiceNumber,
            amountPaid: basePaidAmount,
            commissionEarned: commissionAmount,
            commissionRate,
        }).catch((err) => {
            logger_1.logger.warn('[Influencers] Auto-WhatsApp to marketer failed (non-blocking)', err);
        });
        return commission;
    }
    // -------------------------------------------------------------
    // REFUND REVERSAL (FULL OR PROPORTIONAL)
    // -------------------------------------------------------------
    async reverseCommissionOnRefund(input, tx) {
        const db = tx || database_1.default;
        const commissions = await db.influencerCommission.findMany({
            where: { invoiceId: input.invoiceId },
            include: { invoice: true },
        });
        if (commissions.length === 0)
            return [];
        const results = [];
        for (const comm of commissions) {
            if (comm.status === client_1.InfluencerCommissionStatus.REVERSED) {
                continue;
            }
            const originalCommission = Number(comm.commissionAmount);
            let amountToReverse = originalCommission;
            if (input.isPartial && input.refundedAmount && input.totalInvoiceAmount) {
                const refundRatio = Math.min(1, input.refundedAmount / input.totalInvoiceAmount);
                amountToReverse = Math.round(originalCommission * refundRatio);
            }
            const newReversedAmount = Math.min(originalCommission, Number(comm.reversedAmount) + amountToReverse);
            const isFullyReversed = newReversedAmount >= originalCommission;
            const updated = await db.influencerCommission.update({
                where: { id: comm.id },
                data: {
                    reversedAmount: new client_1.Prisma.Decimal(newReversedAmount),
                    status: isFullyReversed ? client_1.InfluencerCommissionStatus.REVERSED : comm.status,
                    notes: input.reason
                        ? `${comm.notes ? comm.notes + ' | ' : ''}Refund reversed ${amountToReverse} FCFA: ${input.reason}`
                        : comm.notes,
                },
            });
            logger_1.logger.info(`[Influencers] Commission ${comm.id} reversed by ${amountToReverse} FCFA (Total reversed: ${newReversedAmount}/${originalCommission})`);
            results.push(updated);
        }
        return results;
    }
    // -------------------------------------------------------------
    // ADMIN PAYOUT MANAGEMENT
    // -------------------------------------------------------------
    async createPayout(data, staffId) {
        const influencer = await this.getInfluencerById(data.influencerId);
        if (!influencer) {
            throw new errorHandler_1.AppError('Influencer not found', constants_1.HTTP_STATUS.NOT_FOUND);
        }
        if (data.amount <= 0) {
            throw new errorHandler_1.AppError('Payout amount must be greater than zero', constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        if (data.amount > influencer.availableBalance) {
            throw new errorHandler_1.AppError(`Payout amount (${data.amount.toLocaleString()} FCFA) exceeds available approved balance (${influencer.availableBalance.toLocaleString()} FCFA)`, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        return database_1.default.$transaction(async (tx) => {
            const payout = await tx.influencerPayout.create({
                data: {
                    influencerId: data.influencerId,
                    amount: new client_1.Prisma.Decimal(data.amount),
                    payoutMethod: data.payoutMethod,
                    reference: data.reference ? data.reference.trim() : null,
                    notes: data.notes ? data.notes.trim() : null,
                    paidById: staffId,
                },
                include: {
                    influencer: true,
                    paidBy: {
                        select: { id: true, email: true, staffProfile: { select: { name: true } } },
                    },
                },
            });
            // Update commission records to PAID where balance allows
            let remainingToCover = data.amount;
            const unpaidCommissions = await tx.influencerCommission.findMany({
                where: {
                    influencerId: data.influencerId,
                    status: client_1.InfluencerCommissionStatus.APPROVED,
                    payoutId: null,
                },
                orderBy: { createdAt: 'asc' },
            });
            for (const comm of unpaidCommissions) {
                if (remainingToCover <= 0)
                    break;
                const netComm = Number(comm.commissionAmount) - Number(comm.reversedAmount);
                if (netComm <= 0)
                    continue;
                await tx.influencerCommission.update({
                    where: { id: comm.id },
                    data: {
                        payoutId: payout.id,
                        status: client_1.InfluencerCommissionStatus.PAID,
                    },
                });
                remainingToCover -= netComm;
            }
            return payout;
        });
    }
    async getPayouts(influencerId) {
        const where = {};
        if (influencerId)
            where.influencerId = influencerId;
        return database_1.default.influencerPayout.findMany({
            where,
            orderBy: { paidAt: 'desc' },
            include: {
                influencer: { select: { id: true, name: true, phone: true } },
                paidBy: { select: { id: true, email: true, staffProfile: { select: { name: true } } } },
            },
        });
    }
    // -------------------------------------------------------------
    // AUTO-WHATSAPP NOTIFICATION TO MARKETER
    // -------------------------------------------------------------
    async sendInfluencerUsageNotification(params) {
        const frMessage = `🎉 Bonjour ${params.influencerName} ! Votre code promo ${params.promoCode} vient d'être utilisé chez OMEGA SPA (Facture: ${params.invoiceNumber}). Montant payé : ${params.amountPaid.toLocaleString()} FCFA. Votre commission gagnée : ${params.commissionEarned.toLocaleString()} FCFA (${params.commissionRate}%). Merci d'être un ambassadeur OMEGA SPA !`;
        await whatsapp_adapter_1.whatsappAdapter.sendMessage({
            to: params.influencerPhone,
            message: frMessage,
            idempotencyKey: `inf-notif-${params.invoiceNumber}-${Date.now()}`,
        });
    }
}
exports.InfluencersService = InfluencersService;
exports.influencersService = new InfluencersService();
//# sourceMappingURL=influencers.service.js.map