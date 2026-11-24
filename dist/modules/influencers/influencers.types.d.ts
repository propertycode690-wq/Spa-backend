import { InfluencerStatus, InfluencerPayoutMethod } from '@prisma/client';
export interface CreateInfluencerInput {
    name: string;
    phone: string;
    instagram?: string;
    notes?: string;
    status?: InfluencerStatus;
}
export interface UpdateInfluencerInput {
    name?: string;
    phone?: string;
    instagram?: string;
    notes?: string;
    status?: InfluencerStatus;
}
export interface CreatePromoCodeInput {
    influencerId: string;
    code: string;
    discountPercent: number;
    commissionPercent: number;
    startDate?: string | Date;
    endDate?: string | Date;
    maxUses?: number;
    allowRepeatClient?: boolean;
    stackableWithVip?: boolean;
    isActive?: boolean;
}
export interface UpdatePromoCodeInput {
    discountPercent?: number;
    commissionPercent?: number;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    maxUses?: number | null;
    allowRepeatClient?: boolean;
    stackableWithVip?: boolean;
    isActive?: boolean;
}
export interface ValidatePromoCodeInput {
    code: string;
    clientId?: string;
    clientPhone?: string;
    subtotal: number;
}
export interface PromoValidationResult {
    valid: boolean;
    message?: string;
    promoCode?: {
        id: string;
        code: string;
        discountPercent: number;
        commissionPercent: number;
        stackableWithVip: boolean;
        influencerId: string;
        influencerName: string;
        influencerPhone: string;
    };
    discountAmount?: number;
    netAmount?: number;
    isStackableWithVip?: boolean;
}
export interface CreatePayoutInput {
    influencerId: string;
    amount: number;
    payoutMethod: InfluencerPayoutMethod;
    reference?: string;
    notes?: string;
}
export interface ReverseCommissionInput {
    invoiceId: string;
    reason?: string;
    isPartial?: boolean;
    refundedAmount?: number;
    totalInvoiceAmount?: number;
}
//# sourceMappingURL=influencers.types.d.ts.map