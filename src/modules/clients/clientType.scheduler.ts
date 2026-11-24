/**
 * OMEGA SPA POS — Client Type Classification Scheduler
 *
 * Daily midnight (00:00 / 12:00 AM) cron job in Africa/Douala business timezone (UTC+1).
 * Evaluates all active clients against deterministic classification rules:
 * - VIP: Spend >= 300,000 XAF OR visits >= 15 OR Manager assigned. Never auto-downgraded.
 * - REGULAR: >= 2 bookings OR (Spend > 50,000 XAF & visited in last 90d).
 *   Downgraded to PROSPECT if inactive for 180 days -> triggers Win-Back campaign.
 * - NEW: First booking within 30 days.
 * - PROSPECT: Zero paid bookings.
 */

import cron, { ScheduledTask } from 'node-cron';
import { logger } from '../../utils/logger';
import { clientClassificationService } from './clientClassification.service';

const DOUALA_TIMEZONE = 'Africa/Douala';
let classificationTask: ScheduledTask | null = null;
let isJobRunning = false;

/**
 * Run classification for all clients with concurrency protection.
 */
export async function executeClientClassification(): Promise<any> {
  if (isJobRunning) {
    logger.warn('[ClientTypeScheduler] Classification run already in progress. Skipping duplicate execution.');
    return { skipped: true, reason: 'Already running' };
  }

  isJobRunning = true;
  logger.info('[ClientTypeScheduler] Starting daily client classification run in Douala business timezone (Africa/Douala)...');

  try {
    const summary = await clientClassificationService.classifyAllClients();
    logger.info('[ClientTypeScheduler] Daily classification run completed successfully.', summary);
    return summary;
  } catch (err: any) {
    logger.error('[ClientTypeScheduler] Error executing daily classification job:', {
      error: err?.message || String(err),
    });
    throw err;
  } finally {
    isJobRunning = false;
  }
}

/**
 * Initialize midnight cron job (12:00 AM Africa/Douala daily).
 */
export function initClientTypeClassificationScheduler(): void {
  // Cron expression: 0 0 * * * (At 00:00 / 12:00 AM every day)
  const cronExpr = '0 0 * * *';

  classificationTask = cron.schedule(
    cronExpr,
    async () => {
      try {
        await executeClientClassification();
      } catch (err: any) {
        logger.error('[ClientTypeScheduler] Unhandled error during scheduled classification:', {
          error: err?.message || String(err),
        });
      }
    },
    {
      timezone: DOUALA_TIMEZONE,
    }
  );

  logger.info(`[ClientTypeScheduler] Initialized daily midnight classification cron ("${cronExpr}" in ${DOUALA_TIMEZONE})`);
}

/**
 * Stop the scheduler (e.g. for testing or graceful shutdown).
 */
export function stopClientTypeClassificationScheduler(): void {
  if (classificationTask) {
    classificationTask.stop();
    classificationTask = null;
    logger.info('[ClientTypeScheduler] Scheduled classification task stopped.');
  }
}
