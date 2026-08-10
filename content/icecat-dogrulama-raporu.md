# Open Icecat Doğrulama Raporu

**Tarih:** 2026-08-08
**Yöntem:** Open Icecat demo hesabı (`openIcecat-live`) ile **gerçek canlı API sorguları** yapıldı; dönen veriler mevcut `/data/*.json` kayıtlarımızla birebir karşılaştırıldı.
**Not:** Bu bir doğrulama raporudur — kod değişikliği içermez.

---

## 0. Özet: Üç Kritik Sorunun Cevabı

| Soru | Cevap | Kanıt |
| --- | --- | --- |
| Kasada "maksimum GPU uzunluğu" var mı? | ✅ **VAR** ve verimizle **birebir tutuyor** | `Maximum graphics card length = 36.9 cm` → bizim `maxGpuLengthMm: 369` |
| Soğutucuda "uyumlu soket listesi" var mı? | ✅ **VAR** ve kapsamlı | `Supported processor sockets = ... Socket AM4, Socket AM5` (10 soket) |
| CPU/anakart/GPU alanları eksiksiz mi? | ⚠️ **Kısmen** — anakart mükemmel, GPU'da TDP yok, **CPU'lar Open katmanda YOK** | Aşağıda detaylı |

**En önemli iki bulgu:**

1. 🔴 **Intel ve AMD işlemcileri Open Icecat'te yok** — ikisi de `403 Full Icecat` döndü. Yani en kritik kategorimiz (CPU soketi) ücretsiz katmandan **hiç beslenemiyor**.
2. 🟠 **Icecat MPN-bazlı, bizim katalog model-bazlı.** Icecat "Gigabyte RTX 4060 WINDFORCE OC" (192mm) döner; bizim kaydımız jenerik "RTX 4060" (244mm). Bu bir hata değil, **modelleme uyuşmazlığı** — mimari kararı gerektirir.

---

## 1. Erişim ve Kimlik Doğrulama (doğrulandı)

### Çalışan endpoint

```
https://live.icecat.biz/api?lang=<LANG>&shopname=<USER>&Brand=<MARKA>&ProductCode=<MPN>&content=
```

**Open Icecat ürünleri için şifre/token GEREKMİYOR** — yalnızca kullanıcı adı yeterli. Demo hesabı `openIcecat-live` ile tüm testler yapıldı.

### Parametre isimleri — dokümantasyondan farklı, dikkat

Testlerde ortaya çıkan önemli detay: **parametre isimleri büyük/küçük harfe duyarlı.**

| Denenen | Sonuç |
| --- | --- |
| `Brand=AMD&ProductCode=...` | ✅ Çalışıyor |
| `brand=AMD&prod_id=...` | ❌ `400 Product identifier(s) is empty` |
| `vendor=AMD&prod_id=...` | ❌ `400 Product identifier(s) is empty` |
| `GTIN=<ean>` | ✅ Çalışıyor |
| `icecat_id=<id>` | ✅ Çalışıyor |

XML API'sinin (`data.icecat.biz/xml_s3`) `vendor`/`prod_id` parametreleri **JSON API'de geçerli değil.** Dokümantasyonda bu ayrım net anlatılmamış; entegrasyonda zaman kaybettirebilir.

### Diğer erişim bulguları

- **Bulk export** (`data.icecat.biz/export/freexml/EN/`, `/freeurls/`) → `401 Unauthorized`. Kayıtlı hesap gerekiyor. Toplu senkronizasyon için **ücretsiz kayıt şart** (demo hesap yetmez).
- **Rate limiting:** 5 ardışık hızlı istekte hiçbir kısıtlama görülmedi (5× `200 OK`). Üretim hacmi için yine de nazik davranılmalı.
- Yanıtlarda `"DemoAccount": true` alanı dönüyor — demo hesabın kapsamı gerçek hesaptan **dar olabilir**; aşağıdaki `403`'lerin bir kısmı gerçek hesapta açılabilir. ⚠️ Bu, raporun en önemli belirsizliği (bkz. §6).

---

## 2. Kategori Kapsamı — Gerçek Test Sonuçları

