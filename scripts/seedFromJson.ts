/**
 * scripts/seedFromJson.ts
 *
 * Faz 11 Adım 3: 7 JSON dosyasındaki 116 ürünü Supabase'e idempotent
 * şekilde (upsert) aktarır. Her satır tier='verified', source='manual',
 * confidence='high', verified_at=lastUpdated ile doldurulur — bu adımda
 * hiçbir "raw" katman verisi eklenmez.
 *
 * Kullanım:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seedFromJson.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isDatabaseConfigured, getSupabaseClient } from "../lib/db/client";
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

  console.log("Seed başlıyor (116 ürün, 7 kategori, tier=verified)...\n");

  await seedTable<Cpu>("cpus", readJson("cpu.json"), toCpuInsertRow);
  await seedTable<Motherboard>(
    "motherboards",
    readJson("motherboard.json"),
    toMotherboardInsertRow,
  );
  await seedTable<Ram>("rams", readJson("ram.json"), toRamInsertRow);
  await seedTable<Gpu>("gpus", readJson("gpu.json"), toGpuInsertRow);
  await seedTable<Psu>("psus", readJson("psu.json"), toPsuInsertRow);
  await seedTable<Case>("cases", readJson("case.json"), toCaseInsertRow);
  await seedTable<Cooler>("coolers", readJson("cooler.json"), toCoolerInsertRow);

  console.log("\nSeed tamamlandı. Doğrulamak için:\n  npx tsx scripts/verifyMigrationParity.ts");
}

main().catch((error) => {
  console.error("\nSeed başarısız:", error);
  process.exit(1);
});
