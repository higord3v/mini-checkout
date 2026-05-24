import { ConflictError, NotFoundError } from "../../src/errors/app.errors";
import { ProductRepository } from "../../src/repositories/product.repository";
import { PurchaseService } from "../../src/services/purchase.service";

const noDelay = async () => {};

describe("PurchaseService", () => {
  let repo: ProductRepository;
  let service: PurchaseService;

  beforeEach(() => {
    repo = new ProductRepository();
    service = new PurchaseService(repo, noDelay);
  });

  it("completes purchase and decrements stock", async () => {
    const result = await service.createPurchase({ productId: "p1", quantity: 2 });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Purchase completed");
    expect(result.purchaseId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(repo.findById("p1")?.stock).toBe(3);
  });

  it("throws NotFoundError for unknown product", async () => {
    await expect(
      service.createPurchase({ productId: "unknown", quantity: 1 }),
    ).rejects.toThrow(NotFoundError);
    expect(repo.findById("p1")?.stock).toBe(5);
  });

  it("throws ConflictError when quantity exceeds stock", async () => {
    await expect(
      service.createPurchase({ productId: "p1", quantity: 6 }),
    ).rejects.toThrow(ConflictError);
    expect(repo.findById("p1")?.stock).toBe(5);
  });
});
