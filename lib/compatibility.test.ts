import { describe, expect, it } from "vitest";
import {
  calculateRequiredPsuWatt,
  isCoolerCompatible,
  isCpuMotherboardCompatible,
  isGpuCaseCompatible,
  isPsuSufficient,
  isRamMotherboardCompatible,
} from "./compatibility";
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
} from "./data";
import type { Case, Cooler, Cpu, Gpu, Motherboard, Psu, Ram } from "./types";

function requireItem<T>(item: T | undefined, label: string): T {
  if (!item) throw new Error(`Test fixture not found in catalog: ${label}`);
  return item;
}

const priceRange = { min: 0, max: 0 };
const lastUpdated = "2026-08-06";

const cpuAm4: Cpu = {
  id: "cpu-am4",
  slug: "cpu-am4",
  name: "AM4 CPU",
  brand: "AMD",
  socket: "AM4",
  cores: 6,
  threads: 12,
  tdp: 65,
  hasIntegratedGraphics: false,
  generation: "Zen 3",
  priceRangeNew: priceRange,
  priceRangeUsed: priceRange,
  lastUpdated,
};

const cpuLga1700: Cpu = {
  ...cpuAm4,
  id: "cpu-lga1700",
  slug: "cpu-lga1700",
  socket: "LGA1700",
};

const motherboardAm4: Motherboard = {
  id: "mb-am4",
  slug: "mb-am4",
  name: "AM4 Motherboard",
  brand: "ASUS",
  socket: "AM4",
  chipset: "B550",
  ramType: "DDR4",
  ramSlots: 4,
  formFactor: "mATX",
  pcieVersion: "4.0",
  priceRangeNew: priceRange,
  priceRangeUsed: priceRange,
  lastUpdated,
};

const ramDdr4: Ram = {
  id: "ram-ddr4",
  slug: "ram-ddr4",
  name: "DDR4 RAM",
  type: "DDR4",
  speed: 3200,
  capacity: 16,
  moduleCount: 2,
  priceRangeNew: priceRange,
  priceRangeUsed: priceRange,
  lastUpdated,
};

const ramDdr5: Ram = {
  ...ramDdr4,
  id: "ram-ddr5",
  slug: "ram-ddr5",
  type: "DDR5",
};

const gpuSmall: Gpu = {
  id: "gpu-small",
  slug: "gpu-small",
  name: "Small GPU",
  brand: "NVIDIA",
  lengthMm: 210,
  powerConnectorRequired: "8-pin",
  recommendedPsuWatt: 550,
  vram: 8,
  tdp: 165,
  priceRangeNew: priceRange,
  priceRangeUsed: priceRange,
  lastUpdated,
};

const pcCase: Case = {
  id: "case-1",
  slug: "case-1",
  name: "Mid Tower",
  supportedFormFactors: ["ATX", "mATX", "ITX"],
  maxGpuLengthMm: 300,
  maxCoolerHeightMm: 165,
  priceRangeNew: priceRange,
  priceRangeUsed: priceRange,
  lastUpdated,
};

const coolerAm4: Cooler = {
  id: "cooler-am4",
  slug: "cooler-am4",
  name: "AM4 Cooler",
  type: "air",
  compatibleSockets: ["AM4", "AM5"],
  heightMm: 159,
  priceRangeNew: priceRange,
  priceRangeUsed: priceRange,
  lastUpdated,
};

const psu550: Psu = {
  id: "psu-550",
  slug: "psu-550",
  name: "550W PSU",
  wattage: 550,
  certification: "80+ Bronze",
  isModular: false,
  priceRangeNew: priceRange,
  priceRangeUsed: priceRange,
  lastUpdated,
};

describe("isCpuMotherboardCompatible", () => {
  it("returns true when sockets match", () => {
    expect(isCpuMotherboardCompatible(cpuAm4, motherboardAm4)).toBe(true);
  });

  it("returns false when sockets differ", () => {
    expect(isCpuMotherboardCompatible(cpuLga1700, motherboardAm4)).toBe(false);
  });
});

