"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const influencers_controller_1 = require("./influencers.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const roleMiddleware_1 = require("../../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
// POST /api/v1/influencers — Create Influencer (Manager, Marketer)
router.post('/', (0, roleMiddleware_1.allowRoles)('MANAGER', 'MARKETER'), (req, res, next) => influencers_controller_1.influencersController.createInfluencer(req, res, next));
// GET /api/v1/influencers — List Influencers (Manager, Marketer, Reception)
router.get('/', (0, roleMiddleware_1.allowRoles)('MANAGER', 'MARKETER', 'RECEPTION'), (req, res, next) => influencers_controller_1.influencersController.getInfluencers(req, res, next));
// GET /api/v1/influencers/promo-codes — List Promo Codes
router.get('/promo-codes', (0, roleMiddleware_1.allowRoles)('MANAGER', 'MARKETER', 'RECEPTION'), (req, res, next) => influencers_controller_1.influencersController.getPromoCodes(req, res, next));
// POST /api/v1/influencers/promo-codes — Create Promo Code (Manager, Marketer)
router.post('/promo-codes', (0, roleMiddleware_1.allowRoles)('MANAGER', 'MARKETER'), (req, res, next) => influencers_controller_1.influencersController.createPromoCode(req, res, next));
// PATCH /api/v1/influencers/promo-codes/:id — Update Promo Code (Manager)
router.patch('/promo-codes/:id', (0, roleMiddleware_1.allowRoles)('MANAGER'), (req, res, next) => influencers_controller_1.influencersController.updatePromoCode(req, res, next));
// POST /api/v1/influencers/validate-code — Live POS Validation (Manager, Reception, Marketer)
router.post('/validate-code', (0, roleMiddleware_1.allowRoles)('MANAGER', 'RECEPTION', 'MARKETER'), (req, res, next) => influencers_controller_1.influencersController.validatePromoCode(req, res, next));
// POST /api/v1/influencers/apply-code — Apply to Invoice (Manager, Reception)
router.post('/apply-code', (0, roleMiddleware_1.allowRoles)('MANAGER', 'RECEPTION'), (req, res, next) => influencers_controller_1.influencersController.applyPromoCode(req, res, next));
// GET /api/v1/influencers/payouts — List Payouts (Manager, Marketer)
router.get('/payouts', (0, roleMiddleware_1.allowRoles)('MANAGER', 'MARKETER'), (req, res, next) => influencers_controller_1.influencersController.getPayouts(req, res, next));
// POST /api/v1/influencers/payouts — Record Payout (Manager only)
router.post('/payouts', (0, roleMiddleware_1.allowRoles)('MANAGER'), (req, res, next) => influencers_controller_1.influencersController.createPayout(req, res, next));
// POST /api/v1/influencers/reverse-commission — Reverse Commission on Refund (Manager only)
router.post('/reverse-commission', (0, roleMiddleware_1.allowRoles)('MANAGER'), (req, res, next) => influencers_controller_1.influencersController.reverseCommission(req, res, next));
// GET /api/v1/influencers/:id — Influencer Details (Manager, Marketer)
router.get('/:id', (0, roleMiddleware_1.allowRoles)('MANAGER', 'MARKETER'), (req, res, next) => influencers_controller_1.influencersController.getInfluencerById(req, res, next));
// PATCH /api/v1/influencers/:id — Update Influencer (Manager only)
router.patch('/:id', (0, roleMiddleware_1.allowRoles)('MANAGER'), (req, res, next) => influencers_controller_1.influencersController.updateInfluencer(req, res, next));
exports.default = router;
//# sourceMappingURL=influencers.routes.js.map