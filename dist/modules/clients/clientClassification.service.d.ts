/**
 * OMEGA SPA POS — Client Type Classification Service
 *
 * Implements Module 4 Client Type Classification rules:
 * - VIP: Spend >= 300,000 XAF OR visits >= 15 OR manually assigned by Manager.
 *   VIP CANNOT BE DOWNGRADED AUTOMATICALLY.
 * - REGULAR: >= 2 bookings OR (Spend > 50,000 XAF AND visited within last 90 days).
 *   Downgrades to PROSPECT if no visit for 180 days -> triggers Win-Back.
 * - NEW: First booking, within 30 days.
 * - PROSPECT: Zero paid bookings.
 *
 * Timezone: Africa/Douala (UTC+1).
 */
import { ClientType, UpdateClientTypeInput, ClassificationResult, AuthContextUser } from './clients.types';
export declare class ClientClassificationService {
    /**
     * Calculate verified eligible spend and paid visits for a client.
     * Prevents duplicate counting of invoices and excludes full refunds.
     */
    getClientMetrics(clientId: string): Promise<{
        eligibleSpend: number;
        paidVisits: number;
        lastVisitDate: Date | null;
        firstVisitDate: Date | null;
    }>;
    /**
     * Determine deterministic client type based on strict client requirements:
     * Priority: VIP -> REGULAR -> NEW -> PROSPECT.
     */
    determineClientType(currentType: string, isVipManuallyAssigned: boolean, metrics: {
        eligibleSpend: number;
        paidVisits: number;
        lastVisitDate: Date | null;
        firstVisitDate: Date | null;
    }, now?: Date): {
        targetType: ClientType;
        reason: string;
        actionTaken: 'UPGRADED' | 'DOWNGRADED' | 'MAINTAINED' | 'PROTECTED_VIP';
    };
    /**
     * Classify a single client and persist metrics & audit logs if changed.
     */
    classifyClient(clientId: string): Promise<ClassificationResult>;
    /**
     * Run classification for ALL active clients (Midnight Cron or manual execution).
     */
    classifyAllClients(): Promise<{
        totalProcessed: number;
        upgraded: number;
        downgraded: number;
        maintained: number;
        protectedVip: number;
        results: ClassificationResult[];
    }>;
    /**
     * Manual override of client type by Manager.
     * Reason is MANDATORY.
     * VIP downgrade requires Manager role.
     */
    manualOverrideClientType(clientId: string, input: UpdateClientTypeInput, authUser: AuthContextUser): Promise<{
        client: any;
        auditLog: any;
    }>;
    /**
     * Retrieve audit history of client type changes with staff attribution.
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
     * Trigger appropriate automated campaigns when client type changes.
     */
    private triggerReclassificationAutomations;
}
export declare const clientClassificationService: ClientClassificationService;
//# sourceMappingURL=clientClassification.service.d.ts.map