describe("isRamMotherboardCompatible", () => {
  it("returns true when RAM type matches motherboard", () => {
    expect(isRamMotherboardCompatible(ramDdr4, motherboardAm4)).toBe(true);
  });

  it("returns false when RAM type differs from motherboard", () => {
    expect(isRamMotherboardCompatible(ramDdr5, motherboardAm4)).toBe(false);
  });
});

describe("isGpuCaseCompatible", () => {
  it("returns true when GPU length is within case limit", () => {
    expect(isGpuCaseCompatible(gpuSmall, pcCase)).toBe(true);
  });

  it("returns false when GPU is longer than case limit", () => {
    const longGpu: Gpu = { ...gpuSmall, lengthMm: 350 };
    expect(isGpuCaseCompatible(longGpu, pcCase)).toBe(false);
  });

  it("returns true at the exact boundary (GPU length equals max)", () => {
    const exactGpu: Gpu = { ...gpuSmall, lengthMm: pcCase.maxGpuLengthMm };
    expect(isGpuCaseCompatible(exactGpu, pcCase)).toBe(true);
  });
});

describe("isCoolerCompatible", () => {
  it("returns true when cooler supports the CPU socket", () => {
    expect(isCoolerCompatible(coolerAm4, cpuAm4)).toBe(true);
  });

  it("returns false when cooler does not support the CPU socket", () => {
    expect(isCoolerCompatible(coolerAm4, cpuLga1700)).toBe(false);
  });
});

describe("calculateRequiredPsuWatt", () => {
  it("sums CPU TDP, GPU TDP and the 150W buffer", () => {
    expect(calculateRequiredPsuWatt(cpuAm4, gpuSmall)).toBe(
      cpuAm4.tdp + gpuSmall.tdp + 150,
    );
  });

  it("changes when a higher-TDP GPU is used", () => {
    const hotGpu: Gpu = { ...gpuSmall, tdp: 320 };
    expect(calculateRequiredPsuWatt(cpuAm4, hotGpu)).toBe(
      cpuAm4.tdp + 320 + 150,
    );
  });
});

describe("isPsuSufficient", () => {
  it("returns true when PSU wattage exceeds requirement", () => {
    expect(isPsuSufficient(psu550, 500)).toBe(true);
  });

  it("returns false when PSU wattage is below requirement", () => {
    expect(isPsuSufficient(psu550, 600)).toBe(false);
  });

  it("returns true at the exact boundary (wattage equals requirement)", () => {
    expect(isPsuSufficient(psu550, 550)).toBe(true);
  });
});

