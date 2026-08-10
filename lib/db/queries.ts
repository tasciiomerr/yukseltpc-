import type { Case, Cooler, Cpu, Gpu, Motherboard, Psu, Ram } from "../types";
import { getSupabaseClient } from "./client";
import {
  fromCaseRow,
  fromCoolerRow,
  fromCpuRow,
  fromGpuRow,
  fromMotherboardRow,
  fromPsuRow,
  fromRamRow,
  type CaseRow,
  type CoolerRow,
  type CpuRow,
  type GpuRow,
  type MotherboardRow,
  type PsuRow,
  type RamRow,
} from "./mappers";

async function fetchAll<Row>(table: string): Promise<Row[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(table).select("*").order("slug");
  if (error) {
    throw new Error(`Supabase sorgusu başarısız (${table}): ${error.message}`);
  }
  return (data ?? []) as Row[];
}

export async function fetchCpusFromDb(): Promise<Cpu[]> {
  const rows = await fetchAll<CpuRow>("cpus");
  return rows.map(fromCpuRow);
}

export async function fetchMotherboardsFromDb(): Promise<Motherboard[]> {
  const rows = await fetchAll<MotherboardRow>("motherboards");
  return rows.map(fromMotherboardRow);
}

export async function fetchRamsFromDb(): Promise<Ram[]> {
  const rows = await fetchAll<RamRow>("rams");
  return rows.map(fromRamRow);
}

export async function fetchGpusFromDb(): Promise<Gpu[]> {
  const rows = await fetchAll<GpuRow>("gpus");
  return rows.map(fromGpuRow);
}

export async function fetchPsusFromDb(): Promise<Psu[]> {
  const rows = await fetchAll<PsuRow>("psus");
  return rows.map(fromPsuRow);
}

export async function fetchCasesFromDb(): Promise<Case[]> {
  const rows = await fetchAll<CaseRow>("cases");
  return rows.map(fromCaseRow);
}

export async function fetchCoolersFromDb(): Promise<Cooler[]> {
  const rows = await fetchAll<CoolerRow>("coolers");
  return rows.map(fromCoolerRow);
}
