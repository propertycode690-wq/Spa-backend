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

import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { HTTP_STATUS } from '../../config/constants';
import { logger } from '../../utils/logger';
import {
  ClientType,
  UpdateClientTypeInput,
  ClassificationResult,
  AuthContextUser,
} from './clients.types';
import { normalizeClientType } from './clients.validation';

const DOUALA_TIMEZONE = 'Africa/Douala';

export class ClientClassificationService {
  /**
   * Calculate verified eligible spend and paid visits for a client.
   * Prevents duplicate counting of invoices and excludes full refunds.
   */
  async getClientMetrics(clientId: string): Promise<{
    eligibleSpend: number;
    paidVisits: number;
    lastVisitDate: Date | null;
    firstVisitDate: Date | null;
  }> {
    // 1. Fetch all PAID invoices for this client
    const paidInvoices = await prisma.invoice.findMany({
      where: {
        clientId,
        status: 'PAID',
      },
      select: {
        id: true,
        total: true,
        subtotal: true,
        discount: true,
        date: true,
        createdAt: true,
        appointmentId: true,
        payments: {
          select: {
            amount: true,
          },
        },
      },
    });

    let totalSpend = 0;
    const distinctVisitDates = new Set<string>();
    const visitDateObjects: Date[] = [];

    for (const inv of paidInvoices) {
      // Net paid amount: either sum of payments or invoice total
      const paidSum = inv.payments && inv.payments.length > 0
        ? inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
        : Number(inv.total) || 0;
      totalSpend += paidSum;

      // Group visits by date (YYYY-MM-DD in Douala time) to prevent duplicate counting
      const visitDate = inv.date || inv.createdAt;
      const dStr = visitDate.toISOString().slice(0, 10);
      distinctVisitDates.add(dStr);
      visitDateObjects.push(visitDate);
    }

    // Also check completed appointments
    const completedAppts = await prisma.appointment.findMany({
      where: {
        clientId,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        appointmentDate: true,
      },
    });

    for (const appt of completedAppts) {
      const dStr = appt.appointmentDate.toISOString().slice(0, 10);
      distinctVisitDates.add(dStr);
      visitDateObjects.push(appt.appointmentDate);
    }

    // Sort visit dates to find first and latest
    visitDateObjects.sort((a, b) => a.getTime() - b.getTime());

    const firstVisitDate = visitDateObjects.length > 0 ? visitDateObjects[0] : null;
    const lastVisitDate = visitDateObjects.length > 0 ? visitDateObjects[visitDateObjects.length - 1] : null;

    return {
      eligibleSpend: Math.round(totalSpend),
      paidVisits: distinctVisitDates.size,
      lastVisitDate,
      firstVisitDate,
    };
  }

