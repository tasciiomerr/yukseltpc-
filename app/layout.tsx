import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 dark:border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <span className="text-lg font-semibold">YükseltPC</span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/10 dark:border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-black/60 dark:text-white/60">
            © {new Date().getFullYear()} YükseltPC. Tüm hakları saklıdır.
          </div>
        </footer>
      </body>
    </html>
  );
}
