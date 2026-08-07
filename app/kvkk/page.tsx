import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | YükseltPC",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında YükseltPC aydınlatma metni.",
  alternates: { canonical: absoluteUrl("/kvkk") },
};

export default function KvkkPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "KVKK Aydınlatma Metni" }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        KVKK Aydınlatma Metni
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Son güncelleme: 2026-08-08
      </p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu
          (&quot;KVKK&quot;) uyarınca, YükseltPC tarafından işlenen kişisel
          verileriniz hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
        </p>

        <h2>Veri Sorumlusu</h2>
        <p>
          Kişisel verileriniz, veri sorumlusu sıfatıyla YükseltPC tarafından
          aşağıda açıklanan kapsamda işlenmektedir.
        </p>

        <h2>İşlenen Kişisel Veriler</h2>
        <ul>
          <li>
            İletişim sayfası veya e-posta yoluyla bizimle iletişime geçtiğinizde
            paylaştığınız ad, e-posta adresi ve mesaj içeriği.
          </li>
          <li>
            Google Analytics aracılığıyla toplanan anonimleştirilmiş kullanım
            verileri (IP adresinden türetilen yaklaşık konum, cihaz/tarayıcı
            bilgisi, ziyaret edilen sayfalar) —{" "}
            <strong>
              yalnızca çerez onay bandında &quot;Kabul Et&quot; seçtiğinizde
            </strong>{" "}
            toplanmaya başlar; onay vermediğiniz sürece bu veriler hiç işlenmez.
          </li>
        </ul>

        <h2>Kişisel Verilerin İşlenme Amacı</h2>
        <p>Toplanan kişisel veriler aşağıdaki amaçlarla işlenmektedir:</p>
        <ul>
          <li>Bize ulaşan taleplere yanıt verilmesi.</li>
          <li>
            Site kullanımının analiz edilerek hizmet kalitesinin artırılması.
          </li>
          <li>
            Google AdSense aracılığıyla ilgi alanına dayalı reklam gösterilmesi.
          </li>
        </ul>

        <h2>Kişisel Verilerin Aktarılması</h2>
        <p>
          Kişisel verileriniz, yukarıda belirtilen amaçlarla sınırlı olarak
          Google Analytics ve Google AdSense gibi hizmet sağlayıcılarla,
          yalnızca hizmetin gerektirdiği ölçüde paylaşılabilir.
        </p>

        <h2>Veri Sahibinin Hakları</h2>
        <p>KVKK&apos;nın 11. maddesi uyarınca, kişisel veri sahibi olarak:</p>
        <ul>
          <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>
            İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
            öğrenme,
          </li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
          <li>
            KVKK&apos;da öngörülen şartlar çerçevesinde silinmesini veya yok
            edilmesini isteme,
          </li>
          <li>
            İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi
            nedeniyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,
          </li>
          <li>
            Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın
            giderilmesini talep etme haklarına sahipsiniz.
          </li>
        </ul>

        <h2>Başvuru Yöntemi</h2>
        <p>
          Yukarıda sayılan haklarınıza ilişkin taleplerinizi{" "}
          <Link href="/iletisim">iletişim sayfamızda</Link> yer alan e-posta
          adresi üzerinden bize iletebilirsiniz.
        </p>
      </div>
    </div>
  );
}
