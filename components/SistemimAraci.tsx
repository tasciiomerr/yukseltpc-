"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ComponentSelect from "./ComponentSelect";
import UpgradeCard from "./UpgradeCard";
import {
  cases,
  coolers,
  cpus,
  findCaseBySlug,
  findCoolerBySlug,
  findCpuBySlug,
  findGpuBySlug,
  findMotherboardBySlug,
  findPsuBySlug,
  findRamBySlug,
  gpus,
  motherboards,
  psus,
  rams,
} from "@/lib/data";
import { getUpgradeRecommendations } from "@/lib/upgradeAdvisor";

const QUERY_KEYS = {
  cpu: "cpu",
  motherboard: "mb",
  ram: "ram",
  gpu: "gpu",
  psu: "psu",
  pcCase: "case",
  cooler: "cooler",
} as const;

export default function SistemimAraci() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCpuSlug = searchParams.get(QUERY_KEYS.cpu) ?? "";
  const selectedMotherboardSlug =
    searchParams.get(QUERY_KEYS.motherboard) ?? "";
  const selectedRamSlug = searchParams.get(QUERY_KEYS.ram) ?? "";
  const selectedGpuSlug = searchParams.get(QUERY_KEYS.gpu) ?? "";
  const selectedPsuSlug = searchParams.get(QUERY_KEYS.psu) ?? "";
  const selectedCaseSlug = searchParams.get(QUERY_KEYS.pcCase) ?? "";
  const selectedCoolerSlug = searchParams.get(QUERY_KEYS.cooler) ?? "";

  const cpu = findCpuBySlug(selectedCpuSlug);
  const motherboard = findMotherboardBySlug(selectedMotherboardSlug);
  const ram = findRamBySlug(selectedRamSlug);
  const gpu = findGpuBySlug(selectedGpuSlug);
  const psu = findPsuBySlug(selectedPsuSlug);
  const pcCase = findCaseBySlug(selectedCaseSlug);
  const cooler = findCoolerBySlug(selectedCoolerSlug);

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  const hasAnySelection = Boolean(
    cpu || motherboard || ram || gpu || psu || pcCase || cooler,
  );

  const recommendations = useMemo(
    () =>
      getUpgradeRecommendations({ cpu, motherboard, ram, gpu, psu, pcCase, cooler }),
    [cpu, motherboard, ram, gpu, psu, pcCase, cooler],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold sm:text-3xl">
        Sistemim
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Mevcut bilgisayarınızın parçalarını seçin, hangi bileşeni önce
        yükseltmeniz gerektiğini öncelik sırasıyla görün. Tarayıcı güvenlik
        kısıtları nedeniyle donanımınızı otomatik algılayamıyoruz — sadece
        seçim yapmanız yeterli.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-border-subtle bg-surface p-5 sm:grid-cols-2 lg:grid-cols-3">
        <ComponentSelect
          label="İşlemci (CPU)"
          value={selectedCpuSlug}
          onChange={(slug) => updateQuery(QUERY_KEYS.cpu, slug)}
          options={cpus}
        />
        <ComponentSelect
          label="Anakart"
          value={selectedMotherboardSlug}
          onChange={(slug) => updateQuery(QUERY_KEYS.motherboard, slug)}
          options={motherboards}
        />
        <ComponentSelect
          label="RAM"
          value={selectedRamSlug}
          onChange={(slug) => updateQuery(QUERY_KEYS.ram, slug)}
          options={rams}
        />
        <ComponentSelect
          label="Ekran Kartı (GPU)"
          value={selectedGpuSlug}
          onChange={(slug) => updateQuery(QUERY_KEYS.gpu, slug)}
          options={gpus}
        />
        <ComponentSelect
          label="Güç Kaynağı (PSU)"
          value={selectedPsuSlug}
          onChange={(slug) => updateQuery(QUERY_KEYS.psu, slug)}
          options={psus}
        />
        <ComponentSelect
          label="Kasa"
          value={selectedCaseSlug}
          onChange={(slug) => updateQuery(QUERY_KEYS.pcCase, slug)}
          options={cases}
        />
        <ComponentSelect
          label="Soğutucu"
          value={selectedCoolerSlug}
          onChange={(slug) => updateQuery(QUERY_KEYS.cooler, slug)}
          options={coolers}
        />
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">
          Yükseltme Önerisi
        </h2>

        {!hasAnySelection ? (
          <p className="mt-3 text-sm text-foreground/60">
            Öneri alabilmek için yukarıdan en az birkaç bileşen seçin — ne
            kadar çok bileşen seçerseniz öneri o kadar isabetli olur.
          </p>
        ) : recommendations.length === 0 ? (
          <div className="mt-4 rounded-xl border border-success-500/30 bg-success-50 p-5 text-success-700 shadow-sm">
            <p className="font-semibold">Sisteminiz dengeli görünüyor 🎉</p>
            <p className="mt-1 text-sm opacity-90">
              Seçtiğiniz bileşenler arasında belirgin bir darboğaz veya
              yetersizlik tespit edemedik. Acil bir yükseltmeye ihtiyacınız
              yok gibi görünüyor.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {recommendations.map((recommendation, index) => (
              <UpgradeCard
                key={`${recommendation.categorySlug}-${recommendation.title}`}
                recommendation={recommendation}
                priority={index + 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
