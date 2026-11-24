"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.influencersController = exports.InfluencersController = void 0;
const influencers_service_1 = require("./influencers.service");
const influencers_validation_1 = require("./influencers.validation");
const constants_1 = require("../../config/constants");
class InfluencersController {
    async createInfluencer(req, res, next) {
        try {
            const data = influencers_validation_1.createInfluencerSchema.parse(req.body);
            const influencer = await influencers_service_1.influencersService.createInfluencer(data);
            return res.status(constants_1.HTTP_STATUS.CREATED).json({
                success: true,
                data: influencer,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async getInfluencers(req, res, next) {
        try {
            const status = typeof req.query.status === 'string' ? req.query.status : undefined;
            const influencers = await influencers_service_1.influencersService.getInfluencers(status);
            return res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                data: influencers,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async getInfluencerById(req, res, next) {
        try {
            const id = String(req.params.id);
            const influencer = await influencers_service_1.influencersService.getInfluencerById(id);
            return res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                data: influencer,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async updateInfluencer(req, res, next) {
        try {
            const id = String(req.params.id);
            const data = influencers_validation_1.updateInfluencerSchema.parse(req.body);
            const updated = await influencers_service_1.influencersService.updateInfluencer(id, data);
            return res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                data: updated,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async createPromoCode(req, res, next) {
        try {
            const data = influencers_validation_1.createPromoCodeSchema.parse(req.body);
            const promoCode = await influencers_service_1.influencersService.createPromoCode(data);
            return res.status(constants_1.HTTP_STATUS.CREATED).json({
                success: true,
                data: promoCode,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async getPromoCodes(req, res, next) {
        try {
            const influencerId = typeof req.query.influencerId === 'string' ? req.query.influencerId : undefined;
            const promoCodes = await influencers_service_1.influencersService.getPromoCodes(influencerId);
            return res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                data: promoCodes,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async updatePromoCode(req, res, next) {
        try {
            const id = String(req.params.id);
            const data = influencers_validation_1.updatePromoCodeSchema.parse(req.body);
            const updated = await influencers_service_1.influencersService.updatePromoCode(id, data);
            return res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                data: updated,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async validatePromoCode(req, res, next) {
        try {
            const data = influencers_validation_1.validatePromoCodeSchema.parse(req.body);
            const result = await influencers_service_1.influencersService.validatePromoCode(data);
            return res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async applyPromoCode(req, res, next) {
        try {
            const { invoiceId, code } = req.body;
            const updatedInvoice = await influencers_service_1.influencersService.applyPromoCodeToInvoice(invoiceId, code);
            return res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                data: updatedInvoice,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async createPayout(req, res, next) {
        try {
            const data = influencers_validation_1.createPayoutSchema.parse(req.body);
            const authUser = req.user;
            const payout = await influencers_service_1.influencersService.createPayout(data, authUser.id);
            return res.status(constants_1.HTTP_STATUS.CREATED).json({
                success: true,
                data: payout,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async getPayouts(req, res, next) {
        try {
            const influencerId = typeof req.query.influencerId === 'string' ? req.query.influencerId : undefined;
            const payouts = await influencers_service_1.influencersService.getPayouts(influencerId);
            return res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                data: payouts,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async reverseCommission(req, res, next) {
        try {
            const data = influencers_validation_1.reverseCommissionSchema.parse(req.body);
            const reversed = await influencers_service_1.influencersService.reverseCommissionOnRefund(data);
            return res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                data: reversed,
            });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.InfluencersController = InfluencersController;
exports.influencersController = new InfluencersController();
//# sourceMappingURL=influencers.controller.js.map