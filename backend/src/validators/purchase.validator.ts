import { z } from "zod";

export const purchaseBodySchema = z.object({
  productId: z.string({ required_error: "Product is required" }).min(1, "Product is required"),
  quantity: z
    .number({ required_error: "Quantity is required", invalid_type_error: "Invalid quantity" })
    .int("Invalid quantity")
    .positive("Invalid quantity"),
});

export type PurchaseBody = z.infer<typeof purchaseBodySchema>;
