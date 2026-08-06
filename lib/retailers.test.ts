import { describe, expect, it } from "vitest";
import { buildRetailerUrl, retailers, type Retailer } from "./retailers";

function getRetailer(id: string): Retailer {
  const retailer = retailers.find((r) => r.id === id);
  if (!retailer) {
    throw new Error(`Retailer not found: ${id}`);
  }
  return retailer;
}

describe("buildRetailerUrl", () => {
  it("encodes spaces and uppercase letters in the query param form (Hepsiburada)", () => {
    const url = buildRetailerUrl(getRetailer("hepsiburada"), "Ryzen 5 5600X");
    expect(url).toBe("https://www.hepsiburada.com/ara?q=Ryzen%205%205600X");
  });

  it("encodes spaces in the query param form (Trendyol)", () => {
    const url = buildRetailerUrl(getRetailer("trendyol"), "Ryzen 5 5600X");
    expect(url).toBe("https://www.trendyol.com/sr?q=Ryzen%205%205600X");
  });

  it("encodes spaces in the path segment form (Vatan Bilgisayar)", () => {
    const url = buildRetailerUrl(getRetailer("vatan"), "ASUS B550M-A");
    expect(url).toBe("https://www.vatanbilgisayar.com/arama/ASUS%20B550M-A/");
  });

  it("encodes spaces in the path segment form (İncehesap)", () => {
    const url = buildRetailerUrl(getRetailer("incehesap"), "Ryzen 5 5600X");
    expect(url).toBe("https://www.incehesap.com/q/Ryzen%205%205600X");
  });

  it("encodes spaces in the query param form (İtopya)", () => {
    const url = buildRetailerUrl(getRetailer("itopya"), "Ryzen 5 5600X");
    expect(url).toBe("https://www.itopya.com/arama/?a=Ryzen%205%205600X");
  });

  it("encodes spaces in the query param form (Sahibinden, 2.el)", () => {
    const url = buildRetailerUrl(getRetailer("sahibinden"), "Ryzen 5 5600X");
    expect(url).toBe(
      "https://www.sahibinden.com/kelime-ile-arama?query_text=Ryzen%205%205600X",
    );
  });

  it("encodes special characters such as &, +, and Turkish letters", () => {
    const url = buildRetailerUrl(
      getRetailer("hepsiburada"),
      "AMD Ryzen™ 7 9700X & İşlemci",
    );
    expect(url).toBe(
      "https://www.hepsiburada.com/ara?q=AMD%20Ryzen%E2%84%A2%207%209700X%20%26%20%C4%B0%C5%9Flemci",
    );
    expect(url).not.toContain(" ");
    expect(url).not.toContain("&İ");
  });

  it("every retailer produces a valid absolute URL", () => {
    for (const retailer of retailers) {
      const url = buildRetailerUrl(retailer, "Ryzen 5 5600X");
      expect(() => new URL(url)).not.toThrow();
    }
  });

  it("categorizes retailers into sıfır and 2.el groups correctly", () => {
    const sifirIds = retailers
      .filter((r) => r.category === "sifir")
      .map((r) => r.id);
    const ikinciElIds = retailers
      .filter((r) => r.category === "ikinci-el")
      .map((r) => r.id);

    expect(sifirIds).toEqual([
      "hepsiburada",
      "trendyol",
      "vatan",
      "incehesap",
      "itopya",
    ]);
    expect(ikinciElIds).toEqual(["sahibinden"]);
  });
});
