"use client";

import { buildRetailerUrl, retailers } from "@/lib/retailers";
import type { PriceRange } from "@/lib/types";

interface RetailerLinksProps {
  productName: string;
  priceRangeNew?: PriceRange;
  priceRangeUsed?: PriceRange;
}

function formatPriceRange(range: PriceRange): string {
  const min = range.min.toLocaleString("tr-TR");
  const max = range.max.toLocaleString("tr-TR");
  return `${min}-${max} TL`;
}

function trackRetailerLinkClick(retailerName: string, productName: string) {
  if (typeof window === "undefined") return;
  const gtag = (
    window as typeof window & { gtag?: (...args: unknown[]) => void }
  ).gtag;
  gtag?.("event", "retailer_link_click", {
    retailer_name: retailerName,
    product_name: productName,
  });
}

function RetailerGroup({
  title,
  badgeClassName,
  priceRange,
  items,
  productName,
}: {
  title: string;
  badgeClassName: string;
  priceRange?: PriceRange;
  items: typeof retailers;
  productName: string;
}) {
  return (
    <div className="flex-1 rounded-xl border border-border-subtle bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClassName}`}
        >
          {title}
        </span>
        {priceRange && (
          <span className="text-sm font-medium text-foreground/70">
            {formatPriceRange(priceRange)}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((retailer) => (
          <a
            key={retailer.id}
            href={buildRetailerUrl(retailer, productName)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={() => trackRetailerLinkClick(retailer.name, productName)}
            className="rounded-lg border border-border-subtle bg-background px-3 py-1.5 text-sm font-medium text-foreground/80 shadow-sm transition-colors hover:border-primary-500/50 hover:text-primary-accent"
          >
            {retailer.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function RetailerLinks({
  productName,
  priceRangeNew,
  priceRangeUsed,
}: RetailerLinksProps) {
  const newRetailers = retailers.filter((r) => r.category === "sifir");
  const usedRetailers = retailers.filter((r) => r.category === "ikinci-el");

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <RetailerGroup
        title="Sıfır"
        badgeClassName="bg-primary-50 text-primary-accent"
        priceRange={priceRangeNew}
        items={newRetailers}
        productName={productName}
      />
      <RetailerGroup
        title="2.el"
        badgeClassName="bg-accent-500/10 text-accent-600"
        priceRange={priceRangeUsed}
        items={usedRetailers}
        productName={productName}
      />
    </div>
  );
}
