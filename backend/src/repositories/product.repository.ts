import type { Product } from "../models/product";

const SEED_PRODUCTS: Product[] = [
  { id: "p1", name: "Samsung Green Case", price: 45, stock: 5 },
  { id: "p2", name: "Iphone Red Case", price: 30, stock: 10 },
];

export class ProductRepository {
  private products: Product[];

  constructor(initial?: Product[]) {
    this.products = (initial ?? SEED_PRODUCTS).map((p) => ({ ...p }));
  }

  findAll(): Product[] {
    return this.products.map((p) => ({ ...p }));
  }

  findById(id: string): Product | undefined {
    const product = this.products.find((p) => p.id === id);
    return product ? { ...product } : undefined;
  }

  decreaseStock(id: string, quantity: number): void {
    const product = this.products.find((p) => p.id === id);
    if (!product) return;
    product.stock -= quantity;
  }

  reset(products?: Product[]): void {
    this.products = (products ?? SEED_PRODUCTS).map((p) => ({ ...p }));
  }
}

export const productRepository = new ProductRepository();
