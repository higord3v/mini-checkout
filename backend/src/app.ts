import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import type { ProductRepository } from "./repositories/product.repository";
import { createProductsRouter } from "./routes/products.routes";
import { createPurchasesRouter } from "./routes/purchases.routes";
import { PurchaseService } from "./services/purchase.service";

export function createApp(
  repository: ProductRepository,
  options?: { delayFn?: () => Promise<void> },
) {
  const app = express();
  const purchaseService = new PurchaseService(repository, options?.delayFn);

  app.use(
    cors({
      origin: "http://localhost:5173",
    }),
  );
  app.use(express.json());

  app.use("/api/products", createProductsRouter(repository));
  app.use("/api/purchases", createPurchasesRouter(purchaseService));

  app.use(errorMiddleware);

  return app;
}
