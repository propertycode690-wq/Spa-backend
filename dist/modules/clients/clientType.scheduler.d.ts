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
/**
 * Run classification for all clients with concurrency protection.
 */
export declare function executeClientClassification(): Promise<any>;
/**
 * Initialize midnight cron job (12:00 AM Africa/Douala daily).
 */
export declare function initClientTypeClassificationScheduler(): void;
/**
 * Stop the scheduler (e.g. for testing or graceful shutdown).
 */
export declare function stopClientTypeClassificationScheduler(): void;
//# sourceMappingURL=clientType.scheduler.d.ts.map