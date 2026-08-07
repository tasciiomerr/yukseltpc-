import type { AnyProduct, CategoryConfig } from "./categories";
import type { Guide } from "./guides";

export const SITE_URL = "https://yukseltpc.com";
export const SITE_NAME = "YükseltPC";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export interface BreadcrumbSchemaItem {
  label: string;
  href?: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

function hasBrand(
  product: AnyProduct,
): product is AnyProduct & { brand: string } {
  return (
    "brand" in product &&
    typeof (product as { brand?: unknown }).brand === "string"
  );
}

export function buildProductSchema(
  product: AnyProduct,
  category: CategoryConfig,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: category.label,
    url: absoluteUrl(`/${category.slug}/${product.slug}`),
    ...(hasBrand(product)
      ? { brand: { "@type": "Brand", name: product.brand } }
      : {}),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TRY",
      lowPrice: product.priceRangeNew.min,
      highPrice: product.priceRangeNew.max,
      offerCount: 5,
    },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: "info@yukseltpc.com",
  };
}

export function buildArticleSchema(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    dateModified: guide.date,
    url: absoluteUrl(`/rehber/${guide.slug}`),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function buildItemListSchema(
  category: CategoryConfig,
  items: AnyProduct[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/${category.slug}/${item.slug}`),
      name: item.name,
    })),
  };
}
