# YükseltPC — SEO Araştırma Raporu

**Tarih:** 2026-08-06
**Kapsam:** Rakip analizi, Türkçe long-tail anahtar kelime araştırması, içerik-sorgu eşleştirmesi, rehber/blog başlık önerileri, teknik SEO kontrol listesi.
**Not:** Bu aşamada kod yazılmamıştır — bu doküman sadece araştırma/planlama çıktısıdır.

---

## 1. Rakip / Emsal Site Analizi

### 1.1 PCPartPicker (global, İngilizce)

- **Öne çıktığı sorgular:** "pc build compatibility checker", "[CPU] vs [CPU] build", "part list [bütçe]", "is [GPU] compatible with [case]" gibi İngilizce sorgularda çok güçlü. Türkiye'de teknik kullanıcılar tarafından biliniyor ama Türkçe aramalarda neredeyse hiç görünmüyor — bu YükseltPC için doğrudan bir **dil boşluğu** fırsatı.
- **URL yapısı:** Kategori bazlı ve son derece düz/okunabilir (`/products/video-card`, `/product/[id]/[slug]`, `/list/[id]` gibi build listeleri için kısa hash tabanlı ID'ler). SEO dostu ama build sayfaları kullanıcı tarafından üretildiği için indekslenebilirlik sınırlı tutuluyor.
- **İçerik formatları:** (a) Ürün veritabanı sayfaları (spec tablosu + fiyat karşılaştırma), (b) kullanıcı "build" listeleri (paylaşılabilir, uyumluluk otomatik kontrol ediliyor), (c) dahili bir uyumluluk motoru (soket, RAM tipi, PSU yeterliliği, kasa-GPU ölçüsü) — YükseltPC'nin FAZ 3 uyumluluk motoruyla doğrudan örtüşüyor.
- **YükseltPC için çıkarım:** PCPartPicker'ın motorunu değil, **Türkçe dil ve yerel bağlamı** (TL fiyat aralığı, Türkiye'de satıcı linkleri, KDV'li fiyat algısı) kopyalamak asıl fark yaratacak alan.

### 1.2 Technopat Sosyal (Donanım forumu)

- **Öne çıktığı sorgular:** "[parça A] [parça B] uyumlu mu", "hangi donanımların birbirine uyumlu olduğunu anlamak", "toplama bilgisayarda parçaların uyumluluğu" gibi doğal dilde yazılmış, forum-üslubu sorgular. Bu tür sorgularda Google'da çoğunlukla forum konu sayfaları (yıllarca eski olsa bile) üst sıralarda çıkıyor.
- **URL yapısı:** `technopat.net/sosyal/konu/[slug].[numeric-id]/` deseni — slug SEO dostu (Türkçe karakterler sadeleştirilmiş, tire ile ayrılmış) ama numeric ID zorunlu sonek olarak ekleniyor. Forum yazılımının (XenForo) standart yapısı.
- **İçerik formatları:** Soru-cevap tarzı forum konuları, uzun tartışma zincirleri (çok sayıda yanıt = çok sayıda anahtar kelime varyasyonu doğal olarak sayfaya giriyor), etiket sayfaları (`/sosyal/etiket/uyumlu-donanim/`).
- **Zayıf yönü:** Cevaplar dağınık, çelişkili olabiliyor, güncel olmayan bilgiler üstte kalabiliyor, yapılandırılmış veri (schema) yok, mobilde okunabilirlik düşük.
- **YükseltPC için çıkarım:** Forumların kazandığı "doğal dil sorgusu" alanını **net, tek-cevaplı, güncel ve yapılandırılmış** bir sayfa formatıyla (uyumluluk aracı + kısa açıklama + FAQ schema) yakalamak mümkün — forum içeriği kalabalık ve güvenilirlik sinyali zayıf, YükseltPC "kesin cevap" konumlanmasıyla rekabet edebilir.

### 1.3 Donanım Haber Forum (ve türevleri: Donanım Arşivi, PC Hocası)

- **Öne çıktığı sorgular:** Technopat ile büyük ölçüde örtüşüyor ("anakart işlemci uyumu", "anakart ve işlemci uyumluluğu nasıl belirlenir", "çözüldü ✓" etiketli konular). "Çözüldü" ibaresi kullanıcı güvenini artıran bir sinyal olarak öne çıkıyor.
- **URL yapısı:** `forum.donanimhaber.com/[kategori]--f[id]` (kategori) ve `forum.donanimarsivi.com/konu/[slug].[id]/` (konu) — benzer forum-slug deseni.
- **İçerik formatları:** Kategori forumları (örn. "Dahili Bileşenler"), tekil soru-cevap konuları, çok sayfalı tartışmalar (`page-2`, `page-3`).
- **YükseltPC için çıkarım:** "Çözüldü" hissiyatını taklit eden net bir UX (yeşil tik / kırmızı çarpı görsel geri bildirimi zaten FAZ 3'te planlanmış) SEO'da da güven sinyali olarak işlenebilir — sayfa başlığında "✓ Uyumlu mu?" gibi ifadeler CTR'yi artırabilir.

### 1.4 Akakçe

- **Öne çıktığı sorgular:** "[ürün adı] fiyat", "en ucuz [ürün]", markaya göre filtrelenmiş kategori sorguları ("nvidia ekran kartı fiyatları").
- **URL yapısı:** Çok temiz hiyerarşi: `akakce.com/ekran-karti.html` (ana kategori) → `akakce.com/ekran-karti/nvidia-ekran-karti.html` (marka alt kategorisi) → ürün sayfası. Ayrıca ayrı bir karşılaştırma aracı: `akakce.com/ekran-karti-karsilastirma/`.
- **İçerik formatları:** Fiyat listeleme + geçmiş fiyat grafiği + karşılaştırma aracı. Uyumluluk veya "hangi anakartla gider" gibi bağlamsal bilgi **yok** — saf fiyat karşılaştırma.
- **YükseltPC için çıkarım:** Akakçe fiyat sorgularında güçlü ama "bu parça diğerleriyle uyumlu mu / ne alınmalı" sorularına cevap vermiyor — YükseltPC'nin asıl konumlanması (rehberlik + uyumluluk) burada net bir boşluk dolduruyor. URL hiyerarşi deseni (`kategori.html` → `kategori/marka.html`) YükseltPC'nin kategori/filtre sayfalarına doğrudan örnek teşkil edebilir.

### 1.5 Cimri

- **Öne çıktığı sorgular:** Akakçe'ye benzer şekilde fiyat karşılaştırma + "kampanya", "indirim", "en ucuz" sorguları; ayrıca ürün yorumu/puanlama odaklı sorgularda da görünürlüğü var.
- **URL yapısı ve içerik:** Doğrudan platforma özgü teknik veri bulunamadı; genel e-ticaret kategori SEO pratiği (kısa/anlamlı URL, kategori açıklama metni, hiyerarşik breadcrumb) geçerli varsayılabilir.
- **YükseltPC için çıkarım:** Cimri de Akakçe gibi salt fiyat/yorum odaklı — uyumluluk ve rehberlik içeriği YükseltPC'nin farklılaşma alanı olarak doğrulanıyor.

### 1.6 Rakip Analizi — Genel Sonuç

| Site                                | Güçlü Olduğu Alan                               | Zayıf/Eksik Olduğu Alan                           | YükseltPC Fırsatı                           |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------------------- | ------------------------------------------- |
| PCPartPicker                        | Uyumluluk motoru, build paylaşımı               | Türkçe içerik yok                                 | Türkçe + TL fiyat + yerel satıcı            |
| Technopat / Donanım Haber forumları | Doğal dil "uyumlu mu" sorguları, uzun kuyruk    | Dağınık, güncelliğini yitirmiş, yapılandırılmamış | Net/tek-cevap, güncel, schema'lı sayfa      |
| Akakçe / Cimri                      | Fiyat karşılaştırma, marka/kategori hiyerarşisi | Uyumluluk ve rehberlik yok                        | Uyumluluk + rehber + fiyat aralığı birlikte |

---

## 2. Türkçe Long-Tail Anahtar Kelime Listesi

İlgi seviyesi (**Yüksek / Orta / Düşük**) kesin arama hacmi verisine değil, sorgu kalıbının forum/genel arama davranışındaki yaygınlığına dayalı göreceli bir tahmindir — gerçek hacimler Google Search Console / Keyword Planner ile FAZ 7'de doğrulanmalı.

### 2.1 Uyumluluk Soruları

| #   | Sorgu                                                | İlgi   |
| --- | ---------------------------------------------------- | ------ |
| 1   | ryzen 5 5600 hangi anakartla gider                   | Yüksek |
| 2   | i5 13400f hangi anakart ile uyumlu                   | Yüksek |
| 3   | am4 soket hangi işlemciler                           | Orta   |
| 4   | am5 anakart ddr4 destekler mi                        | Orta   |
| 5   | ddr4 mü ddr5 mi almalıyım                            | Yüksek |
| 6   | ddr5 ram eski anakartta çalışır mı                   | Orta   |
| 7   | rtx 4060 hangi kasaya sığar                          | Orta   |
| 8   | ekran kartı kasaya sığmıyor ne yapmalıyım            | Orta   |
| 9   | b550 anakart hangi işlemciler ile uyumlu             | Yüksek |
| 10  | işlemci soket uyumluluğu nasıl anlaşılır             | Yüksek |
| 11  | anakart ile işlemci uyumlu mu nereden anlarım        | Yüksek |
| 12  | psu kaç watt olmalı hesaplama                        | Yüksek |
| 13  | 550w güç kaynağı rtx 4060 için yeterli mi            | Orta   |
| 14  | soğutucu hangi soketlerle uyumlu                     | Düşük  |
| 15  | am4 soğutucu am5'te kullanılır mı                    | Orta   |
| 16  | ram anakart ile uyumlu mu nasıl anlarım              | Yüksek |
| 17  | eski bilgisayara yeni ekran kartı takılır mı         | Orta   |
| 18  | matx anakart atx kasaya sığar mı                     | Düşük  |
| 19  | pcie 4.0 anakart pcie 3.0 ekran kartı ile çalışır mı | Düşük  |
| 20  | intel 13. nesil hangi anakartlarla uyumlu            | Orta   |

### 2.2 Karşılaştırma Sorguları

| #   | Sorgu                                         | İlgi   |
| --- | --------------------------------------------- | ------ |
| 1   | ryzen 5 5600 mi i5 13400f mi                  | Yüksek |
| 2   | rtx 4060 mu rx 7600 mu daha iyi               | Yüksek |
| 3   | ddr4 3200 mü 3600 mü fark yaratır mı          | Orta   |
| 4   | ssd mi hdd mi almalıyım                       | Yüksek |
| 5   | nvme mi sata ssd mi daha hızlı                | Orta   |
| 6   | hava soğutmalı mı sıvı soğutmalı mı           | Orta   |
| 7   | 6 çekirdek mi 8 çekirdek mi oyun için yeterli | Orta   |
| 8   | intel mi amd mi 2026                          | Yüksek |
| 9   | 16gb mi 32gb ram mi yeterli                   | Yüksek |
| 10  | tek kanal mı çift kanal ram mı daha iyi       | Orta   |
| 11  | b550 mi b650 mi anakart                       | Orta   |
| 12  | modüler mi modüler olmayan psu mu             | Düşük  |
| 13  | 80+ bronze mu gold mu fark eder mi            | Düşük  |
| 14  | atx mi matx mi kasa                           | Düşük  |
| 15  | entegre ekran kartı mı harici mi yeterli      | Orta   |
| 16  | rtx 4060 mu 4060 ti mi mantıklı               | Orta   |
| 17  | ryzen 7 mi ryzen 5 mi oyun performansı        | Orta   |
| 18  | 1tb mi 2tb ssd mi almalı                      | Düşük  |
| 19  | yeni nesil mi eski nesil güçlü işlemci mi     | Düşük  |
| 20  | sıfır mı 2. el mi ekran kartı almalı          | Yüksek |

### 2.3 Bütçe / Rehber Sorguları

| #   | Sorgu                                              | İlgi   |
| --- | -------------------------------------------------- | ------ |
| 1   | 5000 tl ekran kartı önerisi                        | Yüksek |
| 2   | 10000 tl işlemci anakart seti                      | Orta   |
| 3   | bilgisayar yükseltme rehberi 2026                  | Yüksek |
| 4   | 15000 tl ile bilgisayar toplama                    | Yüksek |
| 5   | dar bütçeyle oyun bilgisayarı yükseltme            | Orta   |
| 6   | öğrenci bütçesine uygun bilgisayar parçaları       | Orta   |
| 7   | 2026 en iyi fiyat performans ekran kartı           | Yüksek |
| 8   | hangi parçayı önce yükseltmeliyim                  | Yüksek |
| 9   | eski bilgisayarı hızlandırma rehberi               | Yüksek |
| 10  | 3000 tl ram önerisi                                | Orta   |
| 11  | bütçeye göre işlemci önerisi 2026                  | Orta   |
| 12  | az bütçeyle fps artırma                            | Orta   |
| 13  | ofis bilgisayarı için hangi parçalar yeterli       | Düşük  |
| 14  | video montaj için bilgisayar yükseltme             | Orta   |
| 15  | oyun bilgisayarı yükseltme sırası nasıl olmalı     | Yüksek |
| 16  | 20000 tl toplama bilgisayar önerisi                | Orta   |
| 17  | ikinci el parçalarla bütçe dostu yükseltme         | Orta   |
| 18  | hangi parça performansı en çok etkiler             | Yüksek |
| 19  | minimum bütçeyle darboğazsız sistem                | Düşük  |
| 20  | yeni başlayanlar için bilgisayar yükseltme rehberi | Yüksek |

### 2.4 Sorun Giderme Sorguları

| #   | Sorgu                                          | İlgi   |
| --- | ---------------------------------------------- | ------ |
| 1   | bilgisayarım yavaş neden                       | Yüksek |
| 2   | hangi parça bozuk anlarım                      | Orta   |
| 3   | bilgisayar oyunda donuyor neden                | Yüksek |
| 4   | ram yetersiz mi nasıl anlarım                  | Orta   |
| 5   | ekran kartı arızalı belirtileri                | Orta   |
| 6   | işlemci darboğaz yapıyor mu nasıl anlarım      | Yüksek |
| 7   | bilgisayar açılmıyor hangi parça sorumlu       | Orta   |
| 8   | psu arızası belirtileri                        | Düşük  |
| 9   | anakart arızası nasıl anlaşılır                | Düşük  |
| 10  | bilgisayar aşırı ısınıyor ne yapmalıyım        | Yüksek |
| 11  | mavi ekran hatası hangi donanımdan kaynaklanır | Orta   |
| 12  | fps düşüklüğü hangi parçadan kaynaklanır       | Yüksek |
| 13  | ram arızası test etme                          | Düşük  |
| 14  | bilgisayar kendi kendine kapanıyor neden       | Orta   |
| 15  | ssd mi ram mi yavaşlığın sebebi                | Orta   |
| 16  | disk kullanımı yüzde 100 neden                 | Orta   |
| 17  | oyun açılırken donanım yetersiz hatası         | Orta   |
| 18  | eski işlemci yeni oyunları kaldırır mı         | Orta   |
| 19  | bilgisayar sesi çok yüksek geliyor neden       | Düşük  |
| 20  | güç kaynağı yetersiz kalırsa ne olur           | Orta   |

---

## 3. Anahtar Kelime → Sayfa/İçerik Tipi Eşleştirmesi

| Sorgu Grubu                                                              | Önerilen İçerik Tipi                                                                                                             | Açıklama                                                                                                                                                                                                  |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "X ile Y uyumlu mu" (örn. #1, #9, #11 uyumluluk)                         | **Ürün detay sayfası** içindeki "Uyumlu Olduğu Diğer Bileşenler" bölümü + **Uyumluluk Aracı** (`/uyumluluk-araci`) sonuç sayfası | Kullanıcı doğrudan iki ürünü seçip cevap alabilmeli; ürün sayfasında da statik bir "bu CPU şu anakartlarla uyumlu" listesi SEO için ayrıca gerekli (aracın JS'e bağımlı olmayan bir server-render özeti). |
| "ddr4 mü ddr5 mi", genel format/tip soruları                             | **Rehber/blog yazısı** (`/rehber/ddr4-mi-ddr5-mi`)                                                                               | Karar verme rehberi formatında, karşılaştırma tablosu + SSS içermeli.                                                                                                                                     |
| "psu kaç watt olmalı hesaplama"                                          | **PSU Hesaplayıcı** sayfası (`/guc-hesaplayici`)                                                                                 | Araç sayfası; sonuç metni de statik/indekslenebilir olmalı.                                                                                                                                               |
| "X mi Y mi daha iyi / hangisi daha performanslı" (2.2)                   | **Ürün karşılaştırma sayfası** (`/karsilastirma/[urun-a]-vs-[urun-b]`)                                                           | İki ürünü yan yana spec tablosu + kullanım senaryosuna göre öneri metni ile karşılaştıran özel sayfa; en yüksek ilgili çiftler için önceliklendirilmeli.                                                  |
| "sıfır mı 2. el mi almalı"                                               | **Rehber yazısı** (genel) + her ürün sayfasında sıfır/2.el fiyat aralığı bloğu                                                   | Genel karar rehberi + ürün bazlı fiyat karşılaştırması birlikte çalışmalı.                                                                                                                                |
| "5000 TL ekran kartı önerisi", bütçe sorguları (2.3)                     | **Bütçeye göre rehber yazıları** (`/rehber/5000-tl-ekran-karti-onerisi-2026`)                                                    | Bütçe aralığına özel, periyodik güncellenmesi gereken "top N öneri" formatı.                                                                                                                              |
| "bilgisayar yükseltme rehberi 2026", "hangi parçayı önce yükseltmeliyim" | **Genel rehber + Yükseltme Önerisi aracı** (FAZ 3, madde 63) sonucu                                                              | Hem statik rehber içeriği hem de kullanıcının kendi sistemini girip öneri aldığı dinamik araç birbirini desteklemeli.                                                                                     |
| "bilgisayarım yavaş neden", "hangi parça bozuk anlarım" (2.4)            | **Sorun giderme rehber serisi** (`/rehber/bilgisayar-neden-yavas`)                                                               | SSS formatında, kategori bazlı alt başlıklar (RAM, disk, ısınma, GPU) içeren uzun-format rehber; FAQPage schema ile işaretlenmeli.                                                                        |
| "fps düşüklüğü hangi parçadan kaynaklanır", "darboğaz" soruları          | **Darboğaz (bottleneck) rehberi** + Uyumluluk Aracı'ndaki darboğaz uyarı mantığı (FAZ 2, madde 52)                               | Rehber, aracın ürettiği uyarı mantığını insan diliyle açıklayan destekleyici içerik olmalı.                                                                                                               |
| Marka/model bazlı genel sorgular (örn. "ryzen 5 5600 fiyat")             | **Kategori/ürün listeleme sayfaları** (`/islemci`, filtreli)                                                                     | Akakçe tarzı marka/kategori hiyerarşisi (`/islemci/amd`, `/islemci/intel`) SEO'da geniş kapsama sağlar.                                                                                                   |

---

## 4. İlk 15–20 Rehber/Blog Yazısı Önerisi

Her satır: **Başlık (SEO title)** — Açıklama — Hedef anahtar kelime.

1. **"DDR4 mü DDR5 mi? Anakartınıza Göre Doğru RAM Seçimi"** — DDR4/DDR5 farkları, fiyat-performans karşılaştırması ve hangi anakartların hangi tipi desteklediğine dair karar rehberi. — _ddr4 mü ddr5 mi almalıyım_
2. **"İşlemci-Anakart Uyumluluğu Nasıl Anlaşılır? Soket Rehberi"** — AM4/AM5/LGA soketlerinin görsel anlatımı, en sık yapılan uyumsuzluk hataları. — _işlemci soket uyumluluğu nasıl anlaşılır_
3. **"Güç Kaynağı (PSU) Kaç Watt Olmalı? Hesaplama Rehberi"** — Bileşen bazlı ortalama tüketim tablosu, tampon payı mantığı, hesaplayıcı aracına yönlendirme. — _psu kaç watt olmalı hesaplama_
4. **"2026'da 5.000 TL'ye En İyi Fiyat/Performans Ekran Kartları"** — Bütçe segmentine göre güncel öneri listesi, sıfır/2.el karşılaştırması. — _5000 tl ekran kartı önerisi_
5. **"Sıfır mı 2. El mi Almalı? Bilgisayar Parçası Alırken Karar Rehberi"** — Risk/getiri karşılaştırması, hangi parçalarda 2.el mantıklı hangilerinde değil. — _sıfır mı 2. el mi almalı_
6. **"Bilgisayarım Neden Yavaş? 8 Olası Sebep ve Çözümü"** — RAM, disk, ısınma, arka plan yazılımları, GPU darboğazı gibi kategorilere ayrılmış SSS formatlı rehber. — _bilgisayarım yavaş neden_
7. **"Hangi Parçayı Önce Yükseltmeliyim? Öncelik Sıralaması Rehberi"** — Oyun/ofis/üretim senaryolarına göre yükseltme önceliği mantığı, öneri aracına bağlantı. — _hangi parçayı önce yükseltmeliyim_
8. **"RTX 4060 mı RX 7600 mı? Detaylı Karşılaştırma"** — Fiyat, performans, güç tüketimi ve VRAM karşılaştırması. — _rtx 4060 mu rx 7600 mu_
9. **"Ryzen 5 5600 mü Intel i5-13400F mü? Hangisi Daha Mantıklı?"** — Platform maliyeti (anakart+RAM dahil), performans ve gelecek yükseltme potansiyeli açısından karşılaştırma. — _ryzen 5 5600 mi i5 13400f mi_
10. **"Darboğaz (Bottleneck) Nedir? İşlemci-Ekran Kartı Dengesi Nasıl Kurulur"** — Darboğaz kavramının sade anlatımı, yaygın yanlış eşleştirme örnekleri. — _işlemci darboğaz yapıyor mu nasıl anlarım_
11. **"Ekran Kartı Kasaya Sığar mı? Ölçü ve Uyumluluk Rehberi"** — GPU uzunluğu, kasa iç ölçüleri, kaynaklara nasıl bakılır. — _ekran kartı kasaya sığmıyor ne yapmalıyım_
12. **"16GB mi 32GB RAM mi? İhtiyacınıza Göre Kapasite Rehberi"** — Kullanım senaryosuna (oyun/ofis/video düzenleme) göre RAM kapasite önerisi. — _16gb mi 32gb ram mi yeterli_
13. **"Hava mı Sıvı mı Soğutma? İşlemci Soğutucu Seçim Rehberi"** — TDP'ye göre soğutucu seçimi, gürültü/performans dengesi. — _hava soğutmalı mı sıvı soğutmalı mı_
14. **"2026 Bilgisayar Yükseltme Rehberi: Nereden Başlamalı?"** — Kapsamlı giriş rehberi, sitenin tüm araçlarına (uyumluluk, PSU hesaplayıcı, öneri) yönlendiren bir hub sayfası niteliğinde. — _bilgisayar yükseltme rehberi 2026_
15. **"SSD mi HDD mi? Depolama Yükseltmesi Rehberi"** — NVMe/SATA SSD ve HDD farkları, hangi kullanım için hangisi mantıklı. — _ssd mi hdd mi almalıyım_
16. **"Eski Bilgisayara Yeni Ekran Kartı Takılır mı? Kontrol Listesi"** — PSU yeterliliği, PCIe versiyonu, kasa ölçüsü gibi kontrol adımları. — _eski bilgisayara yeni ekran kartı takılır mı_
17. **"Bilgisayar Neden Aşırı Isınıyor? Nedenleri ve Çözümleri"** — Toz, termal macun, fan yapılandırması, soğutucu yetersizliği gibi başlıklar. — _bilgisayar aşırı ısınıyor ne yapmalıyım_
18. **"20.000 TL Bütçeyle 2026'da Toplama Bilgisayar Önerisi"** — Tam sistem önerisi (CPU+anakart+RAM+GPU+PSU+kasa), uyumluluk aracıyla doğrulanmış set. — _20000 tl toplama bilgisayar önerisi_
19. **"Modüler mi Modüler Olmayan PSU mu? Güç Kaynağı Seçim Rehberi"** — Kablo yönetimi, fiyat farkı, kimin için mantıklı olduğu. — _modüler mi modüler olmayan psu mu_
20. **"Öğrenci Bütçesiyle Bilgisayar Yükseltme: Adım Adım Rehber"** — Düşük bütçeyle en çok fark yaratacak yükseltimlerin sıralanması. — _öğrenci bütçesine uygun bilgisayar parçaları_

---

## 5. Teknik SEO Kontrol Listesi

### 5.1 Structured Data (Schema.org) — Sayfa Tipine Göre Kullanım

| Sayfa Tipi                                                                           | Schema                                                                                          | Notlar                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ürün detay sayfası (`/islemci/[slug]` vb.)                                           | `Product` (+ `Offer` fiyat aralığı için `PriceSpecification` veya `AggregateOffer` min/max ile) | Gerçek zamanlı fiyat olmadığı için `Offer.price` yerine "makul aralık" `AggregateOffer.lowPrice`/`highPrice` kullanılmalı; `availability` alanı yanıltıcı olmasın diye eklenmemeli veya `PreOrder`/genel bilgi notuyla sınırlı tutulmalı. |
| Rehber/blog yazıları (`/rehber/[slug]`)                                              | `Article` veya `BlogPosting` + sayfa içinde SSS varsa ek olarak `FAQPage`                       | `datePublished`/`dateModified` düzenli güncellenmeli (Google tazelik sinyali için önemli).                                                                                                                                                |
| SSS içeren tüm sayfalar (rehberler, uyumluluk aracı sonucu, ürün sayfası alt bölümü) | `FAQPage`                                                                                       | Yalnızca sayfada görünür şekilde yer alan sorular işaretlenmeli (gizli/aldatıcı SSS schema kullanımı Google politikalarına aykırı).                                                                                                       |
| Tüm iç sayfalar (kategori, ürün, rehber, araç sayfaları)                             | `BreadcrumbList`                                                                                | Site hiyerarşisini yansıtmalı: Ana Sayfa > Kategori > Alt Kategori > Ürün/Yazı.                                                                                                                                                           |
| Kategori listeleme sayfaları (`/islemci`, `/ekran-karti` vb.)                        | `ItemList` (opsiyonel, ürünleri sıralı listelemek için)                                         | Zorunlu değil ama büyük kategori sayfalarında faydalı olabilir.                                                                                                                                                                           |
| Karşılaştırma sayfaları (`/karsilastirma/x-vs-y`)                                    | `Product` (her iki ürün için ayrı ayrı) + `BreadcrumbList`                                      | `Article` olarak da işaretlenebilir çünkü karşılaştırma metni editoryal içerik taşıyor.                                                                                                                                                   |
| Ana sayfa                                                                            | `WebSite` (+ `SearchAction` site içi arama varsa)                                               | Sitelinks arama kutusu için faydalı.                                                                                                                                                                                                      |
| Hakkımızda/İletişim                                                                  | `Organization`                                                                                  | Marka güven sinyali; logo, iletişim bilgisi içermeli.                                                                                                                                                                                     |

**Genel kural:** Schema'da beyan edilen her bilgi sayfada görsel olarak da mevcut olmalı (Google'ın "structured data görünür içerikle eşleşmeli" kuralı) — özellikle fiyat aralığı ve SSS için.

### 5.2 Meta Title / Description Şablonları

| Sayfa Tipi         | Title Şablonu                                                | Description Şablonu                                                                                                                                  |
| ------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ürün detay         | `{Ürün Adı} — Uyumluluk, Fiyat ve Özellikler \| YükseltPC`   | `{Ürün Adı} teknik özellikleri, hangi {kategori karşı parça} ile uyumlu olduğu ve güncel sıfır/2.el fiyat aralığı. Uyumluluk aracıyla kontrol edin.` |
| Kategori listeleme | `{Kategori Adı} Modelleri ve Uyumluluk Rehberi \| YükseltPC` | `{Kategori Adı} seçeneklerini karşılaştırın, uyumluluk bilgilerine ve fiyat aralıklarına göz atın.`                                                  |
| Karşılaştırma      | `{Ürün A} mi {Ürün B} mi? Karşılaştırma \| YükseltPC`        | `{Ürün A} ve {Ürün B} özellik, performans ve fiyat açısından karşılaştırıldı. Hangisi size uygun, hemen öğrenin.`                                    |
| Rehber/blog        | `{Başlık} — Rehber \| YükseltPC` (60 karakteri aşmamalı)     | `{Yazının 1-2 cümlelik özeti, hedef anahtar kelimeyi doğal şekilde içeren}` (150-160 karakter)                                                       |
| Uyumluluk Aracı    | `Bilgisayar Parça Uyumluluk Kontrolü \| YükseltPC`           | `İşlemci, anakart, RAM, ekran kartı ve güç kaynağınızın uyumlu olup olmadığını saniyeler içinde ücretsiz kontrol edin.`                              |
| PSU Hesaplayıcı    | `Güç Kaynağı (PSU) Watt Hesaplama Aracı \| YükseltPC`        | `Sisteminiz için gereken minimum güç kaynağı gücünü CPU ve GPU'nuza göre hesaplayın.`                                                                |
| Ana sayfa          | `YükseltPC — Bilgisayarınızı Bilinçli Şekilde Yükseltin`     | `Hangi parça hangisiyle uyumlu, ne almalısınız? Uyumluluk aracı, rehberler ve güncel fiyat aralıklarıyla YükseltPC yanınızda.`                       |

**Kurallar:**

- Title etiketleri 50–60 karakter arasında tutulmalı (kesilmeyi önlemek için).
- Description 150–160 karakter arasında, tıklamayı teşvik edici ama tıklama tuzağı (clickbait) olmayan dilde yazılmalı.
- Her ürün/kategori/rehber sayfasının title'ı ve description'ı **benzersiz** olmalı — şablon aynı olsa da değişkenler (ürün adı, kategori) her sayfada farklılaşmalı, kopya içerik riskine karşı.
- Marka adı ("| YükseltPC") sona eklenerek marka bilinirliği desteklenmeli, ancak title'ın anlamlı kısmı (anahtar kelime içeren kısım) başta yer almalı.

### 5.3 Diğer Teknik SEO Kontrol Noktaları

- **Canonical URL:** Filtreli/parametreli kategori sayfalarında (örn. `?marka=amd&fiyat=0-5000`) canonical, filtresiz ana kategori sayfasına veya (filtre kalıcı bir segment ise) kendi temiz URL'sine işaret etmeli — indeks şişmesini önlemek için.
- **İç linkleme:** Her ürün sayfası → ilgili rehber yazıları, ilgili ürünler, uyumluluk aracı sonucu birbirine bağlanmalı (PageRank akışı ve kullanıcı yolculuğu için).
- **Breadcrumb (görsel + schema):** Tüm sayfalarda tutarlı, `Ana Sayfa > Kategori > Ürün` hiyerarşisiyle.
- **Sayfa hızı / Core Web Vitals:** Ürün görselleri lazy-load, statik/SSG sayfalar (Next.js App Router ile zaten planlanmış), gereksiz JS bundle'ından kaçınılmalı.
- **Mobil uyumluluk:** Google mobile-first indexleme yaptığı için tüm test ve denetimler mobil görünümde önceliklendirilmeli.
- **URL yapısı:** Türkçe karakterler sadeleştirilmiş (ı→i, ş→s, ğ→g vb.), tire ile ayrılmış, kısa ve tahmin edilebilir slug'lar (`/islemci/amd-ryzen-5-5600` gibi — FAZ 2'de zaten bu şekilde tasarlandı).
- **Alt metinler:** Ürün görselleri ve rehber görselleri için açıklayıcı, anahtar kelime içeren ama doğal alt metinler.
- **Sitemap/robots:** next-sitemap ile otomatik üretim zaten kurulu (FAZ 1); yeni sayfa tipleri (karşılaştırma, rehber) eklendikçe sitemap'in bunları otomatik yakaladığından emin olunmalı.
- **Hreflang:** Gerekmiyor (tek dil, tek bölge — Türkiye/Türkçe).

---

## Özet ve Öncelik Sırası

1. **En büyük fırsat:** Forumların ("uyumlu mu", "hangisi daha iyi") ve fiyat sitelerinin (Akakçe/Cimri) kapsamadığı **"uyumluluk + rehberlik + fiyat aralığı" üçlüsünü tek sayfada birleştirmek** — bu, YükseltPC'nin net konumlanması.
2. **İçerik önceliği:** Uyumluluk soruları ve bütçe/rehber sorguları en yüksek ilgi seviyesinde işaretlendi — FAZ 5/7'de sayfa üretimi bu iki gruba öncelik vermeli.
3. **Teknik altyapı:** `Product` + `FAQPage` + `BreadcrumbList` schema üçlüsü ve tutarlı title/description şablonları, ürün ve rehber sayfaları canlıya alınırken baştan uygulanmalı (sonradan eklemek yerine).
4. **Doğrulama ihtiyacı:** Bu rapordaki arama ilgisi etiketleri (Yüksek/Orta/Düşük) tahminidir; Search Console ve Keyword Planner verisiyle FAZ 7'de gerçek hacimlerle çapraz kontrol edilmeli.
