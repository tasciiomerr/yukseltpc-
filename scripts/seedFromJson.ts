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

/**
 * Anakart kataloğu Faz 15'te resmi üretici kaynaklarından (asus.com,
 * msi.com, gigabyte.com, asrock.com) doğrulanan 22 yeni kayıtla
 * genişletildi (mb-018..mb-039). Mevcut 17 kayıt "manual" olarak kalır.
 */
const MOTHERBOARD_OFFICIAL_SOURCE_CUTOFF = 18; // mb-018'den itibaren

const MOTHERBOARD_BRAND_DOMAINS: Record<string, string> = {
  ASUS: "asus.com",
  MSI: "msi.com",
  Gigabyte: "gigabyte.com",
  ASRock: "asrock.com",
};

function motherboardMeta(motherboard: Motherboard): ProductMetaInput {
  const numericId = Number(motherboard.id.replace("mb-", ""));
  if (numericId < MOTHERBOARD_OFFICIAL_SOURCE_CUTOFF) {
    return {};
  }
  return {
    source: MOTHERBOARD_BRAND_DOMAINS[motherboard.brand] ?? "manual",
    confidence: "high",
    verifiedAt: motherboard.lastUpdated,
  };
}

/**
 * RAM kataloğu Faz 15'te resmi üretici kaynaklarından (kingston.com,
 * corsair.com, gskill.com, crucial.com) doğrulanan 18 yeni kayıtla
 * genişletildi (ram-017..ram-034). Mevcut 16 kayıt "manual" olarak kalır.
 */
const RAM_OFFICIAL_SOURCE_CUTOFF = 17; // ram-017'den itibaren

function ramSourceDomain(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("kingston")) return "kingston.com";
  if (lower.includes("corsair")) return "corsair.com";
  if (lower.includes("g.skill") || lower.includes("gskill")) return "gskill.com";
  if (lower.includes("crucial")) return "crucial.com";
  if (lower.includes("teamgroup") || lower.includes("t-force")) return "teamgroupinc.com";
  return "manual";
}

function ramMeta(ram: Ram): ProductMetaInput {
  const numericId = Number(ram.id.replace("ram-", ""));
  if (numericId < RAM_OFFICIAL_SOURCE_CUTOFF) {
    return {};
  }
  return {
    source: ramSourceDomain(ram.name),
    confidence: "high",
    verifiedAt: ram.lastUpdated,
  };
}

/**
 * PSU kataloğu Faz 15'te resmi üretici kaynaklarından (corsair.com,
 * seasonic.com, evga.com, bequiet.com) doğrulanan 18 yeni kayıtla
 * genişletildi (psu-017..psu-034). Mevcut 16 kayıt "manual" olarak kalır.
 */
const PSU_OFFICIAL_SOURCE_CUTOFF = 17; // psu-017'den itibaren

function psuSourceDomain(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("corsair")) return "corsair.com";
  if (lower.includes("seasonic")) return "seasonic.com";
  if (lower.includes("evga")) return "evga.com";
  if (lower.includes("be quiet")) return "bequiet.com";
  return "manual";
}

function psuMeta(psu: Psu): ProductMetaInput {
  const numericId = Number(psu.id.replace("psu-", ""));
  if (numericId < PSU_OFFICIAL_SOURCE_CUTOFF) {
    return {};
  }
  return {
    source: psuSourceDomain(psu.name),
    confidence: "high",
    verifiedAt: psu.lastUpdated,
  };
}

/**
 * Kasa kataloğu Faz 15'te resmi üretici kaynaklarından (nzxt.com,
 * corsair.com, fractal-design.com, bequiet.com, lian-li.com ve diğer
 * markaların resmi sayfaları) doğrulanan 18 yeni kayıtla genişletildi
 * (case-016..case-033). Mevcut 15 kayıt "manual" olarak kalır.
 */
const CASE_OFFICIAL_SOURCE_CUTOFF = 16; // case-016'dan itibaren

