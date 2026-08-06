import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UyumlulukAraci from "./UyumlulukAraci";

const replaceMock = vi.fn();
let currentSearch = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/uyumluluk-araci",
  useSearchParams: () => new URLSearchParams(currentSearch),
}));

beforeEach(() => {
  replaceMock.mockClear();
  currentSearch = "";
});

describe("UyumlulukAraci", () => {
  it("henüz seçim yapılmadığında yönlendirici mesajlar gösterir", () => {
    render(<UyumlulukAraci />);

    const card = screen.getByTestId("result-İşlemci - Anakart");
    expect(card).toHaveAttribute("data-status", "pending");
    expect(card).toHaveTextContent("Karşılaştırmak için");
  });

  it("uyumlu CPU-Anakart seçimini yeşil olarak gösterir (URL parametresinden okuma)", () => {
    currentSearch = "cpu=amd-ryzen-5-5600&mb=asus-b550m-a";
    render(<UyumlulukAraci />);

    expect(screen.getByLabelText("İşlemci (CPU)")).toHaveValue(
      "amd-ryzen-5-5600",
    );
    expect(screen.getByLabelText("Anakart")).toHaveValue("asus-b550m-a");

    const card = screen.getByTestId("result-İşlemci - Anakart");
    expect(card).toHaveAttribute("data-status", "compatible");
  });

  it("uyumsuz CPU-Anakart seçimini kırmızı olarak gösterir", () => {
    currentSearch = "cpu=intel-core-i5-13400f&mb=asus-b550m-a";
    render(<UyumlulukAraci />);

    const card = screen.getByTestId("result-İşlemci - Anakart");
    expect(card).toHaveAttribute("data-status", "incompatible");
    expect(card).toHaveTextContent("uyuşmuyor");
  });

  it("bir bileşen seçildiğinde router.replace ile URL güncellenir", async () => {
    const user = userEvent.setup();
    render(<UyumlulukAraci />);

    await user.selectOptions(
      screen.getByLabelText("İşlemci (CPU)"),
      "amd-ryzen-5-5600",
    );

    expect(replaceMock).toHaveBeenCalledWith(
      "/uyumluluk-araci?cpu=amd-ryzen-5-5600",
      { scroll: false },
    );
  });

  it("PSU yeterliliğini CPU+GPU seçili ama PSU seçili değilken tahmini watt ile bekletir", () => {
    currentSearch = "cpu=amd-ryzen-5-5600&gpu=nvidia-rtx-4060";
    render(<UyumlulukAraci />);

    const card = screen.getByTestId("result-Güç Kaynağı Yeterliliği");
    expect(card).toHaveAttribute("data-status", "pending");
    expect(card).toHaveTextContent("330W");
  });
});
