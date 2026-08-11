import { describe, expect, it } from "vitest";
import {
  findCaseBySlug,
  findCpuBySlug,
  findGpuBySlug,
  findMotherboardBySlug,
  findPsuBySlug,
  findRamBySlug,
} from "./data";
import { getUpgradeRecommendations } from "./upgradeAdvisor";

function requireItem<T>(item: T | undefined, label: string): T {
  if (!item) throw new Error(`Test fixture not found in catalog: ${label}`);
  return item;
}

describe("getUpgradeRecommendations", () => {
  it("recommends a GPU upgrade when the GPU is much weaker than the CPU", () => {
    const cpu = requireItem(
      findCpuBySlug("intel-core-i9-14900k"),
      "intel-core-i9-14900k",
    );
    const gpu = requireItem(findGpuBySlug("amd-rx-6400"), "amd-rx-6400");

    const recommendations = getUpgradeRecommendations({ cpu, gpu });

    expect(
      recommendations.some((r) => r.categorySlug === "ekran-karti"),
    ).toBe(true);
  });

  it("recommends a CPU upgrade when the CPU is much weaker than the GPU", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-5-5500"),
      "amd-ryzen-5-5500",
    );
    const gpu = requireItem(
      findGpuBySlug("nvidia-rtx-4090"),
      "nvidia-rtx-4090",
    );

    const recommendations = getUpgradeRecommendations({ cpu, gpu });

    expect(recommendations.some((r) => r.categorySlug === "islemci")).toBe(
      true,
    );
  });

  it("recommends a RAM upgrade when capacity is 8GB or below", () => {
    const ram = requireItem(
      findRamBySlug("crucial-8gb-ddr4-2400"),
      "crucial-8gb-ddr4-2400",
    );

    const recommendations = getUpgradeRecommendations({ ram });

    expect(recommendations.some((r) => r.categorySlug === "ram")).toBe(true);
    expect(
      recommendations.find((r) => r.categorySlug === "ram")?.severity,
    ).toBe("recommended");
  });

  it("does NOT recommend a RAM upgrade when capacity is well above 8GB", () => {
    const ram = requireItem(
      findRamBySlug("corsair-vengeance-32gb-ddr5-6000"),
      "corsair-vengeance-32gb-ddr5-6000",
    );

    const recommendations = getUpgradeRecommendations({ ram });

    expect(recommendations.some((r) => r.categorySlug === "ram")).toBe(
      false,
    );
  });

  it("flags a critical PSU upgrade when the PSU is insufficient for the current CPU+GPU", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-9-9950x3d"),
      "amd-ryzen-9-9950x3d",
    );
    const gpu = requireItem(
      findGpuBySlug("nvidia-rtx-4090"),
      "nvidia-rtx-4090",
    );
    const psu = requireItem(findPsuBySlug("corsair-cv450"), "corsair-cv450");

    const recommendations = getUpgradeRecommendations({ cpu, gpu, psu });

    const psuRec = recommendations.find((r) => r.categorySlug === "guc-kaynagi");
    expect(psuRec).toBeDefined();
    expect(psuRec?.severity).toBe("critical");
  });

  it("puts the critical PSU recommendation first even when other rules also trigger", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-9-9950x3d"),
      "amd-ryzen-9-9950x3d",
    );
    const gpu = requireItem(
      findGpuBySlug("nvidia-rtx-4090"),
      "nvidia-rtx-4090",
    );
    const psu = requireItem(findPsuBySlug("corsair-cv450"), "corsair-cv450");
    const ram = requireItem(
      findRamBySlug("crucial-8gb-ddr4-2400"),
      "crucial-8gb-ddr4-2400",
    );
    const motherboard = requireItem(
      findMotherboardBySlug("asus-b550m-a"),
      "asus-b550m-a",
    );

    const recommendations = getUpgradeRecommendations({
      cpu,
      gpu,
      psu,
      ram,
      motherboard,
    });

    expect(recommendations.length).toBeGreaterThanOrEqual(2);
    expect(recommendations[0].severity).toBe("critical");
    expect(recommendations[0].categorySlug).toBe("guc-kaynagi");
  });

  it("adds an info-level note when the motherboard is DDR4-only", () => {
    const motherboard = requireItem(
      findMotherboardBySlug("asus-b550m-a"),
      "asus-b550m-a",
    );

    const recommendations = getUpgradeRecommendations({ motherboard });

    const mbRec = recommendations.find((r) => r.categorySlug === "anakart");
    expect(mbRec).toBeDefined();
    expect(mbRec?.severity).toBe("info");
  });

  it("does NOT add a motherboard note for a DDR5 motherboard", () => {
    const motherboard = requireItem(
      findMotherboardBySlug("msi-pro-b650m-a"),
      "msi-pro-b650m-a",
    );

    const recommendations = getUpgradeRecommendations({ motherboard });

    expect(recommendations.some((r) => r.categorySlug === "anakart")).toBe(
      false,
    );
  });

  it("returns no recommendations for a well-balanced system", () => {
    const cpu = requireItem(
      findCpuBySlug("amd-ryzen-5-7600"),
      "amd-ryzen-5-7600",
    );
    const gpu = requireItem(
      findGpuBySlug("nvidia-rtx-4060"),
      "nvidia-rtx-4060",
    );
    const psu = requireItem(findPsuBySlug("corsair-cv450"), "corsair-cv450");
    const motherboard = requireItem(
      findMotherboardBySlug("msi-pro-b650m-a"),
      "msi-pro-b650m-a",
    );
    const ram = requireItem(
      findRamBySlug("corsair-vengeance-32gb-ddr5-6000"),
      "corsair-vengeance-32gb-ddr5-6000",
    );

    const recommendations = getUpgradeRecommendations({
      cpu,
      gpu,
      psu,
      motherboard,
      ram,
    });

    expect(recommendations).toEqual([]);
  });

  it("returns an empty array when no components are selected", () => {
    expect(getUpgradeRecommendations({})).toEqual([]);
  });

  it("does not crash when only a case and cooler are selected (no rules apply)", () => {
    const pcCase = requireItem(findCaseBySlug("nzxt-h510"), "nzxt-h510");

    const recommendations = getUpgradeRecommendations({ pcCase });

    expect(recommendations).toEqual([]);
  });
});
