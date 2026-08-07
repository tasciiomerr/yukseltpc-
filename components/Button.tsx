import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-500/20",
  secondary:
    "border border-border-subtle bg-background text-foreground hover:border-primary-500 hover:text-primary-accent",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  ...props
}: {
  href: string;
  variant?: Variant;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: {
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
