import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { getStoredConsent } from "@/lib/consent";
import CookieConsent from "./CookieConsent";

afterEach(() => {
  window.localStorage.clear();
});

describe("CookieConsent", () => {
  it("shows the banner when no choice has been made yet", () => {
    render(<CookieConsent />);
    expect(
      screen.getByRole("dialog", { name: "Çerez onayı" }),
    ).toBeInTheDocument();
  });

  it("does not render when consent was already granted", () => {
    window.localStorage.setItem("yukseltpc-cookie-consent", "granted");
    render(<CookieConsent />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not render when consent was already denied", () => {
    window.localStorage.setItem("yukseltpc-cookie-consent", "denied");
    render(<CookieConsent />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hides the banner and persists 'granted' when the user accepts", async () => {
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(screen.getByRole("button", { name: "Kabul Et" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(getStoredConsent()).toBe("granted");
  });

  it("hides the banner and persists 'denied' when the user rejects", async () => {
    const user = userEvent.setup();
    render(<CookieConsent />);

    await user.click(screen.getByRole("button", { name: "Reddet" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(getStoredConsent()).toBe("denied");
  });
});
