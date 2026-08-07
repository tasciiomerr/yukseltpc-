import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setStoredConsent } from "@/lib/consent";

afterEach(() => {
  window.localStorage.clear();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("AdSlot", () => {
  it("renders nothing by default (NEXT_PUBLIC_ADSENSE_ENABLED unset)", async () => {
    const { default: AdSlot } = await import("./AdSlot");
    const { container } = render(<AdSlot slotId="test-slot" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when enabled but the user has not granted consent", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-1234567890123456");
    vi.resetModules();

    const { default: AdSlot } = await import("./AdSlot");
    const { container } = render(<AdSlot slotId="test-slot" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when enabled and consent granted but no client ID configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.resetModules();
    setStoredConsent("granted");

    const { default: AdSlot } = await import("./AdSlot");
    const { container } = render(<AdSlot slotId="test-slot" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the ad unit when enabled, configured, and consent granted", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-1234567890123456");
    vi.resetModules();
    setStoredConsent("granted");

    const { default: AdSlot } = await import("./AdSlot");
    const { container } = render(<AdSlot slotId="test-slot" />);

    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins).not.toBeNull();
    expect(ins).toHaveAttribute("data-ad-client", "ca-pub-1234567890123456");
    expect(ins).toHaveAttribute("data-ad-slot", "test-slot");
  });
});
