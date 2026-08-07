import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryListing from "@/components/CategoryListing";
import JsonLd from "@/components/JsonLd";
import { getCategory } from "@/lib/categories";
import { absoluteUrl, buildItemListSchema } from "@/lib/seo";

const category = getCategory("islemci")!;

export const metadata: Metadata = {
  title: `${category.label} Modelleri ve Uyumluluk Rehberi | YükseltPC`,
  description: `${category.labelPlural} seçeneklerini karşılaştırın, uyumluluk bilgilerine ve fiyat aralıklarına göz atın.`,
  alternates: { canonical: absoluteUrl(`/${category.slug}`) },
};

export default function IslemciPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={buildItemListSchema(category, category.items)} />
      <Breadcrumb items={[{ label: category.labelPlural }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        {category.labelPlural}
      </h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        İşlemci, bilgisayarınızın hesaplama gücünü belirleyen ana bileşendir.
        Yeni bir işlemci alırken en önemli kriter{" "}
        <strong>soket uyumluluğu</strong> — işlemcinizin soketi (AM4, AM5,
        LGA1700 gibi) anakartınızınkiyle eşleşmelidir. Aşağıdaki modelleri
        inceleyin, seçtiğiniz işlemcinin hangi anakartlarla uyumlu olduğunu ürün
        sayfasında veya{" "}
        <Link
          href="/uyumluluk-araci"
          className="text-primary-accent hover:underline"
        >
          uyumluluk aracında
        </Link>{" "}
        kontrol edin.
      </p>
      <div className="mt-8">
        <CategoryListing categorySlug={category.slug} />
      </div>
    </div>
  );
}
