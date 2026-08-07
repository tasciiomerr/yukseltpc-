import {
  isCoolerCompatible,
  isCpuMotherboardCompatible,
  isGpuCaseCompatible,
  isRamMotherboardCompatible,
} from "./compatibility";
import { cases, coolers, cpus, gpus, motherboards, psus, rams } from "./data";
import type { Case, Cooler, Cpu, Gpu, Motherboard, Psu, Ram } from "./types";

export type AnyProduct = Cpu | Motherboard | Ram | Gpu | Psu | Case | Cooler;

export type CategorySlug =
  | "islemci"
  | "anakart"
  | "ram"
  | "ekran-karti"
  | "guc-kaynagi"
  | "kasa"
  | "sogutucu";

export interface SpecField {
  label: string;
  value: (item: AnyProduct) => string;
}

export interface CategoryFilter {
  label: string;
  value: (item: AnyProduct) => string;
}

export interface RelatedGroup {
  categorySlug: CategorySlug;
  title: string;
  items: AnyProduct[];
}

export interface CategoryConfig {
  slug: CategorySlug;
  label: string;
  labelPlural: string;
  items: AnyProduct[];
  specFields: SpecField[];
  filter: CategoryFilter | null;
  /** Returns lists of products from other categories that are compatible with the given item. */
  getRelated: (item: AnyProduct) => RelatedGroup[];
}

