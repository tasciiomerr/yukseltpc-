import { describe, expect, it } from "vitest";
import { getAllGuides, getGuideBySlug } from "./guides";

describe("guides (markdown content pipeline)", () => {
  it("reads all markdown files from content/rehber", () => {
    const guides = getAllGuides();
    expect(guides.length).toBeGreaterThanOrEqual(3);
  });

  it("parses frontmatter fields for every guide", () => {
    const guides = getAllGuides();
    for (const guide of guides) {
      expect(guide.title).toBeTruthy();
      expect(guide.description).toBeTruthy();
      expect(guide.date).toBeTruthy();
      expect(guide.content.length).toBeGreaterThan(0);
    }
  });

  it("finds a known guide by slug", () => {
    const guide = getGuideBySlug("ddr4-mu-ddr5-mi");
    expect(guide?.title).toContain("DDR4");
  });

  it("returns undefined for an unknown guide slug", () => {
    expect(getGuideBySlug("olmayan-rehber")).toBeUndefined();
  });
});
