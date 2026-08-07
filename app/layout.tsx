import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const headingFont = Sora({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YükseltPC",
  description:
    "Bilgisayarınızı bilinçli şekilde yükseltin: uyumluluk kontrolü, parça rehberleri ve öneriler.",
  metadataBase: new URL("https://yukseltpc.com"),
  openGraph: {
    title: "YükseltPC",
    description:
      "Bilgisayarınızı bilinçli şekilde yükseltin: uyumluluk kontrolü, parça rehberleri ve öneriler.",
    siteName: "YükseltPC",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
