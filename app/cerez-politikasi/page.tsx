import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Çerez Politikası | YükseltPC",
  description:
    "YükseltPC'de kullanılan çerez türleri ve çerez tercihlerinizi nasıl yönetebileceğiniz.",
  alternates: { canonical: absoluteUrl("/cerez-politikasi") },
};

export default function CerezPolitikasiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Çerez Politikası" }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Çerez Politikası</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Son güncelleme: 2026-08-08
      </p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          Çerezler, ziyaret ettiğiniz web siteleri tarafından cihazınıza
          kaydedilen küçük metin dosyalarıdır. YükseltPC, sitemizi daha iyi hale
          getirmek ve size ilgili reklamlar gösterebilmek için çerezler
          kullanır.
        </p>

        <h2>Kullandığımız Çerez Türleri</h2>
        <ul>
          <li>
            <strong>Zorunlu çerezler:</strong> Sitenin temel işlevlerinin (örn.
            çerez onayı tercihinizin hatırlanması) çalışması için gereklidir.
          </li>
          <li>
            <strong>Analitik çerezler:</strong> Google Analytics aracılığıyla
            site kullanımını anonim şekilde ölçmek için kullanılır.
          </li>
          <li>
            <strong>Reklam çerezleri:</strong> Google AdSense aracılığıyla ilgi
            alanınıza uygun reklamlar gösterebilmek için kullanılır.
          </li>
        </ul>

        <h2>Onay Mekanizmamız Nasıl Çalışır?</h2>
        <p>
          Siteyi ilk ziyaretinizde ekranın altında bir çerez onay bandı
          görürsünüz.{" "}
          <strong>
            Analitik (Google Analytics) ve reklam (Google AdSense) çerezleri,
            yalnızca bu bantta &quot;Kabul Et&quot; seçtiğinizde yüklenir.
          </strong>{" "}
          &quot;Reddet&quot; seçerseniz veya bandı kapatmadan siteyi kullanmaya
          devam ederseniz, bu üçüncü taraf scriptleri hiç çalışmaz ve ilgili
          çerezler cihazınıza kaydedilmez — yalnızca sitenin temel işlevleri
          için gerekli zorunlu veriler kullanılır. Tercihiniz, cihazınızda çerez
          olarak değil, tarayıcınızın yerel depolama alanında (localStorage)
          saklanır ve sunucularımıza gönderilmez.
        </p>
        <p>
          Tercihinizi değiştirmek isterseniz, tarayıcınızın site verilerini
          (yerel depolama alanını) bu sitenin adresi için temizleyerek onay
          bandını yeniden görebilirsiniz — adım adım yöntem tarayıcınıza göre
          değişir, genellikle site ayarları veya gizlilik menüsünden
          erişilebilir.
        </p>

        <h2>Tarayıcı Çerez Ayarları</h2>
        <p>
          Çoğu tarayıcı, çerezleri kabul etme veya reddetme konusunda size
          kontrol sağlar. Tarayıcınızın ayarlar menüsünden çerezleri silebilir
          veya engelleyebilirsiniz. Ancak bazı çerezleri engellemeniz durumunda
          sitenin bazı bölümleri düzgün çalışmayabilir.
        </p>
        <p>
          Google&apos;ın reklam çerezleri hakkında tercihlerinizi yönetmek için{" "}
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Reklam Ayarları
          </a>{" "}
          sayfasını ziyaret edebilirsiniz.
        </p>

        <h2>Daha Fazla Bilgi</h2>
        <p>
          Verilerinizin nasıl işlendiği hakkında daha fazla bilgi için{" "}
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link> sayfamızı
          inceleyebilirsiniz.
        </p>
      </div>
    </div>
  );
}
