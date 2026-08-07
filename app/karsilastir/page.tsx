import type { Metadata } from "next";
import { Suspense } from "react";
import Karsilastir from "@/components/Karsilastir";

export const metadata: Metadata = {
  title: "Ürün Karşılaştır | YükseltPC",
  description:
    "Aynı kategoriden iki bilgisayar bileşenini özellik özellik karşılaştırın.",
};

export default function KarsilastirPage() {
  return (
    <Suspense fallback={null}>
      <Karsilastir />
    </Suspense>
  );
}
