import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Rehberler | YükseltPC",
  description:
    "Bilgisayar bileşenleri, uyumluluk ve yükseltme kararları hakkında rehber yazıları.",
  alternates: { canonical: absoluteUrl("/rehber") },
};

export default function RehberListPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumb items={[{ label: "Rehberler" }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Rehberler</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Bilgisayar bileşenleri, uyumluluk kararları ve yükseltme stratejileri
        hakkında pratik, sade dilde yazılmış rehberler.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/rehber/${guide.slug}`}
            className="block rounded-xl border border-border-subtle bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-500/40 hover:shadow-md"
          >
            <h2 className="font-medium text-foreground">{guide.title}</h2>
            <p className="mt-2 text-sm text-foreground/60">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
