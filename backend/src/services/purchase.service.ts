import { randomUUID } from "crypto";
import { ConflictError, NotFoundError } from "../errors/app.errors";
import type { ProductRepository } from "../repositories/product.repository";
import type { PurchaseBody } from "../validators/purchase.validator";
import { randomDelay } from "../utils/delay";

export interface PurchaseSuccess {
  success: true;
  message: string;
  purchaseId: string;
}

export class PurchaseService {
  private readonly delayFn: () => Promise<void>;

  constructor(
    private readonly repository: ProductRepository,
    delayFn?: () => Promise<void>,
  ) {
    this.delayFn = delayFn ?? randomDelay;
  }

  async createPurchase(input: PurchaseBody): Promise<PurchaseSuccess> {
    const product = this.repository.findById(input.productId);
    if (!product) {
      throw new NotFoundError();
    }
    if (input.quantity > product.stock) {
      throw new ConflictError();
    }

    await this.delayFn();

    const current = this.repository.findById(input.productId);
    if (!current) {
      throw new NotFoundError();
    }
    if (input.quantity > current.stock) {
      throw new ConflictError();
    }

    this.repository.decreaseStock(input.productId, input.quantity);

    return {
      success: true,
      message: "Purchase completed",
      purchaseId: randomUUID(),
    };
  }
}
