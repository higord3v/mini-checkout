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

describe("POST /api/purchases validation", () => {
  it("returns 400 for zero quantity", async () => {
    const { app, repo } = createApp();

    const res = await request(app)
      .post("/api/purchases")
      .send({ productId: "p1", quantity: 0 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: "Invalid quantity" });
    expect(repo.findById("p1")?.stock).toBe(5);
  });

  it("returns 400 for missing productId", async () => {
    const { app } = createApp();

    const res = await request(app)
      .post("/api/purchases")
      .send({ quantity: 1 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for malformed JSON", async () => {
    const { app } = createApp();

    const res = await request(app)
      .post("/api/purchases")
      .set("Content-Type", "application/json")
      .send("{ invalid");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
