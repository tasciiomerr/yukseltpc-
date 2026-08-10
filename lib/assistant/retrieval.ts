import { categories, type AnyProduct, type CategorySlug } from "../categories";

export interface ProductMatch {
  product: AnyProduct;
  categorySlug: CategorySlug;
  categoryLabel: string;
  url: string;
  score: number;
}

const TR_CHAR_MAP: Record<string, string> = {
  ı: "i",
  İ: "i",
  ş: "s",
  Ş: "s",
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ö: "o",
  Ö: "o",
  ü: "u",
  Ü: "u",
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ışçğöüİŞÇĞÖÜ]/g, (char) => TR_CHAR_MAP[char] ?? char)
    .trim();
}

function tokenize(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9.]+/)
    .filter((token) => token.length >= 2);
}

function productSearchText(
  product: AnyProduct,
  categoryLabel: string,
  specFields: { value: (item: AnyProduct) => string }[],
): string {
  const specText = specFields.map((field) => field.value(product)).join(" ");
  return normalize(`${categoryLabel} ${product.name} ${specText}`);
}

/**
 * Kullanıcının sorusuyla ilgili ürünleri kataloğumuzdan basit anahtar kelime
 * eşleştirmesiyle bulur. Hiçbir eşleşme yoksa, sorguda geçen kategori adına
 * göre (örn. "ekran kartı") o kategoriden birkaç örnek ürün döndürür — bu,
 * asistanın "elimde hiçbir şey yok" demek yerine genel bir öneri sunabilmesi
 * için, ama yine de yalnızca GERÇEK katalog verisiyle sınırlı kalması içindir.
 */
export function findRelevantProducts(
  query: string,
  limit = 8,
): ProductMatch[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scored: ProductMatch[] = [];

  for (const category of categories) {
    for (const product of category.items) {
      const haystack = productSearchText(
        product,
        category.label,
        category.specFields,
      );
      const score = queryTokens.reduce(
        (acc, token) => acc + (haystack.includes(token) ? 1 : 0),
        0,
      );
      if (score > 0) {
        scored.push({
          product,
          categorySlug: category.slug,
          categoryLabel: category.label,
          url: `/${category.slug}/${product.slug}`,
          score,
        });
      }
    }
  }

  if (scored.length > 0) {
    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  // Doğrudan ürün eşleşmesi yok — sorgu bir kategori adı içeriyor olabilir
  // (örn. "bana bir anakart öner"). O kategoriden birkaç örnek döndür.
  const matchedCategory = categories.find((category) =>
    queryTokens.some((token) => normalize(category.label).includes(token)),
  );

  if (!matchedCategory) return [];

  return matchedCategory.items.slice(0, limit).map((product) => ({
    product,
    categorySlug: matchedCategory.slug,
    categoryLabel: matchedCategory.label,
    url: `/${matchedCategory.slug}/${product.slug}`,
    score: 0,
  }));
}

export function buildContextText(matches: ProductMatch[]): string {
  if (matches.length === 0) {
    return "Kullanıcının sorusuyla ilgili kataloğumuzda hiçbir ürün bulunamadı.";
  }

  return matches
    .map((match) => {
      const specs = categories
        .find((c) => c.slug === match.categorySlug)
        ?.specFields.map(
          (field) => `${field.label}: ${field.value(match.product)}`,
        )
        .join(", ");
      return [
        `- Kategori: ${match.categoryLabel}`,
        `  Ürün adı: ${match.product.name}`,
        `  Özellikler: ${specs ?? ""}`,
        `  Sıfır fiyat aralığı: ${match.product.priceRangeNew.min}-${match.product.priceRangeNew.max} TL`,
        `  2.el fiyat aralığı: ${match.product.priceRangeUsed.min}-${match.product.priceRangeUsed.max} TL`,
        `  URL: ${match.url}`,
      ].join("\n");
    })
    .join("\n\n");
}
