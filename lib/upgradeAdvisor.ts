import { calculateRequiredPsuWatt, isPsuSufficient } from "./compatibility";
import type { CategorySlug } from "./categories";
import type { Case, Cooler, Cpu, Gpu, Motherboard, Psu, Ram } from "./types";

export interface UserSystem {
  cpu?: Cpu;
  motherboard?: Motherboard;
  ram?: Ram;
  gpu?: Gpu;
  psu?: Psu;
  pcCase?: Case;
  cooler?: Cooler;
}

export type RecommendationSeverity = "critical" | "recommended" | "info";

export interface UpgradeRecommendation {
  categorySlug: CategorySlug;
  title: string;
  reason: string;
  severity: RecommendationSeverity;
}

const LOW_RAM_CAPACITY_GB = 8;

/**
 * Fiyat aralığı ortalaması, iki bileşenin göreli performans segmentini
 * karşılaştırmak için kullanılan basit bir vekil (proxy) değerdir —
 * gerçek bir benchmark puanı değil. Kataloğumuzda fiyat, segment
 * (bütçe/orta/üst) ile güçlü şekilde ilişkili olduğu için makul bir
 * kural-tabanlı yaklaşım sağlıyor.
 */
function componentTier(range: { min: number; max: number }): number {
  return (range.min + range.max) / 2;
}

// Zayıf bileşenin segmenti, güçlü bileşenin segmentinin bu oranının
// altındaysa "darboğaz" olarak işaretlenir.
const IMBALANCE_RATIO_THRESHOLD = 0.45;

const SEVERITY_WEIGHT: Record<RecommendationSeverity, number> = {
  critical: 0,
  recommended: 1,
  info: 2,
};

/**
 * Kullanıcının mevcut sistemini basit kural-tabanlı mantıkla analiz edip
 * öncelik sıralı yükseltme önerileri döndürür. Hiçbir kural tetiklenmezse
 * boş dizi döner (sistem dengeli demektir).
 */
export function getUpgradeRecommendations(
  system: UserSystem,
): UpgradeRecommendation[] {
  const { cpu, motherboard, ram, gpu, psu } = system;
  const recommendations: UpgradeRecommendation[] = [];

  // Kural 1 (critical): Güç kaynağı mevcut CPU + GPU kombinasyonu için yetersiz.
  if (cpu && gpu && psu) {
    const requiredWatt = calculateRequiredPsuWatt(cpu, gpu);
    if (!isPsuSufficient(psu, requiredWatt)) {
      recommendations.push({
        categorySlug: "guc-kaynagi",
        title: "Güç kaynağınızı yükseltin",
        reason: `${psu.name} (${psu.wattage}W), ${cpu.name} + ${gpu.name} kombinasyonunun ihtiyaç duyduğu yaklaşık ${requiredWatt}W'ı karşılamıyor. Bu, sistem kararsızlığına veya ani kapanmalara yol açabileceğinden öncelikli olarak ele alınmalı.`,
        severity: "critical",
      });
    }
  }

  // Kural 2 (recommended): RAM 8GB veya altı — modern kullanımda darboğaz.
  if (ram && ram.capacity <= LOW_RAM_CAPACITY_GB) {
    recommendations.push({
      categorySlug: "ram",
      title: "RAM'inizi yükseltin",
      reason: `${ram.capacity}GB RAM, günümüz işletim sistemi ve uygulamaları için düşük kalıyor. Çoklu sekme, arka plan uygulamaları ve oyun gibi günlük kullanımlarda ${LOW_RAM_CAPACITY_GB}GB ve altı bellek darboğaza yol açar — genellikle en ucuz ve en yüksek fark yaratan yükseltmelerden biridir.`,
      severity: "recommended",
    });
  }

  // Kural 3 (recommended): CPU/GPU dengesizliği (darboğaz).
  if (cpu && gpu) {
    const cpuTier = componentTier(cpu.priceRangeNew);
    const gpuTier = componentTier(gpu.priceRangeNew);

    if (gpuTier < cpuTier * IMBALANCE_RATIO_THRESHOLD) {
      let reason = `${cpu.name}, ${gpu.name}'a göre belirgin şekilde daha üst bir segmentte — bu dengesizlik ekran kartınızın işlemcinizin potansiyelini tam kullanmanızı engelleyen bir darboğaza işaret edebilir.`;
      if (psu) {
        const upgradedGpuEstimateWatt = cpu.tdp + gpu.tdp * 1.8 + 150;
        if (!isPsuSufficient(psu, upgradedGpuEstimateWatt)) {
          reason += ` Daha güçlü bir ekran kartına geçerken güç kaynağınızın (${psu.wattage}W) da yetersiz kalabileceğini unutmayın.`;
        }
      }
      recommendations.push({
        categorySlug: "ekran-karti",
        title: "Ekran kartınızı yükseltin",
        reason,
        severity: "recommended",
      });
    } else if (cpuTier < gpuTier * IMBALANCE_RATIO_THRESHOLD) {
      recommendations.push({
        categorySlug: "islemci",
        title: "İşlemcinizi yükseltin",
        reason: `${gpu.name}, ${cpu.name}'a göre belirgin şekilde daha üst bir segmentte — işlemciniz ekran kartınızı yeterince "besleyemiyor" olabilir. Bu darboğaz özellikle düşük çözünürlüklerde daha belirgin hissedilir.`,
        severity: "recommended",
      });
    }
  }

  // Kural 4 (info): Anakart DDR4 — DDR5'e veya yeni nesil CPU'ya geçiş için
  // önce anakart değişimi gerekir.
  if (motherboard && motherboard.ramType === "DDR4") {
    recommendations.push({
      categorySlug: "anakart",
      title: "Anakartınız yükseltme alanınızı sınırlıyor",
      reason: `${motherboard.name} yalnızca DDR4 bellek destekliyor. DDR5'in hız avantajından faydalanmak veya en yeni nesil işlemcilere geçmek isterseniz, önce anakart (ve muhtemelen CPU + RAM) değişimi gerekecek.`,
      severity: "info",
    });
  }

  return recommendations.sort(
    (a, b) => SEVERITY_WEIGHT[a.severity] - SEVERITY_WEIGHT[b.severity],
  );
}
