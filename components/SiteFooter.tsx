import Link from "next/link";

const legalLinks = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
  { href: "/kvkk", label: "KVKK" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
        <nav
          aria-label="Alt bilgi menüsü"
          className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-black/60 dark:text-white/60"
        >
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm text-black/60 dark:text-white/60">
          © {new Date().getFullYear()} YükseltPC. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
