import request from "supertest";
import { createApp } from "../../src/app";
import openApiDocument from "../../src/openapi/openapi.json";
import { ProductRepository } from "../../src/repositories/product.repository";

describe("Swagger API documentation", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("GET /api-docs/ returns 200 when enableApiDocs is true", async () => {
    const app = createApp(new ProductRepository(), { enableApiDocs: true });

    const res = await request(app).get("/api-docs/");

    expect(res.status).toBe(200);
  });

  it("GET /api-docs/ returns 404 when enableApiDocs is false", async () => {
    const app = createApp(new ProductRepository(), { enableApiDocs: false });

    const res = await request(app).get("/api-docs/");

    expect(res.status).toBe(404);
  });

  it("openapi spec documents catalog and purchase paths", () => {
    expect(openApiDocument.paths).toHaveProperty("/api/products");
    expect(openApiDocument.paths).toHaveProperty("/api/purchases");
  });

  it("does not expose /api-docs when NODE_ENV is production", async () => {
    process.env.NODE_ENV = "production";
    const app = createApp(new ProductRepository());

    const res = await request(app).get("/api-docs/");

    expect(res.status).toBe(404);
  });
});