export const categories: CategoryConfig[] = [
  {
    slug: "islemci",
    label: "İşlemci",
    labelPlural: "İşlemciler",
    items: cpus,
    specFields: [
      { label: "Marka", value: (i) => (i as Cpu).brand },
      { label: "Soket", value: (i) => (i as Cpu).socket },
      {
        label: "Çekirdek / İş Parçacığı",
        value: (i) => `${(i as Cpu).cores} / ${(i as Cpu).threads}`,
      },
      { label: "TDP", value: (i) => `${(i as Cpu).tdp}W` },
      {
        label: "Entegre Grafik",
        value: (i) => ((i as Cpu).hasIntegratedGraphics ? "Var" : "Yok"),
      },
      { label: "Nesil", value: (i) => (i as Cpu).generation },
    ],
    filter: { label: "Marka", value: (i) => (i as Cpu).brand },
    getRelated: (item) => {
      const cpu = item as Cpu;
      return [
        {
          categorySlug: "anakart",
          title: "Uyumlu Anakartlar",
          items: motherboards.filter((mb) =>
            isCpuMotherboardCompatible(cpu, mb),
          ),
        },
        {
          categorySlug: "sogutucu",
          title: "Uyumlu Soğutucular",
          items: coolers.filter((cooler) => isCoolerCompatible(cooler, cpu)),
        },
      ];
    },
  },
  {
    slug: "anakart",
    label: "Anakart",
    labelPlural: "Anakartlar",
    items: motherboards,
    specFields: [
      { label: "Marka", value: (i) => (i as Motherboard).brand },
      { label: "Soket", value: (i) => (i as Motherboard).socket },
      { label: "Yonga Seti", value: (i) => (i as Motherboard).chipset },
      { label: "RAM Tipi", value: (i) => (i as Motherboard).ramType },
      {
        label: "RAM Slot Sayısı",
        value: (i) => `${(i as Motherboard).ramSlots}`,
      },
      { label: "Form Faktör", value: (i) => (i as Motherboard).formFactor },
      { label: "PCIe Versiyonu", value: (i) => (i as Motherboard).pcieVersion },
    ],
    filter: { label: "Marka", value: (i) => (i as Motherboard).brand },
    getRelated: (item) => {
      const motherboard = item as Motherboard;
      return [
        {
          categorySlug: "islemci",
          title: "Uyumlu İşlemciler",
          items: cpus.filter((cpu) =>
            isCpuMotherboardCompatible(cpu, motherboard),
          ),
        },
        {
          categorySlug: "ram",
          title: "Uyumlu RAM'ler",
          items: rams.filter((ram) =>
            isRamMotherboardCompatible(ram, motherboard),
          ),
        },
      ];
    },
  },
  {
    slug: "ram",
    label: "RAM",
    labelPlural: "RAM",
    items: rams,
    specFields: [
      { label: "Tip", value: (i) => (i as Ram).type },
      { label: "Hız", value: (i) => `${(i as Ram).speed} MHz` },
      { label: "Kapasite", value: (i) => `${(i as Ram).capacity} GB` },
      { label: "Modül Sayısı", value: (i) => `${(i as Ram).moduleCount}` },
    ],
    filter: { label: "Tip", value: (i) => (i as Ram).type },
    getRelated: (item) => {
      const ram = item as Ram;
      return [
        {
          categorySlug: "anakart",
          title: "Uyumlu Anakartlar",
          items: motherboards.filter((mb) =>
            isRamMotherboardCompatible(ram, mb),
          ),
        },
      ];
    },
  },
  {
    slug: "ekran-karti",
    label: "Ekran Kartı",
    labelPlural: "Ekran Kartları",
    items: gpus,
    specFields: [
      { label: "Marka", value: (i) => (i as Gpu).brand },
      { label: "Uzunluk", value: (i) => `${(i as Gpu).lengthMm} mm` },
      {
        label: "Güç Bağlantısı",
        value: (i) => (i as Gpu).powerConnectorRequired,
      },
      {
        label: "Önerilen PSU Gücü",
        value: (i) => `${(i as Gpu).recommendedPsuWatt}W`,
      },
      { label: "VRAM", value: (i) => `${(i as Gpu).vram} GB` },
      { label: "TDP", value: (i) => `${(i as Gpu).tdp}W` },
    ],
    filter: { label: "Marka", value: (i) => (i as Gpu).brand },
    getRelated: (item) => {
      const gpu = item as Gpu;
      return [
        {
          categorySlug: "kasa",
          title: "Uyumlu Kasalar",
          items: cases.filter((pcCase) => isGpuCaseCompatible(gpu, pcCase)),
        },
      ];
    },
  },
  {
    slug: "guc-kaynagi",
    label: "Güç Kaynağı",
    labelPlural: "Güç Kaynakları",
    items: psus,
    specFields: [
      { label: "Watt", value: (i) => `${(i as Psu).wattage}W` },
      { label: "Sertifika", value: (i) => (i as Psu).certification },
      {
        label: "Modüler",
        value: (i) => ((i as Psu).isModular ? "Evet" : "Hayır"),
      },
    ],
    filter: { label: "Sertifika", value: (i) => (i as Psu).certification },
    getRelated: () => [],
  },
  {
    slug: "kasa",
    label: "Kasa",
    labelPlural: "Kasalar",
    items: cases,
    specFields: [
      {
        label: "Desteklenen Form Faktörler",
        value: (i) => (i as Case).supportedFormFactors.join(", "),
      },
      {
        label: "Maks. GPU Uzunluğu",
        value: (i) => `${(i as Case).maxGpuLengthMm} mm`,
      },
      {
        label: "Maks. Soğutucu Yüksekliği",
        value: (i) => `${(i as Case).maxCoolerHeightMm} mm`,
      },
    ],
    filter: null,
    getRelated: (item) => {
      const pcCase = item as Case;
      return [
        {
          categorySlug: "ekran-karti",
          title: "Sığan Ekran Kartları",
          items: gpus.filter((gpu) => isGpuCaseCompatible(gpu, pcCase)),
        },
      ];
    },
  },
  {
    slug: "sogutucu",
    label: "Soğutucu",
    labelPlural: "Soğutucular",
    items: coolers,
    specFields: [
      {
        label: "Tip",
        value: (i) => ((i as Cooler).type === "air" ? "Hava" : "Sıvı"),
      },
      {
        label: "Uyumlu Soketler",
        value: (i) => (i as Cooler).compatibleSockets.join(", "),
      },
      { label: "Yükseklik", value: (i) => `${(i as Cooler).heightMm} mm` },
    ],
    filter: {
      label: "Tip",
      value: (i) => ((i as Cooler).type === "air" ? "Hava" : "Sıvı"),
    },
    getRelated: (item) => {
      const cooler = item as Cooler;
      return [
        {
          categorySlug: "islemci",
          title: "Uyumlu İşlemciler",
          items: cpus.filter((cpu) => isCoolerCompatible(cooler, cpu)),
        },
      ];
    },
  },
];

export function getCategory(slug: string): CategoryConfig | undefined {
  return categories.find((c) => c.slug === slug);
}

export function findProductBySlug(
  categorySlug: string,
  productSlug: string,
): AnyProduct | undefined {
  const category = getCategory(categorySlug);
  return category?.items.find((item) => item.slug === productSlug);
}