function caseSourceDomain(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("nzxt")) return "nzxt.com";
  if (lower.includes("corsair")) return "corsair.com";
  if (lower.includes("fractal design")) return "fractal-design.com";
  if (lower.includes("lian li")) return "lian-li.com";
  if (lower.includes("cooler master")) return "coolermaster.com";
  if (lower.includes("deepcool")) return "deepcool.com";
  if (lower.includes("thermaltake")) return "thermaltake.com";
  if (lower.includes("ssupd")) return "ssupd.com";
  if (lower.includes("jonsbo")) return "jonsbo.com";
  if (lower.includes("hyte")) return "hyte.com";
  if (lower.includes("silverstone")) return "silverstonetek.com";
  if (lower.includes("montech")) return "montechworld.com";
  return "manual";
}

function caseMeta(pcCase: Case): ProductMetaInput {
  const numericId = Number(pcCase.id.replace("case-", ""));
  if (numericId < CASE_OFFICIAL_SOURCE_CUTOFF) {
    return {};
  }
  return {
    source: caseSourceDomain(pcCase.name),
    confidence: "high",
    verifiedAt: pcCase.lastUpdated,
  };
}

/**
 * Soğutucu kataloğu Faz 15'te resmi üretici kaynaklarından (noctua.at,
 * coolermaster.com, nzxt.com, corsair.com, bequiet.com ve diğer marka
 * sayfaları) doğrulanan 18 yeni kayıtla genişletildi (cooler-016..
 * cooler-033). Mevcut 15 kayıt "manual" olarak kalır.
 */
const COOLER_OFFICIAL_SOURCE_CUTOFF = 16; // cooler-016'dan itibaren

function coolerSourceDomain(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("noctua")) return "noctua.at";
  if (lower.includes("cooler master")) return "coolermaster.com";
  if (lower.includes("nzxt")) return "nzxt.com";
  if (lower.includes("corsair")) return "corsair.com";
  if (lower.includes("be quiet")) return "bequiet.com";
  if (lower.includes("thermalright")) return "thermalright.com";
  if (lower.includes("deepcool")) return "deepcool.com";
  if (lower.includes("arctic")) return "arctic.de";
  if (lower.includes("scythe")) return "scythe-eu.com";
  if (lower.includes("lian li")) return "lian-li.com";
  if (lower.includes("msi")) return "msi.com";
  if (lower.includes("ek-")) return "ekwb.com";
  return "manual";
}

function coolerMeta(cooler: Cooler): ProductMetaInput {
  const numericId = Number(cooler.id.replace("cooler-", ""));
  if (numericId < COOLER_OFFICIAL_SOURCE_CUTOFF) {
    return {};
  }
  return {
    source: coolerSourceDomain(cooler.name),
    confidence: "high",
    verifiedAt: cooler.lastUpdated,
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
    (motherboard) => toMotherboardInsertRow(motherboard, motherboardMeta(motherboard)),
  );
  await seedTable<Ram>("rams", readJson("ram.json"), (ram) =>
    toRamInsertRow(ram, ramMeta(ram)),
  );
  await seedTable<Gpu>("gpus", readJson("gpu.json"), (gpu) =>
    toGpuInsertRow(gpu, gpuMeta(gpu)),
  );
  await seedTable<Psu>("psus", readJson("psu.json"), (psu) =>
    toPsuInsertRow(psu, psuMeta(psu)),
  );
  await seedTable<Case>("cases", readJson("case.json"), (pcCase) =>
    toCaseInsertRow(pcCase, caseMeta(pcCase)),
  );
  await seedTable<Cooler>("coolers", readJson("cooler.json"), (cooler) =>
    toCoolerInsertRow(cooler, coolerMeta(cooler)),
  );

  console.log("\nSeed tamamlandı. Doğrulamak için:\n  npx tsx scripts/verifyMigrationParity.ts");
}

main().catch((error) => {
  console.error("\nSeed başarısız:", error);
  process.exit(1);
});
