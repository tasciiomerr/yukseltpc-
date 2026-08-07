import Link from "next/link";
import { categories } from "@/lib/categories";

const navLinks = [
  { href: "/uyumluluk-araci", label: "Uyumluluk Aracı" },
  { href: "/karsilastir", label: "Karşılaştır" },
  { href: "/rehber", label: "Rehber" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            YükseltPC
          </Link>
        </div>
        <nav
          aria-label="Ana menü"
          className="flex flex-wrap gap-x-4 gap-y-2 text-sm"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white"
            >
              {category.labelPlural}
            </Link>
          ))}
          <span aria-hidden className="text-black/20 dark:text-white/20">
            |
          </span>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
