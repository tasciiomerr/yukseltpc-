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
      className="group block rounded-xl border border-border-subtle bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-500/40 hover:shadow-md"
    >
      <h3 className="font-medium text-foreground group-hover:text-primary-accent">
        {product.name}
      </h3>
      <dl className="mt-3 flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-foreground/50">Sıfır</dt>
          <dd className="font-medium text-foreground/80">
            {formatPriceRange(product.priceRangeNew)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-foreground/50">2.el</dt>
          <dd className="font-medium text-foreground/80">
            {formatPriceRange(product.priceRangeUsed)}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
