import { CreateClientInput, UpdateClientInput, UpdateClientPreferencesInput, AddClientMediaInput, ClientQueryFilter, AuthContextUser } from './clients.types';
/**
 * Safely parse a celebration date (Birthday or Anniversary).
 * Accepts:
 * - Full date: "1990-05-14", "1990/05/14", ISO string
 * - Day & Month only: "05-14", "14-05", "14/05", "05/14", etc.
 * Defaults missing year to 2000 (leap year) so MySQL DATE is valid and Feb 29 is preserved.
 */
export declare function parseCelebrationDate(val?: string | null): Date | null;
export declare class ClientsService {
    createClient(data: CreateClientInput, authUser: AuthContextUser): Promise<{
        introducedByEmployee: {
            staffProfile: {
                name: string;
            } | null;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        whatsapp: string | null;
        quartier: string | null;
        birthday: Date | null;
        anniversary: Date | null;
        gender: string;
        preferredLanguage: string;
        holidayPreference: string;
        clientType: string;
        source: import(".prisma/client").$Enums.ClientSource;
        introducedByEmployeeId: string | null;
        referredByClientId: string | null;
        recommendedByName: string | null;
        recommendedByPhone: string | null;
        lastServiceDate: Date | null;
        recommendedByDate: Date | null;
        firstAppointmentService: string | null;
        isVipManuallyAssigned: boolean;
        vipAssignedAt: Date | null;
        lastClassificationAt: Date | null;
        totalEligibleSpend: import("@prisma/client/runtime/library").Decimal;
        paidVisitsCount: number;
        noShowCount: number;
        lastVisitAt: Date | null;
        referredByPromoCodeId: string | null;
        referredByInfluencerId: string | null;
    }>;
    getClients(query: ClientQueryFilter, authUser?: AuthContextUser): Promise<{
        clients: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getClientById(id: string, authUser?: AuthContextUser): Promise<any>;
    updateClient(id: string, data: UpdateClientInput, authUser: AuthContextUser): Promise<{
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        whatsapp: string | null;
        quartier: string | null;
        birthday: Date | null;
        anniversary: Date | null;
        gender: string;
        preferredLanguage: string;
        holidayPreference: string;
        clientType: string;
        source: import(".prisma/client").$Enums.ClientSource;
        introducedByEmployeeId: string | null;
        referredByClientId: string | null;
        recommendedByName: string | null;
        recommendedByPhone: string | null;
        lastServiceDate: Date | null;
        recommendedByDate: Date | null;
        firstAppointmentService: string | null;
        isVipManuallyAssigned: boolean;
        vipAssignedAt: Date | null;
        lastClassificationAt: Date | null;
        totalEligibleSpend: import("@prisma/client/runtime/library").Decimal;
        paidVisitsCount: number;
        noShowCount: number;
        lastVisitAt: Date | null;
        referredByPromoCodeId: string | null;
        referredByInfluencerId: string | null;
    }>;
    setClientStatus(id: string, status: 'ACTIVE' | 'INACTIVE', authUser: AuthContextUser): Promise<{
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        whatsapp: string | null;
        quartier: string | null;
        birthday: Date | null;
        anniversary: Date | null;
        gender: string;
        preferredLanguage: string;
        holidayPreference: string;
        clientType: string;
        source: import(".prisma/client").$Enums.ClientSource;
        introducedByEmployeeId: string | null;
        referredByClientId: string | null;
        recommendedByName: string | null;
        recommendedByPhone: string | null;
        lastServiceDate: Date | null;
        recommendedByDate: Date | null;
        firstAppointmentService: string | null;
        isVipManuallyAssigned: boolean;
        vipAssignedAt: Date | null;
        lastClassificationAt: Date | null;
        totalEligibleSpend: import("@prisma/client/runtime/library").Decimal;
        paidVisitsCount: number;
        noShowCount: number;
        lastVisitAt: Date | null;
        referredByPromoCodeId: string | null;
        referredByInfluencerId: string | null;
    }>;
    deactivateClient(id: string, authUser: AuthContextUser): Promise<{
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        whatsapp: string | null;
        quartier: string | null;
        birthday: Date | null;
        anniversary: Date | null;
        gender: string;
        preferredLanguage: string;
        holidayPreference: string;
        clientType: string;
        source: import(".prisma/client").$Enums.ClientSource;
        introducedByEmployeeId: string | null;
        referredByClientId: string | null;
        recommendedByName: string | null;
        recommendedByPhone: string | null;
        lastServiceDate: Date | null;
        recommendedByDate: Date | null;
        firstAppointmentService: string | null;
        isVipManuallyAssigned: boolean;
        vipAssignedAt: Date | null;
        lastClassificationAt: Date | null;
        totalEligibleSpend: import("@prisma/client/runtime/library").Decimal;
        paidVisitsCount: number;
        noShowCount: number;
        lastVisitAt: Date | null;
        referredByPromoCodeId: string | null;
        referredByInfluencerId: string | null;
    }>;
    activateClient(id: string, authUser: AuthContextUser): Promise<{
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        whatsapp: string | null;
        quartier: string | null;
        birthday: Date | null;
        anniversary: Date | null;
        gender: string;
        preferredLanguage: string;
        holidayPreference: string;
        clientType: string;
        source: import(".prisma/client").$Enums.ClientSource;
        introducedByEmployeeId: string | null;
        referredByClientId: string | null;
        recommendedByName: string | null;
        recommendedByPhone: string | null;
        lastServiceDate: Date | null;
        recommendedByDate: Date | null;
        firstAppointmentService: string | null;
        isVipManuallyAssigned: boolean;
        vipAssignedAt: Date | null;
        lastClassificationAt: Date | null;
        totalEligibleSpend: import("@prisma/client/runtime/library").Decimal;
        paidVisitsCount: number;
        noShowCount: number;
        lastVisitAt: Date | null;
        referredByPromoCodeId: string | null;
        referredByInfluencerId: string | null;
    }>;
    addClientMedia(clientId: string, data: AddClientMediaInput, authUser: AuthContextUser): Promise<{
        id: string;
        createdAt: Date;
        mediaType: import(".prisma/client").$Enums.MediaType;
        fileUrl: string;
        note: string | null;
        clientId: string;
        publicId: string | null;
        uploadedBy: string | null;
    }>;
    getClientHistory(clientId: string): Promise<{
        id: string;
        createdAt: Date;
        clientId: string;
        action: string;
        details: string | null;
        performedBy: string | null;
    }[]>;
    /**
     * Update client demographic preferences with audit logging (Phase 2A)
     */
    updateClientPreferences(clientId: string, data: UpdateClientPreferencesInput, authUser: AuthContextUser): Promise<{
        id: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        whatsapp: string | null;
        quartier: string | null;
        birthday: Date | null;
        anniversary: Date | null;
        gender: string;
        preferredLanguage: string;
        holidayPreference: string;
        clientType: string;
        source: import(".prisma/client").$Enums.ClientSource;
        introducedByEmployeeId: string | null;
        referredByClientId: string | null;
        recommendedByName: string | null;
        recommendedByPhone: string | null;
        lastServiceDate: Date | null;
        recommendedByDate: Date | null;
        firstAppointmentService: string | null;
        isVipManuallyAssigned: boolean;
        vipAssignedAt: Date | null;
        lastClassificationAt: Date | null;
        totalEligibleSpend: import("@prisma/client/runtime/library").Decimal;
        paidVisitsCount: number;
        noShowCount: number;
        lastVisitAt: Date | null;
        referredByPromoCodeId: string | null;
        referredByInfluencerId: string | null;
    }>;
    /**
     * Retrieve audit history of customer preference changes (Phase 2A)
     */
    getPreferencesAudit(clientId: string): Promise<({
        staff: {
            staffProfile: {
                name: string;
            } | null;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        clientId: string;
        staffId: string | null;
        field: string;
        oldValue: string | null;
        newValue: string;
    })[]>;
    /**
     * Module 4: Manual override of Client Type (VIP, REGULAR, NEW, PROSPECT) with mandatory reason.
     */
    updateClientType(clientId: string, input: any, authUser: AuthContextUser): Promise<{
        client: any;
        auditLog: any;
    }>;
    /**
     * Module 4: Get Client Type classification audit trail.
     */
    getClientTypeAudit(clientId: string): Promise<({
        staff: {
            staffProfile: {
                name: string;
            } | null;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        reason: string;
        clientId: string;
        oldType: string | null;
        newType: string;
        isManual: boolean;
        staffId: string | null;
    })[]>;
    /**
     * Module 4: Trigger classification on demand (single or all active clients).
     */
    runClassification(clientId?: string): Promise<import("./clients.types").ClassificationResult | {
        totalProcessed: number;
        upgraded: number;
        downgraded: number;
        maintained: number;
        protectedVip: number;
        results: import("./clients.types").ClassificationResult[];
    }>;
}
export declare const clientsService: ClientsService;
//# sourceMappingURL=clients.service.d.ts.map