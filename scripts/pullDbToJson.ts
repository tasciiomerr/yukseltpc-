/**
 * scripts/pullDbToJson.ts
 *
 * lib/data.ts, "use client" bileşenler (örn. components/UyumlulukAraci.tsx)
 * tarafından doğrudan import edildiği için ASLA bir DB istemcisi veya
 * SUPABASE_SERVICE_ROLE_KEY gibi bir secret içeremez — aksi halde bu
 * secret, tarayıcıya gönderilen client bundle'a sızar.
 *
 * Bunun yerine: veritabanı, build ÖNCESİNDE (bu script ile) data/*.json
 * dosyalarına "pull" edilir. lib/data.ts hiç değişmeden, her zamanki gibi
 * bu JSON dosyalarını senkron olarak okumaya devam eder — ama içerikleri
 * artık veritabanından taze çekilmiş olur.
 *
 * SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY tanımlı değilse (yerel geliştirme,
 * bu sandbox, veya Supabase henüz kurulmadıysa) script sessizce hiçbir şey
 * yapmadan çıkar — data/*.json dosyaları elle yazılmış haliyle kalır. Bu
 * sayede `npm run build` her zaman, DB olsun olmasın, hatasız çalışır.
 *
 * Kullanım (npm run build'den önce "prebuild" olarak otomatik çalışır):
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/pullDbToJson.ts
 */
import { writeFileSync } from "node:fs";
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

function writeJson(file: string, records: unknown[]): void {
  writeFileSync(join(dataDir, file), `${JSON.stringify(records, null, 2)}\n`, "utf-8");
  console.log(`✓ ${file}: ${records.length} kayıt veritabanından yazıldı`);
}

async function main() {
  if (!isDatabaseConfigured()) {
    console.log(
      "ℹ SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY tanımlı değil — data/*.json dosyaları " +
        "mevcut haliyle (elle yazılmış) kullanılacak. Bu normal bir durumdur (yerel " +
        "geliştirme veya Supabase henüz kurulmadıysa).",
    );
    return;
  }

  console.log("Veritabanından data/*.json dosyaları yenileniyor...\n");

  writeJson("cpu.json", await fetchCpusFromDb());
  writeJson("motherboard.json", await fetchMotherboardsFromDb());
  writeJson("ram.json", await fetchRamsFromDb());
  writeJson("gpu.json", await fetchGpusFromDb());
  writeJson("psu.json", await fetchPsusFromDb());
  writeJson("case.json", await fetchCasesFromDb());
  writeJson("cooler.json", await fetchCoolersFromDb());

  console.log("\nTamamlandı — data/*.json artık veritabanının bir anlık görüntüsü.");
}

main().catch((error) => {
  console.error("\ndata/*.json yenilenemedi:", error);
  process.exit(1);
});
