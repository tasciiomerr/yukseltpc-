import type { Metadata } from "next";
import { Suspense } from "react";
import SistemimAraci from "@/components/SistemimAraci";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sistemim — Yükseltme Önerisi Al | YükseltPC",
  description:
    "Mevcut bilgisayarınızın parçalarını seçin, hangi bileşeni önce yükseltmeniz gerektiğini gerekçesiyle birlikte öğrenin.",
  alternates: { canonical: absoluteUrl("/sistemim") },
};

export default function SistemimPage() {
  return (
    <Suspense fallback={null}>
      <SistemimAraci />
    </Suspense>
  );
}
