import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PurchasePage } from "../../src/pages/PurchasePage";
import * as productService from "../../src/services/productService";
import * as purchaseService from "../../src/services/purchaseService";

vi.mock("../../src/services/productService");
vi.mock("../../src/services/purchaseService");

const mockProducts = [
  { id: "p1", name: "Samsung Green Case", price: 45, stock: 5 },
];

describe("PurchasePage stock errors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(productService.getProducts).mockResolvedValue({
      success: true,
      data: mockProducts,
    });
  });

  it("shows insufficient stock message", async () => {
    const user = userEvent.setup();
    vi.mocked(purchaseService.createPurchase).mockRejectedValue(
      new Error("Insufficient stock"),
    );

    render(<PurchasePage />);
    await screen.findByText("Samsung Green Case");

    await user.click(screen.getByRole("button", { name: /Samsung Green Case/i }));
    await user.clear(screen.getByLabelText("Quantity"));
    await user.type(screen.getByLabelText("Quantity"), "99");
    await user.click(screen.getByRole("button", { name: /^Purchase$/i }));

    await waitFor(() => {
      expect(screen.getByText("Insufficient stock")).toBeInTheDocument();
    });
  });

  it("shows product not found message", async () => {
    const user = userEvent.setup();
    vi.mocked(purchaseService.createPurchase).mockRejectedValue(
      new Error("Product not found"),
    );

    render(<PurchasePage />);
    await screen.findByText("Samsung Green Case");

    await user.click(screen.getByRole("button", { name: /Samsung Green Case/i }));
    await user.click(screen.getByRole("button", { name: /^Purchase$/i }));

    await waitFor(() => {
      expect(screen.getByText("Product not found")).toBeInTheDocument();
    });
  });
});
