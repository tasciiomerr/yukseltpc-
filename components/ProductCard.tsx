import Link from "next/link";
import type { AnyProduct } from "@/lib/categories";

function formatPriceRange(range: { min: number; max: number }): string {
  return `${range.min.toLocaleString("tr-TR")}-${range.max.toLocaleString("tr-TR")} TL`;
}

export default function ProductCard({
  product,
  categorySlug,
}: {
  product: AnyProduct;
  categorySlug: string;
}) {
  return (
    <Link
      href={`/${categorySlug}/${product.slug}`}
      className="block rounded-lg border border-black/10 p-4 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
    >
      <h3 className="font-medium">{product.name}</h3>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Sıfır: {formatPriceRange(product.priceRangeNew)}
      </p>
      <p className="text-sm text-black/60 dark:text-white/60">
        2.el: {formatPriceRange(product.priceRangeUsed)}
      </p>
    </Link>
  );
}
