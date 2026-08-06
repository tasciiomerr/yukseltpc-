export interface PriceRange {
  min: number;
  max: number;
}

interface BaseProduct {
  id: string;
  slug: string;
  name: string;
  priceRangeNew: PriceRange;
  priceRangeUsed: PriceRange;
  lastUpdated: string;
}

export interface Cpu extends BaseProduct {
  brand: string;
  socket: string;
  cores: number;
  threads: number;
  tdp: number;
  hasIntegratedGraphics: boolean;
  generation: string;
}

export interface Motherboard extends BaseProduct {
  brand: string;
  socket: string;
  chipset: string;
  ramType: "DDR4" | "DDR5";
  ramSlots: number;
  formFactor: "ATX" | "mATX" | "ITX";
  pcieVersion: string;
}

export interface Ram extends BaseProduct {
  type: "DDR4" | "DDR5";
  speed: number;
  capacity: number;
  moduleCount: number;
}

export interface Gpu extends BaseProduct {
  brand: string;
  lengthMm: number;
  powerConnectorRequired: string;
  recommendedPsuWatt: number;
  vram: number;
  tdp: number;
}

export interface Psu extends BaseProduct {
  wattage: number;
  certification: string;
  isModular: boolean;
}

export interface Case extends BaseProduct {
  supportedFormFactors: ("ATX" | "mATX" | "ITX")[];
  maxGpuLengthMm: number;
  maxCoolerHeightMm: number;
}

export interface Cooler extends BaseProduct {
  type: "air" | "liquid";
  compatibleSockets: string[];
  heightMm: number;
}
