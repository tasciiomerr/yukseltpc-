import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ZodType } from "zod";
import {
  caseSchema,
  coolerSchema,
  cpuSchema,
  gpuSchema,
  motherboardSchema,
  psuSchema,
  ramSchema,
} from "../lib/schemas";

const dataDir = join(__dirname, "..", "data");

const datasets: { file: string; schema: ZodType }[] = [
  { file: "cpu.json", schema: cpuSchema },
  { file: "motherboard.json", schema: motherboardSchema },
  { file: "ram.json", schema: ramSchema },
  { file: "gpu.json", schema: gpuSchema },
  { file: "psu.json", schema: psuSchema },
  { file: "case.json", schema: caseSchema },
  { file: "cooler.json", schema: coolerSchema },
];

let hasError = false;

for (const { file, schema } of datasets) {
  const raw = readFileSync(join(dataDir, file), "utf-8");
  const records = JSON.parse(raw);

  if (!Array.isArray(records)) {
    console.error(`✗ ${file}: expected an array of records`);
    hasError = true;
    continue;
  }

  let fileHasError = false;

  records.forEach((record, index) => {
    const result = schema.safeParse(record);
    if (!result.success) {
      fileHasError = true;
      hasError = true;
      console.error(`✗ ${file}[${index}] (${record.id ?? "unknown id"}):`);
      for (const issue of result.error.issues) {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      }
    }
  });

  if (!fileHasError) {
    console.log(`✓ ${file}: ${records.length} record(s) valid`);
  }
}

if (hasError) {
  console.error("\nValidation failed.");
  process.exit(1);
} else {
  console.log("\nAll data files valid.");
}
