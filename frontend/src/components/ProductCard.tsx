import type { Product } from "../types/api";

interface ProductCardProps {
  product: Product;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}

export function ProductCard({
  product,
  selected,
  disabled,
  onSelect,
}: ProductCardProps) {
  return (
    <button
      type="button"
      className={`product-card ${selected ? "selected" : ""}`}
      disabled={disabled}
      onClick={() => onSelect(product.id)}
      aria-pressed={selected}
    >
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
    </button>
  );
}
