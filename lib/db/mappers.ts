import type { Case, Cooler, Cpu, Gpu, Motherboard, Psu, Ram } from "../types";

export interface ProductMetaInput {
  mpn?: string | null;
  tier?: "verified" | "raw";
  source?: string;
  confidence?: "high" | "medium" | "low";
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  icecatId?: number | null;
  rawSpecs?: Record<string, unknown> | null;
}

interface CommonRow {
  id: string;
  slug: string;
  name: string;
  mpn: string | null;
  price_new_min: number;
  price_new_max: number;
  price_used_min: number;
  price_used_max: number;
  last_updated: string;
  tier: "verified" | "raw";
  source: string;
  confidence: "high" | "medium" | "low";
  verified_at: string | null;
  verified_by: string | null;
  icecat_id: number | null;
  raw_specs: Record<string, unknown> | null;
}

function commonInsertFields(
  product: {
    id: string;
    slug: string;
    name: string;
    priceRangeNew: { min: number; max: number };
    priceRangeUsed: { min: number; max: number };
    lastUpdated: string;
  },
  meta: ProductMetaInput,
): CommonRow {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    mpn: meta.mpn ?? null,
    price_new_min: product.priceRangeNew.min,
    price_new_max: product.priceRangeNew.max,
    price_used_min: product.priceRangeUsed.min,
    price_used_max: product.priceRangeUsed.max,
    last_updated: product.lastUpdated,
    tier: meta.tier ?? "verified",
    source: meta.source ?? "manual",
    confidence: meta.confidence ?? "high",
    verified_at: meta.verifiedAt ?? product.lastUpdated,
    verified_by: meta.verifiedBy ?? null,
    icecat_id: meta.icecatId ?? null,
    raw_specs: meta.rawSpecs ?? null,
  };
}

function commonAppFields(row: CommonRow) {
  return {
    priceRangeNew: { min: row.price_new_min, max: row.price_new_max },
    priceRangeUsed: { min: row.price_used_min, max: row.price_used_max },
    lastUpdated: row.last_updated,
  };
}

// ---------------------------------------------------------------------
// CPU
// ---------------------------------------------------------------------
export interface CpuRow extends CommonRow {
  id: string;
  brand: string;
  socket: string;
  cores: number;
  threads: number;
  tdp: number | null;
  has_integrated_graphics: boolean;
  generation: string;
}

export function toCpuInsertRow(cpu: Cpu, meta: ProductMetaInput = {}) {
  return {
    ...commonInsertFields(cpu, meta),
    brand: cpu.brand,
    socket: cpu.socket,
    cores: cpu.cores,
    threads: cpu.threads,
    tdp: cpu.tdp,
    has_integrated_graphics: cpu.hasIntegratedGraphics,
    generation: cpu.generation,
  };
}

export function fromCpuRow(row: CpuRow): Cpu {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ...commonAppFields(row),
    brand: row.brand,
    socket: row.socket,
    cores: row.cores,
    threads: row.threads,
    tdp: row.tdp ?? 0,
    hasIntegratedGraphics: row.has_integrated_graphics,
    generation: row.generation,
  };
}

// ---------------------------------------------------------------------
// Motherboard
// ---------------------------------------------------------------------
export interface MotherboardRow extends CommonRow {
  id: string;
  brand: string;
  socket: string;
  chipset: string;
  ram_type: "DDR4" | "DDR5";
  ram_slots: number;
  form_factor: "ATX" | "mATX" | "ITX";
  pcie_version: string;
}

export function toMotherboardInsertRow(
  mb: Motherboard,
  meta: ProductMetaInput = {},
) {
  return {
    ...commonInsertFields(mb, meta),
    brand: mb.brand,
    socket: mb.socket,
    chipset: mb.chipset,
    ram_type: mb.ramType,
    ram_slots: mb.ramSlots,
    form_factor: mb.formFactor,
    pcie_version: mb.pcieVersion,
  };
}

export function fromMotherboardRow(row: MotherboardRow): Motherboard {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ...commonAppFields(row),
    brand: row.brand,
    socket: row.socket,
    chipset: row.chipset,
    ramType: row.ram_type,
    ramSlots: row.ram_slots,
    formFactor: row.form_factor,
    pcieVersion: row.pcie_version,
  };
}

