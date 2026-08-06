import { z } from "zod";

const priceRangeSchema = z.object({
  min: z.number().nonnegative(),
  max: z.number().nonnegative(),
});

const baseProductSchema = {
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  priceRangeNew: priceRangeSchema,
  priceRangeUsed: priceRangeSchema,
  lastUpdated: z.string(),
};

export const cpuSchema = z.object({
  ...baseProductSchema,
  brand: z.string(),
  socket: z.string(),
  cores: z.number().int().positive(),
  threads: z.number().int().positive(),
  tdp: z.number().positive(),
  hasIntegratedGraphics: z.boolean(),
  generation: z.string(),
});

export const motherboardSchema = z.object({
  ...baseProductSchema,
  brand: z.string(),
  socket: z.string(),
  chipset: z.string(),
  ramType: z.enum(["DDR4", "DDR5"]),
  ramSlots: z.number().int().positive(),
  formFactor: z.enum(["ATX", "mATX", "ITX"]),
  pcieVersion: z.string(),
});

export const ramSchema = z.object({
  ...baseProductSchema,
  type: z.enum(["DDR4", "DDR5"]),
  speed: z.number().int().positive(),
  capacity: z.number().positive(),
  moduleCount: z.number().int().positive(),
});

export const gpuSchema = z.object({
  ...baseProductSchema,
  brand: z.string(),
  lengthMm: z.number().positive(),
  powerConnectorRequired: z.string(),
  recommendedPsuWatt: z.number().positive(),
  vram: z.number().positive(),
  tdp: z.number().positive(),
});

export const psuSchema = z.object({
  ...baseProductSchema,
  wattage: z.number().positive(),
  certification: z.string(),
  isModular: z.boolean(),
});

export const caseSchema = z.object({
  ...baseProductSchema,
  supportedFormFactors: z.array(z.enum(["ATX", "mATX", "ITX"])),
  maxGpuLengthMm: z.number().positive(),
  maxCoolerHeightMm: z.number().positive(),
});

export const coolerSchema = z.object({
  ...baseProductSchema,
  type: z.enum(["air", "liquid"]),
  compatibleSockets: z.array(z.string()),
  heightMm: z.number().positive(),
});
