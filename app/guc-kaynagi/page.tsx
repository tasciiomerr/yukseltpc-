import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryListing from "@/components/CategoryListing";
import JsonLd from "@/components/JsonLd";
import { getCategory } from "@/lib/categories";
import { absoluteUrl, buildItemListSchema } from "@/lib/seo";

const category = getCategory("guc-kaynagi")!;

export const metadata: Metadata = {
  title: `${category.label} Modelleri ve Uyumluluk Rehberi | YükseltPC`,
  description: `${category.labelPlural} seçeneklerini karşılaştırın, uyumluluk bilgilerine ve fiyat aralıklarına göz atın.`,
  alternates: { canonical: absoluteUrl(`/${category.slug}`) },
};

export default function GucKaynagiPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={buildItemListSchema(category, category.items)} />
      <Breadcrumb items={[{ label: category.labelPlural }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        {category.labelPlural}
      </h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Güç kaynağı, sisteminizin en görmezden gelinen ama en kritik
        bileşenlerinden biridir. Yetersiz bir güç kaynağı ani kapanmalara veya
        kararsızlığa yol açabilir. Gereken minimum gücü işlemci ve ekran
        kartınızın TDP değerlerine göre{" "}
        <Link
          href="/uyumluluk-araci"
          className="text-primary-accent underline underline-offset-2"
        >
          uyumluluk aracındaki hesaplayıcıyla
        </Link>{" "}
        öğrenebilir, aşağıdaki modellerden watt ve sertifikasına göre
        seçebilirsiniz.
      </p>
      <div className="mt-8">
        <CategoryListing categorySlug={category.slug} />
      </div>
    </div>
  );
}
