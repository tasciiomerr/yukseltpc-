import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { ButtonLink } from "@/components/Button";
import JsonLd from "@/components/JsonLd";
import { categories } from "@/lib/categories";
import { getAllGuides } from "@/lib/guides";
import {
  absoluteUrl,
  buildFaqSchema,
  buildWebsiteSchema,
  type FaqItem,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "YükseltPC — Bilgisayarınızı Bilinçli Şekilde Yükseltin",
  description:
    "Hangi parça hangisiyle uyumlu, ne almalısınız? Uyumluluk aracı, rehberler ve güncel fiyat aralıklarıyla YükseltPC yanınızda.",
  alternates: { canonical: absoluteUrl("/") },
};

const faqItems: FaqItem[] = [
  {
    question: "YükseltPC kullanmak ücretsiz mi?",
    answer:
      "Evet. Uyumluluk aracı, karşılaştırma aracı ve tüm rehber içerikleri tamamen ücretsizdir, üyelik gerektirmez.",
  },
  {
    question: "Uyumluluk aracı nasıl çalışır?",
    answer:
      "İşlemci, anakart, RAM, ekran kartı, güç kaynağı, kasa ve soğutucunuzu seçtiğinizde; soket, RAM tipi, fiziksel ölçüler ve güç yeterliliği gibi kriterlere göre otomatik olarak uyumlu olup olmadıklarını gösterir.",
  },
  {
    question: "Fiyat bilgileri güncel mi?",
    answer:
      "Fiyatlar gerçek zamanlı değildir; periyodik olarak güncellenen makul bir aralık gösterir. Kesin ve güncel fiyat için ürün sayfasındaki satıcı linklerini kullanabilirsiniz.",
  },
  {
    question: "Sıfır mı yoksa 2. el mi almalıyım?",
    answer:
      "Bu, bütçenize ve risk toleransınıza bağlıdır. Genel karşılaştırma için 'Sıfır mı 2. El mi Almalı?' rehberimize göz atabilir, her ürün sayfasında her iki seçeneğin fiyat aralığını görebilirsiniz.",
  },
];

const steps = [
  {
    number: "1",
    title: "Bileşenlerini seç",
    description:
      "Elindeki veya almayı düşündüğün işlemci, anakart, RAM, ekran kartı gibi parçaları seç.",
  },
  {
    number: "2",
    title: "Uyumluluğu anında gör",
    description:
      "Soket, RAM tipi, kasa ölçüsü ve güç kaynağı yeterliliği otomatik kontrol edilir.",
  },
  {
    number: "3",
    title: "Sıfır veya 2.el satın al",
    description:
      "Fiyat aralığını gör, güvendiğin satıcıların arama sonuçlarına tek tıkla git.",
  },
];

export default function Home() {
  const featuredGuides = getAllGuides().slice(0, 3);

  return (
    <div>
      <JsonLd data={buildWebsiteSchema()} />
      <JsonLd data={buildFaqSchema(faqItems)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-primary-50 to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:py-28">
          <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-accent">
            Bilinçli yükseltme, tek yerde
          </span>
          <h1 className="mt-5 max-w-2xl font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Bilgisayarını Yükselt<span className="text-primary-accent">PC</span>{" "}
            ile Bilinçli Kararla Yükselt
          </h1>
          <p className="mt-5 max-w-xl text-lg text-foreground/60">
            Hangi parça hangisiyle uyumlu, ne almalısın? Uyumluluk aracı,
            rehberler ve güncel fiyat aralıklarıyla YükseltPC yanında.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/uyumluluk-araci" className="px-6 py-3 text-base">
              Uyumluluk Aracını Dene
            </ButtonLink>
            <ButtonLink
              href="/rehber"
              variant="secondary"
              className="px-6 py-3 text-base"
            >
              Rehberlere Göz At
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-heading text-2xl font-bold">Popüler Kategoriler</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-background p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-500/40 hover:shadow-md"
            >
              <span className="font-medium text-foreground group-hover:text-primary-accent">
                {category.labelPlural}
              </span>
              <span className="text-xs text-foreground/50">
                {category.items.length} ürün
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-heading text-2xl font-bold">Nasıl Çalışır?</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 font-heading text-sm font-bold text-white">
                  {step.number}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-foreground/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <AdSlot slotId="home-mid" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold">
            Öne Çıkan Rehberler
          </h2>
          <Link
            href="/rehber"
            className="text-sm font-medium text-primary-accent hover:underline"
          >
            Tümünü gör →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featuredGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/rehber/${guide.slug}`}
              className="block rounded-xl border border-border-subtle bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-500/40 hover:shadow-md"
            >
              <h3 className="font-medium text-foreground">{guide.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="font-heading text-2xl font-bold">
            Sık Sorulan Sorular
          </h2>
          <div className="mt-6 flex flex-col gap-6">
            {faqItems.map((item) => (
              <div key={item.question}>
                <h3 className="font-semibold text-foreground">
                  {item.question}
                </h3>
                <p className="mt-1.5 text-sm text-foreground/70">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
