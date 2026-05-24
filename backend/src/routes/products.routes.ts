import { Router } from "express";
import type { ProductRepository } from "../repositories/product.repository";
import { createProductsController } from "../controllers/products.controller";

export function createProductsRouter(repository: ProductRepository): Router {
  const router = Router();
  const controller = createProductsController(repository);

  router.get("/", controller.list);

  return router;
}
