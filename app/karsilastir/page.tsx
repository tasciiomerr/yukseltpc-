import type { Metadata } from "next";
import { Suspense } from "react";
import Karsilastir from "@/components/Karsilastir";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ürün Karşılaştır | YükseltPC",
  description:
    "Aynı kategoriden iki bilgisayar bileşenini özellik özellik karşılaştırın.",
  alternates: { canonical: absoluteUrl("/karsilastir") },
};

export default function KarsilastirPage() {
  return (
    <Suspense fallback={null}>
      <Karsilastir />
    </Suspense>
  );
}
