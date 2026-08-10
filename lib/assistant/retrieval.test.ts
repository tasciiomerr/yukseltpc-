import { describe, expect, it } from "vitest";
import { buildContextText, findRelevantProducts } from "./retrieval";

describe("findRelevantProducts", () => {
  it("finds a specific CPU by name", () => {
    const matches = findRelevantProducts("Ryzen 5 5600 hangi anakartla uyumlu");
    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.some((m) => m.product.slug === "amd-ryzen-5-5600"),
    ).toBe(true);
    expect(matches[0].categorySlug).toBe("islemci");
  });

  it("finds a motherboard by chipset name", () => {
    const matches = findRelevantProducts("B650 anakart önerir misin");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((m) => m.categorySlug === "anakart")).toBe(true);
  });

  it("is case- and Turkish-character-insensitive", () => {
    const lower = findRelevantProducts("ryzen 5 5600");
    const upperTurkish = findRelevantProducts("RYZEN 5 5600");
    expect(lower.length).toBeGreaterThan(0);
    expect(upperTurkish.length).toBe(lower.length);
  });

  it("falls back to category samples when the query names a category but no specific product", () => {
    const matches = findRelevantProducts("bana bir ekran kartı öner");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((m) => m.categorySlug === "ekran-karti")).toBe(true);
  });

  it("returns an empty array for a completely unrelated query", () => {
    const matches = findRelevantProducts("yarın okula gidecek misin");
    expect(matches).toEqual([]);
  });

  it("returns an empty array for an empty query", () => {
    expect(findRelevantProducts("")).toEqual([]);
    expect(findRelevantProducts("   ")).toEqual([]);
  });

  it("respects the limit parameter", () => {
    const matches = findRelevantProducts("işlemci", 3);
    expect(matches.length).toBeLessThanOrEqual(3);
  });
});

describe("buildContextText", () => {
  it("produces a not-found message for an empty match list", () => {
    const text = buildContextText([]);
    expect(text).toContain("bulunamadı");
  });

  it("includes the product URL so the assistant can link to it", () => {
    const matches = findRelevantProducts("Ryzen 5 5600");
    const text = buildContextText(matches);
    expect(text).toContain("/islemci/amd-ryzen-5-5600");
  });
});
