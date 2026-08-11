"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/categories";

const toolLinks = [
  { href: "/sistemim", label: "Sistemim" },
  { href: "/uyumluluk-araci", label: "Uyumluluk Aracı" },
  { href: "/karsilastir", label: "Karşılaştır" },
  { href: "/rehber", label: "Rehber" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsMenuOpen(false);
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2 py-2 font-heading text-lg font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-sm text-white">
            Y
          </span>
          Yükselt<span className="text-primary-accent">PC</span>
        </Link>

        <nav
          aria-label="Ana menü"
          className="hidden items-center gap-1 md:flex"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className={`rounded-md px-3 py-2.5 text-sm transition-colors ${
                isActive(`/${category.slug}`)
                  ? "text-primary-accent"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {category.labelPlural}
            </Link>
          ))}
          <span aria-hidden className="mx-1 h-4 w-px bg-border-subtle" />
          {toolLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-primary-50 text-primary-accent"
                  : "text-foreground/80 hover:bg-surface hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border-subtle md:hidden"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            {isMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobil menü"
          className="border-t border-border-subtle px-4 py-3 md:hidden"
        >
          <p className="px-1 pb-1 text-xs font-medium uppercase tracking-wide text-foreground/50">
            Kategoriler
          </p>
          <div className="flex flex-col">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="rounded-md px-2 py-2 text-sm text-foreground/80 hover:bg-surface"
              >
                {category.labelPlural}
              </Link>
            ))}
          </div>
          <p className="px-1 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-foreground/50">
            Araçlar
          </p>
          <div className="flex flex-col">
            {toolLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
