"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeClientClassification = executeClientClassification;
exports.initClientTypeClassificationScheduler = initClientTypeClassificationScheduler;
exports.stopClientTypeClassificationScheduler = stopClientTypeClassificationScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const logger_1 = require("../../utils/logger");
const clientClassification_service_1 = require("./clientClassification.service");
const DOUALA_TIMEZONE = 'Africa/Douala';
let classificationTask = null;
let isJobRunning = false;
/**
 * Run classification for all clients with concurrency protection.
 */
async function executeClientClassification() {
    if (isJobRunning) {
        logger_1.logger.warn('[ClientTypeScheduler] Classification run already in progress. Skipping duplicate execution.');
        return { skipped: true, reason: 'Already running' };
    }
    isJobRunning = true;
    logger_1.logger.info('[ClientTypeScheduler] Starting daily client classification run in Douala business timezone (Africa/Douala)...');
    try {
        const summary = await clientClassification_service_1.clientClassificationService.classifyAllClients();
        logger_1.logger.info('[ClientTypeScheduler] Daily classification run completed successfully.', summary);
        return summary;
    }
    catch (err) {
        logger_1.logger.error('[ClientTypeScheduler] Error executing daily classification job:', {
            error: err?.message || String(err),
        });
        throw err;
    }
    finally {
        isJobRunning = false;
    }
}
/**
 * Initialize midnight cron job (12:00 AM Africa/Douala daily).
 */
function initClientTypeClassificationScheduler() {
    // Cron expression: 0 0 * * * (At 00:00 / 12:00 AM every day)
    const cronExpr = '0 0 * * *';
    classificationTask = node_cron_1.default.schedule(cronExpr, async () => {
        try {
            await executeClientClassification();
        }
        catch (err) {
            logger_1.logger.error('[ClientTypeScheduler] Unhandled error during scheduled classification:', {
                error: err?.message || String(err),
            });
        }
    }, {
        timezone: DOUALA_TIMEZONE,
    });
    logger_1.logger.info(`[ClientTypeScheduler] Initialized daily midnight classification cron ("${cronExpr}" in ${DOUALA_TIMEZONE})`);
}
/**
 * Stop the scheduler (e.g. for testing or graceful shutdown).
 */
function stopClientTypeClassificationScheduler() {
    if (classificationTask) {
        classificationTask.stop();
        classificationTask = null;
        logger_1.logger.info('[ClientTypeScheduler] Scheduled classification task stopped.');
    }
}
//# sourceMappingURL=clientType.scheduler.js.map