"use strict";
/**
 * OMEGA SPA POS — Holiday & Occasion Greetings Automation Service
 *
 * Manages 16 Fixed Holidays and 8 Variable Holidays with:
 *   - Universal Meta Template: omega_holiday_greeting
 *   - Automatic annual repetition for fixed dates
 *   - Year-specific date updates for variable dates (Eid, Easter, Mother's/Father's Day)
 *   - Strict idempotency: HOLIDAY_{CODE}_{YEAR}_{CLIENT_ID} ensures 0 duplicates
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.holidayService = exports.HolidayService = exports.META_HOLIDAY_TEMPLATE_NAME = exports.MUSLIM_HOLIDAY_CODES = exports.CHRISTIAN_HOLIDAY_CODES = exports.UNIVERSAL_HOLIDAY_TEMPLATE_FR = exports.UNIVERSAL_HOLIDAY_TEMPLATE_EN = exports.UNIVERSAL_HOLIDAY_TEMPLATE = void 0;
exports.isClientEligibleForHoliday = isClientEligibleForHoliday;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../utils/logger");
const database_1 = __importDefault(require("../../config/database"));
const whatsapp_adapter_1 = require("./whatsapp.adapter");
const whatsapp_types_1 = require("./whatsapp.types");
exports.UNIVERSAL_HOLIDAY_TEMPLATE = `Hi {NAME},

Happy {OCCASION} from OMEGA SPA! 🌸 Wishing you and your loved ones happiness, peace, good health and joy.

Thank you for being part of our family. We truly appreciate your trust and support.

Warm wishes,
Team OMEGA SPA ❤️`;
exports.UNIVERSAL_HOLIDAY_TEMPLATE_EN = `Hi {NAME},

Happy {OCCASION} from OMEGA SPA! 🌸 Wishing you and your loved ones happiness, peace, good health and joy.

Thank you for being part of our family. We truly appreciate your trust and support.

Warm wishes,
Team OMEGA SPA ❤️`;
exports.UNIVERSAL_HOLIDAY_TEMPLATE_FR = `Bonjour {NAME},

Joyeux {OCCASION} de la part de toute l'équipe d'OMEGA SPA ! 🌸 Nous vous souhaitons, ainsi qu'à vos proches, bonheur, paix, santé et prospérité.

Merci de faire partie de notre famille. Nous apprécions grandement votre confiance et votre fidélité.

Chaleureusement,
L'équipe OMEGA SPA ❤️`;
exports.CHRISTIAN_HOLIDAY_CODES = new Set([
    'CHRISTMAS',
    'CHRISTMAS_DAY',
    'GOOD_FRIDAY',
    'EASTER',
    'EASTER_SUNDAY',
    'ASSUMPTION',
    'ASSUMPTION_DAY',
    'ASCENSION',
    'ASCENSION_DAY',
]);
exports.MUSLIM_HOLIDAY_CODES = new Set([
    'EID',
    'EID_AL_FITR',
    'EID_AL_ADHA',
    'TABASKI',
]);
/**
 * Validates whether a client is eligible for a specific holiday campaign based on:
 * - Module 1: Gender targeting (Mother's Day -> Female/Prefer Not To Say; Father's Day -> Male/Prefer Not To Say)
 * - Module 3: Religious preference (Christian -> Christian holidays; Muslim -> Muslim holidays; Neutral/Not Provided -> Never religious)
 */
