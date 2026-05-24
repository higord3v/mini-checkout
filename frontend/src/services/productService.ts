import { apiRequest } from "../api/client";
import type { ProductsResponse } from "../types/api";

export async function getProducts() {
  return apiRequest<ProductsResponse>("/api/products");
}