  /**
   * Determine deterministic client type based on strict client requirements:
   * Priority: VIP -> REGULAR -> NEW -> PROSPECT.
   */
  determineClientType(
    currentType: string,
    isVipManuallyAssigned: boolean,
    metrics: {
      eligibleSpend: number;
      paidVisits: number;
      lastVisitDate: Date | null;
      firstVisitDate: Date | null;
    },
    now = new Date()
  ): {
    targetType: ClientType;
    reason: string;
    actionTaken: 'UPGRADED' | 'DOWNGRADED' | 'MAINTAINED' | 'PROTECTED_VIP';
  } {
    const { eligibleSpend, paidVisits, lastVisitDate, firstVisitDate } = metrics;
    const msInDay = 24 * 60 * 60 * 1000;

    const daysSinceLastVisit = lastVisitDate
      ? Math.floor((now.getTime() - lastVisitDate.getTime()) / msInDay)
      : null;

    const daysSinceFirstVisit = firstVisitDate
      ? Math.floor((now.getTime() - firstVisitDate.getTime()) / msInDay)
      : null;

    // RULE 1: VIP EVALUATION (Highest Priority)
    // - Total eligible spend >= 300,000 XAF OR
    // - Total eligible visits >= 15 OR
    // - Manually assigned by Manager (cannot be downgraded automatically)
    if (isVipManuallyAssigned) {
      return {
        targetType: 'VIP',
        reason: 'Protected VIP status manually assigned by Manager',
        actionTaken: 'PROTECTED_VIP',
      };
    }

    if (eligibleSpend >= 300000 || paidVisits >= 15) {
      const reason = eligibleSpend >= 300000
        ? `VIP qualified: Total eligible spend ${eligibleSpend.toLocaleString()} XAF >= 300,000 XAF`
        : `VIP qualified: Total visits (${paidVisits}) >= 15`;
      return {
        targetType: 'VIP',
        reason,
        actionTaken: currentType === 'VIP' ? 'MAINTAINED' : 'UPGRADED',
      };
    }

    // VIP DOWNGRADE PROTECTION:
    // If the client is currently a VIP (e.g. previously qualified), NEVER downgrade automatically!
    if (currentType === 'VIP') {
      return {
        targetType: 'VIP',
        reason: 'Existing VIP client preserved. VIP status requires explicit Manager approval to downgrade.',
        actionTaken: 'PROTECTED_VIP',
      };
    }

    // RULE 2: REGULAR EVALUATION & 180-DAY DOWNGRADE RULE
    // Qualified if:
    // - 2 or more bookings OR
    // - Spend > 50,000 XAF AND visited within last 90 days.
    const isRegularQualified =
      paidVisits >= 2 ||
      (eligibleSpend > 50000 && daysSinceLastVisit !== null && daysSinceLastVisit <= 90);

    if (isRegularQualified) {
      // DOWNGRADE RULE: If no visit for 180 days, downgrade Regular to Prospect
      if (daysSinceLastVisit !== null && daysSinceLastVisit > 180) {
        return {
          targetType: 'PROSPECT',
          reason: `Regular client downgraded to Prospect: No visit for ${daysSinceLastVisit} days (exceeds 180-day threshold). Triggering Win-Back.`,
          actionTaken: 'DOWNGRADED',
        };
      }

      return {
        targetType: 'REGULAR',
        reason: paidVisits >= 2
          ? `Regular qualified: ${paidVisits} verified visits`
          : `Regular qualified: Spend ${eligibleSpend.toLocaleString()} XAF > 50,000 XAF with visit within last 90 days (${daysSinceLastVisit}d ago)`,
        actionTaken: currentType === 'REGULAR' ? 'MAINTAINED' : (currentType === 'PROSPECT' ? 'UPGRADED' : 'MAINTAINED'),
      };
    }

    // RULE 3: NEW CLIENT EVALUATION
    // - First booking, within 30 days
    if (paidVisits === 1 && daysSinceFirstVisit !== null && daysSinceFirstVisit <= 30) {
      return {
        targetType: 'NEW',
        reason: `New client: First booking occurred ${daysSinceFirstVisit} days ago (within 30-day window)`,
        actionTaken: currentType === 'NEW' ? 'MAINTAINED' : 'UPGRADED',
      };
    }

    // If first booking was > 30 days ago and only 1 booking:
    // Does not qualify as NEW (>30d) and does not qualify as REGULAR (<2 visits, spend <= 50,000)
    // Evaluates to PROSPECT
    // RULE 4: PROSPECT (Zero paid bookings, or expired single booking)
    return {
      targetType: 'PROSPECT',
      reason: paidVisits === 0
        ? 'Prospect: Zero paid bookings recorded'
        : `Prospect: 1 booking visited ${daysSinceLastVisit ?? 'N/A'} days ago (> 30 days, < 2 visits)`,
      actionTaken: currentType === 'PROSPECT' ? 'MAINTAINED' : 'DOWNGRADED',
    };
  }

