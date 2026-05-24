export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface ProductsResponse {
  success: true;
  data: Product[];
}

export interface PurchaseSuccessResponse {
  success: true;
  message: string;
  purchaseId: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

export type ApiError = Error & { status: number; message: string };
