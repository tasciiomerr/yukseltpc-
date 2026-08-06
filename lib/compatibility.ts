import type { Case, Cooler, Cpu, Gpu, Motherboard, Psu, Ram } from "./types";

const PSU_BUFFER_WATT = 150;

export function isCpuMotherboardCompatible(
  cpu: Cpu,
  motherboard: Motherboard,
): boolean {
  return cpu.socket === motherboard.socket;
}

export function isRamMotherboardCompatible(
  ram: Ram,
  motherboard: Motherboard,
): boolean {
  return ram.type === motherboard.ramType;
}

export function isGpuCaseCompatible(gpu: Gpu, pcCase: Case): boolean {
  return gpu.lengthMm <= pcCase.maxGpuLengthMm;
}

export function isCoolerCompatible(cooler: Cooler, cpu: Cpu): boolean {
  return cooler.compatibleSockets.includes(cpu.socket);
}

export function calculateRequiredPsuWatt(cpu: Cpu, gpu: Gpu): number {
  return cpu.tdp + gpu.tdp + PSU_BUFFER_WATT;
}

export function isPsuSufficient(psu: Psu, requiredWatt: number): boolean {
  return psu.wattage >= requiredWatt;
}
