import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryListing from "@/components/CategoryListing";
import JsonLd from "@/components/JsonLd";
import { getCategory } from "@/lib/categories";
import { absoluteUrl, buildItemListSchema } from "@/lib/seo";

const category = getCategory("kasa")!;

export const metadata: Metadata = {
  title: `${category.label} Modelleri ve Uyumluluk Rehberi | YükseltPC`,
  description: `${category.labelPlural} seçeneklerini karşılaştırın, uyumluluk bilgilerine ve fiyat aralıklarına göz atın.`,
  alternates: { canonical: absoluteUrl(`/${category.slug}`) },
};

export default function KasaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={buildItemListSchema(category, category.items)} />
      <Breadcrumb items={[{ label: category.labelPlural }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        {category.labelPlural}
      </h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Kasa seçerken üç ölçüyü kontrol edin: desteklediği{" "}
        <strong>anakart form faktörü</strong> (ATX/mATX/ITX), maksimum{" "}
        <strong>ekran kartı uzunluğu</strong> ve maksimum{" "}
        <strong>soğutucu yüksekliği</strong>. Özellikle uzun ekran kartları ve
        yüksek hava soğutuculu sistemlerde bu sınırları aşmamaya dikkat edin —
        her ürün sayfasında hangi ekran kartlarının sığdığını görebilirsiniz.
      </p>
      <div className="mt-8">
        <CategoryListing categorySlug={category.slug} />
      </div>
    </div>
  );
}
