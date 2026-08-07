import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, buildOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hakkımızda | YükseltPC",
  description:
    "YükseltPC, bilgisayarını bilinçli şekilde yükseltmek isteyenler için uyumluluk kontrolü ve rehberlik sunar.",
  alternates: { canonical: absoluteUrl("/hakkimizda") },
};

export default function HakkimizdaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={buildOrganizationSchema()} />
      <Breadcrumb items={[{ label: "Hakkımızda" }]} />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Hakkımızda</h1>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          YükseltPC, elindeki bilgisayarı parça parça, bilinçli şekilde
          yükseltmek isteyen kullanıcılara yardımcı olmak için kuruldu.
          Amacımız; hangi bileşenin hangisiyle uyumlu olduğunu, ne almanız
          gerektiğini ve sıfır ya da 2.el seçeneklerini nereden
          araştırabileceğinizi tek bir yerde, sade bir şekilde sunmak.
        </p>

        <h2>Neden YükseltPC?</h2>
        <p>
          Bilgisayar parçası yükseltmek, doğru bilgiye sahip olmadan karmaşık ve
          riskli bir süreç olabilir. Forumlarda dağınık bilgiler arasında doğru
          cevabı bulmak zaman alır. YükseltPC, uyumluluk kontrolünü ve temel
          yükseltme rehberliğini tek bir araçta birleştirerek bu süreci
          kolaylaştırmayı hedefler.
        </p>

        <h2>Neler Sunuyoruz?</h2>
        <ul>
          <li>
            Bileşenler arası uyumluluğu anında kontrol eden{" "}
            <Link href="/uyumluluk-araci">uyumluluk aracı</Link>.
          </li>
          <li>
            Kategori bazlı ürün sayfaları ve teknik özellik karşılaştırmaları.
          </li>
          <li>Sıfır ve 2.el satıcı arama linkleri.</li>
          <li>Yükseltme kararlarınıza yardımcı olacak rehber yazıları.</li>
        </ul>

        <h2>Gelir Modeli</h2>
        <p>
          YükseltPC şu anda yalnızca reklam (Google AdSense) gelirine
          dayanmaktadır. İçerik ve öneriler, herhangi bir satıcıdan komisyon
          almadan hazırlanmaktadır.
        </p>
      </div>
    </div>
  );
}
