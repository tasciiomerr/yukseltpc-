import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, buildOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İletişim | YükseltPC",
  description: "YükseltPC ile iletişime geçin.",
  alternates: { canonical: absoluteUrl("/iletisim") },
};

export default function IletisimPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={buildOrganizationSchema()} />
      <Breadcrumb items={[{ label: "İletişim" }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">İletişim</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Sorularınız, geri bildirimleriniz veya iş birliği talepleriniz için bize
        ulaşabilirsiniz.
      </p>

      <p className="mt-6 text-sm">
        E-posta:{" "}
        <a href="mailto:info@yukseltpc.com" className="underline">
          info@yukseltpc.com
        </a>
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
