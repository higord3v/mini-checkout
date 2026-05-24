import request from "supertest";
import express from "express";
import { ProductRepository } from "../../src/repositories/product.repository";
import { PurchaseService } from "../../src/services/purchase.service";
import { createPurchasesRouter } from "../../src/routes/purchases.routes";
import { errorMiddleware } from "../../src/middleware/error.middleware";

function createApp() {
  const repo = new ProductRepository();
  const app = express();
  app.use(express.json());
  app.use(
    "/api/purchases",
    createPurchasesRouter(new PurchaseService(repo, async () => {})),
  );
  app.use(errorMiddleware);
  return { app, repo };
}

describe("POST /api/purchases errors", () => {
  it("returns 404 for unknown product", async () => {
    const { app, repo } = createApp();

    const res = await request(app)
      .post("/api/purchases")
      .send({ productId: "unknown", quantity: 1 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Product not found" });
    expect(repo.findById("p1")?.stock).toBe(5);
  });

  it("returns 409 for insufficient stock", async () => {
    const { app, repo } = createApp();

    const res = await request(app)
      .post("/api/purchases")
      .send({ productId: "p1", quantity: 6 });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ success: false, message: "Insufficient stock" });
    expect(repo.findById("p1")?.stock).toBe(5);
  });
});
