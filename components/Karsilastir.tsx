"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";

const QUERY_KEYS = {
  category: "kategori",
  productA: "a",
  productB: "b",
} as const;

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
      <h1 className="text-2xl font-bold sm:text-3xl">Ürün Karşılaştır</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Aynı kategoriden iki ürünü seçip özelliklerini yan yana karşılaştırın.
        Sonuç linkini paylaşabilirsiniz.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="karsilastir-kategori" className="text-sm font-medium">
            Kategori
          </label>
          <select
            id="karsilastir-kategori"
            value={category.slug}
            onChange={(event) => handleCategoryChange(event.target.value)}
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.labelPlural}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="karsilastir-a" className="text-sm font-medium">
            1. Ürün
          </label>
          <select
            id="karsilastir-a"
            value={selectedASlug}
            onChange={(event) =>
              updateQuery({ [QUERY_KEYS.productA]: event.target.value })
            }
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
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
          <label htmlFor="karsilastir-b" className="text-sm font-medium">
            2. Ürün
          </label>
          <select
            id="karsilastir-b"
            value={selectedBSlug}
            onChange={(event) =>
              updateQuery({ [QUERY_KEYS.productB]: event.target.value })
            }
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
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
        <p className="mt-8 text-sm text-black/60 dark:text-white/60">
          Karşılaştırmak için iki ürün seçin.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-4 text-left font-medium text-black/60 dark:text-white/60">
                  Özellik
                </th>
                <th className="py-2 pr-4 text-left font-semibold">
                  {productA.name}
                </th>
                <th className="py-2 text-left font-semibold">
                  {productB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {category.specFields.map((field) => (
                <tr
                  key={field.label}
                  className="border-b border-black/10 last:border-0 dark:border-white/10"
                >
                  <th className="py-2 pr-4 text-left font-medium text-black/60 dark:text-white/60">
                    {field.label}
                  </th>
                  <td className="py-2 pr-4">{field.value(productA)}</td>
                  <td className="py-2">{field.value(productB)}</td>
                </tr>
              ))}
              <tr className="border-b border-black/10 last:border-0 dark:border-white/10">
                <th className="py-2 pr-4 text-left font-medium text-black/60 dark:text-white/60">
                  Sıfır Fiyat Aralığı
                </th>
                <td className="py-2 pr-4">
                  {formatPriceRange(productA.priceRangeNew)}
                </td>
                <td className="py-2">
                  {formatPriceRange(productB.priceRangeNew)}
                </td>
              </tr>
              <tr>
                <th className="py-2 pr-4 text-left font-medium text-black/60 dark:text-white/60">
                  2.el Fiyat Aralığı
                </th>
                <td className="py-2 pr-4">
                  {formatPriceRange(productA.priceRangeUsed)}
                </td>
                <td className="py-2">
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
