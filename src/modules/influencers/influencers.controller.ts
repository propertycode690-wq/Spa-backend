import { Request, Response, NextFunction } from 'express';
import { influencersService } from './influencers.service';
import {
  createInfluencerSchema,
  updateInfluencerSchema,
  createPromoCodeSchema,
  updatePromoCodeSchema,
  validatePromoCodeSchema,
  createPayoutSchema,
  reverseCommissionSchema,
} from './influencers.validation';
import { HTTP_STATUS } from '../../config/constants';

export class InfluencersController {
  async createInfluencer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = createInfluencerSchema.parse(req.body);
      const influencer = await influencersService.createInfluencer(data as any);
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: influencer,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getInfluencers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const influencers = await influencersService.getInfluencers(status as any);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: influencers,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getInfluencerById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const id = String(req.params.id);
      const influencer = await influencersService.getInfluencerById(id);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: influencer,
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateInfluencer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const id = String(req.params.id);
      const data = updateInfluencerSchema.parse(req.body);
      const updated = await influencersService.updateInfluencer(id, data as any);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      return next(error);
    }
  }

  async createPromoCode(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = createPromoCodeSchema.parse(req.body);
      const promoCode = await influencersService.createPromoCode(data as any);
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: promoCode,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getPromoCodes(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const influencerId = typeof req.query.influencerId === 'string' ? req.query.influencerId : undefined;
      const promoCodes = await influencersService.getPromoCodes(influencerId);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: promoCodes,
      });
    } catch (error) {
      return next(error);
    }
  }

  async updatePromoCode(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const id = String(req.params.id);
      const data = updatePromoCodeSchema.parse(req.body);
      const updated = await influencersService.updatePromoCode(id, data as any);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      return next(error);
    }
  }

  async validatePromoCode(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = validatePromoCodeSchema.parse(req.body);
      const result = await influencersService.validatePromoCode(data as any);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async applyPromoCode(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { invoiceId, code } = req.body;
      const updatedInvoice = await influencersService.applyPromoCodeToInvoice(invoiceId, code);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: updatedInvoice,
      });
    } catch (error) {
      return next(error);
    }
  }

  async createPayout(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = createPayoutSchema.parse(req.body);
      const authUser = (req as any).user;
      const payout = await influencersService.createPayout(data as any, authUser.id);
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: payout,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getPayouts(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const influencerId = typeof req.query.influencerId === 'string' ? req.query.influencerId : undefined;
      const payouts = await influencersService.getPayouts(influencerId);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: payouts,
      });
    } catch (error) {
      return next(error);
    }
  }

  async reverseCommission(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = reverseCommissionSchema.parse(req.body);
      const reversed = await influencersService.reverseCommissionOnRefund(data as any);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: reversed,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const influencersController = new InfluencersController();