| Kategori | Test edilen ürün (MPN) | Sonuç |
| --- | --- | --- |
| RAM | Kingston `KF432C16BB/16` | ✅ Açık |
| **Kasa** | be quiet! `BGW38` (Pure Base 500DX) | ✅ Açık |
| **Soğutucu** | be quiet! `BK021` (Dark Rock 4) | ✅ Açık |
| Soğutucu | ARCTIC `ACFRE00067A` (Liquid Freezer II) | ✅ Açık |
| Soğutucu | Zalman `CNPS10X` | ✅ Açık |
| Anakart | ASUS `90MB14I0-M0EAY0` (PRIME B550M-A) | ✅ Açık |
| GPU | Gigabyte `GV-N4060WF2OC-8GD` (RTX 4060) | ✅ Açık |
| GPU | ASUS `90YV0J90-M0NA00` (RX 7900 GRE) | ✅ Açık |
| **CPU (Intel)** | `BX8071513400F` (i5-13400F) | 🔴 **403 — Full Icecat** |
| **CPU (AMD)** | `100-100000065BOX` (Ryzen 5 5600X) | 🔴 **403 — Full Icecat** |
| Soğutucu | Cooler Master `RR-212S-20PK-R1` (Hyper 212) | 🔴 403 — Full Icecat |
| Kasa | Corsair `CC-9011200-WW` | 🔴 403 — Full Icecat |
| Soğutucu | Noctua `NH-D15` | 🔴 403 — Full Icecat |
| Kasa | Cooler Master `MCB-NR200-KGNN-S00` (NR200) | ⚪ 404 — veritabanında yok |
| Çevre birimi | Logitech `910-004291` | ⚪ 404 — marka kısıtlaması |

**Yorum:** Kapsam **markaya göre** değişiyor, kategoriye göre değil. be quiet!, ASUS, Gigabyte, Kingston, ARCTIC, Zalman → açık. Corsair, Noctua, Cooler Master, Intel, AMD → kapalı. Bu, Icecat'in "sponsor marka" modelinin doğrudan sonucu: markanın Icecat'e sponsor olup olmadığına bağlı.

🔴 **Bu bizim için ciddi bir sorun:** mevcut kataloğumuzdaki Corsair (PSU/kasa/RAM), Cooler Master (kasa/soğutucu), NZXT ve Noctua ürünleri ücretsiz katmanda erişilemez durumda.

---

## 3. Alan Bazında Doğrulama

### 3.1 Kasa — ✅ MÜKEMMEL (kritik soru #1 cevaplandı)

be quiet! Pure Base 500DX (`BGW38`) — bizim `bequiet-pure-base-500dx` kaydımızla karşılaştırma:

| Icecat alanı | Icecat değeri | Bizim alanımız | Bizim değerimiz | Durum |
| --- | --- | --- | --- | --- |
| `Maximum graphics card length` | **36.9 cm** | `maxGpuLengthMm` | **369** | ✅ **BİREBİR** |
| `Maximum CPU cooler height` | **19 cm** | `maxCoolerHeightMm` | **190** | ✅ **BİREBİR** |
| `Supported motherboard form factors` | ATX, micro ATX, Mini-ATX | `supportedFormFactors` | ["ATX","mATX","ITX"] | ✅ Eşleşiyor (sözlük farkı) |

Ek olarak radyatör desteği, fan yuvaları, maks. PSU uzunluğu, toz filtresi gibi **bizde hiç olmayan zengin alanlar** da mevcut.

⚠️ **Birim uyarısı:** Değerler **cm** cinsinden geliyor ("36.9 cm"), bizim şemamız **mm**. Dönüşüm katmanı şart. Ayrıca Icecat "Mini-ATX" diyor — bu aslında **Mini-ITX**; Icecat'in standart dışı terminolojisi. Sözlük eşleme tablosu gerekiyor.

### 3.2 Soğutucu — ✅ VAR ama eksik bir alan var (kritik soru #2 cevaplandı)

be quiet! Dark Rock 4 (`BK021`):

```
Supported processor sockets = LGA 1150 (Socket H3), LGA 1151 (Socket H4),
  LGA 1155 (Socket H2), LGA 1200 (Socket H5), LGA 1700, LGA 2011 (Socket R),
  LGA 2011-v3 (Socket R), LGA 2066, Socket AM4, Socket AM5
```

✅ Soket listesi **var ve kapsamlı**. Ayrıca `Thermal Design Power (TDP) = 200 W` gibi soğutma kapasitesi bilgisi de var (bizde hiç yok, değerli).

