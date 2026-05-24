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
  { id: "p2", name: "Iphone Red Case", price: 30, stock: 10 },
];

describe("PurchasePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(productService.getProducts).mockResolvedValue({
      success: true,
      data: mockProducts,
    });
  });

  it("shows success message after purchase", async () => {
    const user = userEvent.setup();
    vi.mocked(purchaseService.createPurchase).mockResolvedValue({
      success: true,
      message: "Purchase completed",
      purchaseId: "uuid-1",
    });

    render(<PurchasePage />);

    await screen.findByText("Samsung Green Case");

    await user.click(screen.getByRole("button", { name: /Samsung Green Case/i }));
    await user.click(screen.getByRole("button", { name: /^Purchase$/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Purchase completed successfully"),
      ).toBeInTheDocument();
    });
  });
});
