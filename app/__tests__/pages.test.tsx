import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AnakartPage from "../anakart/page";
import CerezPolitikasiPage from "../cerez-politikasi/page";
import EkranKartiPage from "../ekran-karti/page";
import GizlilikPolitikasiPage from "../gizlilik-politikasi/page";
import GucKaynagiPage from "../guc-kaynagi/page";
import HakkimizdaPage from "../hakkimizda/page";
import IletisimPage from "../iletisim/page";
import IslemciPage from "../islemci/page";
import KasaPage from "../kasa/page";
import ProductDetailPage from "../[kategori]/[slug]/page";
import KullanimSartlariPage from "../kullanim-sartlari/page";
import KvkkPage from "../kvkk/page";
import NotFound from "../not-found";
import RamPage from "../ram/page";
import RehberListPage from "../rehber/page";
import RehberDetailPage from "../rehber/[slug]/page";
import SogutucuPage from "../sogutucu/page";

describe("category listing pages render without throwing", () => {
  it.each([
    ["İşlemci", IslemciPage, "İşlemciler"],
    ["Anakart", AnakartPage, "Anakartlar"],
    ["RAM", RamPage, "RAM"],
    ["Ekran Kartı", EkranKartiPage, "Ekran Kartları"],
    ["Güç Kaynağı", GucKaynagiPage, "Güç Kaynakları"],
    ["Kasa", KasaPage, "Kasalar"],
    ["Soğutucu", SogutucuPage, "Soğutucular"],
  ] as const)("%s listing page shows its heading", (_name, Page, heading) => {
    render(<Page />);
    expect(
      screen.getByRole("heading", { level: 1, name: heading }),
    ).toBeInTheDocument();
  });
});

describe("product detail page ([kategori]/[slug])", () => {
  it("renders spec table and retailer links for a valid product", async () => {
    const jsx = await ProductDetailPage({
      params: Promise.resolve({
        kategori: "islemci",
        slug: "amd-ryzen-5-5600",
      }),
    });
    render(jsx);

    expect(
      screen.getByRole("heading", { level: 1, name: "AMD Ryzen 5 5600" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Teknik Özellikler")).toBeInTheDocument();
    expect(screen.getByText("Hepsiburada")).toBeInTheDocument();
  });

  it("shows compatible motherboards as related products", async () => {
    const jsx = await ProductDetailPage({
      params: Promise.resolve({
        kategori: "islemci",
        slug: "amd-ryzen-5-5600",
      }),
    });
    render(jsx);

    expect(screen.getByText("Uyumlu Anakartlar")).toBeInTheDocument();
    expect(screen.getByText("ASUS B550M-A")).toBeInTheDocument();
  });

  it("calls notFound() for an unknown category", async () => {
    await expect(
      ProductDetailPage({
        params: Promise.resolve({ kategori: "yok-boyle-kategori", slug: "x" }),
      }),
    ).rejects.toThrow();
  });

  it("calls notFound() for an unknown product slug", async () => {
    await expect(
      ProductDetailPage({
        params: Promise.resolve({
          kategori: "islemci",
          slug: "yok-boyle-urun",
        }),
      }),
    ).rejects.toThrow();
  });
});

describe("rehber (guides) pages", () => {
  it("lists all guides on the index page", () => {
    render(<RehberListPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Rehberler" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/DDR4 mü DDR5 mi/)).toBeInTheDocument();
  });

  it("renders a guide's markdown content on the detail page", async () => {
    const jsx = await RehberDetailPage({
      params: Promise.resolve({ slug: "ddr4-mu-ddr5-mi" }),
    });
    render(jsx);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /DDR4 mü DDR5 mi/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Temel Farklar/ }),
    ).toBeInTheDocument();
  });

  it("calls notFound() for an unknown guide slug", async () => {
    await expect(
      RehberDetailPage({
        params: Promise.resolve({ slug: "yok-boyle-rehber" }),
      }),
    ).rejects.toThrow();
  });
});

describe("legal and info pages render without throwing", () => {
  it.each([
    ["Gizlilik Politikası", GizlilikPolitikasiPage],
    ["Çerez Politikası", CerezPolitikasiPage],
    ["Kullanım Şartları", KullanimSartlariPage],
    ["KVKK Aydınlatma Metni", KvkkPage],
    ["Hakkımızda", HakkimizdaPage],
    ["İletişim", IletisimPage],
  ] as const)("%s page shows its heading", (heading, Page) => {
    render(<Page />);
    expect(
      screen.getByRole("heading", { level: 1, name: heading }),
    ).toBeInTheDocument();
  });
});

describe("not-found page", () => {
  it("offers links back to the home page and the compatibility tool", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Ana Sayfaya Dön" }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: "Uyumluluk Aracını Dene" }),
    ).toHaveAttribute("href", "/uyumluluk-araci");
  });
});
