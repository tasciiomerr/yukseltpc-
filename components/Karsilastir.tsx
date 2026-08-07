"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";

const QUERY_KEYS = {
  category: "kategori",
  productA: "a",
  productB: "b",
} as const;

const selectClassName =
  "rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none";

function formatPriceRange(range: { min: number; max: number }): string {
  return `${range.min.toLocaleString("tr-TR")}-${range.max.toLocaleString("tr-TR")} TL`;
}

export default function Karsilastir() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategorySlug =
    searchParams.get(QUERY_KEYS.category) ?? categories[0].slug;
  const selectedASlug = searchParams.get(QUERY_KEYS.productA) ?? "";
  const selectedBSlug = searchParams.get(QUERY_KEYS.productB) ?? "";

  const category = getCategory(selectedCategorySlug) ?? categories[0];
  const productA = category.items.find((item) => item.slug === selectedASlug);
  const productB = category.items.find((item) => item.slug === selectedBSlug);

  function updateQuery(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  function handleCategoryChange(newCategorySlug: string) {
    updateQuery({
      [QUERY_KEYS.category]: newCategorySlug,
      [QUERY_KEYS.productA]: "",
      [QUERY_KEYS.productB]: "",
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold sm:text-3xl">
        Ürün Karşılaştır
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Aynı kategoriden iki ürünü seçip özelliklerini yan yana karşılaştırın.
        Sonuç linkini paylaşabilirsiniz.
      </p>

      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface p-5 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="karsilastir-kategori"
            className="text-sm font-medium text-foreground/70"
          >
            Kategori
          </label>
          <select
            id="karsilastir-kategori"
            value={category.slug}
            onChange={(event) => handleCategoryChange(event.target.value)}
            className={selectClassName}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.labelPlural}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="karsilastir-a"
            className="text-sm font-medium text-foreground/70"
          >
            1. Ürün
          </label>
          <select
            id="karsilastir-a"
            value={selectedASlug}
            onChange={(event) =>
              updateQuery({ [QUERY_KEYS.productA]: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">Seçilmedi</option>
            {category.items.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="karsilastir-b"
            className="text-sm font-medium text-foreground/70"
          >
            2. Ürün
          </label>
          <select
            id="karsilastir-b"
            value={selectedBSlug}
            onChange={(event) =>
              updateQuery({ [QUERY_KEYS.productB]: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">Seçilmedi</option>
            {category.items.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!productA || !productB ? (
        <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-subtle py-16 text-center">
          <span aria-hidden className="text-3xl">
            ⚖️
          </span>
          <p className="text-sm font-medium text-foreground/70">
            Karşılaştırmak için iki ürün seçin.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface">
                <th className="px-4 py-3 text-left font-medium text-foreground/60">
                  Özellik
                </th>
                <th className="px-4 py-3 text-left font-heading font-semibold text-primary-accent">
                  {productA.name}
                </th>
                <th className="px-4 py-3 text-left font-heading font-semibold text-primary-accent">
                  {productB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {category.specFields.map((field, index) => (
                <tr
                  key={field.label}
                  className={index % 2 === 0 ? "bg-background" : "bg-surface"}
                >
                  <th className="px-4 py-2.5 text-left font-medium text-foreground/60">
                    {field.label}
                  </th>
                  <td className="px-4 py-2.5 font-medium">
                    {field.value(productA)}
                  </td>
                  <td className="px-4 py-2.5 font-medium">
                    {field.value(productB)}
                  </td>
                </tr>
              ))}
              <tr className="bg-primary-50/40">
                <th className="px-4 py-2.5 text-left font-medium text-foreground/60">
                  Sıfır Fiyat Aralığı
                </th>
                <td className="px-4 py-2.5 font-medium">
                  {formatPriceRange(productA.priceRangeNew)}
                </td>
                <td className="px-4 py-2.5 font-medium">
                  {formatPriceRange(productB.priceRangeNew)}
                </td>
              </tr>
              <tr className="bg-primary-50/40">
                <th className="px-4 py-2.5 text-left font-medium text-foreground/60">
                  2.el Fiyat Aralığı
                </th>
                <td className="px-4 py-2.5 font-medium">
                  {formatPriceRange(productA.priceRangeUsed)}
                </td>
                <td className="px-4 py-2.5 font-medium">
                  {formatPriceRange(productB.priceRangeUsed)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
