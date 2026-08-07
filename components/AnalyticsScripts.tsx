"use client";

import Script from "next/script";
import { useConsent } from "@/lib/useConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

/**
 * Google Analytics ve AdSense scriptlerini yükler — yalnızca kullanıcı
 * çerez onayı verdikten SONRA ve ilgili ortam değişkenleri tanımlıysa.
 * Onay verilmeden (veya reddedilirse) hiçbir üçüncü taraf script'i
 * yüklenmez. Bkz. README "AdSense Kurulumu".
 */
export default function AnalyticsScripts() {
  const consent = useConsent();

  if (consent !== "granted") return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
      {ADSENSE_ENABLED && ADSENSE_CLIENT_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
