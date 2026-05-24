import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import type { ProductRepository } from "./repositories/product.repository";
import { createProductsRouter } from "./routes/products.routes";
import { createPurchasesRouter } from "./routes/purchases.routes";
import { PurchaseService } from "./services/purchase.service";
import { setupSwagger } from "./swagger/setupSwagger";

export function createApp(
  repository: ProductRepository,
  options?: { delayFn?: () => Promise<void>; enableApiDocs?: boolean },
) {
  const app = express();
  const purchaseService = new PurchaseService(repository, options?.delayFn);
  const enableApiDocs =
    options?.enableApiDocs ?? process.env.NODE_ENV !== "production";

  app.use(
    cors({
      origin: "http://localhost:5173",
    }),
  );
  app.use(express.json());

  if (enableApiDocs) {
    setupSwagger(app);
  }

  app.use("/api/products", createProductsRouter(repository));
  app.use("/api/purchases", createPurchasesRouter(purchaseService));

  app.use(errorMiddleware);

  return app;
}
