"use client";

import { useMemo, useState } from "react";
import { getCategory } from "@/lib/categories";
import ProductCard from "./ProductCard";

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
      {category.filter && (
        <div className="mb-6 flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm font-medium">
            {category.filter.label}
          </label>
          <select
            id="category-filter"
            value={selectedFilter}
            onChange={(event) => setSelectedFilter(event.target.value)}
            className="rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm dark:border-white/15 dark:bg-black"
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
        <p className="text-sm text-black/60 dark:text-white/60">
          Bu kritere uyan ürün bulunamadı.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
              categorySlug={category.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
