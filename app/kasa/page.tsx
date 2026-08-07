import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryListing from "@/components/CategoryListing";
import { getCategory } from "@/lib/categories";

const category = getCategory("kasa")!;

export const metadata: Metadata = {
  title: `${category.labelPlural} Modelleri ve Uyumluluk Rehberi | YükseltPC`,
  description: `${category.labelPlural} seçeneklerini karşılaştırın, uyumluluk bilgilerine ve fiyat aralıklarına göz atın.`,
};

export default function KasaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumb items={[{ label: category.labelPlural }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        {category.labelPlural}
      </h1>
      <div className="mt-8">
        <CategoryListing categorySlug={category.slug} />
      </div>
    </div>
  );
}
