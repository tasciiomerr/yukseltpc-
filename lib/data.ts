import caseData from "@/data/case.json";
import coolerData from "@/data/cooler.json";
import cpuData from "@/data/cpu.json";
import gpuData from "@/data/gpu.json";
import motherboardData from "@/data/motherboard.json";
import psuData from "@/data/psu.json";
import ramData from "@/data/ram.json";
import type { Case, Cooler, Cpu, Gpu, Motherboard, Psu, Ram } from "./types";

export const cpus = cpuData as Cpu[];
export const motherboards = motherboardData as Motherboard[];
export const rams = ramData as Ram[];
export const gpus = gpuData as Gpu[];
export const psus = psuData as Psu[];
export const cases = caseData as Case[];
export const coolers = coolerData as Cooler[];

export function findCpuBySlug(slug: string | null): Cpu | undefined {
  return slug ? cpus.find((item) => item.slug === slug) : undefined;
}

export function findMotherboardBySlug(
  slug: string | null,
): Motherboard | undefined {
  return slug ? motherboards.find((item) => item.slug === slug) : undefined;
}

export function findRamBySlug(slug: string | null): Ram | undefined {
  return slug ? rams.find((item) => item.slug === slug) : undefined;
}

export function findGpuBySlug(slug: string | null): Gpu | undefined {
  return slug ? gpus.find((item) => item.slug === slug) : undefined;
}

export function findPsuBySlug(slug: string | null): Psu | undefined {
  return slug ? psus.find((item) => item.slug === slug) : undefined;
}

export function findCaseBySlug(slug: string | null): Case | undefined {
  return slug ? cases.find((item) => item.slug === slug) : undefined;
}

export function findCoolerBySlug(slug: string | null): Cooler | undefined {
  return slug ? coolers.find((item) => item.slug === slug) : undefined;
}
