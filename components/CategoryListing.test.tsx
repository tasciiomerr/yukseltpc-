import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import CategoryListing from "./CategoryListing";

describe("CategoryListing", () => {
  it("renders all products for a category by default", () => {
    render(<CategoryListing categorySlug="islemci" />);
    expect(screen.getByText("AMD Ryzen 5 5600")).toBeInTheDocument();
    expect(screen.getByText("Intel Core i5-13400F")).toBeInTheDocument();
  });

  it("filters the list when a brand is selected", async () => {
    const user = userEvent.setup();
    render(<CategoryListing categorySlug="islemci" />);

    await user.selectOptions(screen.getByLabelText("Marka"), "AMD");

    expect(screen.getByText("AMD Ryzen 5 5600")).toBeInTheDocument();
    expect(screen.queryByText("Intel Core i5-13400F")).not.toBeInTheDocument();
  });

  it("'Tümü' option resets the filter and shows every product again", async () => {
    const user = userEvent.setup();
    render(<CategoryListing categorySlug="islemci" />);

    const select = screen.getByLabelText("Marka");
    await user.selectOptions(select, "AMD");
    expect(screen.queryByText("Intel Core i5-13400F")).not.toBeInTheDocument();

    await user.selectOptions(select, "Tümü");
    expect(screen.getByText("AMD Ryzen 5 5600")).toBeInTheDocument();
    expect(screen.getByText("Intel Core i5-13400F")).toBeInTheDocument();
  });

  it("renders nothing for an unknown category slug", () => {
    const { container } = render(
      <CategoryListing categorySlug="olmayan-kategori" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("has a screen-reader-only heading for correct document outline", () => {
    render(<CategoryListing categorySlug="islemci" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "İşlemciler Listesi" }),
    ).toBeInTheDocument();
  });
});
