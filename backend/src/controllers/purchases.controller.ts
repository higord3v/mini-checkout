import type { Request, Response, NextFunction } from "express";
import type { PurchaseService } from "../services/purchase.service";
import { purchaseBodySchema } from "../validators/purchase.validator";

export function createPurchasesController(service: PurchaseService) {
  return {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const body = purchaseBodySchema.parse(req.body);
        const result = await service.createPurchase(body);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
  };
}