🟠 **Ancak `heightMm` sorunlu.** Boyutlar şöyle dönüyor:
```
Width = 136 mm | Depth = 159.4 mm | Height = 74.3 mm
```
Dark Rock 4'ün gerçek **yüksekliği 159.4mm**'dir — yani Icecat'in `Depth` alanı bizim `heightMm` alanımıza karşılık geliyor. **Eksen eşlemesi güvenilmez**; ürün kutu içinde yatık ölçülmüş. Bu alan otomatik alınamaz, **kural bazlı çıkarım veya manuel doğrulama gerektirir.**

⚠️ Sözlük farkı: Icecat `Socket AM4` / `LGA 1700` (boşluklu), bizim şema `AM4` / `LGA1700` (boşluksuz). Normalizasyon katmanı zorunlu.

### 3.3 Anakart — ✅ MÜKEMMEL

ASUS PRIME B550M-A (`90MB14I0-M0EAY0`) — bizim `asus-b550m-a` kaydımız:

| Icecat alanı | Icecat değeri | Bizim alanımız | Bizim değerimiz | Durum |
| --- | --- | --- | --- | --- |
| `Processor socket` | Socket AM4 | `socket` | AM4 | ✅ |
| `Supported memory types` | DDR4-SDRAM | `ramType` | DDR4 | ✅ |
| `Number of memory slots` | 4 | `ramSlots` | 4 | ✅ |
| `Motherboard chipset` | AMD B550 | `chipset` | B550 | ✅ |
| `Motherboard form factor` | micro ATX | `formFactor` | mATX | ✅ |
| `PCI Express x16 (Gen 4.x) slots` | 1 | `pcieVersion` | 4.0 | ⚠️ Alan **adından** çıkarılmalı |

**Anakart kategorisi tam kapsanıyor** — bu, §1.1'de incelediğimiz `pc-part-dataset`'in başaramadığı şeydi (orada `ramType` yoktu).

⚠️ `pcieVersion` değerin kendisinde değil, **özellik adının içinde** ("Gen 4.x"). Parse edilebilir ama kırılgan.

### 3.4 GPU — ⚠️ TDP EKSİK (kritik boşluk)

Gigabyte RTX 4060 WINDFORCE OC (`GV-N4060WF2OC-8GD`):

| Icecat alanı | Değer | Bizim karşılığı | Durum |
| --- | --- | --- | --- |
| `Length` | 192 mm | `lengthMm` | ⚠️ AIB farkı (bkz. §4) |
| `Supplementary power connectors` | 1x 8-pin | `powerConnectorRequired` | ✅ |
| `Minimum system power supply` | 450 W | `recommendedPsuWatt` | ⚠️ Bizimki 550 (daha temkinli) |
| `Discrete graphics card memory` | 8 GB | `vram` | ✅ |
| **TDP** | 🔴 **YOK** | `tdp` | 🔴 **36 özelliğin hiçbirinde TDP/güç tüketimi yok** |

🔴 **Bu ciddi:** `tdp` alanı bizim `calculateRequiredPsuWatt()` fonksiyonumuzun **doğrudan girdisi**. Icecat'ten gelmiyorsa, GPU TDP'si için ayrı bir kaynak (TechPowerUp) veya manuel giriş gerekiyor.

ℹ️ Not: `Minimum system power supply` (450W) ile bizim `recommendedPsuWatt` (550W) aynı şey değil — Icecat **üreticinin mutlak minimumunu**, biz **güvenli öneriyi** kaydediyoruz. Bunlar farklı semantikte alanlar, doğrudan eşleştirilmemeli.

### 3.5 RAM — ✅ İyi, bir uyarıyla

Kingston Fury Beast (`KF432C16BB/16`) — bizim `kingston-fury-beast-16gb-ddr4-3200`:

| Icecat | Değer | Bizim | Durum |
| --- | --- | --- | --- |
| `Internal memory type` | DDR4 | `type: DDR4` | ✅ |
| `Memory data transfer rate` | 3200 MT/s | `speed: 3200` | ✅ |
| `Internal memory` | 16 GB | `capacity: 16` | ✅ |
| `Memory layout (modules x size)` | **1 x 16 GB** | `moduleCount: **2**` | 🔴 **ÇELİŞKİ** |

