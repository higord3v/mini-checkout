import { useCallback, useEffect, useState } from "react";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductCard } from "../components/ProductCard";
import { usePurchase } from "../hooks/usePurchase";
import { getProducts } from "../services/productService";
import type { Product } from "../types/api";

export function PurchasePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loadError, setLoadError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
      setLoadError("");
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load products",
      );
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const { isSubmitting, feedback, submitPurchase, setFeedback } =
    usePurchase(loadProducts);

  const handleSubmit = () => {
    if (!selectedId) {
      setFeedback({ type: "error", message: "Product is required" });
      return;
    }
    const qty = Number(quantity);
    void submitPurchase(selectedId, qty);
  };

  const disabled = isSubmitting;

  return (
    <main className="purchase-page">
      <h1>Phone Case Checkout</h1>

      {loadError && <Alert variant="error" message={loadError} />}

      <section className="product-list" aria-label="Products">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedId === product.id}
            disabled={disabled}
            onSelect={setSelectedId}
          />
        ))}
      </section>

      <section className="purchase-form">
        <Input
          label="Quantity"
          type="number"
          min={1}
          value={quantity}
          disabled={disabled}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {isSubmitting && <LoadingSpinner />}

        <Button disabled={disabled || !selectedId} onClick={handleSubmit}>
          {isSubmitting ? "Processing..." : "Purchase"}
        </Button>
      </section>

      {feedback && (
        <Alert
          variant={feedback.type === "success" ? "success" : "error"}
          message={feedback.message}
        />
      )}
    </main>
  );
}
