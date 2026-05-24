import { apiRequest } from "../api/client";
import type { PurchaseSuccessResponse } from "../types/api";

export interface PurchaseInput {
  productId: string;
  quantity: number;
}

export async function createPurchase(input: PurchaseInput) {
  return apiRequest<PurchaseSuccessResponse>("/api/purchases", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