Bu çelişki bir Icecat hatası **değil** — bizim hatamız/belirsizliğimiz. `KF432C16BB/16` gerçekten **tek 16GB modül**; 2×8GB kit farklı bir MPN'dir (`KF432C16BB K2/16`). Bizim kaydımız MPN'siz olduğu için hangi varyantı temsil ettiği belirsiz.

➡️ **Çıkarım: MPN alanı olmadan katalog ölçeklenemez.** Bu, mimari tasarımın zorunlu bir gereksinimidir.

### 3.6 CPU — 🔴 DOĞRULANAMADI

Hem Intel (`BX8071513400F`) hem AMD (`100-100000065BOX`) `403 Full Icecat` döndü. **Open Icecat ile CPU soketi/TDP/çekirdek verisi alınamıyor.**

Bu, ücretsiz katmanın en büyük boşluğu — çünkü CPU soketi uyumluluk motorumuzun **en kritik alanı**. Çözüm: CPU verisi için AMD CSV export + Intel ARK + TechPowerUp ücretsiz katmanı (önceki raporda önerildiği gibi). **Icecat CPU için kullanılmayacak.**

---

## 4. Veri Kalitesi Değerlendirmesi: MPN-bazlı vs Model-bazlı

En önemli yapısal bulgu. İki GPU karşılaştırması:

| Ürün | Icecat (MPN-exact) | Bizim (jenerik model) | Fark |
| --- | --- | --- | --- |
| RTX 4060 | Gigabyte WINDFORCE OC → **192 mm** | "NVIDIA RTX 4060" → **244 mm** | **52 mm** |
| RX 7900 GRE | ASUS Dual → **279.9 mm** | "AMD RX 7900 GRE" → **267 mm** | **13 mm** |

**Bu bir veri hatası değil, iki farklı modelleme felsefesi:**

- **Icecat:** Her fiziksel ürün (MPN) ayrı kayıt. "Gigabyte RTX 4060 WINDFORCE OC 8G" ≠ "ASUS RTX 4060 Dual".
- **Bizim katalog:** Çip/model düzeyinde tek jenerik kayıt. "RTX 4060" tek satır.

**Sonuçları:**

- ✅ Icecat modeli **daha doğru** — Faz 10'da RTX 4090 uzunluğunu 304→336mm düzeltirken bizzat yaşadığımız sorun tam olarak buydu. Jenerik kayıtta "doğru uzunluk" diye bir şey yok.
- 🔴 Ancak MPN düzeyine geçmek **katalog boyutunu 5-10× büyütür** (tek RTX 4060 yerine ~15 AIB varyantı) ve slug/URL yapımızı değiştirir.
- ⚠️ Jenerik kalırsak, uyumluluk motorunun GPU uzunluk kontrolü **hiçbir zaman kesin olamaz** — "muhtemelen sığar" demek zorunda kalırız.

➡️ Bu, doğrudan iki katmanlı mimarinin (Bölüm 2) gerekçesidir.

## 5. Türkçe Desteği — ✅ Çalışıyor

`lang=TR` ile sorgulandığında:

```
İşlemci üreticisi = AMD
İşlemci soketi = Soket AM4
İşlemcilerle uyumlu = AMD Ryzen 3000 Series
```

✅ Türkçe **özellik adları ve değerleri** mevcut — ürün sayfalarında doğrudan gösterilebilir, bu büyük bir kazanç (çeviri maliyeti yok).

⚠️ **Ama makine işleme için TR kullanılmamalı:** "Soket AM4" gibi lokalize değerler parse edilirse dil değişince kırılır. **Kural: mantık için `lang=EN` + `Value`/`RawValue`, gösterim için `lang=TR` + `PresentationValue`.**

ℹ️ `İşlemcilerle uyumlu = AMD Ryzen 3000 Series` alanı dikkat çekici — anakartın desteklediği CPU listesi. Ancak B550'nin Ryzen 5000'i de desteklediği bilindiğinden bu alan **eksik/güncel değil**. Uyumluluk kararında kullanılmamalı.

---

## 6. Genel Değerlendirme

### Güçlü yanlar

