import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import { findProductBySlug } from "@/lib/categories";
import { getAllGuides, getGuideBySlug } from "@/lib/guides";
import { absoluteUrl, buildArticleSchema } from "@/lib/seo";

interface PageParams {
  slug: string;
}

/** Tabloları mobilde taşmayı önlemek için yatay kaydırılabilir bir kapsayıcıya sarar. */
const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
};

/** Markdown içeriğini blok (boş satır) sınırlarında ortadan ikiye böler. */
function splitMarkdownInHalf(content: string): [string, string] {
  const blocks = content.split(/\n\n+/);
  const midpoint = Math.ceil(blocks.length / 2);
  return [
    blocks.slice(0, midpoint).join("\n\n"),
    blocks.slice(midpoint).join("\n\n"),
  ];
}

export function generateStaticParams(): PageParams[] {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return { title: "Rehber Bulunamadı | YükseltPC" };
  }
  return {
    title: `${guide.seoTitle ?? guide.title} | YükseltPC`,
    description: guide.description,
    alternates: { canonical: absoluteUrl(`/rehber/${guide.slug}`) },
  };
}

export default async function RehberDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedGuides = (guide.relatedGuides ?? [])
    .map((relatedSlug) => getGuideBySlug(relatedSlug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const relatedProducts = (guide.relatedProducts ?? [])
    .map((ref) => ({
      product: findProductBySlug(ref.kategori, ref.slug),
      kategori: ref.kategori,
    }))
    .filter(
      (
        entry,
      ): entry is {
        product: NonNullable<typeof entry.product>;
        kategori: string;
      } => Boolean(entry.product),
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={buildArticleSchema(guide)} />
      <Breadcrumb
        items={[
          { label: "Rehberler", href: "/rehber" },
          { label: guide.title },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{guide.title}</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Son güncelleme: {guide.date}
      </p>

      {(() => {
        const [firstHalf, secondHalf] = splitMarkdownInHalf(guide.content);
        return (
          <>
            <article className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {firstHalf}
              </ReactMarkdown>
            </article>
            <div className="not-prose my-8">
              <AdSlot slotId={`rehber-mid-${guide.slug}`} />
            </div>
            <article className="prose prose-neutral max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {secondHalf}
              </ReactMarkdown>
            </article>
          </>
        );
      })()}

      <div className="my-8">
        <AdSlot slotId={`rehber-end-${guide.slug}`} />
      </div>

      {relatedGuides.length > 0 && (
        <section className="mt-12 border-t border-border-subtle pt-8">
          <h2 className="font-heading text-lg font-semibold">
            İlgili Rehberler
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedGuides.map((related) => (
              <Link
                key={related.slug}
                href={`/rehber/${related.slug}`}
                className="block rounded-xl border border-border-subtle bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-500/40 hover:shadow-md"
              >
                <h3 className="font-medium text-foreground">{related.title}</h3>
                <p className="mt-1.5 text-sm text-foreground/60">
                  {related.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-10 border-t border-border-subtle pt-8">
          <h2 className="font-heading text-lg font-semibold">İlgili Ürünler</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedProducts.map(({ product, kategori }) => (
              <ProductCard
                key={`${kategori}-${product.slug}`}
                product={product}
                categorySlug={kategori}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
