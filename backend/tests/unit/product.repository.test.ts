import { ProductRepository } from "../../src/repositories/product.repository";

describe("ProductRepository", () => {
  it("seeds two products with expected stock", () => {
    const repo = new ProductRepository();
    const products = repo.findAll();

    expect(products).toHaveLength(2);
    expect(products[0]).toMatchObject({
      id: "p1",
      name: "Samsung Green Case",
      price: 45,
      stock: 5,
    });
    expect(products[1]).toMatchObject({
      id: "p2",
      name: "Iphone Red Case",
      price: 30,
      stock: 10,
    });
  });
});
