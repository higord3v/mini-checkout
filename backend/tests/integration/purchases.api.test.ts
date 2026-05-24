import request from "supertest";
import { createApp } from "../../src/app";
import { ProductRepository } from "../../src/repositories/product.repository";
import { PurchaseService } from "../../src/services/purchase.service";
import express from "express";
import { createPurchasesRouter } from "../../src/routes/purchases.routes";
import { errorMiddleware } from "../../src/middleware/error.middleware";

function createTestPurchasesApp(repo: ProductRepository) {
  const app = express();
  app.use(express.json());
  const service = new PurchaseService(repo, async () => {});
  app.use("/api/purchases", createPurchasesRouter(service));
  app.use(errorMiddleware);
  return app;
}

describe("POST /api/purchases", () => {
  it("returns 201 on successful purchase", async () => {
    const repo = new ProductRepository();
    const app = createTestPurchasesApp(repo);

    const res = await request(app)
      .post("/api/purchases")
      .send({ productId: "p1", quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      success: true,
      message: "Purchase completed",
    });
    expect(res.body.purchaseId).toBeDefined();
    expect(repo.findById("p1")?.stock).toBe(3);
  });
});

describe("POST /api/purchases with full app", () => {
  it("exposes products after purchase via catalog", async () => {
    const repo = new ProductRepository();
    const app = createApp(repo, { delayFn: async () => {} });

    await request(app)
      .post("/api/purchases")
      .send({ productId: "p1", quantity: 1 });

    const res = await request(app).get("/api/products");
    const p1 = res.body.data.find((p: { id: string }) => p.id === "p1");
    expect(p1.stock).toBe(4);
  });
});
