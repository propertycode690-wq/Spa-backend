import { InfluencerStatus, Prisma } from '@prisma/client';
import { CreateInfluencerInput, UpdateInfluencerInput, CreatePromoCodeInput, UpdatePromoCodeInput, ValidatePromoCodeInput, PromoValidationResult, CreatePayoutInput, ReverseCommissionInput } from './influencers.types';
export declare class InfluencersService {
    createInfluencer(data: CreateInfluencerInput): Promise<{
        promoCodes: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            influencerId: string;
            discountPercent: Prisma.Decimal;
            commissionPercent: Prisma.Decimal;
            startDate: Date | null;
            endDate: Date | null;
            maxUses: number | null;
            currentUses: number;
            allowRepeatClient: boolean;
            stackableWithVip: boolean;
        }[];
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.InfluencerStatus;
        notes: string | null;
        instagram: string | null;
    }>;
    getInfluencers(status?: InfluencerStatus): Promise<{
        id: string;
        name: string;
        phone: string;
        instagram: string | null;
        status: import(".prisma/client").$Enums.InfluencerStatus;
        notes: string | null;
        createdAt: Date;
        promoCodes: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            influencerId: string;
            discountPercent: Prisma.Decimal;
            commissionPercent: Prisma.Decimal;
            startDate: Date | null;
            endDate: Date | null;
            maxUses: number | null;
            currentUses: number;
            allowRepeatClient: boolean;
            stackableWithVip: boolean;
        }[];
        totalReferredClients: number;
        totalEarned: number;
        totalPaidOut: number;
        availableBalance: number;
    }[]>;
    getInfluencerById(id: string): Promise<{
        totalEarned: number;
        totalPaidOut: number;
        availableBalance: number;
        commissions: ({
            client: {
                id: string;
                phone: string;
                name: string;
            } | null;
            invoice: {
                id: string;
                date: Date;
                invoiceNumber: string;
                total: Prisma.Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            commissionRate: Prisma.Decimal;
            status: import(".prisma/client").$Enums.InfluencerCommissionStatus;
            clientId: string | null;
            invoiceId: string;
            notes: string | null;
            promoCodeId: string;
            influencerId: string;
            payoutId: string | null;
            basePaidAmount: Prisma.Decimal;
            commissionAmount: Prisma.Decimal;
            reversedAmount: Prisma.Decimal;
        })[];
        promoCodes: ({
            usages: ({
                client: {
                    id: string;
                    phone: string;
                    name: string;
                } | null;
                invoice: {
                    id: string;
                    date: Date;
                    invoiceNumber: string;
                    total: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                clientId: string | null;
                invoiceId: string;
                promoCodeId: string;
                discountAmount: Prisma.Decimal;
            })[];
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            influencerId: string;
            discountPercent: Prisma.Decimal;
            commissionPercent: Prisma.Decimal;
            startDate: Date | null;
            endDate: Date | null;
            maxUses: number | null;
            currentUses: number;
            allowRepeatClient: boolean;
            stackableWithVip: boolean;
        })[];
        payouts: ({
            paidBy: {
                staffProfile: {
                    name: string;
                } | null;
                id: string;
                email: string;
            } | null;
        } & {
            id: string;
            notes: string | null;
            paidAt: Date;
            amount: Prisma.Decimal;
            influencerId: string;
            payoutMethod: import(".prisma/client").$Enums.InfluencerPayoutMethod;
            reference: string | null;
            paidById: string | null;
        })[];
        referredClients: {
            id: string;
            phone: string;
            createdAt: Date;
            name: string;
            clientType: string;
            totalEligibleSpend: Prisma.Decimal;
        }[];
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.InfluencerStatus;
        notes: string | null;
        instagram: string | null;
    }>;
    updateInfluencer(id: string, data: UpdateInfluencerInput): Promise<{
        promoCodes: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            influencerId: string;
            discountPercent: Prisma.Decimal;
            commissionPercent: Prisma.Decimal;
            startDate: Date | null;
            endDate: Date | null;
            maxUses: number | null;
            currentUses: number;
            allowRepeatClient: boolean;
            stackableWithVip: boolean;
        }[];
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.InfluencerStatus;
        notes: string | null;
        instagram: string | null;
    }>;
    createPromoCode(data: CreatePromoCodeInput): Promise<{
        influencer: {
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.InfluencerStatus;
            notes: string | null;
            instagram: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        influencerId: string;
        discountPercent: Prisma.Decimal;
        commissionPercent: Prisma.Decimal;
        startDate: Date | null;
        endDate: Date | null;
        maxUses: number | null;
        currentUses: number;
        allowRepeatClient: boolean;
        stackableWithVip: boolean;
    }>;
    getPromoCodes(influencerId?: string): Promise<({
        influencer: {
            id: string;
            phone: string;
            name: string;
            status: import(".prisma/client").$Enums.InfluencerStatus;
            instagram: string | null;
        };
        _count: {
            referredClients: number;
            usages: number;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        influencerId: string;
        discountPercent: Prisma.Decimal;
        commissionPercent: Prisma.Decimal;
        startDate: Date | null;
        endDate: Date | null;
        maxUses: number | null;
        currentUses: number;
        allowRepeatClient: boolean;
        stackableWithVip: boolean;
    })[]>;
    updatePromoCode(id: string, data: UpdatePromoCodeInput): Promise<{
        influencer: {
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.InfluencerStatus;
            notes: string | null;
            instagram: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        influencerId: string;
        discountPercent: Prisma.Decimal;
        commissionPercent: Prisma.Decimal;
        startDate: Date | null;
        endDate: Date | null;
        maxUses: number | null;
        currentUses: number;
        allowRepeatClient: boolean;
        stackableWithVip: boolean;
    }>;
    validatePromoCode(input: ValidatePromoCodeInput): Promise<PromoValidationResult>;
    applyPromoCodeToInvoice(invoiceId: string, promoCodeString: string, tx?: Prisma.TransactionClient): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        date: Date;
        clientName: string | null;
        clientId: string | null;
        appointmentId: string | null;
        invoiceNumber: string;
        clientPhone: string | null;
        subtotal: Prisma.Decimal;
        discount: Prisma.Decimal;
        total: Prisma.Decimal;
        pointsEarned: number;
        pointsRedeemed: number;
        promoCodeId: string | null;
        promoDiscount: Prisma.Decimal;
        vipDiscount: Prisma.Decimal;
    }>;
    generateCommissionForInvoice(invoiceId: string, tx?: Prisma.TransactionClient): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        commissionRate: Prisma.Decimal;
        status: import(".prisma/client").$Enums.InfluencerCommissionStatus;
        clientId: string | null;
        invoiceId: string;
        notes: string | null;
        promoCodeId: string;
        influencerId: string;
        payoutId: string | null;
        basePaidAmount: Prisma.Decimal;
        commissionAmount: Prisma.Decimal;
        reversedAmount: Prisma.Decimal;
    } | null>;
    reverseCommissionOnRefund(input: ReverseCommissionInput, tx?: Prisma.TransactionClient): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        commissionRate: Prisma.Decimal;
        status: import(".prisma/client").$Enums.InfluencerCommissionStatus;
        clientId: string | null;
        invoiceId: string;
        notes: string | null;
        promoCodeId: string;
        influencerId: string;
        payoutId: string | null;
        basePaidAmount: Prisma.Decimal;
        commissionAmount: Prisma.Decimal;
        reversedAmount: Prisma.Decimal;
    }[]>;
    createPayout(data: CreatePayoutInput, staffId: string): Promise<{
        influencer: {
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.InfluencerStatus;
            notes: string | null;
            instagram: string | null;
        };
        paidBy: {
            staffProfile: {
                name: string;
            } | null;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        notes: string | null;
        paidAt: Date;
        amount: Prisma.Decimal;
        influencerId: string;
        payoutMethod: import(".prisma/client").$Enums.InfluencerPayoutMethod;
        reference: string | null;
        paidById: string | null;
    }>;
    getPayouts(influencerId?: string): Promise<({
        influencer: {
            id: string;
            phone: string;
            name: string;
        };
        paidBy: {
            staffProfile: {
                name: string;
            } | null;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        notes: string | null;
        paidAt: Date;
        amount: Prisma.Decimal;
        influencerId: string;
        payoutMethod: import(".prisma/client").$Enums.InfluencerPayoutMethod;
        reference: string | null;
        paidById: string | null;
    })[]>;
    private sendInfluencerUsageNotification;
}
export declare const influencersService: InfluencersService;
//# sourceMappingURL=influencers.service.d.ts.map