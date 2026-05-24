import request from "supertest";
import { createApp } from "../../src/app";
import { ProductRepository } from "../../src/repositories/product.repository";

describe("GET /api/products", () => {
  it("returns seeded catalog", async () => {
    const repo = new ProductRepository();
    const app = createApp(repo);

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].id).toBe("p1");
  });
});
