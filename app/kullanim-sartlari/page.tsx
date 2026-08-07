import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kullanım Şartları | YükseltPC",
  description:
    "YükseltPC'yi kullanırken geçerli olan kullanım şartları ve sorumluluk sınırlamaları.",
  alternates: { canonical: absoluteUrl("/kullanim-sartlari") },
};

export default function KullanimSartlariPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Kullanım Şartları" }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Kullanım Şartları</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Son güncelleme: 2026-08-06
      </p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          Bu sayfa, YükseltPC (&quot;site&quot;) web sitesini kullanırken
          uymanız gereken şartları açıklar. Siteyi kullanarak bu şartları kabul
          etmiş sayılırsınız.
        </p>

        <h2>Site İçeriğinin Amacı</h2>
        <p>
          YükseltPC üzerindeki uyumluluk bilgileri, fiyat aralıkları ve rehber
          içerikleri yalnızca bilgilendirme amaçlıdır. Verdiğimiz uyumluluk
          sonuçları ve öneriler genel teknik bilgilere dayanır; nihai satın alma
          kararını vermeden önce ürün üreticisinin resmi spesifikasyonlarını
          doğrulamanızı öneririz.
        </p>

        <h2>Fiyat Bilgileri</h2>
        <p>
          Sitemizde gösterilen fiyat aralıkları gerçek zamanlı değildir,
          periyodik olarak güncellenen yaklaşık/makul aralıklardır. Güncel ve
          kesin fiyat bilgisi için satıcı linklerinden ilgili sitelere gitmenizi
          öneririz.
        </p>

        <h2>Satıcı Linkleri</h2>
        <p>
          Sitemizdeki satıcı arama linkleri, sizi ilgili e-ticaret sitelerinin
          arama sonuç sayfalarına yönlendirir. YükseltPC bu üçüncü taraf
          sitelerin içeriğinden, fiyatlandırmasından veya satış süreçlerinden
          sorumlu değildir.
        </p>

        <h2>Sorumluluk Sınırlaması</h2>
        <p>
          YükseltPC, site içeriğinin doğruluğu için makul özeni gösterir ancak
          hata, eksiklik veya güncel olmayan bilgilerden kaynaklanan zararlardan
          sorumlu tutulamaz. Site &quot;olduğu gibi&quot; sunulmaktadır.
        </p>

        <h2>Fikri Mülkiyet</h2>
        <p>
          Sitedeki özgün metin, tasarım ve yazılım YükseltPC&apos;ye aittir.
          İçeriklerin izinsiz kopyalanması veya ticari amaçla yeniden
          kullanılması yasaktır.
        </p>

        <h2>Değişiklikler</h2>
        <p>
          Bu Kullanım Şartları zaman zaman güncellenebilir. Güncel sürüm her
          zaman bu sayfada yayınlanır.
        </p>

        <h2>İletişim</h2>
        <p>
          Sorularınız için <Link href="/iletisim">iletişim sayfamızı</Link>{" "}
          kullanabilirsiniz.
        </p>
      </div>
    </div>
  );
}
