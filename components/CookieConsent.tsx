"use client";

import Link from "next/link";
import Button from "./Button";
import { setStoredConsent } from "@/lib/consent";
import { useConsent } from "@/lib/useConsent";

export default function CookieConsent() {
  const consent = useConsent();

  if (consent !== "unknown") return null;

  function handleChoice(status: "granted" | "denied") {
    setStoredConsent(status);
  }

  return (
    <div
      role="dialog"
      aria-label="Çerez onayı"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-background shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/70">
          Deneyiminizi iyileştirmek, kullanım istatistiklerini ölçmek ve reklam
          gösterebilmek için çerezler kullanıyoruz. Detaylar için{" "}
          <Link
            href="/cerez-politikasi"
            className="text-primary-accent hover:underline"
          >
            Çerez Politikası
          </Link>
          &apos;nı inceleyebilirsiniz.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" onClick={() => handleChoice("denied")}>
            Reddet
          </Button>
          <Button onClick={() => handleChoice("granted")}>Kabul Et</Button>
        </div>
      </div>
    </div>
  );
}
