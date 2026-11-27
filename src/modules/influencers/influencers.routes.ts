import { Router } from 'express';
import { influencersController } from './influencers.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { allowRoles } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// POST /api/v1/influencers — Create Influencer (Manager, Marketer, Reception)
router.post(
  '/',
  allowRoles('MANAGER', 'MARKETER', 'RECEPTION'),
  (req, res, next) => influencersController.createInfluencer(req, res, next)
);

// GET /api/v1/influencers — List Influencers (Manager, Marketer, Reception)
router.get(
  '/',
  allowRoles('MANAGER', 'MARKETER', 'RECEPTION'),
  (req, res, next) => influencersController.getInfluencers(req, res, next)
);

// GET /api/v1/influencers/promo-codes — List Promo Codes
router.get(
  '/promo-codes',
  allowRoles('MANAGER', 'MARKETER', 'RECEPTION'),
  (req, res, next) => influencersController.getPromoCodes(req, res, next)
);

// POST /api/v1/influencers/promo-codes — Create Promo Code (Manager, Marketer, Reception)
router.post(
  '/promo-codes',
  allowRoles('MANAGER', 'MARKETER', 'RECEPTION'),
  (req, res, next) => influencersController.createPromoCode(req, res, next)
);

// PATCH /api/v1/influencers/promo-codes/:id — Update Promo Code (Manager)
router.patch(
  '/promo-codes/:id',
  allowRoles('MANAGER'),
  (req, res, next) => influencersController.updatePromoCode(req, res, next)
);

// POST /api/v1/influencers/validate-code — Live POS Validation (Manager, Reception, Marketer)
router.post(
  '/validate-code',
  allowRoles('MANAGER', 'RECEPTION', 'MARKETER'),
  (req, res, next) => influencersController.validatePromoCode(req, res, next)
);

// POST /api/v1/influencers/apply-code — Apply to Invoice (Manager, Reception)
router.post(
  '/apply-code',
  allowRoles('MANAGER', 'RECEPTION'),
  (req, res, next) => influencersController.applyPromoCode(req, res, next)
);

// GET /api/v1/influencers/payouts — List Payouts (Manager, Marketer)
router.get(
  '/payouts',
  allowRoles('MANAGER', 'MARKETER'),
  (req, res, next) => influencersController.getPayouts(req, res, next)
);

// POST /api/v1/influencers/payouts — Record Payout (Manager only)
router.post(
  '/payouts',
  allowRoles('MANAGER'),
  (req, res, next) => influencersController.createPayout(req, res, next)
);

// POST /api/v1/influencers/reverse-commission — Reverse Commission on Refund (Manager only)
router.post(
  '/reverse-commission',
  allowRoles('MANAGER'),
  (req, res, next) => influencersController.reverseCommission(req, res, next)
);

// GET /api/v1/influencers/:id — Influencer Details (Manager, Marketer)
router.get(
  '/:id',
  allowRoles('MANAGER', 'MARKETER'),
  (req, res, next) => influencersController.getInfluencerById(req, res, next)
);

// PATCH /api/v1/influencers/:id — Update Influencer (Manager only)
router.patch(
  '/:id',
  allowRoles('MANAGER'),
  (req, res, next) => influencersController.updateInfluencer(req, res, next)
);

export default router;
