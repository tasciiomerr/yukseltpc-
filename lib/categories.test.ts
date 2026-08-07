import { describe, expect, it } from "vitest";
import { categories, findProductBySlug, getCategory } from "./categories";

describe("categories registry", () => {
  it("defines exactly the 7 expected category slugs", () => {
    const slugs = categories.map((c) => c.slug).sort();
    expect(slugs).toEqual(
      [
        "anakart",
        "ekran-karti",
        "guc-kaynagi",
        "islemci",
        "kasa",
        "ram",
        "sogutucu",
      ].sort(),
    );
  });

  it("every category has at least one item", () => {
    for (const category of categories) {
      expect(category.items.length).toBeGreaterThan(0);
    }
  });

  it("every spec field can be computed for every item without throwing", () => {
    for (const category of categories) {
      for (const item of category.items) {
        for (const field of category.specFields) {
          expect(() => field.value(item)).not.toThrow();
          expect(typeof field.value(item)).toBe("string");
        }
      }
    }
  });

  it("getCategory returns undefined for an unknown slug", () => {
    expect(getCategory("bilinmeyen-kategori")).toBeUndefined();
  });

  it("findProductBySlug finds a known CPU by category + slug", () => {
    const product = findProductBySlug("islemci", "amd-ryzen-5-5600");
    expect(product?.name).toBe("AMD Ryzen 5 5600");
  });

  it("findProductBySlug returns undefined for a non-existent slug", () => {
    expect(findProductBySlug("islemci", "yok-boyle-bir-urun")).toBeUndefined();
  });

  it("CPU getRelated returns compatible motherboards and coolers", () => {
    const cpuCategory = getCategory("islemci")!;
    const cpu = cpuCategory.items.find(
      (item) => item.slug === "amd-ryzen-5-5600",
    )!;
    const related = cpuCategory.getRelated(cpu);

    const motherboardGroup = related.find(
      (group) => group.categorySlug === "anakart",
    );
    expect(motherboardGroup?.items.every((mb) => "socket" in mb)).toBe(true);
    expect(
      motherboardGroup?.items.every(
        (mb) => (mb as { socket: string }).socket === "AM4",
      ),
    ).toBe(true);
  });

  it("GPU getRelated only returns cases the GPU physically fits in", () => {
    const gpuCategory = getCategory("ekran-karti")!;
    const gpu = gpuCategory.items[0];
    const related = gpuCategory.getRelated(gpu);
    const caseGroup = related.find((group) => group.categorySlug === "kasa");

    for (const pcCase of caseGroup?.items ?? []) {
      expect((gpu as { lengthMm: number }).lengthMm).toBeLessThanOrEqual(
        (pcCase as { maxGpuLengthMm: number }).maxGpuLengthMm,
      );
    }
  });
});
