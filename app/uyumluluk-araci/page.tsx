import type { Metadata } from "next";
import { Suspense } from "react";
import UyumlulukAraci from "@/components/UyumlulukAraci";

export const metadata: Metadata = {
  title: "Bilgisayar Parça Uyumluluk Kontrolü | YükseltPC",
  description:
    "İşlemci, anakart, RAM, ekran kartı ve güç kaynağınızın uyumlu olup olmadığını saniyeler içinde ücretsiz kontrol edin.",
};

export default function UyumlulukAraciPage() {
  return (
    <Suspense fallback={null}>
      <UyumlulukAraci />
    </Suspense>
  );
}