- ✅ **İki kritik sorunun cevabı olumlu:** kasa maks. GPU uzunluğu ve soğutucu soket listesi **var**, üstelik elle girdiğimiz verilerle **birebir tutuyor**. Bu, hem Icecat'in hem bizim mevcut verimizin kalitesini karşılıklı doğruluyor.
- ✅ Anakart kategorisi **tam kapsanıyor** — açık veri setlerinin başaramadığı şey.
- ✅ Üretici onaylı veri, açık lisans, API'ye açık izin, Türkçe destek, ücretsiz.
- ✅ Bizde hiç olmayan zengin alanlar (radyatör desteği, soğutucu TDP kapasitesi, fan yuvaları) ileride yeni özellikler için fırsat.

### Zayıf yanlar / riskler

| Sorun | Etki | Şiddet |
| --- | --- | --- |
| **CPU'lar Open katmanda yok** (Intel+AMD 403) | En kritik kategori beslenemiyor | 🔴 Yüksek |
| **GPU'da TDP alanı yok** | PSU hesap motorunun girdisi eksik | 🔴 Yüksek |
| **Marka kapsamı seçici** (Corsair, Noctua, Cooler Master, NZXT kapalı) | Mevcut kataloğun önemli kısmı erişilemez | 🔴 Yüksek |
| MPN-bazlı vs model-bazlı uyuşmazlık | Katalog modelleme kararı gerektiriyor | 🟠 Orta |
| Soğutucu `heightMm` eksen karışıklığı | Manuel doğrulama gerekiyor | 🟠 Orta |
| Birim (cm/mm) ve sözlük ("Socket AM4"/"Mini-ATX") farkları | Normalizasyon katmanı şart | 🟡 Düşük (çözülebilir) |
| `pcieVersion` alan **adından** parse ediliyor | Kırılgan | 🟡 Düşük |

### Doğrulanamayan (kayıt sonrası test edilmeli)

- Demo hesap `"DemoAccount": true` döndürüyor. **Gerçek (ücretsiz kayıtlı) hesapta yukarıdaki `403`'lerin bir kısmı açılabilir.** Özellikle Corsair/Cooler Master/Noctua'nın gerçekten kapalı mı yoksa demo kısıtlaması mı olduğu netleşmeli.
- Bulk export (`401`) içeriği ve güncelleme sıklığı — ücretsiz kayıt sonrası incelenmeli.
- Full Icecat maliyeti.

### Sonuç

**Open Icecat, kataloğun tamamını besleyebilecek tek kaynak DEĞİL — ama kasa, soğutucu, anakart ve RAM için güçlü bir birincil kaynak.**

Doğrulanan kategori bazlı strateji:

| Kategori | Icecat (ücretsiz) yeterli mi? | Birincil kaynak önerisi |
| --- | --- | --- |
| Kasa | ✅ Evet (marka kapsamı elverdiğince) | Icecat |
| Anakart | ✅ Evet | Icecat |
| RAM | ✅ Evet | Icecat |
| Soğutucu | 🟠 Kısmen (`heightMm` manuel) | Icecat + manuel düzeltme |
| GPU | 🟠 Kısmen (TDP yok) | Icecat + TechPowerUp (TDP için) |
| PSU | ❓ Test edilmedi (Corsair kapalı çıktı) | Icecat + manuel |
| **CPU** | 🔴 **Hayır** | AMD CSV + Intel ARK + TechPowerUp |

**Bir sonraki somut adım:** Ücretsiz Open Icecat hesabı açıp (a) marka kapsamının demo kısıtı mı gerçek mi olduğunu, (b) bulk export içeriğini test etmek. Bu, tek başına stratejinin kapsamını netleştirecek.

---

## Ek: Tekrarlanabilir Test Komutları

```bash
# Kasa — maks. GPU uzunluğu doğrulaması
curl -s "https://live.icecat.biz/api?lang=EN&shopname=openIcecat-live&Brand=be%20quiet%21&ProductCode=BGW38&content="

# Soğutucu — soket listesi doğrulaması
curl -s "https://live.icecat.biz/api?lang=EN&shopname=openIcecat-live&Brand=be%20quiet%21&ProductCode=BK021&content="

# Anakart — soket / RAM tipi / slot doğrulaması
curl -s "https://live.icecat.biz/api?lang=EN&shopname=openIcecat-live&Brand=ASUS&ProductCode=90MB14I0-M0EAY0&content="

# CPU — Full Icecat kısıtının doğrulanması (403 döner)
curl -s "https://live.icecat.biz/api?lang=EN&shopname=openIcecat-live&Brand=Intel&ProductCode=BX8071513400F&content="
```
