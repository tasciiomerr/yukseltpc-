/**
 * scripts/verifyMigrationParity.ts
 *
 * Faz 11 Adım 3'ün TEK başarı ölçütü: JSON dosyalarındaki 116 ürünle
 * veritabanından okunan 116 ürünü alan alan karşılaştırır. Herhangi bir
 * fark varsa (eksik/fazla kayıt veya alan uyuşmazlığı) raporlar ve
 * process.exit(1) ile çıkar.
 *
 * Kullanım:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/verifyMigrationParity.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isDatabaseConfigured } from "../lib/db/client";
import {
  fetchCasesFromDb,
  fetchCoolersFromDb,
  fetchCpusFromDb,
  fetchGpusFromDb,
  fetchMotherboardsFromDb,
  fetchPsusFromDb,
  fetchRamsFromDb,
} from "../lib/db/queries";

const dataDir = join(__dirname, "..", "data");

function readJson<T extends { id: string }>(file: string): T[] {
  const raw = readFileSync(join(dataDir, file), "utf-8");
  return JSON.parse(raw) as T[];
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
    return [...keys].every((key) => deepEqual(aObj[key], bObj[key]));
  }
  return false;
}

interface Diff {
  category: string;
  kind: "missing-in-db" | "extra-in-db" | "field-mismatch";
  id: string;
  detail?: string;
}

function compareCategory<T extends { id: string }>(
  category: string,
  jsonRecords: T[],
  dbRecords: T[],
): Diff[] {
  const diffs: Diff[] = [];
  const jsonById = new Map(jsonRecords.map((r) => [r.id, r]));
  const dbById = new Map(dbRecords.map((r) => [r.id, r]));

  for (const [id, jsonRecord] of jsonById) {
    const dbRecord = dbById.get(id);
    if (!dbRecord) {
      diffs.push({ category, kind: "missing-in-db", id });
      continue;
    }
    if (!deepEqual(jsonRecord, dbRecord)) {
      const mismatchedFields = Object.keys(jsonRecord as object).filter(
        (key) =>
          !deepEqual(
            (jsonRecord as Record<string, unknown>)[key],
            (dbRecord as Record<string, unknown>)[key],
          ),
      );
      diffs.push({
        category,
        kind: "field-mismatch",
        id,
        detail: mismatchedFields
          .map(
            (key) =>
              `${key}: JSON=${JSON.stringify((jsonRecord as Record<string, unknown>)[key])} DB=${JSON.stringify((dbRecord as Record<string, unknown>)[key])}`,
          )
          .join(", "),
      });
    }
  }

  for (const id of dbById.keys()) {
    if (!jsonById.has(id)) {
      diffs.push({ category, kind: "extra-in-db", id });
    }
  }

  return diffs;
}

async function main() {
  if (!isDatabaseConfigured()) {
    console.error(
      "✗ SUPABASE_URL ve/veya SUPABASE_SERVICE_ROLE_KEY tanımlı değil.\n" +
        "  Bu script gerçek bir Supabase projesi gerektirir — bkz. README.md 'Supabase Kurulumu'.",
    );
    process.exit(1);
  }

  console.log("Parite kontrolü başlıyor...\n");

  const checks: { category: string; json: unknown[]; db: unknown[] }[] = [
    { category: "cpus", json: readJson("cpu.json"), db: await fetchCpusFromDb() },
    {
      category: "motherboards",
      json: readJson("motherboard.json"),
      db: await fetchMotherboardsFromDb(),
    },
    { category: "rams", json: readJson("ram.json"), db: await fetchRamsFromDb() },
    { category: "gpus", json: readJson("gpu.json"), db: await fetchGpusFromDb() },
    { category: "psus", json: readJson("psu.json"), db: await fetchPsusFromDb() },
    { category: "cases", json: readJson("case.json"), db: await fetchCasesFromDb() },
    {
      category: "coolers",
      json: readJson("cooler.json"),
      db: await fetchCoolersFromDb(),
    },
  ];

  let totalJson = 0;
  let totalDb = 0;
  const allDiffs: Diff[] = [];

  for (const { category, json, db } of checks) {
    totalJson += json.length;
    totalDb += db.length;
    const diffs = compareCategory(
      category,
      json as { id: string }[],
      db as { id: string }[],
    );
    allDiffs.push(...diffs);

    if (diffs.length === 0) {
      console.log(`✓ ${category}: ${json.length}/${json.length} kayıt birebir eşleşti`);
    } else {
      console.log(`✗ ${category}: ${diffs.length} fark bulundu`);
      for (const diff of diffs) {
        console.log(`   - [${diff.kind}] id=${diff.id}${diff.detail ? ` (${diff.detail})` : ""}`);
      }
    }
  }

  console.log(`\nToplam: JSON=${totalJson} kayıt, DB=${totalDb} kayıt`);

  if (allDiffs.length === 0) {
    console.log("\n✓ 0 FARK — migration parite doğrulaması başarılı.");
  } else {
    console.error(`\n✗ ${allDiffs.length} FARK bulundu — migration parite doğrulaması BAŞARISIZ.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\nParite kontrolü başarısız:", error);
  process.exit(1);
});
