import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface GuideFrontmatter {
  title: string;
  description: string;
  date: string;
}

export interface Guide extends GuideFrontmatter {
  slug: string;
  content: string;
}

const GUIDES_DIR = path.join(process.cwd(), "content", "rehber");

export function getAllGuides(): Guide[] {
  const files = fs
    .readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith(".md"));

  const guides = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      content,
      ...(data as GuideFrontmatter),
    };
  });

  return guides.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getGuideBySlug(slug: string): Guide | undefined {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    content,
    ...(data as GuideFrontmatter),
  };
}
