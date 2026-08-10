# YükseltPC Katalog Ölçekleme Araştırması

**Tarih:** 2026-08-08
**Kapsam:** Mevcut 116 ürünlük JSON tabanlı kataloğu binlerce ürüne taşıma seçeneklerinin araştırılması
**Not:** Bu bir araştırma/karar raporudur — kod değişikliği içermez.

---

## 0. Yönetici Özeti

Araştırmanın en önemli üç bulgusu:

1. **Türkiye e-ticaret sitelerinin resmi API'leri bu iş için kullanılamaz.** Hepsiburada ve Trendyol'un geliştirici API'leri *satıcı* API'leridir — yalnızca kendi mağazanızın ürünlerini yönetmenizi sağlar, genel katalog okuma yetkisi vermez. Katalog verisi için scraping tek yol olurdu ve bu hem ToS hem FSEK sui generis veri tabanı hakkı açısından ciddi risk taşır.

2. **Tek bir kaynak tüm 7 kategoriyi doğru şekilde kapsamıyor.** Uyumluluk motorumuzun ihtiyaç duyduğu alanlar (soket, RAM tipi, GPU uzunluğu mm, soğutucu soket listesi, kasa maks. GPU uzunluğu) tam olarak açık veri setlerinde en zayıf kapsanan alanlar. Hibrit, kategori-bazlı kaynak stratejisi şart.

3. **Ölçek bizim asıl değerimiz değil.** YükseltPC'nin farkı ürün *sayısı* değil, **uyumluluk kararlarının doğruluğu**. 10.000 yanlış/eksik spesifikasyonlu ürün, 500 doğru üründen daha az değerlidir — çünkü tek bir yanlış soket verisi kullanıcıya yanlış satın alma tavsiyesi verdirir.

**Önerim:** Tam otomatik büyük ölçekli scraping'e gitmek yerine, **Open Icecat + üretici verisi + insan doğrulaması** üzerine kurulu yarı otomatik bir pipeline ile Supabase/PostgreSQL'e geçmek ve 6-9 ay içinde kademeli olarak ~1.500-2.500 ürüne çıkmak.

---

## 1. Donanım Teknik Spesifikasyon Kaynakları

### 1.1 Açık Kaynak / Ücretsiz Veri Setleri

