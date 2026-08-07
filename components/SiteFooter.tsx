import Link from "next/link";
import { categories } from "@/lib/categories";

const legalLinks = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
  { href: "/kvkk", label: "KVKK" },
];

const corporateLinks = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/rehber", label: "Rehber" },
  { href: "/uyumluluk-araci", label: "Uyumluluk Aracı" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-foreground/60 hover:text-primary-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-heading text-lg font-bold">
              Yükselt<span className="text-primary-accent">PC</span>
            </span>
            <p className="mt-3 text-sm text-foreground/60">
              Bilgisayarınızı bilinçli şekilde yükseltin: uyumluluk kontrolü,
              parça rehberleri ve öneriler.
            </p>
          </div>
          <FooterColumn
            title="Kategoriler"
            links={categories.map((c) => ({
              href: `/${c.slug}`,
              label: c.labelPlural,
            }))}
          />
          <FooterColumn title="Kurumsal" links={corporateLinks} />
          <FooterColumn title="Yasal" links={legalLinks} />
        </div>

        <div className="mt-10 border-t border-border-subtle pt-6 text-sm text-foreground/50">
          © {new Date().getFullYear()} YükseltPC. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