// ---------------------------------------------------------------------
// RAM
// ---------------------------------------------------------------------
export interface RamRow extends CommonRow {
  id: string;
  type: "DDR4" | "DDR5";
  speed: number;
  capacity: number;
  module_count: number;
}

export function toRamInsertRow(ram: Ram, meta: ProductMetaInput = {}) {
  return {
    ...commonInsertFields(ram, meta),
    type: ram.type,
    speed: ram.speed,
    capacity: ram.capacity,
    module_count: ram.moduleCount,
  };
}

export function fromRamRow(row: RamRow): Ram {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ...commonAppFields(row),
    type: row.type,
    speed: row.speed,
    capacity: row.capacity,
    moduleCount: row.module_count,
  };
}

// ---------------------------------------------------------------------
// GPU
// ---------------------------------------------------------------------
export interface GpuRow extends CommonRow {
  id: string;
  brand: string;
  length_mm: number;
  power_connector_required: string;
  recommended_psu_watt: number | null;
  vram: number;
  tdp: number | null;
}

export function toGpuInsertRow(gpu: Gpu, meta: ProductMetaInput = {}) {
  return {
    ...commonInsertFields(gpu, meta),
    brand: gpu.brand,
    length_mm: gpu.lengthMm,
    power_connector_required: gpu.powerConnectorRequired,
    recommended_psu_watt: gpu.recommendedPsuWatt,
    vram: gpu.vram,
    tdp: gpu.tdp,
  };
}

export function fromGpuRow(row: GpuRow): Gpu {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ...commonAppFields(row),
    brand: row.brand,
    lengthMm: row.length_mm,
    powerConnectorRequired: row.power_connector_required,
    recommendedPsuWatt: row.recommended_psu_watt ?? 0,
    vram: row.vram,
    tdp: row.tdp ?? 0,
  };
}

// ---------------------------------------------------------------------
// PSU
// ---------------------------------------------------------------------
export interface PsuRow extends CommonRow {
  id: string;
  wattage: number;
  certification: string;
  is_modular: boolean;
}

export function toPsuInsertRow(psu: Psu, meta: ProductMetaInput = {}) {
  return {
    ...commonInsertFields(psu, meta),
    wattage: psu.wattage,
    certification: psu.certification,
    is_modular: psu.isModular,
  };
}

export function fromPsuRow(row: PsuRow): Psu {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ...commonAppFields(row),
    wattage: row.wattage,
    certification: row.certification,
    isModular: row.is_modular,
  };
}

// ---------------------------------------------------------------------
// Case
// ---------------------------------------------------------------------
export interface CaseRow extends CommonRow {
  id: string;
  supported_form_factors: ("ATX" | "mATX" | "ITX")[];
  max_gpu_length_mm: number;
  max_cooler_height_mm: number;
}

export function toCaseInsertRow(pcCase: Case, meta: ProductMetaInput = {}) {
  return {
    ...commonInsertFields(pcCase, meta),
    supported_form_factors: pcCase.supportedFormFactors,
    max_gpu_length_mm: pcCase.maxGpuLengthMm,
    max_cooler_height_mm: pcCase.maxCoolerHeightMm,
  };
}

export function fromCaseRow(row: CaseRow): Case {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ...commonAppFields(row),
    supportedFormFactors: row.supported_form_factors,
    maxGpuLengthMm: row.max_gpu_length_mm,
    maxCoolerHeightMm: row.max_cooler_height_mm,
  };
}

// ---------------------------------------------------------------------
// Cooler
// ---------------------------------------------------------------------
export interface CoolerRow extends CommonRow {
  id: string;
  type: "air" | "liquid";
  compatible_sockets: string[];
  height_mm: number | null;
}

export function toCoolerInsertRow(cooler: Cooler, meta: ProductMetaInput = {}) {
  return {
    ...commonInsertFields(cooler, meta),
    type: cooler.type,
    compatible_sockets: cooler.compatibleSockets,
    height_mm: cooler.heightMm,
  };
}

export function fromCoolerRow(row: CoolerRow): Cooler {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ...commonAppFields(row),
    type: row.type,
    compatibleSockets: row.compatible_sockets,
    heightMm: row.height_mm ?? 0,
  };
}
