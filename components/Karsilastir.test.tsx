import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Karsilastir from "./Karsilastir";

const replaceMock = vi.fn();
let currentSearch = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/karsilastir",
  useSearchParams: () => new URLSearchParams(currentSearch),
}));

beforeEach(() => {
  replaceMock.mockClear();
  currentSearch = "";
});

describe("Karsilastir", () => {
  it("shows a prompt when no products are selected yet", () => {
    render(<Karsilastir />);
    expect(
      screen.getByText("Karşılaştırmak için iki ürün seçin."),
    ).toBeInTheDocument();
  });

  it("renders a comparison table when both products are selected via URL params", () => {
    currentSearch =
      "kategori=islemci&a=amd-ryzen-5-5600&b=intel-core-i5-13400f";
    render(<Karsilastir />);

    expect(
      screen.getByRole("columnheader", { name: "AMD Ryzen 5 5600" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Intel Core i5-13400F" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("AM4").length).toBeGreaterThan(0);
  });

  it("resets product selections when the category changes", async () => {
    currentSearch = "kategori=islemci&a=amd-ryzen-5-5600";
    const user = userEvent.setup();
    render(<Karsilastir />);

    await user.selectOptions(screen.getByLabelText("Kategori"), "anakart");

    expect(replaceMock).toHaveBeenCalledWith("/karsilastir?kategori=anakart", {
      scroll: false,
    });
  });
});
