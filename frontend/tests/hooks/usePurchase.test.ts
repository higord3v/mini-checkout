import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePurchase } from "../../src/hooks/usePurchase";
import * as purchaseService from "../../src/services/purchaseService";

vi.mock("../../src/services/purchaseService");

describe("usePurchase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets isSubmitting while purchase is in progress", async () => {
    vi.mocked(purchaseService.createPurchase).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                success: true,
                message: "Purchase completed",
                purchaseId: "id-1",
              }),
            50,
          );
        }),
    );

    const { result } = renderHook(() => usePurchase());

    act(() => {
      void result.current.submitPurchase("p1", 1);
    });

    expect(result.current.isSubmitting).toBe(true);

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it("blocks duplicate submission while in flight", async () => {
    vi.mocked(purchaseService.createPurchase).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                success: true,
                message: "Purchase completed",
                purchaseId: "id-1",
              }),
            100,
          );
        }),
    );

    const { result } = renderHook(() => usePurchase());

    act(() => {
      void result.current.submitPurchase("p1", 1);
      void result.current.submitPurchase("p1", 1);
    });

    expect(purchaseService.createPurchase).toHaveBeenCalledTimes(1);
  });
});
