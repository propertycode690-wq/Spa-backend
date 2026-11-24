import { Request, Response, NextFunction } from 'express';
export declare class InfluencersController {
    createInfluencer(req: Request, res: Response, next: NextFunction): Promise<any>;
    getInfluencers(req: Request, res: Response, next: NextFunction): Promise<any>;
    getInfluencerById(req: Request, res: Response, next: NextFunction): Promise<any>;
    updateInfluencer(req: Request, res: Response, next: NextFunction): Promise<any>;
    createPromoCode(req: Request, res: Response, next: NextFunction): Promise<any>;
    getPromoCodes(req: Request, res: Response, next: NextFunction): Promise<any>;
    updatePromoCode(req: Request, res: Response, next: NextFunction): Promise<any>;
    validatePromoCode(req: Request, res: Response, next: NextFunction): Promise<any>;
    applyPromoCode(req: Request, res: Response, next: NextFunction): Promise<any>;
    createPayout(req: Request, res: Response, next: NextFunction): Promise<any>;
    getPayouts(req: Request, res: Response, next: NextFunction): Promise<any>;
    reverseCommission(req: Request, res: Response, next: NextFunction): Promise<any>;
}
export declare const influencersController: InfluencersController;
//# sourceMappingURL=influencers.controller.d.ts.map