import type { Request, Response } from "express";
import type { ProductRepository } from "../repositories/product.repository";

export function createProductsController(repository: ProductRepository) {
  return {
    list(_req: Request, res: Response): void {
      res.status(200).json({
        success: true,
        data: repository.findAll(),
      });
    },
  };
}
