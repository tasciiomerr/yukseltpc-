import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import RetailerLinks from "@/components/RetailerLinks";
import SpecTable from "@/components/SpecTable";
import type { AnyProduct, CategoryConfig } from "@/lib/categories";
import { categories, findProductBySlug, getCategory } from "@/lib/categories";
import { absoluteUrl, buildProductSchema } from "@/lib/seo";
import type {
  Case,
  Cooler,
  Cpu,
  Gpu,
  Motherboard,
  Psu,
  Ram,
} from "@/lib/types";

interface PageParams {
  kategori: string;
  slug: string;
}

function buildProductIntro(
  category: CategoryConfig,
  product: AnyProduct,
): string {
  switch (category.slug) {
    case "islemci": {
      const cpu = product as Cpu;
      return `${cpu.name}, ${cpu.socket} soketini kullanan ${cpu.cores} çekirdek / ${cpu.threads} iş parçacıklı bir ${cpu.brand} işlemcidir. Bu işlemciyi alacaksanız anakartınızın da ${cpu.socket} soketine sahip olması gerekir — aşağıdaki uyumlu anakart listesine veya sağdaki uyumluluk aracına bakarak kontrol edebilirsiniz.`;
    }
    case "anakart": {
      const mb = product as Motherboard;
      return `${mb.name}, ${mb.socket} soketli işlemcileri ve ${mb.ramType} bellek modüllerini destekleyen bir ${mb.formFactor} anakarttır. ${mb.chipset} yonga setine sahiptir ve ${mb.ramSlots} RAM slotu bulunur. Bu anakartla hangi işlemci ve RAM'lerin uyumlu olduğunu aşağıda görebilirsiniz.`;
    }
    case "ram": {
      const ram = product as Ram;
      return `${ram.name}, ${ram.speed} MHz hızında çalışan ${ram.capacity} GB kapasiteli bir ${ram.type} bellek kitidir (${ram.moduleCount} modül). Anakartınızın ${ram.type} desteklediğinden emin olmadan bu RAM'i satın almayın — uyumluluk aracıyla saniyeler içinde kontrol edebilirsiniz.`;
    }
    case "ekran-karti": {
      const gpu = product as Gpu;
      return `${gpu.name}, ${gpu.vram} GB VRAM'e ve ${gpu.lengthMm} mm uzunluğa sahip bir ${gpu.brand} ekran kartıdır. ${gpu.tdp}W güç tüketimiyle önerilen sistem gücü ${gpu.recommendedPsuWatt}W civarındadır. Kasanıza fiziksel olarak sığıp sığmadığını aşağıdaki uyumlu kasa listesinden kontrol edebilirsiniz.`;
    }
    case "guc-kaynagi": {
      const psu = product as Psu;
      return `${psu.name}, ${psu.wattage}W gücünde ${psu.certification} sertifikalı${psu.isModular ? " modüler" : ""} bir güç kaynağıdır. Sisteminiz için gereken minimum gücü işlemci ve ekran kartınızı seçerek uyumluluk aracındaki PSU hesaplayıcıyla öğrenebilirsiniz.`;
    }
    case "kasa": {
      const pcCase = product as Case;
      return `${pcCase.name}, ${pcCase.supportedFormFactors.join("/")} anakart form faktörlerini destekleyen, en fazla ${pcCase.maxGpuLengthMm} mm uzunluğunda ekran kartı ve ${pcCase.maxCoolerHeightMm} mm yüksekliğinde soğutucu kabul eden bir kasadır. Ekran kartınızın sığıp sığmayacağını aşağıda kontrol edebilirsiniz.`;
    }
    case "sogutucu": {
      const cooler = product as Cooler;
      return `${cooler.name}, ${cooler.type === "air" ? "hava soğutmalı" : "sıvı soğutmalı"} bir işlemci soğutucusudur ve ${cooler.compatibleSockets.join(", ")} soketlerini destekler. ${cooler.heightMm} mm yüksekliğiyle kasanızın soğutucu yükseklik sınırına da dikkat etmelisiniz.`;
    }
    default:
      return "";
  }
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
  const category = getCategory(kategori);
  const product = findProductBySlug(kategori, slug);
  if (!category || !product) {
    return { title: "Ürün Bulunamadı | YükseltPC" };
  }
  return {
    title: `${product.name} — Uyumluluk, Fiyat ve Özellikler | YükseltPC`,
    description: `${product.name} teknik özellikleri, hangi ${category.label.toLocaleLowerCase("tr-TR")} ile uyumlu olduğu ve güncel sıfır/2.el fiyat aralığı. Uyumluluk aracıyla kontrol edin.`,
    alternates: {
      canonical: absoluteUrl(`/${category.slug}/${product.slug}`),
    },
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
      <JsonLd data={buildProductSchema(product, category)} />
      <Breadcrumb
        items={[
          { label: category.labelPlural, href: `/${category.slug}` },
          { label: product.name },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{product.name}</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        {buildProductIntro(category, product)}
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Teknik Özellikler</h2>
        <div className="mt-3">
          <SpecTable item={product} fields={category.specFields} />
        </div>
      </section>

      <div className="mt-8">
        <AdSlot slotId={`product-${category.slug}-${product.slug}`} />
      </div>

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
