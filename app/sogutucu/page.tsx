import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryListing from "@/components/CategoryListing";
import JsonLd from "@/components/JsonLd";
import { getCategory } from "@/lib/categories";
import { absoluteUrl, buildItemListSchema } from "@/lib/seo";

const category = getCategory("sogutucu")!;

export const metadata: Metadata = {
  title: `${category.label} Modelleri ve Uyumluluk Rehberi | YükseltPC`,
  description: `${category.labelPlural} seçeneklerini karşılaştırın, uyumluluk bilgilerine ve fiyat aralıklarına göz atın.`,
  alternates: { canonical: absoluteUrl(`/${category.slug}`) },
};

export default function SogutucuPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={buildItemListSchema(category, category.items)} />
      <Breadcrumb items={[{ label: category.labelPlural }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        {category.labelPlural}
      </h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        İşlemci soğutucusu seçerken önce <strong>soket uyumluluğunu</strong>{" "}
        (AM4, AM5, LGA1700 gibi), sonra kasanızın izin verdiği maksimum
        yüksekliği kontrol edin. Hava soğutucular daha ekonomik ve bakımı
        kolayken, sıvı soğutucular yüksek TDP&apos;li işlemcilerde daha sessiz
        çalışabilir. Hangi soğutucunun işlemcinizle uyumlu olduğunu{" "}
        <Link
          href="/uyumluluk-araci"
          className="text-primary-accent underline underline-offset-2"
        >
          uyumluluk aracıyla
        </Link>{" "}
        kontrol edin.
      </p>
      <div className="mt-8">
        <CategoryListing categorySlug={category.slug} />
      </div>
    </div>
  );
}
