import { describe, expect, it } from "vitest";
import {
  calculateRequiredPsuWatt,
  isCoolerCompatible,
  isCpuMotherboardCompatible,
  isGpuCaseCompatible,
  isPsuSufficient,
  isRamMotherboardCompatible,
} from "./compatibility";
import type { Case, Cooler, Cpu, Gpu, Motherboard, Psu, Ram } from "./types";

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
