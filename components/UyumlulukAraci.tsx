"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  calculateRequiredPsuWatt,
  isCoolerCompatible,
  isCpuMotherboardCompatible,
  isGpuCaseCompatible,
  isPsuSufficient,
  isRamMotherboardCompatible,
} from "@/lib/compatibility";
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
import ComponentSelect from "./ComponentSelect";
import ResultCard, { type ResultStatus } from "./ResultCard";

const QUERY_KEYS = {
  cpu: "cpu",
  motherboard: "mb",
  ram: "ram",
  gpu: "gpu",
  psu: "psu",
  pcCase: "case",
  cooler: "cooler",
} as const;

export default function UyumlulukAraci() {
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

  const cpuMotherboardResult = useMemo(() => {
    if (!cpu || !motherboard) {
      return {
        status: "pending" as ResultStatus,
        message: "Karşılaştırmak için bir işlemci ve anakart seçin.",
      };
    }
    const compatible = isCpuMotherboardCompatible(cpu, motherboard);
    return {
      status: (compatible ? "compatible" : "incompatible") as ResultStatus,
      message: compatible
        ? `${cpu.name}, ${motherboard.name} ile aynı sokete (${cpu.socket}) sahip.`
        : `${cpu.name} (${cpu.socket}) ile ${motherboard.name} (${motherboard.socket}) soketleri uyuşmuyor.`,
    };
  }, [cpu, motherboard]);

  const ramMotherboardResult = useMemo(() => {
    if (!ram || !motherboard) {
      return {
        status: "pending" as ResultStatus,
        message: "Karşılaştırmak için bir RAM ve anakart seçin.",
      };
    }
    const compatible = isRamMotherboardCompatible(ram, motherboard);
    return {
      status: (compatible ? "compatible" : "incompatible") as ResultStatus,
      message: compatible
        ? `${ram.name}, anakartın desteklediği ${motherboard.ramType} tipiyle uyumlu.`
        : `${ram.name} (${ram.type}) anakartın desteklediği ${motherboard.ramType} tipiyle uyumsuz.`,
    };
  }, [ram, motherboard]);

  const gpuCaseResult = useMemo(() => {
    if (!gpu || !pcCase) {
      return {
        status: "pending" as ResultStatus,
        message: "Karşılaştırmak için bir ekran kartı ve kasa seçin.",
      };
    }
    const compatible = isGpuCaseCompatible(gpu, pcCase);
    return {
      status: (compatible ? "compatible" : "incompatible") as ResultStatus,
      message: compatible
        ? `${gpu.name} (${gpu.lengthMm}mm), ${pcCase.name} kasasına (maks. ${pcCase.maxGpuLengthMm}mm) sığıyor.`
        : `${gpu.name} (${gpu.lengthMm}mm), ${pcCase.name} kasasının maksimum ${pcCase.maxGpuLengthMm}mm sınırını aşıyor.`,
    };
  }, [gpu, pcCase]);

  const coolerCpuResult = useMemo(() => {
    if (!cooler || !cpu) {
      return {
        status: "pending" as ResultStatus,
        message: "Karşılaştırmak için bir soğutucu ve işlemci seçin.",
      };
    }
    const compatible = isCoolerCompatible(cooler, cpu);
    return {
      status: (compatible ? "compatible" : "incompatible") as ResultStatus,
      message: compatible
        ? `${cooler.name}, ${cpu.socket} soketini destekliyor.`
        : `${cooler.name}, ${cpu.socket} soketini desteklemiyor.`,
    };
  }, [cooler, cpu]);

  const psuResult = useMemo(() => {
    if (!cpu || !gpu) {
      return {
        status: "pending" as ResultStatus,
        message:
          "Gereken gücü hesaplamak için bir işlemci ve ekran kartı seçin.",
      };
    }
    const requiredWatt = calculateRequiredPsuWatt(cpu, gpu);
    if (!psu) {
      return {
        status: "pending" as ResultStatus,
        message: `Tahmini gereken güç: ${requiredWatt}W. Yeterliliği görmek için bir güç kaynağı seçin.`,
      };
    }
    const sufficient = isPsuSufficient(psu, requiredWatt);
    return {
      status: (sufficient ? "compatible" : "incompatible") as ResultStatus,
      message: sufficient
        ? `${psu.name} (${psu.wattage}W), tahmini ${requiredWatt}W ihtiyacı karşılıyor.`
        : `${psu.name} (${psu.wattage}W), tahmini ${requiredWatt}W ihtiyacı karşılamıyor.`,
    };
  }, [cpu, gpu, psu]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">Uyumluluk Aracı</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Bileşenlerinizi seçin, uyumluluk sonuçlarını anında görün. Sonuç linkini
        paylaşabilirsiniz.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResultCard
          title="İşlemci - Anakart"
          status={cpuMotherboardResult.status}
          message={cpuMotherboardResult.message}
        />
        <ResultCard
          title="RAM - Anakart"
          status={ramMotherboardResult.status}
          message={ramMotherboardResult.message}
        />
        <ResultCard
          title="Ekran Kartı - Kasa"
          status={gpuCaseResult.status}
          message={gpuCaseResult.message}
        />
        <ResultCard
          title="Soğutucu - İşlemci"
          status={coolerCpuResult.status}
          message={coolerCpuResult.message}
        />
        <ResultCard
          title="Güç Kaynağı Yeterliliği"
          status={psuResult.status}
          message={psuResult.message}
        />
      </section>
    </div>
  );
}