  /**
   * Classify a single client and persist metrics & audit logs if changed.
   */
  async classifyClient(clientId: string): Promise<ClassificationResult> {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        phone: true,
        preferredLanguage: true,
        clientType: true,
        isVipManuallyAssigned: true,
        lastVisitAt: true,
      },
    });

    if (!client) {
      throw new AppError('Client not found', HTTP_STATUS.NOT_FOUND);
    }

    const metrics = await this.getClientMetrics(clientId);
    const now = new Date();
    const currentType = client.clientType || 'PROSPECT';

    const decision = this.determineClientType(
      currentType,
      client.isVipManuallyAssigned,
      metrics,
      now
    );

    const msInDay = 24 * 60 * 60 * 1000;
    const daysSinceLastVisit = metrics.lastVisitDate
      ? Math.floor((now.getTime() - metrics.lastVisitDate.getTime()) / msInDay)
      : null;

    // Update client metrics in database
    await prisma.client.update({
      where: { id: clientId },
      data: {
        totalEligibleSpend: metrics.eligibleSpend,
        paidVisitsCount: metrics.paidVisits,
        lastClassificationAt: now,
        ...(metrics.lastVisitDate ? { lastVisitAt: metrics.lastVisitDate } : {}),
        ...(decision.targetType !== currentType ? { clientType: decision.targetType } : {}),
      },
    });

    // If type changed, record audit log and trigger automations
    if (decision.targetType !== currentType) {
      await prisma.clientTypeAuditLog.create({
        data: {
          clientId,
          staffId: null, // System automated classification
          oldType: currentType,
          newType: decision.targetType,
          reason: decision.reason,
          isManual: false,
        },
      });

      await prisma.clientHistory.create({
        data: {
          clientId,
          action: 'CLIENT_TYPE_CLASSIFIED',
          details: `Client reclassified from ${currentType} to ${decision.targetType}: ${decision.reason}`,
          performedBy: 'SYSTEM_CRON',
        },
      });

      // Automated WhatsApp triggers on reclassification
      this.triggerReclassificationAutomations(client, currentType, decision.targetType).catch((err) => {
        logger.warn('[ClientClassification] Automation hook warning:', { error: err?.message || err });
      });
    }

    return {
      clientId,
      clientName: client.name,
      oldType: currentType,
      newType: decision.targetType,
      reason: decision.reason,
      totalSpend: metrics.eligibleSpend,
      paidVisits: metrics.paidVisits,
      daysSinceLastVisit,
      actionTaken: decision.actionTaken,
    };
  }

  /**
   * Run classification for ALL active clients (Midnight Cron or manual execution).
   */
  async classifyAllClients(): Promise<{
    totalProcessed: number;
    upgraded: number;
    downgraded: number;
    maintained: number;
    protectedVip: number;
    results: ClassificationResult[];
  }> {
    const clients = await prisma.client.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    const results: ClassificationResult[] = [];
    let upgraded = 0;
    let downgraded = 0;
    let maintained = 0;
    let protectedVip = 0;

    for (const c of clients) {
      try {
        const res = await this.classifyClient(c.id);
        results.push(res);
        if (res.actionTaken === 'UPGRADED') upgraded++;
        else if (res.actionTaken === 'DOWNGRADED') downgraded++;
        else if (res.actionTaken === 'PROTECTED_VIP') protectedVip++;
        else maintained++;
      } catch (err: any) {
        logger.error(`[ClientClassification] Failed to classify client ${c.id}:`, {
          error: err?.message || err,
        });
      }
    }

    logger.info(`[ClientClassification] Completed run for ${clients.length} clients: ${upgraded} upgraded, ${downgraded} downgraded, ${protectedVip} protected VIP, ${maintained} maintained.`);

    return {
      totalProcessed: clients.length,
      upgraded,
      downgraded,
      maintained,
      protectedVip,
      results,
    };
  }

  /**
   * Manual override of client type by Manager.
   * Reason is MANDATORY.
   * VIP downgrade requires Manager role.
   */
  async manualOverrideClientType(
    clientId: string,
    input: UpdateClientTypeInput,
    authUser: AuthContextUser
  ): Promise<{ client: any; auditLog: any }> {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new AppError('Client not found', HTTP_STATUS.NOT_FOUND);
    }

    const cleanReason = String(input.reason || '').trim();
    if (!cleanReason || cleanReason.length < 3) {
      throw new AppError('Reason is mandatory for manual client type change (minimum 3 characters).', HTTP_STATUS.BAD_REQUEST);
    }

    const newType = normalizeClientType(input.clientType) as ClientType;
    const oldType = (client.clientType || 'PROSPECT') as ClientType;

    if (newType === oldType) {
      throw new AppError(`Client is already classified as ${newType}.`, HTTP_STATUS.BAD_REQUEST);
    }

    // Role-based security for VIP assignment / downgrade:
    // Only MANAGER can assign VIP manually or downgrade an existing VIP.
    const isManager = authUser.role === 'MANAGER';
    if ((oldType === 'VIP' || newType === 'VIP') && !isManager) {
      throw new AppError('Only Managers can manually assign or downgrade VIP client status.', HTTP_STATUS.FORBIDDEN);
    }

    const isVipManuallyAssigned = newType === 'VIP' ? true : (oldType === 'VIP' ? false : client.isVipManuallyAssigned);
    const vipAssignedAt = newType === 'VIP' ? new Date() : (oldType === 'VIP' ? null : client.vipAssignedAt);

    // Atomic update of Client + Audit Log
    const [updatedClient, auditLog] = await prisma.$transaction([
      prisma.client.update({
        where: { id: clientId },
        data: {
          clientType: newType,
          isVipManuallyAssigned,
          vipAssignedAt,
          lastClassificationAt: new Date(),
        },
      }),
      prisma.clientTypeAuditLog.create({
        data: {
          clientId,
          staffId: authUser.id,
          oldType,
          newType,
          reason: cleanReason,
          isManual: true,
        },
        include: {
          staff: {
            select: {
              id: true,
              email: true,
              staffProfile: { select: { name: true } },
            },
          },
        },
      }),
      prisma.clientHistory.create({
        data: {
          clientId,
          action: 'CLIENT_TYPE_OVERRIDE',
          details: `Manual override by ${authUser.role} from ${oldType} to ${newType}. Reason: "${cleanReason}"`,
          performedBy: authUser.id,
        },
      }),
    ]);

    return { client: updatedClient, auditLog };
  }

  /**
   * Retrieve audit history of client type changes with staff attribution.
   */
  async getClientTypeAudit(clientId: string) {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      throw new AppError('Client not found', HTTP_STATUS.NOT_FOUND);
    }

    return prisma.clientTypeAuditLog.findMany({
      where: { clientId },
      include: {
        staff: {
          select: {
            id: true,
            email: true,
            staffProfile: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Trigger appropriate automated campaigns when client type changes.
   */
  private async triggerReclassificationAutomations(
    client: { id: string; name: string; phone: string; preferredLanguage: string },
    oldType: string,
    newType: string
  ) {
    try {
      const { whatsappService } = await import('../whatsapp/whatsapp.service');

      // 1. Regular -> Prospect downgrade: Trigger Win-Back campaign
      if (oldType === 'REGULAR' && newType === 'PROSPECT') {
        logger.info(`[ClientClassification] Triggering Win-Back campaign for client ${client.name} (${client.id})`);
        await whatsappService.triggerWinBack(client.id);
      }

      // 2. Promotion to VIP: Trigger VIP Exclusive Welcome
      if (newType === 'VIP' && oldType !== 'VIP') {
        logger.info(`[ClientClassification] Triggering VIP Welcome for client ${client.name} (${client.id})`);
        await whatsappService.triggerVipWelcome(client.id);
      }
    } catch (e: any) {
      logger.warn('[ClientClassification] Reclassification automation trigger non-critical error:', {
        error: e?.message || e,
      });
    }
  }
}

export const clientClassificationService = new ClientClassificationService();
