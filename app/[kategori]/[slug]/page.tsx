import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import RetailerLinks from "@/components/RetailerLinks";
import SpecTable from "@/components/SpecTable";
import { categories, findProductBySlug, getCategory } from "@/lib/categories";

interface PageParams {
  kategori: string;
  slug: string;
}

export function generateStaticParams(): PageParams[] {
  return categories.flatMap((category) =>
    category.items.map((item) => ({
      kategori: category.slug,
      slug: item.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { kategori, slug } = await params;
  const product = findProductBySlug(kategori, slug);
  if (!product) {
    return { title: "Ürün Bulunamadı | YükseltPC" };
  }
  return {
    title: `${product.name} — Uyumluluk, Fiyat ve Özellikler | YükseltPC`,
    description: `${product.name} teknik özellikleri, uyumlu olduğu diğer bileşenler ve güncel sıfır/2.el fiyat aralığı.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { kategori, slug } = await params;
  const category = getCategory(kategori);
  if (!category) notFound();

  const product = findProductBySlug(kategori, slug);
  if (!product) notFound();

  const relatedGroups = category.getRelated(product);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumb
        items={[
          { label: category.labelPlural, href: `/${category.slug}` },
          { label: product.name },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{product.name}</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Teknik Özellikler</h2>
        <div className="mt-3">
          <SpecTable item={product} fields={category.specFields} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Satın Al</h2>
        <div className="mt-3">
          <RetailerLinks
            productName={product.name}
            priceRangeNew={product.priceRangeNew}
            priceRangeUsed={product.priceRangeUsed}
          />
        </div>
      </section>

      {relatedGroups.map((group) =>
        group.items.length > 0 ? (
          <section key={group.categorySlug} className="mt-8">
            <h2 className="text-lg font-semibold">{group.title}</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((related) => (
                <ProductCard
                  key={related.slug}
                  product={related}
                  categorySlug={group.categorySlug}
                />
              ))}
            </div>
          </section>
        ) : null,
      )}
    </div>
  );
}
