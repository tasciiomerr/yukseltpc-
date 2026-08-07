import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryListing from "@/components/CategoryListing";
import JsonLd from "@/components/JsonLd";
import { getCategory } from "@/lib/categories";
import { absoluteUrl, buildItemListSchema } from "@/lib/seo";

const category = getCategory("ram")!;

export const metadata: Metadata = {
  title: `${category.label} Modelleri ve Uyumluluk Rehberi | YükseltPC`,
  description: `${category.labelPlural} seçeneklerini karşılaştırın, uyumluluk bilgilerine ve fiyat aralıklarına göz atın.`,
  alternates: { canonical: absoluteUrl(`/${category.slug}`) },
};

export default function RamPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={buildItemListSchema(category, category.items)} />
      <Breadcrumb items={[{ label: category.labelPlural }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        {category.labelPlural}
      </h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        RAM (bellek) yükseltmesi, fiyat/performans açısından en kolay ve etkili
        yükseltmelerden biridir. Alacağınız RAM&apos;in tipi (
        <strong>DDR4 veya DDR5</strong>) anakartınızın desteklediği tiple
        birebir eşleşmelidir — aksi halde modül anakarta takılabilse bile
        çalışmaz. Emin değilseniz{" "}
        <Link
          href="/uyumluluk-araci"
          className="text-primary-accent hover:underline"
        >
          uyumluluk aracıyla
        </Link>{" "}
        anakartınızı seçip anında kontrol edin.
      </p>
      <div className="mt-8">
        <CategoryListing categorySlug={category.slug} />
      </div>
    </div>
  );
}
