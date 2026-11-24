/**
 * OMEGA SPA POS — Holiday & Occasion Greetings Automation Service
 *
 * Manages 16 Fixed Holidays and 8 Variable Holidays with:
 *   - Universal Meta Template: omega_holiday_greeting
 *   - Automatic annual repetition for fixed dates
 *   - Year-specific date updates for variable dates (Eid, Easter, Mother's/Father's Day)
 *   - Strict idempotency: HOLIDAY_{CODE}_{YEAR}_{CLIENT_ID} ensures 0 duplicates
 */
export interface HolidayOccasion {
    id: string;
    code: string;
    name: string;
    category: 'fixed' | 'variable';
    fixedMonth?: number;
    fixedDay?: number;
    variableDates?: Record<string, string>;
    isActive: boolean;
    timing: string;
}
export declare const UNIVERSAL_HOLIDAY_TEMPLATE = "Hi {NAME},\n\nHappy {OCCASION} from OMEGA SPA! \uD83C\uDF38 Wishing you and your loved ones happiness, peace, good health and joy.\n\nThank you for being part of our family. We truly appreciate your trust and support.\n\nWarm wishes,\nTeam OMEGA SPA \u2764\uFE0F";
export declare const UNIVERSAL_HOLIDAY_TEMPLATE_EN = "Hi {NAME},\n\nHappy {OCCASION} from OMEGA SPA! \uD83C\uDF38 Wishing you and your loved ones happiness, peace, good health and joy.\n\nThank you for being part of our family. We truly appreciate your trust and support.\n\nWarm wishes,\nTeam OMEGA SPA \u2764\uFE0F";
export declare const UNIVERSAL_HOLIDAY_TEMPLATE_FR = "Bonjour {NAME},\n\nJoyeux {OCCASION} de la part de toute l'\u00E9quipe d'OMEGA SPA ! \uD83C\uDF38 Nous vous souhaitons, ainsi qu'\u00E0 vos proches, bonheur, paix, sant\u00E9 et prosp\u00E9rit\u00E9.\n\nMerci de faire partie de notre famille. Nous appr\u00E9cions grandement votre confiance et votre fid\u00E9lit\u00E9.\n\nChaleureusement,\nL'\u00E9quipe OMEGA SPA \u2764\uFE0F";
export declare const CHRISTIAN_HOLIDAY_CODES: Set<string>;
export declare const MUSLIM_HOLIDAY_CODES: Set<string>;
/**
 * Validates whether a client is eligible for a specific holiday campaign based on:
 * - Module 1: Gender targeting (Mother's Day -> Female/Prefer Not To Say; Father's Day -> Male/Prefer Not To Say)
 * - Module 3: Religious preference (Christian -> Christian holidays; Muslim -> Muslim holidays; Neutral/Not Provided -> Never religious)
 */
export declare function isClientEligibleForHoliday(client: {
    gender?: string | null;
    holidayPreference?: string | null;
}, holidayCode: string): {
    eligible: boolean;
    reason?: string;
};
export declare const META_HOLIDAY_TEMPLATE_NAME = "omega_holiday_greeting";
export declare class HolidayService {
    private filePath;
    private holidaysCache;
    constructor();
    private ensureInitialized;
    private saveToFile;
    /**
     * Get all 24 holidays with their current configurations
     */
    getHolidays(): HolidayOccasion[];
    /**
     * Update a holiday (toggle active, change timing, or update variable date for a specific year)
     */
    updateHoliday(idOrCode: string, updates: {
        isActive?: boolean;
        timing?: string;
        year?: number | string;
        date?: string;
    }): HolidayOccasion | null;
    /**
     * Format message using Universal Template with client preferred language (FR, EN, or BOTH)
     */
    formatMessage(clientName: string, occasionName: string, lang?: 'EN' | 'FR' | 'BOTH'): string;
    /**
     * Checks if any active holiday falls on the given date (in Africa/Douala timezone)
     * dateStr: "YYYY-MM-DD"
     */
    getHolidaysForDate(dateStr: string): HolidayOccasion[];
    /**
     * Dispatches greetings for a specific holiday to all eligible clients
     * Enforces:
     * 1. Religious preference filtering (never send religious campaigns to Neutral Only or Not Provided)
     * 2. Gender targeting (Mother's Day -> Female/Prefer Not To Say; Father's Day -> Male/Prefer Not To Say)
     * 3. Preferred language (FR, EN, or BOTH)
     * 4. Strict Idempotency: HOLIDAY_{code}_{year}_{clientId} prevents duplicate sending!
     */
    dispatchHolidayGreetings(holidayCode: string, year: number): Promise<{
        holidayName: string;
        totalTargeted: number;
        sentCount: number;
        alreadySentCount: number;
        skippedCount: number;
        failedCount: number;
    }>;
    /**
     * Test send greeting to a specific phone number
     */
    testSendGreeting(holidayCode: string, targetPhone: string, testName?: string): Promise<{
        success: boolean;
        renderedMessage: string;
        error?: string;
    }>;
}
export declare const holidayService: HolidayService;
//# sourceMappingURL=holiday.service.d.ts.map