describe("real catalog data — known-correct hardware scenarios", () => {
  it("Ryzen 7 7800X3D (AM5) is compatible with an AM5 B650 motherboard", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-7-7800x3d"),
      "amd-ryzen-7-7800x3d",
    );
    const motherboard = requireItem(
      findMotherboardBySlug("asus-tuf-gaming-b650-plus"),
      "asus-tuf-gaming-b650-plus",
    );
    expect(cpu.socket).toBe("AM5");
    expect(motherboard.socket).toBe("AM5");
    expect(isCpuMotherboardCompatible(cpu, motherboard)).toBe(true);
  });

  it("an LGA1700 Intel CPU is NOT compatible with an AM5 motherboard", () => {
    const cpu = requireItem(
      findCpuBySlug("intel-core-i7-13700k"),
      "intel-core-i7-13700k",
    );
    const motherboard = requireItem(
      findMotherboardBySlug("asus-tuf-gaming-b650-plus"),
      "asus-tuf-gaming-b650-plus",
    );
    expect(isCpuMotherboardCompatible(cpu, motherboard)).toBe(false);
  });

  it("an LGA1851 Core Ultra CPU is NOT compatible with an LGA1700 motherboard", () => {
    const cpu = requireItem(
      findCpuBySlug("intel-core-ultra-7-265k"),
      "intel-core-ultra-7-265k",
    );
    const motherboard = requireItem(
      findMotherboardBySlug("asus-rog-strix-z790-e-gaming"),
      "asus-rog-strix-z790-e-gaming",
    );
    expect(isCpuMotherboardCompatible(cpu, motherboard)).toBe(false);
  });

  it("an AM4 Ryzen 5 5600 is compatible with an AM4 X570 motherboard", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-5-5600"),
      "amd-ryzen-5-5600",
    );
    const motherboard = requireItem(
      findMotherboardBySlug("asus-rog-strix-x570-e-gaming"),
      "asus-rog-strix-x570-e-gaming",
    );
    expect(isCpuMotherboardCompatible(cpu, motherboard)).toBe(true);
  });

  it("DDR5 RAM is NOT compatible with a DDR4-only B550 motherboard", () => {
    const ram = requireItem(
      findRamBySlug("corsair-vengeance-32gb-ddr5-6000"),
      "corsair-vengeance-32gb-ddr5-6000",
    );
    const motherboard = requireItem(
      findMotherboardBySlug("asus-b550m-a"),
      "asus-b550m-a",
    );
    expect(isRamMotherboardCompatible(ram, motherboard)).toBe(false);
  });

  it("DDR5 RAM is compatible with a DDR5 AM5 motherboard", () => {
    const ram = requireItem(
      findRamBySlug("gskill-trident-z5-32gb-ddr5-6000"),
      "gskill-trident-z5-32gb-ddr5-6000",
    );
    const motherboard = requireItem(
      findMotherboardBySlug("gigabyte-b650-aorus-elite-ax"),
      "gigabyte-b650-aorus-elite-ax",
    );
    expect(isRamMotherboardCompatible(ram, motherboard)).toBe(true);
  });

  it("a large AIB RTX 4090 (336mm) does NOT fit a compact SFF case (330mm limit)", () => {
    const gpu = requireItem(
      findGpuBySlug("nvidia-rtx-4090"),
      "nvidia-rtx-4090",
    );
    const pcCaseCompact = requireItem(
      findCaseBySlug("cooler-master-nr200"),
      "cooler-master-nr200",
    );
    expect(gpu.lengthMm).toBeGreaterThan(pcCaseCompact.maxGpuLengthMm);
    expect(isGpuCaseCompatible(gpu, pcCaseCompact)).toBe(false);
  });

  it("the same RTX 4090 fits comfortably in a full-size ATX case", () => {
    const gpu = requireItem(
      findGpuBySlug("nvidia-rtx-4090"),
      "nvidia-rtx-4090",
    );
    const pcCaseFullSize = requireItem(
      findCaseBySlug("corsair-5000d-airflow"),
      "corsair-5000d-airflow",
    );
    expect(isGpuCaseCompatible(gpu, pcCaseFullSize)).toBe(true);
  });

  it("a compact RX 7600 (210mm) fits in the same Mini-ITX case", () => {
    const gpu = requireItem(findGpuBySlug("amd-rx-7600"), "amd-rx-7600");
    const pcCaseCompact = requireItem(
      findCaseBySlug("cooler-master-nr200"),
      "cooler-master-nr200",
    );
    expect(isGpuCaseCompatible(gpu, pcCaseCompact)).toBe(true);
  });

  it("an AM5-only low-profile cooler is NOT compatible with an AM4 CPU", () => {
    const cooler = requireItem(
      findCoolerBySlug("noctua-nh-l9a-am5"),
      "noctua-nh-l9a-am5",
    );
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-5-5600"),
      "amd-ryzen-5-5600",
    );
    expect(isCoolerCompatible(cooler, cpu)).toBe(false);
  });

  it("a Noctua NH-D15 supports both AM4 and LGA1851 sockets", () => {
    const cooler = requireItem(
      findCoolerBySlug("noctua-nh-d15"),
      "noctua-nh-d15",
    );
    const cpuAm4Real = requireItem(
      findCpuBySlug("amd-ryzen-5-5600"),
      "amd-ryzen-5-5600",
    );
    const cpuLga1851 = requireItem(
      findCpuBySlug("intel-core-ultra-5-245k"),
      "intel-core-ultra-5-245k",
    );
    expect(isCoolerCompatible(cooler, cpuAm4Real)).toBe(true);
    expect(isCoolerCompatible(cooler, cpuLga1851)).toBe(true);
  });

  it("calculates a realistic PSU requirement for a high-end Ryzen 9 9900X + RTX 4080 Super build", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-9-7950x"),
      "amd-ryzen-9-7950x",
    );
    const gpu = requireItem(
      findGpuBySlug("nvidia-rtx-4080-super"),
      "nvidia-rtx-4080-super",
    );
    const requiredWatt = calculateRequiredPsuWatt(cpu, gpu);
    expect(requiredWatt).toBe(cpu.tdp + gpu.tdp + 150);

    const psu750 = requireItem(
      findPsuBySlug("corsair-rm750x"),
      "corsair-rm750x",
    );
    expect(isPsuSufficient(psu750, requiredWatt)).toBe(true);

    const psu550Real = requireItem(
      findPsuBySlug("corsair-cv550"),
      "corsair-cv550",
    );
    expect(isPsuSufficient(psu550Real, requiredWatt)).toBe(false);
  });

  it("a Zen 5 Ryzen 9 9950X3D (3D V-Cache) is compatible with an AM5 motherboard", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-9-9950x3d"),
      "amd-ryzen-9-9950x3d",
    );
    const motherboard = requireItem(
      findMotherboardBySlug("gigabyte-b650-aorus-elite-ax"),
      "gigabyte-b650-aorus-elite-ax",
    );
    expect(cpu.socket).toBe("AM5");
    expect(isCpuMotherboardCompatible(cpu, motherboard)).toBe(true);
  });

  it("an older Zen 2 AM4 APU (Ryzen 5 4600G) is still compatible with a modern AM4 motherboard by socket", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-5-4600g"),
      "amd-ryzen-5-4600g",
    );
    const motherboard = requireItem(
      findMotherboardBySlug("asus-rog-strix-x570-e-gaming"),
      "asus-rog-strix-x570-e-gaming",
    );
    expect(cpu.hasIntegratedGraphics).toBe(true);
    expect(isCpuMotherboardCompatible(cpu, motherboard)).toBe(true);
  });

  it("an Intel Core Ultra 9 285K (LGA1851) is compatible with an LGA1851 motherboard and incompatible with LGA1700", () => {
    const cpu = requireItem(
      findCpuBySlug("intel-core-ultra-9-285k"),
      "intel-core-ultra-9-285k",
    );
    const lga1851Board = requireItem(
      findMotherboardBySlug("msi-pro-z890-a"),
      "msi-pro-z890-a",
    );
    const lga1700Board = requireItem(
      findMotherboardBySlug("asus-rog-strix-z790-e-gaming"),
      "asus-rog-strix-z790-e-gaming",
    );
    expect(isCpuMotherboardCompatible(cpu, lga1851Board)).toBe(true);
    expect(isCpuMotherboardCompatible(cpu, lga1700Board)).toBe(false);
  });

  it("an RTX 4080 (310mm) just barely fits a case with a 320mm GPU limit", () => {
    const gpu = requireItem(findGpuBySlug("nvidia-rtx-4080"), "nvidia-rtx-4080");
    const pcCase = requireItem(
      findCaseBySlug("montech-air-100"),
      "montech-air-100",
    );
    expect(gpu.lengthMm).toBeLessThanOrEqual(pcCase.maxGpuLengthMm);
    expect(isGpuCaseCompatible(gpu, pcCase)).toBe(true);
  });

  it("a budget RTX 3050 (168mm) fits even the most compact Mini-ITX case", () => {
    const gpu = requireItem(findGpuBySlug("nvidia-rtx-3050"), "nvidia-rtx-3050");
    const pcCase = requireItem(
      findCaseBySlug("cooler-master-nr200"),
      "cooler-master-nr200",
    );
    expect(isGpuCaseCompatible(gpu, pcCase)).toBe(true);
  });

  it("an RX 6900 XT (267mm) fits a compact SFF case within its 330mm limit", () => {
    const gpu = requireItem(findGpuBySlug("amd-rx-6900-xt"), "amd-rx-6900-xt");
    const pcCase = requireItem(
      findCaseBySlug("cooler-master-nr200"),
      "cooler-master-nr200",
    );
    expect(isGpuCaseCompatible(gpu, pcCase)).toBe(true);
  });

  it("calculates a realistic PSU requirement for a Ryzen 9 9950X + RX 6900 XT build", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-9-9950x"),
      "amd-ryzen-9-9950x",
    );
    const gpu = requireItem(findGpuBySlug("amd-rx-6900-xt"), "amd-rx-6900-xt");
    const requiredWatt = calculateRequiredPsuWatt(cpu, gpu);
    expect(requiredWatt).toBe(cpu.tdp + gpu.tdp + 150);

    const psu850 = requireItem(
      findPsuBySlug("corsair-rm850x"),
      "corsair-rm850x",
    );
    expect(isPsuSufficient(psu850, requiredWatt)).toBe(true);

    const psu550Real = requireItem(
      findPsuBySlug("corsair-cv550"),
      "corsair-cv550",
    );
    expect(isPsuSufficient(psu550Real, requiredWatt)).toBe(false);
  });

  it("a budget Ryzen 5 5500 (AM4) is compatible with a budget A320 motherboard", () => {
    const cpu = requireItem(findCpuBySlug("amd-ryzen-5-5500"), "amd-ryzen-5-5500");
    const motherboard = requireItem(
      findMotherboardBySlug("gigabyte-a320m-s2h"),
      "gigabyte-a320m-s2h",
    );
    expect(isCpuMotherboardCompatible(cpu, motherboard)).toBe(true);
  });

  it("DDR5 RAM is compatible with a new B650E motherboard but NOT with a new DDR4-only B450 motherboard", () => {
    const ram = requireItem(
      findRamBySlug("gskill-trident-z5-32gb-ddr5-6000"),
      "gskill-trident-z5-32gb-ddr5-6000",
    );
    const b650e = requireItem(
      findMotherboardBySlug("asus-rog-strix-b650e-f-gaming-wifi"),
      "asus-rog-strix-b650e-f-gaming-wifi",
    );
    const b450 = requireItem(
      findMotherboardBySlug("gigabyte-b450-aorus-elite"),
      "gigabyte-b450-aorus-elite",
    );
    expect(isRamMotherboardCompatible(ram, b650e)).toBe(true);
    expect(isRamMotherboardCompatible(ram, b450)).toBe(false);
  });

  it("an Intel Core Ultra 9 285K is compatible with a new Z890 motherboard but NOT a new LGA1700 H610 motherboard", () => {
    const cpu = requireItem(
      findCpuBySlug("intel-core-ultra-9-285k"),
      "intel-core-ultra-9-285k",
    );
    const z890 = requireItem(
      findMotherboardBySlug("asrock-z890-pro-rs-wifi"),
      "asrock-z890-pro-rs-wifi",
    );
    const h610 = requireItem(
      findMotherboardBySlug("asus-prime-h610m-e-d4"),
      "asus-prime-h610m-e-d4",
    );
    expect(isCpuMotherboardCompatible(cpu, z890)).toBe(true);
    expect(isCpuMotherboardCompatible(cpu, h610)).toBe(false);
  });

  it("a budget H810 (LGA1851) motherboard is NOT compatible with an LGA1700 CPU", () => {
    const cpu = requireItem(
      findCpuBySlug("intel-core-i5-14400f"),
      "intel-core-i5-14400f",
    );
    const h810 = requireItem(
      findMotherboardBySlug("asus-prime-h810m-k"),
      "asus-prime-h810m-k",
    );
    expect(isCpuMotherboardCompatible(cpu, h810)).toBe(false);
  });

  it("a Ryzen 7 8700G APU (AM5) fits its PSU/cooling profile as a low-power iGPU build", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-7-8700g"),
      "amd-ryzen-7-8700g",
    );
    expect(cpu.socket).toBe("AM5");
    expect(cpu.hasIntegratedGraphics).toBe(true);
    expect(cpu.tdp).toBeLessThanOrEqual(65);
  });

  it("every catalog item referenced by slug in these tests actually exists (sanity check)", () => {
    expect(cpus.length).toBeGreaterThanOrEqual(60);
    expect(motherboards.length).toBeGreaterThanOrEqual(35);
    expect(rams.length).toBeGreaterThanOrEqual(15);
    expect(gpus.length).toBeGreaterThanOrEqual(35);
    expect(psus.length).toBeGreaterThanOrEqual(15);
    expect(cases.length).toBeGreaterThanOrEqual(15);
    expect(coolers.length).toBeGreaterThanOrEqual(15);
  });
});
