"use client";

import { Fragment, useMemo, useState } from "react";
import { getCategory } from "@/lib/categories";
import AdSlot from "./AdSlot";
import ProductCard from "./ProductCard";

const AD_INTERVAL = 6;

export default function CategoryListing({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const category = getCategory(categorySlug);
  const [selectedFilter, setSelectedFilter] = useState("");

  const filterOptions = useMemo(() => {
    if (!category?.filter) return [];
    const values = category.items.map((item) => category.filter!.value(item));
    return Array.from(new Set(values)).sort();
  }, [category]);

  if (!category) return null;

  const filteredItems = selectedFilter
    ? category.items.filter(
        (item) => category.filter!.value(item) === selectedFilter,
      )
    : category.items;

  return (
    <div>
      <h2 className="sr-only">{category.labelPlural} Listesi</h2>
      {category.filter && (
        <div className="mb-6 flex items-center gap-2">
          <label
            htmlFor="category-filter"
            className="text-sm font-medium text-foreground/70"
          >
            {category.filter.label}
          </label>
          <select
            id="category-filter"
            value={selectedFilter}
            onChange={(event) => setSelectedFilter(event.target.value)}
            className="rounded-lg border border-border-subtle bg-background px-3 py-1.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="">Tümü</option>
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-subtle py-16 text-center">
          <span aria-hidden className="text-3xl">
            🔍
          </span>
          <p className="text-sm font-medium text-foreground/70">
            Bu kritere uyan ürün bulunamadı.
          </p>
          <p className="text-sm text-foreground/50">
            Farklı bir filtre seçmeyi deneyin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => {
            const isAdRow =
              (index + 1) % AD_INTERVAL === 0 &&
              index !== filteredItems.length - 1;
            return (
              <Fragment key={item.slug}>
                <ProductCard product={item} categorySlug={category.slug} />
                {isAdRow && (
                  <div className="col-span-full">
                    <AdSlot slotId={`category-${category.slug}-${index}`} />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
