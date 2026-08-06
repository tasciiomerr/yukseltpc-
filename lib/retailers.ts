export type RetailerCategory = "sifir" | "ikinci-el";

export interface Retailer {
  id: string;
  name: string;
  category: RetailerCategory;
  /** Contains a literal `{query}` placeholder to be replaced with the encoded product name. */
  urlTemplate: string;
}

/**
 * URL kalıpları 2026-08-06 tarihinde ilgili sitelerde arama yapılarak
 * doğrulanmıştır (bkz. Faz 4 araştırması). İtopya ve Sahibinden,
 * bot koruması nedeniyle bu geliştirme ortamından doğrudan tıklanarak
 * test edilemedi; kalıpları sitenin kendi indekslenmiş URL'lerinden ve
 * belgelenmiş kullanım örneklerinden doğrulandı — periyodik olarak
 * elle kontrol edilmeli (bkz. yol haritası madde 80).
 */
export const retailers: Retailer[] = [
  {
    id: "hepsiburada",
    name: "Hepsiburada",
    category: "sifir",
    urlTemplate: "https://www.hepsiburada.com/ara?q={query}",
  },
  {
    id: "trendyol",
    name: "Trendyol",
    category: "sifir",
    urlTemplate: "https://www.trendyol.com/sr?q={query}",
  },
  {
    id: "vatan",
    name: "Vatan Bilgisayar",
    category: "sifir",
    urlTemplate: "https://www.vatanbilgisayar.com/arama/{query}/",
  },
  {
    id: "incehesap",
    name: "İncehesap",
    category: "sifir",
    urlTemplate: "https://www.incehesap.com/q/{query}",
  },
  {
    id: "itopya",
    name: "İtopya",
    category: "sifir",
    urlTemplate: "https://www.itopya.com/arama/?a={query}",
  },
  {
    id: "sahibinden",
    name: "Sahibinden",
    category: "ikinci-el",
    urlTemplate:
      "https://www.sahibinden.com/kelime-ile-arama?query_text={query}",
  },
];

export function buildRetailerUrl(
  retailer: Retailer,
  productName: string,
): string {
  return retailer.urlTemplate.replace(
    "{query}",
    encodeURIComponent(productName),
  );
}
