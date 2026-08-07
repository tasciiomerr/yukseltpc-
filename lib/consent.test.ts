import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getStoredConsent,
  setStoredConsent,
  subscribeToConsent,
} from "./consent";

afterEach(() => {
  window.localStorage.clear();
});

describe("consent", () => {
  it("returns 'unknown' when nothing is stored", () => {
    expect(getStoredConsent()).toBe("unknown");
  });

  it("persists and reflects a granted choice", () => {
    setStoredConsent("granted");
    expect(getStoredConsent()).toBe("granted");
  });

  it("persists and reflects a denied choice", () => {
    setStoredConsent("denied");
    expect(getStoredConsent()).toBe("denied");
  });

  it("ignores garbage values in storage and falls back to 'unknown'", () => {
    window.localStorage.setItem("yukseltpc-cookie-consent", "not-a-status");
    expect(getStoredConsent()).toBe("unknown");
  });

  it("notifies subscribers when consent changes", () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToConsent(callback);

    setStoredConsent("granted");

    expect(callback).toHaveBeenCalledWith("granted");
    unsubscribe();
  });

  it("stops notifying after unsubscribe", () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToConsent(callback);
    unsubscribe();

    setStoredConsent("denied");

    expect(callback).not.toHaveBeenCalled();
  });
});
