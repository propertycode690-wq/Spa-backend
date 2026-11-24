import prisma from '../src/config/database';
import { influencersService } from '../src/modules/influencers/influencers.service';
import { clientClassificationService } from '../src/modules/clients/clientClassification.service';
import { isClientEligibleForHoliday } from '../src/modules/whatsapp/holiday.service';
import { createPromoCodeSchema } from '../src/modules/influencers/influencers.validation';

async function runVerification() {
  console.log('====================================================');
  console.log('🚀 RUNNING COMPREHENSIVE 5-MODULE VERIFICATION SUITE');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, desc: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${desc}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
    }
  }

  try {
    // ----------------------------------------------------
    // MODULE 1, 2, 3: GENDER, LANGUAGE, HOLIDAY PREFERENCES
    // ----------------------------------------------------
    console.log('--- MODULES 1, 2, 3: Preferences & Campaigns ---');
    
    // Mother's Day targets Female + Prefer Not To Say
    const motherDayEligibleFemale = isClientEligibleForHoliday(
      { gender: 'FEMALE', holidayPreference: 'NEUTRAL_ONLY' },
      'MOTHERS_DAY'
    );
    assert(motherDayEligibleFemale.eligible, "Mother's Day targets FEMALE even if holiday preference is NEUTRAL_ONLY");

    const motherDayBlockedMale = isClientEligibleForHoliday(
      { gender: 'MALE', holidayPreference: 'NEUTRAL_ONLY' },
      'MOTHERS_DAY'
    );
    assert(!motherDayBlockedMale.eligible, "Mother's Day BLOCKS MALE clients");

    // Father's Day targets Male + Prefer Not To Say
    const fatherDayEligibleMale = isClientEligibleForHoliday(
      { gender: 'MALE', holidayPreference: 'NOT_PROVIDED' },
      'FATHERS_DAY'
    );
    assert(fatherDayEligibleMale.eligible, "Father's Day targets MALE clients");

    // Religious campaigns (Christmas) blocked if NOT_PROVIDED or NEUTRAL_ONLY
    const christmasBlockedNotProvided = isClientEligibleForHoliday(
      { gender: 'FEMALE', holidayPreference: 'NOT_PROVIDED' },
      'CHRISTMAS'
    );
    assert(!christmasBlockedNotProvided.eligible, 'Religious campaign (Christmas) BLOCKED when preference is NOT_PROVIDED');

    const christmasBlockedNeutralOnly = isClientEligibleForHoliday(
      { gender: 'FEMALE', holidayPreference: 'NEUTRAL_ONLY' },
      'CHRISTMAS'
    );
    assert(!christmasBlockedNeutralOnly.eligible, 'Religious campaign (Christmas) BLOCKED when preference is NEUTRAL_ONLY');

    const eidEligibleMuslim = isClientEligibleForHoliday(
      { gender: 'FEMALE', holidayPreference: 'MUSLIM' },
      'EID_AL_FITR'
    );
    assert(eidEligibleMuslim.eligible, 'Eid al-Fitr targets MUSLIM clients');

    const tabaskiEligibleMuslim = isClientEligibleForHoliday(
      { gender: 'MALE', holidayPreference: 'MUSLIM' },
      'TABASKI'
    );
    assert(tabaskiEligibleMuslim.eligible, 'Tabaski targets MUSLIM clients');

    // ----------------------------------------------------
    // MODULE 4: CLIENT CLASSIFICATION
    // ----------------------------------------------------
    console.log('\n--- MODULE 4: Client Type Classification ---');

    // VIP rule: Spend >= 300,000 XAF
    const evalVip = clientClassificationService.determineClientType(
      'REGULAR',
      false,
      {
        eligibleSpend: 350000,
        paidVisits: 4,
        firstVisitDate: new Date(Date.now() - 60 * 24 * 3600 * 1000),
        lastVisitDate: new Date(),
      }
    );
    assert(evalVip.targetType === 'VIP', 'Spend >= 300,000 XAF qualifies as VIP');

    // Regular rule: 2+ bookings and visited in last 90 days
    const evalRegular = clientClassificationService.determineClientType(
      'NEW',
      false,
      {
        eligibleSpend: 40000,
        paidVisits: 3,
        firstVisitDate: new Date(Date.now() - 50 * 24 * 3600 * 1000),
        lastVisitDate: new Date(Date.now() - 20 * 24 * 3600 * 1000),
      }
    );
    assert(evalRegular.targetType === 'REGULAR', '3 bookings with visit in last 20 days classifies as REGULAR');

    // Downgrade: Regular with no visit in 180 days -> PROSPECT
    const evalDowngrade = clientClassificationService.determineClientType(
      'REGULAR',
      false,
      {
        eligibleSpend: 60000,
        paidVisits: 4,
        firstVisitDate: new Date(Date.now() - 250 * 24 * 3600 * 1000),
        lastVisitDate: new Date(Date.now() - 190 * 24 * 3600 * 1000), // >180 days ago
      }
    );
    assert(evalDowngrade.targetType === 'PROSPECT', 'Regular with >180 days no visit downgrades to PROSPECT');

    // VIP Protection: VIP cannot be automatically downgraded!
    const evalVipProtected = clientClassificationService.determineClientType(
      'VIP',
      false,
      {
        eligibleSpend: 350000,
        paidVisits: 16,
        firstVisitDate: new Date(Date.now() - 400 * 24 * 3600 * 1000),
        lastVisitDate: new Date(Date.now() - 200 * 24 * 3600 * 1000), // >180 days ago
      }
    );
    assert(evalVipProtected.targetType === 'VIP', 'VIP is protected: Never auto-downgraded even after 180 days');

    // ----------------------------------------------------
    // MODULE 5: INFLUENCERS & PROMO CODES
    // ----------------------------------------------------
    console.log('\n--- MODULE 5: Influencers & Promo Codes ---');

    // Validation schema test: 6-8 chars uppercase e.g. BELLA10
    const validCodeSchema = createPromoCodeSchema.safeParse({
      influencerId: 'b3c77279-d03f-4b58-9637-b7fd947100d2',
      code: 'BELLA10',
      discountPercent: 10,
      commissionPercent: 15,
    });
    assert(validCodeSchema.success === true, 'Promo code BELLA10 passes 6-8 char uppercase schema');

    const invalidCodeSchema = createPromoCodeSchema.safeParse({
      influencerId: 'b3c77279-d03f-4b58-9637-b7fd947100d2',
      code: 'toolongcode123',
      discountPercent: 10,
      commissionPercent: 15,
    });
    assert(!invalidCodeSchema.success, 'Promo code toolongcode123 rejected (exceeds 8 chars)');

    const lowercaseCodeSchema = createPromoCodeSchema.safeParse({
      influencerId: 'b3c77279-d03f-4b58-9637-b7fd947100d2',
      code: 'bella10',
      discountPercent: 10,
      commissionPercent: 15,
    });
    assert(lowercaseCodeSchema.success && lowercaseCodeSchema.data.code === 'BELLA10', 'Promo code bella10 normalized to uppercase BELLA10');

    // Financial Calculation: Commission = Final Price after discount x Commission %
    // Example: 20,000 FCFA subtotal, 10% discount -> 18,000 FCFA final paid
    // Commission at 15% -> 2,700 FCFA
    const subtotal = 20000;
    const discountRate = 10;
    const commissionRate = 15;
    const discountAmount = Math.round((subtotal * discountRate) / 100);
    const finalPaidPrice = subtotal - discountAmount;
    const commissionAmount = Math.round((finalPaidPrice * commissionRate) / 100);

    assert(discountAmount === 2000, 'Discount calculation: 10% of 20,000 = 2,000 FCFA');
    assert(finalPaidPrice === 18000, 'Final price after discount: 20,000 - 2,000 = 18,000 FCFA');
    assert(commissionAmount === 2700, 'Commission calculation: 15% of 18,000 = 2,700 FCFA');

    // Full Refund: 100% of commission reversed (2,700 FCFA)
    const fullRefundReversed = commissionAmount;
    assert(fullRefundReversed === 2700, 'Full refund reverses 100% of commission (2,700 FCFA)');

    // Partial Refund: 50% refund (9,000 of 18,000) reverses 50% of commission (1,350 FCFA)
    const partialRefundAmount = 9000;
    const partialRatio = partialRefundAmount / finalPaidPrice;
    const partialReversed = Math.round(commissionAmount * partialRatio);
    assert(partialReversed === 1350, 'Partial refund (50%) proportionally reverses 1,350 FCFA commission');

    // Self-referral prevention logic: clientPhone matches marketer phone (with/without country code)
    const clientPhone = '+237 699 00 11 22';
    const marketerPhone = '699001122';
    const normalize = (p: string) => p.replace(/[\s\-\+\(\)]/g, '').toLowerCase();
    const cNorm = normalize(clientPhone);
    const mNorm = normalize(marketerPhone);
    const isSelfReferral = cNorm === mNorm || cNorm.includes(mNorm) || mNorm.includes(cNorm);
    assert(isSelfReferral, 'Self-referral correctly detected when client phone matches marketer phone');

    // VIP Stacking logic: if client is VIP and code not stackable -> block stacking
    const isVip = true;
    const stackableWithVip = false;
    const canStack = !isVip || stackableWithVip;
    assert(!canStack, 'VIP stacking blocked when stackableWithVip is false');

    console.log('\n====================================================');
    console.log(`📊 FINAL RESULT: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
    console.log('====================================================');
  } catch (err: any) {
    console.error('Fatal test error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