| Kaynak | Kapsam | Format | Lisans | Değerlendirme |
| --- | --- | --- | --- | --- |
| [docyx/pc-part-dataset](https://github.com/docyx/pc-part-dataset) | ~66.778 parça, tüm kategoriler | JSON / JSONL / CSV | MIT | **En kapsamlı açık set.** Ancak PCPartPicker'dan scrape edilmiş (lisans zinciri sorunlu) ve son güncelleme 2025-07. |
| [Pawikoski/PC-Components](https://github.com/Pawikoski/PC-Components) | CPU, GPU, anakart | JSON | Belirtilmemiş | Alan seti çok dar (GPU'da sadece isim var). Kullanılabilir değil. |
| [felixsteinke/cpu-spec-dataset](https://github.com/felixsteinke/cpu-spec-dataset) | Intel + AMD CPU | CSV + Spring Boot API | Açık | Sadece CPU. Üretici verisinden derlenmiş, kalitesi iyi. |
| [painebenjamin/dbgpu](https://github.com/painebenjamin/dbgpu) | 2.000+ GPU | Python paketi | Açık | TechPowerUp kaynaklı. GPU için iyi başlangıç. |
| [RightNow-AI/RightNow-GPU-Database](https://github.com/RightNow-AI/RightNow-GPU-Database) | 2.824 GPU | — | Açık | GPU odaklı alternatif. |

#### Kritik uyarı: pc-part-dataset'in alan kapsamı

Bu veri setinin `API.md` dosyasını inceledim. **Bizim uyumluluk motorumuzun ihtiyaç duyduğu alanların önemli bir kısmı eksik:**

| Kategori | Mevcut alanlar | YükseltPC'nin ihtiyacı olup **EKSİK** olan |
| --- | --- | --- |
| CPU | `core_count`, `core_clock`, `boost_clock`, `microarchitecture`, `tdp`, `graphics`, `smt` | ❌ **socket** (motorumuzun en kritik alanı!) |
| Anakart | `socket`, `form_factor`, `max_memory`, `memory_slots` | ❌ **ramType (DDR4/DDR5)**, chipset |
| RAM | `speed`, `modules`, `cas_latency` | ❌ **type (DDR4/DDR5)** açıkça yok |
| GPU | `chipset`, `memory`, `core_clock`, `length` | ❌ tdp, powerConnector, recommendedPsuWatt |
| PSU | `type`, `efficiency`, `wattage`, `modular` | ✅ Büyük ölçüde yeterli |
| Kasa | `type`, `color`, `external_volume`, `internal_35_bays` | ❌ **maxGpuLengthMm**, **maxCoolerHeightMm** (sadece hacim litre olarak var!) |
| Soğutucu | `rpm`, `noise_level`, `size` | ❌ **compatibleSockets**, **heightMm** |

**Sonuç:** Bu veri seti tek başına kataloğu besleyemez. Uyumluluk mantığımızın dayandığı 5 alanın (CPU soketi, RAM tipi, kasa GPU limiti, kasa soğutucu limiti, soğutucu soket listesi) **hiçbiri** güvenilir şekilde mevcut değil. Ürün isimlerini ve temel alanları çekmek için iskelet olarak kullanılabilir, ama kritik alanlar ayrıca doldurulmalı.

### 1.2 Üretici Kaynakları

| Üretici | Durum | Notlar |
| --- | --- | --- |
| **Intel** | Kısmen açık | [ARK](https://ark.intel.com) tam spesifikasyon sunar. OData tabanlı bir spec API'sinin varlığından söz ediliyor ancak **erişilebilir/güncel bir public endpoint doğrulayamadım** (DNS çözülmedi). Intel topluluk forumlarında API erişiminin doğrudan Intel'e e-posta ile talep edilmesi gerektiği belirtiliyor. Üçüncü taraf [intel-ark-api](https://github.com/issy/intel-ark-api) mevcut ama resmi değil. |
| **AMD** | Yarı açık | [AMD Product Specifications](https://www.amd.com/en/products/specifications/processors.html) sayfası **CSV/Excel olarak manuel dışa aktarım destekliyor.** Resmi bulk API yok ama bu manuel export, CPU verisi için en yüksek kaliteli kaynak. |
| **NVIDIA** | Kapalı | Genel spec API'si yok. Referans tasarım spesifikasyonları ürün sayfalarında, ancak **AIB (partner) modellerin uzunluk/TDP farklılıkları NVIDIA'da hiç yok** — bu bizim için kritik bir boşluk (Faz 10'da RTX 4090 uzunluk düzeltmesinde bizzat yaşadığımız sorun). |
| **Anakart üreticileri** (ASUS, MSI, Gigabyte, ASRock) | Kapalı | Hiçbiri genel spec API'si sunmuyor. Veri, ürün sayfalarında HTML olarak dağınık. Model sayısı çok yüksek (her yonga seti için onlarca varyant). **En zor kategori bu.** |

**Değerlendirme:** Üretici verisi *en doğru* kaynak ama *en az otomatikleştirilebilir* olanı. CPU'da (Intel+AMD) iyi çalışır; GPU'da AIB varyantları nedeniyle yetersiz; anakartta pratik değil.

### 1.3 Ticari / Lisanslı Sağlayıcılar

#### TechPowerUp Hardware Database

[TechPowerUp](https://www.techpowerup.com/database-licensing/) CPU, GPU ve SSD veritabanlarını lisanslıyor:

- **REST API + MCP erişimi** sunuyor; her düzeltme anında yansıyor (scraping gecikmesi yok).
- **Akademik/araştırma kullanımı için ücretsiz** bir katman var: API anahtarı gerektirmiyor, flagship + güncel nesil ürünleri kapsıyor. Atribüsyon isteniyor.
- **Ticari kullanım için ayrı lisans gerekiyor** — fiyat kamuya açık değil, doğrudan iletişimle vaka bazlı belirleniyor. *(Maliyet aralığı doğrulanamadı; bütçeleme için teklif alınması gerekir.)*
- **Sınır:** Sadece CPU/GPU/SSD. Anakart, kasa, soğutucu, PSU **yok** — yani 7 kategorimizin 2'sini karşılıyor.

#### Icecat — en güçlü aday

[Icecat](https://icecat.com/), üretici onaylı ürün içeriği sağlayan global bir katalog:

- **Open Icecat ücretsiz sürüm:** 600+ sponsor markadan 18M+ ürün datasheet'i.
- **Kayıt:** Ücretsiz hesap açıp e-posta doğrulaması yeterli; anında erişim.
- **Format:** XML, CSV, JSON, HTML. **Dokümante edilmiş API'ler üzerinden otomatik erişime açıkça izin veriliyor.**
- **Dil:** 70+ dil (Türkçe içerik potansiyeli var, ancak bileşen kategorilerindeki Türkçe kapsam derinliğini doğrulayamadım).
- **İçerik:** Standartlaştırılmış teknik spesifikasyonlar, marka, MPN, görseller, lojistik veri.
- **Lisans:** Open Content License. Kullanım bilgisinin telif sahiplerine iletilmesine izin verilmesi şartı var. Bazı yüksek çözünürlüklü görsel/video varlıkları yetkili bayilere ayrılmış.
- **Full Icecat (ücretli):** Kataloğun tam kapsamı + marka bulutu.

**Neden güçlü:** Üretici *onaylı* veri (scraping değil), açık lisans, otomatik erişime izin, tüm bileşen kategorilerini kapsama potansiyeli, MPN bazlı eşleştirme. Hukuki risk profili en temiz seçenek.

**Doğrulanması gereken:** Bileşen kategorilerindeki (özellikle kasa `maxGpuLengthMm` ve soğutucu `compatibleSockets`) alan derinliğinin gerçekten yeterli olup olmadığı — bu ancak hesap açıp örnek datasheet çekilerek test edilebilir. **Bu, bir sonraki adımın ilk işi olmalı.**

### 1.4 Wikipedia / Wikidata

Wikidata'nın gerçek kapsamını SPARQL ile ölçtüm:

| Özellik | Kullanan öğe sayısı |
| --- | --- |
| P1141 — işlemci çekirdek sayısı | **11.642** |
| P1041 — soket (socket supported) | **141** |

**Sonuç: Wikidata birincil kaynak olarak kullanılamaz.** Çekirdek sayısı gibi popüler alanlarda makul kapsam var, ancak **bizim en kritik alanımız olan soket için sadece 141 öğe** mevcut. Kasa boyutları, soğutucu soket uyumluluğu, GPU uzunluğu gibi alanlar ise pratikte hiç yok. Ek olarak Wikidata verisi topluluk kaynaklı olduğundan doğruluk garantisi yok.

**Kullanılabilir yer:** Ürün-nesil-mimari ilişkileri gibi kavramsal/sözlük verisi için ikincil zenginleştirme kaynağı olabilir. Spesifikasyon kaynağı olarak hayır.

### 1.5 PCPartPicker

- **Resmi public API yok** ve PCPartPicker bunu sunamayacaklarını açıkça belirtmiş.
- ToS'ta erişimin her an, sebepli veya sebepsiz sonlandırılabileceği yazıyor; kendi servisini kuranların erişiminin kaldırılabileceği belirtilmiş.
- Çok sayıda gayri resmi scraper mevcut ama bunların hepsi ToS dışında.
- `docyx/pc-part-dataset` MIT lisanslı olsa da **içeriği PCPartPicker'dan scrape edilmiş** — MIT lisansı scraper'ın kodunu kapsar, kazınan verinin haklarını temizlemez.

**Değerlendirme:** Doğrudan kullanım hukuki olarak riskli. Veri setini "hangi ürünler var" listesi (isim/MPN keşfi) için referans almak, spesifikasyonları başka kaynaktan doğrulamak daha savunulabilir bir yaklaşım.

---

## 2. Türkiye E-Ticaret Siteleri

### 2.1 Resmi API Durumu — kritik bulgu

| Site | API var mı? | Kimler erişebilir? | Katalog okuma? |
| --- | --- | --- | --- |
| **Hepsiburada** | Evet — [developers.hepsiburada.com](https://developers.hepsiburada.com/hepsiburada/docs/getting-started) | Sadece **satıcı / entegratörler** | ❌ Hayır — sadece kendi ürünlerinizi *gönderme* |
| **Trendyol** | Evet — [developers.trendyol.com](https://developers.trendyol.com/) | Sadece **Partner Programı satıcıları** (SellerId + API Key + Secret) | ❌ Hayır — kendi mağaza ürün/stok/sipariş yönetimi |
| **Vatan Bilgisayar** | Genel API yok | — | ❌ |
| **İncehesap** | Genel API yok | — | ❌ |
| **İtopya** | Genel API yok | — | ❌ |

**Bu, araştırmanın en belirleyici bulgusu.** Hepsiburada ve Trendyol'un API'leri "katalog API'si" değil, **satıcı entegrasyon API'si**. Satıcı olsanız bile yalnızca kendi ürünlerinizi yönetirsiniz — pazaryerinin genel ürün kataloğunu okuyamazsınız. Yani YükseltPC gibi üçüncü taraf bir bilgi sitesi için bu API'ler kullanışsızdır.

### 2.2 robots.txt İncelemesi

| Site | Bulgular |
| --- | --- |
| **İtopya** | ⚠️ **`Disallow: /Urun`** — ürün sayfalarının kendisi kapalı. Ayrıca `/AramaSonuclari`, `/kendin-topla`, `/bilgisayar`, `/XmlFeed` ve 60+ disallow kuralı. **Ürün verisi çekmek robots.txt'e açıkça aykırı.** |
| **Vatan Bilgisayar** | Ürün sayfaları genel olarak açık; ancak `*/urun_kiyaslama/*`, `*/yeni-urunler/*`, arama sonuçları ve `?page=` gibi parametreli sayfalar kapalı. AhrefsBot/SemrushBot/Yandex için **10 saniye crawl-delay**. ⚠️ **GPTBot yalnızca `/llmmap.txt`'e izinli** — otomatik/AI erişimine karşı net bir sinyal. |
| **İncehesap** | En serbest robots.txt: sadece `/uye/*` ve `/ajax/*` kapalı. AI botları için özel kural yok. |
| **Hepsiburada** | robots.txt çekilemedi (403 — bot koruması aktif). Bu başlı başına otomatik erişime karşı teknik önlem alındığının göstergesi. |

### 2.3 Hukuki Çerçeve (Türkiye)

Türkiye'de web scraping'i doğrudan düzenleyen özel bir mevzuat yok, ancak üç ayrı koruma katmanı devreye giriyor:

1. **FSEK — Veri Tabanı Koruması:**
   - Md. 6/b.11 uyarınca özgün veri tabanları eser olarak korunuyor.
   - **Sui generis koruma:** İçeriğin derlenmesi, doğrulanması veya sunulması için *önemli ölçüde emek, zaman ve mali kaynak* yatırılmış veri tabanları, yaratıcılık şartı aranmaksızın korunuyor. **Bir e-ticaret sitesinin ürün kataloğu tam olarak bu tanıma girer.**
   - Sistematik ve büyük ölçekli veri toplama, fikri mülkiyet ihlali oluşturabilir.

2. **Haksız Rekabet:** TTK md. 54-63 ve TBK md. 57. Rakip/benzer bir hizmet kurmak için başkasının emeğiyle oluşturduğu veri tabanından yararlanmak haksız rekabet olarak değerlendirilebiliyor.

3. **Sözleşme İhlali:** Sitelerin kullanım koşullarını kabul edip (özellikle üye olup) sonra otomatik toplama yapmak sözleşmeye aykırılık riski doğurur.

4. **KVKK:** Bizim senaryomuzda teknik spec veri kişisel veri içermediği için doğrudan bir KVKK riski düşük — ancak kullanıcı yorumları/satıcı bilgileri gibi alanlar toplanırsa devreye girer. **Sadece teknik spec toplamak bu riski büyük ölçüde bertaraf eder.**

### 2.4 Türkiye E-Ticaret Sonucu

**Toplu teknik spec çekimi için tavsiye edilmez.** Gerekçeler:

- Resmi API yolu kapalı (satıcı API'leri işe yaramıyor).
- İtopya'da robots.txt ürün sayfalarını açıkça yasaklıyor; Hepsiburada aktif bot koruması uyguluyor; Vatan AI botlarını kısıtlıyor.
- Sui generis veri tabanı hakkı, tam olarak "büyük emekle derlenmiş ürün kataloğu" senaryosunu koruyor.
- **Ek olarak veri kalitesi de düşük:** Türkiye e-ticaret sitelerinin spec alanları standart değil, sık sık eksik/yanlış ve serbest metin halinde. "Soket: AM4" bilgisini 5 farklı sitede 5 farklı formatta bulursunuz. Yani hukuki risk alınsa bile kazanç düşük.

**İstisna — meşru kullanım alanı:** Ürünlerin *hangi modellerin Türkiye'de satıldığını* anlamak için sitemap/kategori sayfalarından **ürün adı ve MPN düzeyinde, düşük hacimli, robots.txt'e saygılı** keşif yapmak savunulabilir. Bu, "hangi ürünleri kataloğa almalıyım" önceliklendirmesi için yeterlidir ve spec verisi başka kaynaktan gelir. Fiyat ve spec toplu çekimi bunun dışında tutulmalı.

**Uzun vadeli meşru alternatif:** Vatan/İncehesap/İtopya ile **bayi/affiliate anlaşması** yapmak. Türkiye'de tedarikçiler yaygın olarak bayilere **XML ürün feed'i** sağlıyor. Bu, izinli ve sözleşmeye dayalı bir veri erişimi sağlar — üstelik affiliate geliri ile iş modeline de katkı sunar. Bu yol, scraping'in hukuki riski olmadan aynı veriye ulaşmanın en temiz biçimidir ve **ayrıca araştırılmaya değer.**

---

## 3. Yaklaşımların Karşılaştırması

| Yaklaşım | Veri kalitesi | Güncellik | Maliyet | Hukuki risk | Bakım yükü |
| --- | --- | --- | --- | --- | --- |
| **Open Icecat** | ⭐⭐⭐⭐ Üretici onaylı | ⭐⭐⭐⭐ Sürekli | Ücretsiz (Full sürüm ücretli) | 🟢 Düşük — açık lisans, API'ye izinli | 🟢 Düşük — feed senkronizasyonu |
| **TechPowerUp lisans** | ⭐⭐⭐⭐⭐ En yüksek | ⭐⭐⭐⭐⭐ Anlık | 🟡 Ticari lisans (teklif gerekli) | 🟢 Düşük — lisanslı | 🟢 Düşük |
| **Üretici verisi (Intel/AMD)** | ⭐⭐⭐⭐⭐ Kaynağın kendisi | ⭐⭐⭐ Manuel export | Ücretsiz | 🟢 Düşük | 🔴 Yüksek — manuel, sadece CPU |
| **pc-part-dataset (GitHub)** | ⭐⭐ Kritik alanlar eksik | ⭐ 2025-07'de donmuş | Ücretsiz | 🟡 Orta — kaynak PCPartPicker scrape | 🔴 Yüksek — kendimiz güncellemeliyiz |
| **Wikidata** | ⭐⭐ Topluluk, doğrulanmamış | ⭐⭐⭐ Sürekli | Ücretsiz | 🟢 Yok — CC0 | 🟡 Orta |
| **TR e-ticaret scraping** | ⭐⭐ Standart dışı, eksik | ⭐⭐⭐⭐ Anlık | Altyapı maliyeti | 🔴 **Yüksek** — FSEK sui generis + ToS + robots.txt | 🔴 Çok yüksek — site değişince kırılır |
| **TR bayi/affiliate XML feed** | ⭐⭐⭐ Değişken | ⭐⭐⭐⭐⭐ Anlık | Anlaşmaya bağlı | 🟢 Düşük — sözleşmeli | 🟡 Orta |
| **Elle giriş (mevcut yöntem)** | ⭐⭐⭐⭐⭐ En doğru | ⭐⭐ Yavaş | Zaman | 🟢 Yok | 🔴 Ölçeklenmiyor |

### Bakım yükü — en çok küçümsenen kalem

Ürün kataloğu **statik değil, çürüyen** bir varlıktır:

- Her yıl 2-3 yeni CPU/GPU nesli çıkıyor, her nesilde onlarca SKU.
- Her yeni yonga seti için 20-50 anakart varyantı piyasaya giriyor.
- AIB GPU modelleri sürekli değişiyor (aynı çip, farklı uzunluk/TDP).
- Fiyat aralıkları TL bazında **çok hızlı eskiyor** — mevcut `priceRangeNew/Used` + `lastUpdated` modeli 1.000+ üründe manuel olarak sürdürülemez.

**Kritik soru: Bu veriyi kim güncel tutacak?** 116 üründe elle yönetilebilir. 1.000 üründe otomasyon şart. 10.000 üründe *ekip* şart. Katalog büyütme kararı, aslında bir **operasyonel yük** kararıdır — teknik bir karar değil.

---

## 4. Mimari Önerisi: JSON → PostgreSQL/Supabase

### 4.1 Neden geçiş gerekli?

Mevcut JSON dosyası + `generateStaticParams` yaklaşımının kırılma noktaları:

- **Build süresi:** 116 üründe 156 sayfa ~1.7 saniyede üretiliyor. 5.000 üründe SSG build süresi ve bellek kullanımı pratik olmayan seviyeye çıkar.
- **Sorgulanabilirlik:** "AM5 soketli, DDR5 destekli, 8.000 TL altı anakartlar" gibi filtreleme JSON'da tüm diziyi belleğe alıp taramayı gerektirir.
- **Çoklu yazar:** JSON dosyalarında git merge conflict'leri, birden fazla kişi veri girmeye başladığında engel olur.
- **Kısmi güncelleme:** Tek bir ürünün fiyatını güncellemek için tüm dosyayı yeniden yazmak gerekir.

### 4.2 Şema Taslağı

Mevcut `lib/types.ts` yapısı iyi tasarlanmış (BaseProduct + kategori-özel arayüzler). Bunu ilişkisel modele şöyle taşımayı öneriyorum — **normalize edilmiş çekirdek + esnek spec yaklaşımı:**

```
products                          -- tüm kategorilerin ortak çekirdeği
  id              uuid PK
  slug            text UNIQUE
  category        text            -- 'cpu' | 'motherboard' | ...
  name            text
  brand           text
  mpn             text            -- üretici parça no: kaynak eşleştirmenin anahtarı
  ean             text            -- Icecat eşleştirmesi için
  status          text            -- 'draft' | 'verified' | 'published' | 'discontinued'
  created_at, updated_at

product_specs                     -- kategori-özel teknik alanlar
  product_id      uuid FK
  key             text            -- 'socket', 'tdp', 'length_mm', ...
  value_text      text
  value_num       numeric         -- sayısal karşılaştırma için ayrı kolon
  unit            text
  source          text            -- 'icecat' | 'manufacturer' | 'manual' | 'techpowerup'
  confidence      text            -- 'verified' | 'imported' | 'inferred'
  verified_by     text
  verified_at     timestamptz
  PRIMARY KEY (product_id, key)

prices                            -- fiyatı üründen ayır (farklı yaşam döngüsü!)
  product_id      uuid FK
  condition       text            -- 'new' | 'used'
  min_try, max_try numeric
  captured_at     timestamptz
  source          text

compatibility_rules               -- motoru veriye taşı (opsiyonel, ileri aşama)
  id, rule_type, params jsonb
```

**Tasarım gerekçeleri:**

- **`product_specs` neden EAV (key-value)?** 7 kategorinin her biri için ayrı tablo (`cpus`, `motherboards`, ...) da geçerli bir seçenek ve tip güvenliği daha iyi olurdu. Ancak katalog büyürken yeni alanlar (PCIe nesli, bellek bant genişliği, RGB desteği...) sürekli ekleniyor; her seferinde migration yazmak yavaşlatır. **Hibrit öneri: en kritik ve her zaman gerekli olan alanlar (socket, ram_type, length_mm) kategori tablolarında tipli kolon olarak; uzun kuyruk alanlar `product_specs`'te.** Böylece uyumluluk motoru tipli kolonlarla çalışır (hızlı + güvenli), vitrin/filtreleme esnek kalır.
- **`source` + `confidence` + `verified_by` alanları zorunlu.** Binlerce ürüne çıkarken en büyük tehlike "bu değer nereden geldi, güvenilir mi?" sorusuna cevap verememektir. Her spec değerinin kökeni izlenebilir olmalı. Faz 10'daki RTX 4090 uzunluk düzeltmesi tam olarak bu izlenebilirliğin neden gerektiğinin örneğidir.
- **Fiyatı ayrı tabloya al.** Fiyat günlük/haftalık değişir, spec neredeyse hiç değişmez. Aynı tabloda tutmak, her fiyat güncellemesinde ürün satırını kirletir ve `lastUpdated` alanının anlamını belirsizleştirir (spec mi güncellendi, fiyat mı?).

### 4.3 Next.js Tarafı: Render Stratejisi

Katalog büyüdükçe tam SSG sürdürülemez. Önerilen geçiş:

- **Kategori sayfaları:** ISR (`revalidate`) + sunucu tarafı filtreleme.
- **Ürün detay sayfaları:** ISR + `generateStaticParams` ile yalnızca **en popüler ~500 ürünü** build zamanında üret; geri kalanı ilk istekte on-demand üretilip cache'lensin (`dynamicParams: true`). Bu, build süresini sabit tutarken SEO'yu korur.
- **Sitemap:** Statik build çıktısından değil, doğrudan veritabanından üretilmeli. `next-sitemap`'in mevcut kurulumu binlerce URL'de yeniden değerlendirilmeli (sitemap başına 50.000 URL limiti, index sitemap gerekebilir).
- **Uyumluluk aracı:** Mevcut `lib/compatibility.ts` saf fonksiyonlar olarak kalabilir — sadece veri kaynağı değişir. **Testler korunmalı ve genişletilmeli.** Bu, mevcut mimarinin en güçlü yanı: iş mantığı veri katmanından zaten ayrılmış durumda.

### 4.4 Veri Giriş Pipeline'ı: **Yarı Otomatik** (öneri)

Tam otomatik değil, tam manuel de değil. Önerilen 4 aşamalı akış:

```
[1] KEŞİF (otomatik)
    Icecat feed + üretici listeleri + (opsiyonel) TR sitemap'lerinden
    "hangi ürünler var" listesi → MPN/EAN bazlı aday kuyruğu
                ↓
[2] İÇE AKTARMA (otomatik)
    Icecat/TechPowerUp'tan spec çekimi → products (status='draft',
    confidence='imported', source kaydedilir)
                ↓
[3] DOĞRULAMA (yarı otomatik) ← EN KRİTİK AŞAMA
    • Otomatik kontroller: şema (zod), aykırı değer tespiti
      (GPU uzunluğu 150-400mm dışıysa uyar), çapraz kaynak
      karşılaştırması (Icecat vs TechPowerUp uyuşmuyorsa işaretle)
    • İnsan onayı: yalnızca işaretlenen/çelişkili kayıtlar için
      → status='verified'
                ↓
[4] YAYIN (otomatik)
    status='published' → ISR revalidate → sitemap güncelle
```

**Neden tam otomatik olmasın?** Çünkü YükseltPC'nin ürünü *tavsiye*dir. Yanlış bir soket verisi, kullanıcının uyumsuz bir anakart almasına yol açar — bu, sitenin tüm güvenilirliğini yok eder. Otomatik içe aktarma hız kazandırır, ancak **"verified" durumuna geçiş insan onayından geçmelidir** — hiç değilse uyumluluk motorunun okuduğu 5 kritik alan için.

**Akıllı kısayol:** Doğrulama yükünü azaltmak için *kural tabanlı çıkarım* kullanılabilir. Örneğin: "Ryzen 7 7800X3D" adı geçen her CPU → soket AM5 (çünkü tüm Ryzen 7000 serisi AM5). Bu tür kurallar, doğrulanması gereken kayıt sayısını dramatik biçimde azaltır ve `confidence='inferred'` olarak işaretlenir.

---

## 5. Aşamalı Büyüme Planı

### Neden 10.000 ürünle başlamak riskli?

1. **Doğrulanmamış veri = negatif değer.** 10.000 ürünün spec'ini insan gözüyle doğrulamak imkansız. Doğrulanmamış veriyle uyumluluk tavsiyesi vermek, hiç tavsiye vermemekten kötüdür — kullanıcı yanlış parça alır, güven kaybedilir ve bu geri kazanılmaz.

2. **SEO'da "thin content" cezası.** 10.000 zayıf içerikli ürün sayfası, Google'ın gözünde düşük kaliteli site sinyali üretir. Faz 7-10'da kurduğumuz SEO temeli (JSON-LD, canonical, gerçek rehber içeriği) bu şekilde zarar görebilir. Az sayıda derin sayfa, çok sayıda sığ sayfadan iyidir.

3. **Bakım borcu anında birikir.** 10.000 ürünün fiyat ve spec güncelliği ilk günden itibaren çürümeye başlar. 6 ay sonra elinizde "güncel değil" damgası yemiş dev bir katalog kalır.

4. **Talebin nerede olduğunu bilmiyoruz.** Hangi ürünlerin gerçekten arandığını henüz ölçmedik. 10.000 ürünün muhtemelen %90'ı hiç ziyaret almayacak; o veriyi hazırlamak ve sürdürmek saf israf olur.

5. **Uyumluluk motoru geniş ölçekte test edilmedi.** Şu an 100 test var ve 116 ürünle çalışıyor. Katalog 50x büyüdüğünde ortaya çıkacak kenar durumları (bilinmeyen soket adları, eksik alanlar, birim tutarsızlıkları) önce küçük ölçekte keşfedilmeli.

### Önerilen Yol Haritası

| Aşama | Hedef | Kapsam | Odak | Süre |
| --- | --- | --- | --- | --- |
| **A — Temel** | ~250 ürün | Mevcut 116 + en çok aranan modeller | **Altyapı geçişi.** Supabase şeması, mevcut JSON'un migrasyonu, ISR'e geçiş, admin arayüzü. Ürün sayısı neredeyse sabit — amaç boru hattını kurmak. | 4-6 hafta |
| **B — Derinlik** | ~600 ürün | Türkiye'de aktif satılan güncel nesil (AM4/AM5/LGA1700/LGA1851 + RTX 40/RX 7000) | **Icecat entegrasyonu + doğrulama akışı.** Her ürün `verified`. Analytics ile hangi ürünlerin arandığı ölçülmeye başlanır. | 6-8 hafta |
| **C — Genişleme** | ~1.500 ürün | Önceki nesiller + 2. el pazarında yaygın modeller + anakart varyantları | **Otomasyonun olgunlaşması.** Çıkarım kuralları, çapraz kaynak doğrulama, aykırı değer tespiti devreye girer. İnsan onayı sadece işaretli kayıtlarda. | 8-12 hafta |
| **D — Ölçek** | 3.000+ | Talep verisinin gösterdiği yöne göre | **Yalnızca ölçülen talep varsa.** Bu aşamaya geçme kararı B ve C'den gelen analytics verisiyle alınmalı — plana göre değil, veriye göre. | Açık uçlu |

### Önceliklendirme: hangi 500 ürün?

"En çok satan/aranan" sezgisel olarak doğru ama ölçülebilir hale getirilmeli. Öneri sıralaması:

1. **Mevcut uyumluluk aracında en çok seçilen ürünler** (kendi analytics verimiz — en güvenilir sinyal).
2. **Google Search Console'da site için gelen ürün-adı sorguları** (talebi zaten görüyoruz).
3. **Türkiye e-ticaret sitelerinde "çok satanlar" listelerindeki modeller** (düşük hacimli, robots.txt'e saygılı keşif ile — sadece isim düzeyinde, spec değil).
4. **Güncel nesil tam kapsama:** Bir nesli *eksiksiz* kapsamak, birçok nesli kısmi kapsamaktan iyidir. Kullanıcı aradığını bulamazsa site değersizdir; "AM5 CPU'ların hepsi burada" güveni değerlidir.

### Her aşamada korunması gereken ilke

**Bir ürün, uyumluluk motorunun ihtiyaç duyduğu 5 kritik alanı `verified` seviyesinde doldurulmadan yayına alınmamalı.** Eksik veriyle yayına alınacaksa, o alan için açıkça "bu bilgi doğrulanmadı" uyarısı gösterilmeli. Sessizce yanlış/eksik veri sunmak, sitenin temel değer önerisini yok eder.

---

## 6. Sonuç ve Öneri

### Önerilen kaynak stratejisi (hibrit, kategori bazlı)

| Kategori | Birincil kaynak | İkincil / doğrulama |
| --- | --- | --- |
| CPU | AMD CSV export + Intel ARK | TechPowerUp (ücretsiz katman), çıkarım kuralları |
| GPU | TechPowerUp / dbgpu | Icecat (AIB varyant uzunlukları için) |
| Anakart | **Icecat** | Üretici sayfası (yonga seti/RAM tipi doğrulaması) |
| RAM | Icecat | Üretici |
| PSU | Icecat | pc-part-dataset (bu kategoride alan kapsamı yeterli) |
| Kasa | **Icecat + elle doğrulama** | ⚠️ `maxGpuLengthMm` en zor alan — muhtemelen kalıcı manuel iş |
| Soğutucu | **Icecat + elle doğrulama** | ⚠️ `compatibleSockets` en zor alan — üretici uyumluluk listeleri |

### Net önerim

1. **İlk iş: Open Icecat hesabı açıp bileşen kategorilerinde bir örnek doğrulaması yapın.** Ücretsiz ve hızlı. Kasa `maxGpuLengthMm` ve soğutucu `compatibleSockets` alanları Icecat'te varsa, bu strateji büyük ölçüde çözülür; yoksa bu iki kategori için kalıcı manuel süreç planlanmalı. **Tüm planın en kritik bilinmeyeni bu.**

2. **Türkiye e-ticaret scraping'ini masadan kaldırın.** Hukuki risk (FSEK sui generis + haksız rekabet), teknik engeller (İtopya robots.txt ürün sayfalarını yasaklıyor, Hepsiburada bot koruması) ve düşük veri kalitesi bir arada geldiğinde getirisi yok. Yerine **bayi/affiliate XML feed anlaşması** yolunu araştırın — hem meşru hem gelir modeline katkı sağlar.

3. **Veritabanı geçişini ürün sayısını artırmadan yapın.** Aşama A'nın tamamı altyapıya ayrılmalı. Aynı anda hem şema hem ölçek değiştirmek, hata ayıklamayı çok zorlaştırır. Mevcut 116 ürün ve 100 test, geçişin doğruluğunu kanıtlayacak mükemmel bir kontrol setidir — geçiş sonrası tüm testler aynı sonucu vermeli.

4. **Yarı otomatik pipeline'ı hedefleyin, tam otomatiği değil.** Kritik 5 alanda insan onayı, sitenin güvenilirliğinin sigortasıdır.

5. **10.000 değil, 12 ayda ~1.500 doğrulanmış ürün hedefleyin.** Ölçek kararı, B ve C aşamalarından gelen gerçek talep verisiyle yeniden değerlendirilmeli.

### Bu raporun sınırları

Aşağıdaki noktalar doğrulanamadı ve karar öncesi netleştirilmeli:

- Open Icecat'in bileşen kategorilerindeki **alan derinliği** (özellikle kasa/soğutucu fiziksel ölçüleri) ve **Türkçe içerik kapsamı** — hesap açılarak test edilmeli.
- TechPowerUp ticari lisans **maliyeti** — kamuya açık değil, teklif alınmalı.
- Intel'in OData spec API'sinin **güncel erişilebilirliği** — erişim doğrulanamadı, Intel'e doğrudan sorulmalı.
- Türk tedarikçilerin (Vatan/İncehesap/İtopya) **bayi XML feed'lerinde teknik spec alanlarının varlığı** — ticari görüşme gerektirir.

---

## Kaynaklar

- [docyx/pc-part-dataset](https://github.com/docyx/pc-part-dataset) — 66.778 parçalık MIT lisanslı veri seti
- [Pawikoski/PC-Components](https://github.com/Pawikoski/PC-Components)
- [felixsteinke/cpu-spec-dataset](https://github.com/felixsteinke/cpu-spec-dataset)
- [painebenjamin/dbgpu](https://github.com/painebenjamin/dbgpu)
- [RightNow-AI/RightNow-GPU-Database](https://github.com/RightNow-AI/RightNow-GPU-Database)
- [TechPowerUp — Hardware Database Licensing & API Access](https://www.techpowerup.com/database-licensing/)
- [Icecat — Free Product Content / Open Icecat](https://icecat.com/structured-data-content-users/)
- [Icecat Open Content License](https://iceclog.com/open-content-license/)
- [Icecat — Ücretsiz kayıt](https://icecat.biz/en/registration)
- [AMD Processor Specifications](https://www.amd.com/en/products/specifications/processors.html)
- [issy/intel-ark-api](https://github.com/issy/intel-ark-api) — gayri resmi Intel ARK REST API
- [Hepsiburada Developer Portal](https://developers.hepsiburada.com/hepsiburada/docs/getting-started)
- [Trendyol Integration Documentation](https://developers.trendyol.com/)
- [Trendyol — Entegrasyon Servislerine Genel Bakış](https://developers.trendyol.com/docs/getting-started)
- [PCPartPicker Terms of Service](https://uk.pcpartpicker.com/tos/)
- [PCPartPicker forum — API talebi yanıtı](https://pcpartpicker.com/forums/topic/360367-make-the-pcpartpicker-internal-api-public)
- [Wikidata P1141 — number of processor cores](https://www.wikidata.org/wiki/Property:P1141)
- [Wikidata P1041 — socket supported](https://www.wikidata.org/wiki/Property:P1041)
- [Web Kazıma (Web Scraping) ve İnternet Sitelerine Yönelik Koruma — Lexology](https://www.lexology.com/library/detail.aspx?g=cf0ded85-1ada-4062-9a5d-06e57c171818)
- [Web Scraping Eyleminin Haksız Rekabet Açısından Değerlendirilmesi — Göksu Safi Işık](https://www.goksusafiisik.av.tr/tr/publications/2025-summer-issue/web-scraping-eyleminin-haksiz-rekabet-acisindan-degerlendirilmesi?id=510)
