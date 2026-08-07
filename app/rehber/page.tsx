import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Rehberler | YükseltPC",
  description:
    "Bilgisayar bileşenleri, uyumluluk ve yükseltme kararları hakkında rehber yazıları.",
};

export default function RehberListPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumb items={[{ label: "Rehberler" }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Rehberler</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/rehber/${guide.slug}`}
            className="block rounded-lg border border-black/10 p-4 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
          >
            <h2 className="font-medium">{guide.title}</h2>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
