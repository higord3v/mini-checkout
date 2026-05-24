import { Router } from "express";
import type { PurchaseService } from "../services/purchase.service";
import { createPurchasesController } from "../controllers/purchases.controller";

export function createPurchasesRouter(service: PurchaseService): Router {
  const router = Router();
  const controller = createPurchasesController(service);

  router.post("/", controller.create);

  return router;
}
