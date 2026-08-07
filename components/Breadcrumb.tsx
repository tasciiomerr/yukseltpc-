import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const allItems: BreadcrumbItem[] = [
    { label: "Ana Sayfa", href: "/" },
    ...items,
  ];

  return (
    <nav aria-label="Gezinme yolu" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-foreground/50">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1"
            >
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-primary-accent">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-foreground" : ""}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