function isClientEligibleForHoliday(client, holidayCode) {
    const holUpper = holidayCode.toUpperCase();
    const pref = (client.holidayPreference || 'NOT_PROVIDED').toUpperCase();
    const gender = (client.gender || 'NOT_PROVIDED').toUpperCase();
    // 1. Gender-specific campaign targeting
    if (holUpper === 'MOTHERS_DAY') {
        if (gender !== 'FEMALE' && gender !== 'PREFER_NOT_TO_SAY') {
            return { eligible: false, reason: "Mother's Day targets Female and Prefer Not To Say clients" };
        }
    }
    else if (holUpper === 'FATHERS_DAY') {
        if (gender !== 'MALE' && gender !== 'PREFER_NOT_TO_SAY') {
            return { eligible: false, reason: "Father's Day targets Male and Prefer Not To Say clients" };
        }
    }
    // 2. Religious campaign restrictions
    const isChristian = exports.CHRISTIAN_HOLIDAY_CODES.has(holUpper);
    const isMuslim = exports.MUSLIM_HOLIDAY_CODES.has(holUpper);
    if (isChristian) {
        // Never send religious campaigns to Neutral Only or Not Provided
        if (pref !== 'CHRISTIAN' && pref !== 'BOTH') {
            return { eligible: false, reason: `Christian holiday sent only to Christian or Both preferences (client is ${pref})` };
        }
    }
    else if (isMuslim) {
        // Never send religious campaigns to Neutral Only or Not Provided
        if (pref !== 'MUSLIM' && pref !== 'BOTH') {
            return { eligible: false, reason: `Muslim holiday sent only to Muslim or Both preferences (client is ${pref})` };
        }
    }
    return { eligible: true };
}
exports.META_HOLIDAY_TEMPLATE_NAME = 'omega_holiday_greeting';
// Default 24 holidays specified by OMEGA SPA
const DEFAULT_HOLIDAYS = [
    // ─── 1. FIXED DATES (16) ───
    { id: 'hol-new-year', code: 'NEW_YEAR', name: "New Year's Day", category: 'fixed', fixedMonth: 1, fixedDay: 1, isActive: true, timing: '09:00' },
    { id: 'hol-youth-day', code: 'YOUTH_DAY', name: "Youth Day (Cameroon)", category: 'fixed', fixedMonth: 2, fixedDay: 11, isActive: true, timing: '09:00' },
    { id: 'hol-valentines', code: 'VALENTINES_DAY', name: "Valentine's Day", category: 'fixed', fixedMonth: 2, fixedDay: 14, isActive: true, timing: '09:00' },
    { id: 'hol-womens-day', code: 'WOMENS_DAY', name: "International Women's Day", category: 'fixed', fixedMonth: 3, fixedDay: 8, isActive: true, timing: '09:00' },
    { id: 'hol-labour-day', code: 'LABOUR_DAY', name: "Labour Day", category: 'fixed', fixedMonth: 5, fixedDay: 1, isActive: true, timing: '09:00' },
    { id: 'hol-national-day', code: 'NATIONAL_DAY', name: "National Day (Cameroon)", category: 'fixed', fixedMonth: 5, fixedDay: 20, isActive: true, timing: '09:00' },
    { id: 'hol-africa-day', code: 'AFRICA_DAY', name: "Africa Day", category: 'fixed', fixedMonth: 5, fixedDay: 25, isActive: true, timing: '09:00' },
    { id: 'hol-mandela-day', code: 'MANDELA_DAY', name: "Nelson Mandela Day", category: 'fixed', fixedMonth: 7, fixedDay: 18, isActive: true, timing: '09:00' },
    { id: 'hol-friendship-day', code: 'FRIENDSHIP_DAY', name: "International Friendship Day", category: 'fixed', fixedMonth: 7, fixedDay: 30, isActive: true, timing: '09:00' },
    { id: 'hol-assumption-day', code: 'ASSUMPTION_DAY', name: "Assumption Day", category: 'fixed', fixedMonth: 8, fixedDay: 15, isActive: true, timing: '09:00' },
    { id: 'hol-peace-day', code: 'PEACE_DAY', name: "International Day of Peace", category: 'fixed', fixedMonth: 9, fixedDay: 21, isActive: true, timing: '09:00' },
    { id: 'hol-mental-health', code: 'MENTAL_HEALTH_DAY', name: "World Mental Health Day", category: 'fixed', fixedMonth: 10, fixedDay: 10, isActive: true, timing: '09:00' },
    { id: 'hol-halloween', code: 'HALLOWEEN', name: "Halloween", category: 'fixed', fixedMonth: 10, fixedDay: 31, isActive: true, timing: '09:00' },
    { id: 'hol-christmas-day', code: 'CHRISTMAS_DAY', name: "Christmas Day", category: 'fixed', fixedMonth: 12, fixedDay: 25, isActive: true, timing: '09:00' },
    { id: 'hol-boxing-day', code: 'BOXING_DAY', name: "Boxing Day", category: 'fixed', fixedMonth: 12, fixedDay: 26, isActive: true, timing: '09:00' },
    { id: 'hol-new-years-eve', code: 'NEW_YEARS_EVE', name: "New Year's Eve", category: 'fixed', fixedMonth: 12, fixedDay: 31, isActive: true, timing: '09:00' },
    // ─── 2. VARIABLE DATES (8) ───
    {
        id: 'hol-mlk-day',
        code: 'MLK_DAY',
        name: "Martin Luther King Jr. Day",
        category: 'variable',
        variableDates: {
            '2026': '2026-01-19',
            '2027': '2027-01-18',
            '2028': '2028-01-17',
            '2029': '2029-01-15',
            '2030': '2030-01-21',
        },
        isActive: true,
        timing: '09:00',
    },
    {
        id: 'hol-eid-al-fitr',
        code: 'EID_AL_FITR',
        name: "Eid al-Fitr",
        category: 'variable',
        variableDates: {
            '2026': '2026-03-20',
            '2027': '2027-03-10',
            '2028': '2028-02-28',
            '2029': '2029-02-15',
            '2030': '2030-02-05',
        },
        isActive: true,
        timing: '09:00',
    },
    {
        id: 'hol-good-friday',
        code: 'GOOD_FRIDAY',
        name: "Good Friday",
        category: 'variable',
        variableDates: {
            '2026': '2026-04-03',
            '2027': '2027-03-26',
            '2028': '2028-04-14',
            '2029': '2029-03-30',
            '2030': '2030-04-19',
        },
        isActive: true,
        timing: '09:00',
    },
    {
        id: 'hol-easter-sunday',
        code: 'EASTER_SUNDAY',
        name: "Easter Sunday",
        category: 'variable',
        variableDates: {
            '2026': '2026-04-05',
            '2027': '2027-03-28',
            '2028': '2028-04-16',
            '2029': '2029-04-01',
            '2030': '2030-04-21',
        },
        isActive: true,
        timing: '09:00',
    },
    {
        id: 'hol-ascension-day',
        code: 'ASCENSION_DAY',
        name: "Ascension Day",
        category: 'variable',
        variableDates: {
            '2026': '2026-05-14',
            '2027': '2027-05-06',
            '2028': '2028-05-25',
            '2029': '2029-05-10',
            '2030': '2030-05-30',
        },
        isActive: true,
        timing: '09:00',
    },
    {
        id: 'hol-mothers-day',
        code: 'MOTHERS_DAY',
        name: "Mother's Day",
        category: 'variable',
        variableDates: {
            '2026': '2026-05-10',
            '2027': '2027-05-09',
            '2028': '2028-05-14',
            '2029': '2029-05-13',
            '2030': '2030-05-12',
        },
        isActive: true,
        timing: '09:00',
    },
    {
        id: 'hol-eid-al-adha',
        code: 'EID_AL_ADHA',
        name: "Eid al-Adha (Tabaski)",
        category: 'variable',
        variableDates: {
            '2026': '2026-05-27',
            '2027': '2027-05-16',
            '2028': '2028-05-05',
            '2029': '2029-04-24',
            '2030': '2030-04-14',
        },
        isActive: true,
        timing: '09:00',
    },
    {
        id: 'hol-fathers-day',
        code: 'FATHERS_DAY',
        name: "Father's Day",
        category: 'variable',
        variableDates: {
            '2026': '2026-06-21',
            '2027': '2027-06-20',
            '2028': '2028-06-18',
            '2029': '2029-06-17',
            '2030': '2030-06-16',
        },
        isActive: true,
        timing: '09:00',
    },
];
class HolidayService {
    filePath = path_1.default.join(process.cwd(), 'whatsapp_holidays.json');
    holidaysCache = null;
    constructor() {
        this.ensureInitialized();
    }
    ensureInitialized() {
        try {
            if (fs_1.default.existsSync(this.filePath)) {
                const raw = fs_1.default.readFileSync(this.filePath, 'utf8');
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Merge defaults in case new holidays were added
                    let changed = false;
                    for (const d of DEFAULT_HOLIDAYS) {
                        const existing = parsed.find((h) => h.code === d.code);
                        if (!existing) {
                            parsed.push(d);
                            changed = true;
                        }
                        else {
                            // Synchronize holiday name if updated (e.g. removing slashes)
                            if (existing.name !== d.name && (existing.name.includes('/') || !existing.name)) {
                                existing.name = d.name;
                                changed = true;
                            }
                            if (d.variableDates) {
                                if (!existing.variableDates)
                                    existing.variableDates = {};
                                for (const [yr, dt] of Object.entries(d.variableDates)) {
                                    if (!existing.variableDates[yr]) {
                                        existing.variableDates[yr] = dt;
                                        changed = true;
                                    }
                                }
                            }
                        }
                    }
                    this.holidaysCache = parsed;
                    if (changed) {
                        this.saveToFile(parsed);
                    }
                    return;
                }
            }
        }
        catch (e) {
            logger_1.logger.warn('[HolidayService] Could not read holidays file, resetting to defaults', { error: e?.message });
        }
        // Default initialization
        this.holidaysCache = [...DEFAULT_HOLIDAYS];
        this.saveToFile(this.holidaysCache);
    }
    saveToFile(data) {
        try {
            fs_1.default.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
        }
        catch (e) {
            logger_1.logger.error('[HolidayService] Failed to write holidays file', { error: e?.message });
        }
    }
    /**
     * Get all 24 holidays with their current configurations
     */
    getHolidays() {
        if (!this.holidaysCache) {
            this.ensureInitialized();
        }
        return this.holidaysCache || DEFAULT_HOLIDAYS;
    }
    /**
     * Update a holiday (toggle active, change timing, or update variable date for a specific year)
     */
    updateHoliday(idOrCode, updates) {
        const list = this.getHolidays();
        const item = list.find((h) => h.id === idOrCode || h.code === idOrCode);
        if (!item)
            return null;
        if (typeof updates.isActive === 'boolean') {
            item.isActive = updates.isActive;
        }
        if (updates.timing) {
            item.timing = updates.timing;
        }
        if (updates.year && updates.date) {
            const yearKey = String(updates.year);
            if (!item.variableDates)
                item.variableDates = {};
            item.variableDates[yearKey] = updates.date.trim();
        }
        this.saveToFile(list);
        return item;
    }
    /**
     * Format message using Universal Template with client preferred language (FR, EN, or BOTH)
     */
    formatMessage(clientName, occasionName, lang = 'FR') {
        const isEn = lang === 'EN';
        const isBoth = lang === 'BOTH';
        const cleanOccasion = (occasionName || 'Special Holiday').replace(/\s*\/\s*/g, ' - ').trim();
        if (isBoth) {
            const frName = clientName && clientName.trim() ? clientName.trim() : 'Cher(e) Client(e)';
            const enName = clientName && clientName.trim() ? clientName.trim() : 'Valued Client';
            const frText = exports.UNIVERSAL_HOLIDAY_TEMPLATE_FR.replace('{NAME}', frName).replace('{OCCASION}', cleanOccasion);
            const enText = exports.UNIVERSAL_HOLIDAY_TEMPLATE_EN.replace('{NAME}', enName).replace('{OCCASION}', cleanOccasion);
            return `${frText}\n\n━━━━━━━━━━━━━━\n${enText}`;
        }
        if (isEn) {
            const name = clientName && clientName.trim() ? clientName.trim() : 'Valued Client';
            return exports.UNIVERSAL_HOLIDAY_TEMPLATE_EN.replace('{NAME}', name).replace('{OCCASION}', cleanOccasion);
        }
        const name = clientName && clientName.trim() ? clientName.trim() : 'Cher(e) Client(e)';
        return exports.UNIVERSAL_HOLIDAY_TEMPLATE_FR.replace('{NAME}', name).replace('{OCCASION}', cleanOccasion);
    }
    /**
     * Checks if any active holiday falls on the given date (in Africa/Douala timezone)
     * dateStr: "YYYY-MM-DD"
     */
    getHolidaysForDate(dateStr) {
        const [yearStr, monthStr, dayStr] = dateStr.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);
        const list = this.getHolidays();
        const matched = [];
        for (const h of list) {
            if (!h.isActive)
                continue;
            if (h.category === 'fixed') {
                if (h.fixedMonth === month && h.fixedDay === day) {
                    matched.push(h);
                }
            }
            else if (h.category === 'variable') {
                const scheduledDate = h.variableDates?.[String(year)];
                if (scheduledDate === dateStr) {
                    matched.push(h);
                }
            }
        }
        return matched;
    }
    /**
     * Dispatches greetings for a specific holiday to all eligible clients
     * Enforces:
     * 1. Religious preference filtering (never send religious campaigns to Neutral Only or Not Provided)
     * 2. Gender targeting (Mother's Day -> Female/Prefer Not To Say; Father's Day -> Male/Prefer Not To Say)
     * 3. Preferred language (FR, EN, or BOTH)
     * 4. Strict Idempotency: HOLIDAY_{code}_{year}_{clientId} prevents duplicate sending!
     */
    async dispatchHolidayGreetings(holidayCode, year) {
        const list = this.getHolidays();
        const holiday = list.find((h) => h.code === holidayCode || h.id === holidayCode);
        if (!holiday) {
            throw new Error(`Holiday not found with code: ${holidayCode}`);
        }
        // Fetch all active clients with a phone number and their preference attributes
        const clients = await database_1.default.client.findMany({
            where: {
                OR: [
                    { phone: { not: '' } },
                    { whatsapp: { not: '' } },
                ],
            },
            select: {
                id: true,
                name: true,
                phone: true,
                whatsapp: true,
                gender: true,
                preferredLanguage: true,
                holidayPreference: true,
            },
        });
        let sentCount = 0;
        let alreadySentCount = 0;
        let skippedCount = 0;
        let failedCount = 0;
        for (const client of clients) {
            const recipientPhone = (client.whatsapp || client.phone || '').trim();
            if (!recipientPhone)
                continue;
            // Check eligibility (Gender targeting and religious campaign restrictions)
            const eligibility = isClientEligibleForHoliday(client, holiday.code);
            if (!eligibility.eligible) {
                skippedCount++;
                continue;
            }
            const idempotencyKey = `HOLIDAY_${holiday.code}_${year}_${client.id}`;
            // Check if already sent
            const existingLog = await database_1.default.whatsAppMessageLog.findUnique({
                where: { idempotencyKey },
            });
            if (existingLog) {
                alreadySentCount++;
                continue;
            }
            const clientName = client.name || 'Valued Client';
            const rawHolidayName = holiday.name || 'Special Holiday';
            const cleanHolidayName = rawHolidayName.replace(/\s*\/\s*/g, ' - ').trim();
            const rawLang = String(client.preferredLanguage || 'FR').toUpperCase();
            const clientLang = rawLang === 'EN' ? 'EN' : rawLang === 'BOTH' ? 'BOTH' : 'FR';
            const renderedMessage = this.formatMessage(clientName, cleanHolidayName, clientLang);
            // Meta Cloud API template metadata
            const templateMetadata = {
                template: {
                    name: exports.META_HOLIDAY_TEMPLATE_NAME,
                    language: clientLang === 'EN' ? 'en' : 'fr',
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: clientName },
                                { type: 'text', text: cleanHolidayName },
                            ],
                        },
                    ],
                },
            };
            try {
                const sendResult = await whatsapp_adapter_1.whatsappAdapter.send({
                    channel: 'WHATSAPP',
                    recipient: { phone: recipientPhone, name: clientName },
                    content: renderedMessage,
                    idempotencyKey,
                    metadata: templateMetadata,
                });
                await database_1.default.whatsAppMessageLog.create({
                    data: {
                        clientId: client.id,
                        recipientPhone,
                        message: renderedMessage,
                        status: sendResult.success ? whatsapp_types_1.WhatsAppMessageStatus.SENT : whatsapp_types_1.WhatsAppMessageStatus.FAILED,
                        failureReason: sendResult.failureReason,
                        providerMessageId: sendResult.providerMessageId,
                        idempotencyKey,
                        sentAt: sendResult.success ? new Date() : null,
                    },
                });
                if (sendResult.success) {
                    sentCount++;
                }
                else {
                    failedCount++;
                }
            }
            catch (err) {
                failedCount++;
                logger_1.logger.error(`[HolidayService] Failed to send ${holiday.name} greeting to ${recipientPhone}:`, err);
            }
        }
        return {
            holidayName: holiday.name,
            totalTargeted: clients.length,
            sentCount,
            alreadySentCount,
            skippedCount,
            failedCount,
        };
    }
    /**
     * Test send greeting to a specific phone number
     */
    async testSendGreeting(holidayCode, targetPhone, testName) {
        const list = this.getHolidays();
        const holiday = list.find((h) => h.code === holidayCode || h.id === holidayCode);
        const rawHolidayName = holiday ? holiday.name : 'Special Holiday';
        // Remove forward slashes / because Meta WhatsApp Cloud API marketing delivery blocks / in body variables
        const holidayName = rawHolidayName.replace(/\s*\/\s*/g, ' - ').trim();
        const clientName = (testName && testName.trim() ? testName.trim() : 'Valued Client')
            .replace(/[\r\n\t]/g, ' ')
            .replace(/\s+/g, ' ')
            .slice(0, 60);
        const message = this.formatMessage(clientName, holidayName);
        const templateMetadata = {
            template: {
                name: exports.META_HOLIDAY_TEMPLATE_NAME,
                language: 'en',
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: clientName },
                            { type: 'text', text: holidayName },
                        ],
                    },
                ],
            },
        };
        const idempotencyKey = `TEST_HOLIDAY_${Date.now()}`;
        const res = await whatsapp_adapter_1.whatsappAdapter.send({
            channel: 'WHATSAPP',
            recipient: { phone: targetPhone, name: clientName },
            content: message,
            idempotencyKey,
            metadata: templateMetadata,
        });
        // Persist into WhatsApp message audit logs for complete visibility & delivery status tracking
        try {
            await database_1.default.whatsAppMessageLog.create({
                data: {
                    recipientPhone: targetPhone,
                    message,
                    status: res.success ? whatsapp_types_1.WhatsAppMessageStatus.SENT : whatsapp_types_1.WhatsAppMessageStatus.FAILED,
                    failureReason: res.failureReason || null,
                    providerMessageId: res.providerMessageId || null,
                    idempotencyKey,
                    sentAt: res.success ? new Date() : null,
                },
            });
        }
        catch (logErr) {
            logger_1.logger.warn('[HolidayService] Could not persist testSend log', { error: logErr?.message });
        }
        return {
            success: res.success,
            renderedMessage: message,
            error: res.failureReason,
        };
    }
}
exports.HolidayService = HolidayService;
exports.holidayService = new HolidayService();
//# sourceMappingURL=holiday.service.js.map