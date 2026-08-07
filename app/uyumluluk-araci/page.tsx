import type { Metadata } from "next";
import { Suspense } from "react";
import UyumlulukAraci from "@/components/UyumlulukAraci";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Bilgisayar Parça Uyumluluk Kontrolü | YükseltPC",
  description:
    "İşlemci, anakart, RAM, ekran kartı ve güç kaynağınızın uyumlu olup olmadığını saniyeler içinde ücretsiz kontrol edin.",
  alternates: { canonical: absoluteUrl("/uyumluluk-araci") },
};

export default function UyumlulukAraciPage() {
  return (
    <Suspense fallback={null}>
      <UyumlulukAraci />
    </Suspense>
  );
}
