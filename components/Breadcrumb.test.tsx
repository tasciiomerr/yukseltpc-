import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Breadcrumb from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("always renders Ana Sayfa as the first item", () => {
    render(<Breadcrumb items={[{ label: "İşlemciler" }]} />);
    expect(screen.getByText("Ana Sayfa")).toBeInTheDocument();
  });

  it("renders the last item as plain text (not a link)", () => {
    render(
      <Breadcrumb
        items={[
          { label: "İşlemciler", href: "/islemci" },
          { label: "AMD Ryzen 5 5600" },
        ]}
      />,
    );

    const lastItem = screen.getByText("AMD Ryzen 5 5600");
    expect(lastItem.tagName).not.toBe("A");
    expect(lastItem).toHaveAttribute("aria-current", "page");
  });

  it("renders intermediate items with href as links", () => {
    render(
      <Breadcrumb
        items={[
          { label: "İşlemciler", href: "/islemci" },
          { label: "AMD Ryzen 5 5600" },
        ]}
      />,
    );

    const link = screen.getByText("İşlemciler");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/islemci");
  });
});
