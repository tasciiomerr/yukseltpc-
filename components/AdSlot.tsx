"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/lib/useConsent";

const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

interface AdSlotProps {
  /** AdSense "ad slot" ID — will be assigned when a real ad unit is created. */
  slotId: string;
  className?: string;
}

/**
 * Placeholder reklam alanı. NEXT_PUBLIC_ADSENSE_ENABLED "true" olmadan,
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID tanımlı olmadan veya kullanıcı çerez
 * onayı vermeden hiçbir şey render etmez — bkz. README "AdSense Kurulumu".
 */
export default function AdSlot({ slotId, className = "" }: AdSlotProps) {
  const consent = useConsent();
  const pushedRef = useRef(false);
  const isActive =
    ADSENSE_ENABLED && Boolean(ADSENSE_CLIENT_ID) && consent === "granted";

  useEffect(() => {
    if (!isActive || pushedRef.current) return;
    try {
      const w = window as typeof window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // adsbygoogle.js henüz yüklenmemiş olabilir; sonraki render'da tekrar denenir.
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <span className="text-[10px] uppercase tracking-wide text-foreground/40">
        Reklam
      </span>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
