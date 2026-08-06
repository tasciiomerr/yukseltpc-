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

export default function RetailerLinks({
  productName,
  priceRangeNew,
  priceRangeUsed,
}: RetailerLinksProps) {
  const newRetailers = retailers.filter((r) => r.category === "sifir");
  const usedRetailers = retailers.filter((r) => r.category === "ikinci-el");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-sm font-semibold">Sıfır</h4>
          {priceRangeNew && (
            <span className="text-xs text-black/60 dark:text-white/60">
              {formatPriceRange(priceRangeNew)}
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {newRetailers.map((retailer) => (
            <a
              key={retailer.id}
              href={buildRetailerUrl(retailer, productName)}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() => trackRetailerLinkClick(retailer.name, productName)}
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              {retailer.name}
            </a>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-sm font-semibold">2.el</h4>
          {priceRangeUsed && (
            <span className="text-xs text-black/60 dark:text-white/60">
              {formatPriceRange(priceRangeUsed)}
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {usedRetailers.map((retailer) => (
            <a
              key={retailer.id}
              href={buildRetailerUrl(retailer, productName)}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() => trackRetailerLinkClick(retailer.name, productName)}
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              {retailer.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
