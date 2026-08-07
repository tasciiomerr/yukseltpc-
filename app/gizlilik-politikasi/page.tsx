import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | YükseltPC",
  description:
    "YükseltPC gizlilik politikası: hangi verileri topluyoruz, nasıl kullanıyoruz ve haklarınız nelerdir.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Gizlilik Politikası" }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        Gizlilik Politikası
      </h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Son güncelleme: 2026-08-06
      </p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          YükseltPC (&quot;biz&quot;, &quot;site&quot;) olarak
          ziyaretçilerimizin gizliliğine önem veriyoruz. Bu Gizlilik Politikası,
          sitemizi kullanırken hangi verilerin toplandığını, bu verilerin nasıl
          kullanıldığını ve haklarınızın neler olduğunu açıklar.
        </p>

        <h2>Topladığımız Veriler</h2>
        <p>Sitemizi kullanırken aşağıdaki türde veriler toplanabilir:</p>
        <ul>
          <li>
            Google Analytics aracılığıyla toplanan anonim kullanım verileri
            (ziyaret edilen sayfalar, oturum süresi, cihaz/tarayıcı bilgisi).
          </li>
          <li>
            Çerezler aracılığıyla toplanan tercih ve reklam ilgi alanı verileri
            (bkz. <Link href="/cerez-politikasi">Çerez Politikası</Link>).
          </li>
          <li>
            İletişim formunu veya e-posta adresimizi kullanarak bize
            ulaştığınızda paylaştığınız ad, e-posta adresi ve mesaj içeriği.
          </li>
        </ul>

        <h2>Verilerin Kullanım Amacı</h2>
        <p>Toplanan veriler şu amaçlarla kullanılır:</p>
        <ul>
          <li>Site performansını ve kullanıcı deneyimini iyileştirmek.</li>
          <li>
            Google AdSense aracılığıyla ilgi alanına dayalı reklam
            gösterebilmek.
          </li>
          <li>Bize ulaşan mesajlara yanıt verebilmek.</li>
        </ul>

        <h2>Üçüncü Taraf Hizmetler</h2>
        <p>
          Sitemiz Google Analytics ve Google AdSense gibi üçüncü taraf
          hizmetleri kullanır. Bu hizmetler kendi gizlilik politikalarına tabi
          çerezler kullanabilir. Google&apos;ın veri kullanımı hakkında daha
          fazla bilgi için{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Gizlilik ve Şartlar
          </a>{" "}
          sayfasını inceleyebilirsiniz.
        </p>

        <h2>Haklarınız</h2>
        <p>
          Kişisel verilerinizle ilgili haklarınız hakkında detaylı bilgi için{" "}
          <Link href="/kvkk">KVKK Aydınlatma Metni</Link> sayfamızı
          inceleyebilir, taleplerinizi{" "}
          <Link href="/iletisim">iletişim sayfamızdan</Link> bize
          iletebilirsiniz.
        </p>

        <h2>Değişiklikler</h2>
        <p>
          Bu Gizlilik Politikası zaman zaman güncellenebilir. Güncel sürüm her
          zaman bu sayfada yayınlanır.
        </p>
      </div>
    </div>
  );
}
