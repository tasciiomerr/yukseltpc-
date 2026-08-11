/**
 * scripts/seedFromJson.ts
 *
 * data/*.json dosyalarındaki tüm ürünleri Supabase'e idempotent şekilde
 * (upsert) aktarır. Her satır tier='verified' ile doldurulur — source/
 * confidence varsayılan olarak "manual"/"high" atanır, CPU kategorisinde
 * resmi kaynaktan doğrulanan kayıtlar için cpuMeta() bunu üreticiye göre
 * (ark.intel.com / amd.com) geçersiz kılar (bkz. aşağıda).
 *
 * Kullanım:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seedFromJson.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isDatabaseConfigured, getSupabaseClient } from "../lib/db/client";
import type { ProductMetaInput } from "../lib/db/mappers";
import {
  toCaseInsertRow,
  toCoolerInsertRow,
  toCpuInsertRow,
  toGpuInsertRow,
  toMotherboardInsertRow,
  toPsuInsertRow,
  toRamInsertRow,
} from "../lib/db/mappers";
import type { Case, Cooler, Cpu, Gpu, Motherboard, Psu, Ram } from "../lib/types";

const dataDir = join(__dirname, "..", "data");

function readJson<T>(file: string): T[] {
  const raw = readFileSync(join(dataDir, file), "utf-8");
  return JSON.parse(raw) as T[];
}

/**
 * CPU kataloğu Faz 12'de resmi üretici kaynaklarından (ark.intel.com,
 * amd.com) doğrulanan 39 yeni kayıtla genişletildi (cpu-023..cpu-061).
 * Bu kayıtlar için source alanını doğru üreticiye işaretliyoruz; mevcut
 * 22 kayıt (cpu-001..cpu-022) "manual" (Faz 10 elle doğrulama) olarak kalır.
 */
const OFFICIAL_SOURCE_CUTOFF = 23; // cpu-023'ten itibaren

function cpuMeta(cpu: Cpu): ProductMetaInput {
  const numericId = Number(cpu.id.replace("cpu-", ""));
  if (numericId < OFFICIAL_SOURCE_CUTOFF) {
    return {}; // varsayılan: source="manual" (bkz. lib/db/mappers.ts)
  }
  return {
    source: cpu.brand === "Intel" ? "ark.intel.com" : "amd.com",
    confidence: "high",
    verifiedAt: cpu.lastUpdated,
  };
}

/**
 * GPU kataloğu Faz 14'te resmi üretici kaynaklarından (nvidia.com,
 * amd.com) doğrulanan 20 yeni kayıtla genişletildi (gpu-016..gpu-035).
 * Mevcut 15 kayıt (gpu-001..gpu-015) "manual" olarak kalır.
 */
const GPU_OFFICIAL_SOURCE_CUTOFF = 16; // gpu-016'dan itibaren

function gpuMeta(gpu: Gpu): ProductMetaInput {
  const numericId = Number(gpu.id.replace("gpu-", ""));
  if (numericId < GPU_OFFICIAL_SOURCE_CUTOFF) {
    return {};
  }
  return {
    source: gpu.brand === "NVIDIA" ? "nvidia.com" : "amd.com",
    confidence: "high",
    verifiedAt: gpu.lastUpdated,
  };
}

async function seedTable<T>(
  table: string,
  records: T[],
  toRow: (record: T) => Record<string, unknown>,
): Promise<void> {
  const supabase = getSupabaseClient();
  const rows = records.map(toRow);

  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(`${table} upsert başarısız: ${error.message}`);
  }

  console.log(`✓ ${table}: ${rows.length} kayıt upsert edildi`);
}

async function main() {
  if (!isDatabaseConfigured()) {
    console.error(
      "✗ SUPABASE_URL ve/veya SUPABASE_SERVICE_ROLE_KEY tanımlı değil.\n" +
        "  Bu script gerçek bir Supabase projesi gerektirir — bkz. README.md 'Supabase Kurulumu'.",
    );
    process.exit(1);
  }

  console.log("Seed başlıyor (7 kategori, tier=verified)...\n");

  await seedTable<Cpu>("cpus", readJson("cpu.json"), (cpu) =>
    toCpuInsertRow(cpu, cpuMeta(cpu)),
  );
  await seedTable<Motherboard>(
    "motherboards",
    readJson("motherboard.json"),
    toMotherboardInsertRow,
  );
  await seedTable<Ram>("rams", readJson("ram.json"), toRamInsertRow);
  await seedTable<Gpu>("gpus", readJson("gpu.json"), (gpu) =>
    toGpuInsertRow(gpu, gpuMeta(gpu)),
  );
  await seedTable<Psu>("psus", readJson("psu.json"), toPsuInsertRow);
  await seedTable<Case>("cases", readJson("case.json"), toCaseInsertRow);
  await seedTable<Cooler>("coolers", readJson("cooler.json"), toCoolerInsertRow);

  console.log("\nSeed tamamlandı. Doğrulamak için:\n  npx tsx scripts/verifyMigrationParity.ts");
}

main().catch((error) => {
  console.error("\nSeed başarısız:", error);
  process.exit(1);
});
