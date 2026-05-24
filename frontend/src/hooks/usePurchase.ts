import { useCallback, useRef, useState } from "react";
import { createPurchase } from "../services/purchaseService";

export function usePurchase(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const submitPurchase = useCallback(
    async (productId: string, quantity: number) => {
      if (submittingRef.current) return;

      submittingRef.current = true;
      setIsSubmitting(true);
      setFeedback(null);

      try {
        await createPurchase({ productId, quantity });
        setFeedback({
          type: "success",
          message: "Purchase completed successfully",
        });
        onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An unexpected error occurred";
        setFeedback({ type: "error", message });
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { isSubmitting, feedback, submitPurchase, setFeedback };
}
