# İki Katmanlı Veri Mimarisi Tasarımı

**Tarih:** 2026-08-08
**Durum:** Tasarım dokümanı — **henüz uygulama yok**, kod değişikliği içermez.
**Girdi:** [icecat-dogrulama-raporu.md](./icecat-dogrulama-raporu.md) bulguları — özellikle: (a) Icecat kasa/anakart/RAM için birebir doğru veri veriyor, (b) CPU'lar Open katmanda erişilemiyor, (c) GPU'da TDP yok, (d) Icecat **MPN-bazlı**, bizim katalog **model-bazlı** (RTX 4060 örneği: Icecat 192mm vs bizim jenerik kayıt 244mm — 52mm fark).

---

## 1. İki Katmanlı Ürün Modeli

### Neden gerekli?

Icecat raporu şunu gösterdi: toplu kaynaktan gelen veri **çoğunlukla doğru** ama (a) bazı alanlarda eksik (GPU TDP), (b) bazı alanlarda modelleme belirsiz (MPN yokluğunda "1x16GB mi 2x8GB mi" karışıklığı), (c) bazı markalarda hiç erişilemez. Bunu **hiç filtrelemeden** doğrudan uyumluluk motoruna sokmak, kullanıcıya yanlış "✅ uyumlu" gösterme riski taşır — bu da sitenin en temel güven vaadini (gerçek/doğru teknik veri) zedeler.

Çözüm: **tek bir ürün havuzu**, ama her kayıt bir **tier** (katman) taşır.

### Katman tanımları

| Alan | `verified` (Doğrulanmış) | `raw` (Otomatik/Ham) |
| --- | --- | --- |
| Kaynak | Elle girilmiş + üretici sitesinden çapraz kontrol (mevcut 116 ürün gibi) | Icecat / TechPowerUp / AMD-Intel CSV gibi toplu kaynaktan otomatik çekilmiş |
| `confidence` | `high` | `medium` (kaynak güvenilir ama MPN/eksen belirsizliği olabilir) veya `low` (eksik alan var, tahmini dolduruldu) |
| Uyumluluk motoru çıktısı | **"Uyumlu" / "Uyumsuz"** (kesin) | **"Muhtemelen uyumlu, doğrulanmadı" / "Muhtemelen uyumsuz, doğrulanmadı"** |
| Kullanıcıya görünürlük | Normal ürün kartı | Ürün kartında sarı "topluluk doğrulaması bekliyor" rozeti |
| Ürün sayfası SSG'de yer alır mı? | Evet | Evet (ama `noindex` + rozetli — SEO'da yarım-doğru veri yayılmasın) |
| Kim `verified`'a taşıyabilir? | — | Manuel inceleme (editör) veya otomatik kural (bkz. §1.3) |

### 1.1 `verified` → `raw` arası fark yalnızca ikili değil

Icecat raporundaki üç somut örnek, "raw" katmanın kendi içinde de derecelenmesi gerektiğini gösteriyor:

1. **Kasa (be quiet! Pure Base 500DX):** Icecat verisi bizim elle girdiğimiz değerle **birebir** aynı çıktı. Böyle bir alan otomatik çekilse bile aslında `high` confidence hak eder.
2. **Soğutucu (Dark Rock 4) yüksekliği:** Icecat `Depth=159.4mm` alanı bizim `heightMm` alanımıza karşılık geliyordu, `Height=74.3mm` değil — eksen karışıklığı. Bu alan otomatik çekilirse `low` confidence ile işaretlenmeli, manuel gözden geçirilene kadar uyumluluk motorunda **hiç kullanılmamalı** (null bırakılmalı).
3. **GPU TDP:** Icecat'te hiç yok. Bu durumda satır `raw` tier'da bile olsa `tdp` alanı `NULL` kalmalı — motor bu alanı `NULL` gördüğünde PSU hesaplamasını "veri eksik, tahmini gösterim" uyarısıyla yapmalı, sessizce yanlış sayı üretmemeli.

Bu nedenle şema tasarımında confidence **alan bazında da** taşınabilir olmalı (bkz. §2.3).

### 1.2 Raw katmanın amacı: kapsam, verified katmanın amacı: güven

`raw` katman, kataloğu SEO ve arama kapsamı açısından hızla büyütmenin yoludur (bir ürün sayfası olmadan o ürün için hiç trafik alamayız). `verified` katman ise uyumluluk motorunun **hiç yanılmaması gereken** çekirdeğidir. İki katman **aynı arayüzü paylaşır** (ürün sayfası, kart, uyumluluk aracı) ama farklı garanti seviyesi taşır — kullanıcıya bu fark **açıkça** gösterilmelidir, gizlenmemelidir.

### 1.3 Raw → Verified terfi kuralı (taslak)

- **Otomatik terfi:** Bir `raw` kaydın tüm zorunlu alanları dolu VE kaynak Icecat gibi güvenilir bir sağlayıcıdan geldiyse VE aynı MPN için ikinci bir bağımsız kaynaktan (örn. TechPowerUp) çapraz doğrulama alanları eşleşiyorsa → `confidence: high`'a yükseltilebilir ama yine de `tier: verified`'a **otomatik geçmez** (editör onayı gerekir — bu, "gerçek ve doğru olmalı, uydurma değil" ilkesinin korunması için bilinçli bir sürtünme noktasıdır).
- **Manuel terfi:** Editör paneli (ileride) üzerinden bir `raw` kaydı gözden geçirip "doğruladım" işaretler → `tier: verified`, `verified_at: now()`, `verified_by: <editör>`.

---

## 2. Veritabanı Şeması (Supabase / PostgreSQL)

### 2.1 Tasarım kararı: 7 kategori tablosu (JSON dosyalarını birebir yansıtır)

İki alternatif değerlendirildi:

| Yaklaşım | Artı | Eksi |
| --- | --- | --- |
| **A. Tek `products` tablosu + JSONB `specs`** | Esnek, yeni kategori eklemek şema değişikliği istemez | Zod tip güvenliği kaybolur, uyumluluk motoru sorguları karmaşıklaşır (JSONB içinde `socket = socket` karşılaştırması) |
| **B. 7 ayrı tablo, mevcut `lib/types.ts` arayüzlerini birebir yansıtır** ✅ | Mevcut zod şemalarıyla 1:1 eşleşir, mevcut `lib/compatibility.ts` fonksiyonları değişmeden çalışır, migration riski en düşük | Yeni kategori eklemek yeni tablo + migration ister |

**Öneri: B.** Gerekçe: Bölüm 2'nin açık şartı "mevcut 100 testin veritabanı katmanında da nasıl çalışacağı" — testler `Cpu`, `Motherboard` gibi somut TS tiplerine karşı yazılmış. Tip şeklini korumak, testleri **değiştirmeden** DB'ye taşımanın tek düşük riskli yolu.

### 2.2 Ortak kolonlar (7 tabloda da tekrarlanır)

```sql
id            uuid primary key default gen_random_uuid(),
slug          text unique not null,
name          text not null,
mpn           text,                    -- Manufacturer Part Number (Icecat raporundaki
                                        -- "1x16GB vs 2x8GB" belirsizliğini çözer)
price_new_min integer not null,
price_new_max integer not null,
price_used_min integer not null,
price_used_max integer not null,
last_updated  date not null,

tier          text not null default 'verified'
                check (tier in ('verified','raw')),
source        text not null default 'manual',
                -- 'manual' | 'icecat' | 'techpowerup' | 'amd-csv' | 'intel-ark' ...
confidence    text not null default 'high'
                check (confidence in ('high','medium','low')),
verified_at   timestamptz,             -- null = hiç insan onayından geçmedi
verified_by   text,
icecat_id     bigint,                  -- dış kaynak referansı (izlenebilirlik için)
raw_specs     jsonb,                   -- Icecat'in şemaya map edilmeyen ek alanları
                                        -- (radyatör desteği, fan yuvaları vb. — gösterim
                                        -- amaçlı, uyumluluk motoru KULLANMAZ)

created_at    timestamptz not null default now(),
updated_at    timestamptz not null default now()
```

### 2.3 Alan-bazlı confidence: `field_confidence` yardımcı tablosu

`raw` katmanda bir kaydın **bazı** alanları güvenilir, bazıları değilse (örn. soğutucu genişlik/derinlik/yükseklik karışıklığı), tek bir satır-seviyesi `confidence` yetersiz kalır. Bunun için ayrı, hafif bir tablo:

```sql
create table field_confidence (
  id            uuid primary key default gen_random_uuid(),
  table_name    text not null,   -- 'coolers', 'gpus' ...
  row_id        uuid not null,
  field_name    text not null,   -- 'height_mm', 'tdp' ...
  confidence    text not null check (confidence in ('high','medium','low','missing')),
  note          text,            -- "Icecat Depth alanından türetildi, doğrulanmadı"
  unique (table_name, row_id, field_name)
);
```

Uyumluluk motoru, kritik bir alanı (`socket`, `ram_type`, `tdp`, `length_mm`, `max_gpu_length_mm`, `max_cooler_height_mm`, `wattage`) kullanmadan önce bu tabloya bakar; `confidence = 'missing'` veya `'low'` ise sonucu **kesin değil, "muhtemelen"** olarak işaretler.

### 2.4 Kategori-özel kolonlar (örnek: `coolers` ve `gpus`)

```sql
create table coolers (
  -- ...ortak kolonlar (2.2)...
  type                 text not null check (type in ('air','liquid')),
  compatible_sockets   text[] not null,
  height_mm            integer      -- NULL olabilir (raw katman, eksik veri)
);

create table gpus (
  -- ...ortak kolonlar (2.2)...
  brand                     text not null,
  length_mm                 integer not null,
  power_connector_required  text not null,
  recommended_psu_watt      integer,
  vram                      integer not null,
  tdp                       integer      -- NULL olabilir (Icecat'te yok)
);
```

Diğer 5 tablo (`cpus`, `motherboards`, `rams`, `psus`, `cases`) aynı mantıkla `lib/types.ts`'teki alanları birebir yansıtır; zorunlu-ama-Icecat'te-eksik-olabilecek alanlar (`tdp`, `height_mm` gibi) `nullable` yapılır, geri kalanı `not null` kalır.

### 2.5 Zod tiplerinin şemaya eşlenmesi

`lib/types.ts`'teki `BaseProduct` ve kategori arayüzleri **değişmeden** kalır — DB satırı uygulamaya dönerken şu ek alanlarla genişletilmiş bir tip kullanılır:

```typescript
// lib/types.ts'e EKLENECEK (mevcut alanlar dokunulmaz)
interface ProductMeta {
  tier: "verified" | "raw";
  source: string;
  confidence: "high" | "medium" | "low";
  verifiedAt: string | null;
  mpn: string | null;
}

export type CpuRecord = Cpu & ProductMeta;
// ... aynı desen Motherboard, Ram, Gpu, Psu, Case, Cooler için
```

`lib/schemas.ts`'teki zod şemaları da aynı şekilde `.extend({ tier, source, confidence, verifiedAt, mpn })` ile genişletilir — **mevcut alan doğrulamaları hiç değişmez**, yalnızca yeni alanlar eklenir. Bu, `npm run validate-data`'nın geriye dönük uyumlu kalmasını sağlar.

---

## 3. Geçiş Planı: JSON → Veritabanı (ürün sayısını artırmadan)

Amaç: **116 mevcut ürünü**, hiçbir yeni veri eklemeden, DB'ye taşıyıp doğruluğunu kanıtlamak. Bu, "raw katman" karmaşıklığından önce gelen, izole edilmiş bir adım.

### Adım 1 — Şema migration'ı

Supabase'de 7 tablo + `field_confidence` tablosunu §2'deki şemayla oluştur. Bu aşamada tüm satırlar `tier='verified'`, `confidence='high'`, `source='manual'` olacağından `field_confidence` tablosu bu adımda **boş kalır** — sadece yapı kurulur.

### Adım 2 — Idempotent seed script

`scripts/seedFromJson.ts` (tek seferlik, tekrar çalıştırılabilir):

```
data/cpu.json → upsert into cpus (slug ON CONFLICT DO UPDATE)
data/motherboard.json → upsert into motherboards
... (7 dosya için aynı desen)
```

Her satıra otomatik olarak `tier='verified'`, `source='manual'`, `confidence='high'`, `verified_at=last_updated` atanır (çünkü bu veri zaten Faz 10'da elle doğrulanmıştı).

### Adım 3 — Parite doğrulama scripti (kritik güvenlik ağı)

`scripts/verifyMigrationParity.ts`: JSON dosyalarındaki her satırı DB'deki karşılığıyla **alan alan** karşılaştırır:

- Satır sayısı eşit mi? (7 kategori için: 22, 17, 16, 15, 16, 15, 15 → toplam 116)
- Her `slug` için tüm alanlar (fiyat aralıkları dahil) birebir eşleşiyor mu?
- Fazladan veya eksik satır var mı?

Bu script `0 fark` raporlamadan geçiş **tamamlanmış sayılmaz.**

### Adım 4 — `lib/data.ts`'i veri kaynağı-agnostik hale getirme

Mevcut dışa açık fonksiyonlar (`cpus`, `findCpuBySlug`, vb.) **imzasını değiştirmeden** iç implementasyonu değiştirir:

```typescript
// Öncesi: statik JSON import
export const cpus = cpuData as Cpu[];

// Sonrası: build-time'da DB'den çekilip modül seviyesinde cache'lenir
export const cpus = await fetchCpusFromDb(); // Next.js build/ISR sınırları içinde
```

Bu değişikliğin **çağıran kodda (sayfalar, testler) hiçbir değişiklik gerektirmemesi** tasarımın temel amacı — `lib/data.ts` bir **adaptör katmanı** olarak kalır.

### Adım 5 — Mevcut 100 testin DB katmanında çalışması

`lib/compatibility.test.ts` şu an `./data`'dan import ediyor (`cpus`, `findCpuBySlug` vb.). Adım 4 tamamlandığında bu importlar **aynı isimlerle** DB-backed veriyi döndürür — **testlerin tek satırı bile değişmez.** Testler zaten davranışı (`isCpuMotherboardCompatible(cpu, mb) === true` gibi) kontrol ediyor, veri kaynağını değil.

Tek pratik risk: testler CI'da her çalıştığında gerçek bir Supabase bağlantısı mı açacak, yoksa test-time'da bir DB snapshot/fixture mı kullanılacak? **Öneri:** test ortamı için `lib/data.ts`, `NODE_ENV=test` durumunda DB yerine JSON dosyalarını okumaya devam etsin (aynı adaptör, farklı kaynak) — böylece testler hızlı, izole ve CI'da harici bağımlılıksız kalır; JSON dosyaları da bu nedenle **silinmez, "source of truth export"** olarak saklanır (bkz. §3 Adım 6).

### Adım 6 — Geçiş sonrası JSON dosyalarının rolü

JSON dosyaları silinmez. Rolleri değişir: artık **uygulamanın okuduğu kaynak değil**, (a) test fixture'ı, (b) DB'nin periyodik export'u / yedek/versiyon geçmişi olarak kalırlar. `npm run validate-data` script'i JSON dosyalarını doğrulamaya devam eder; DB'ye yazma işlemi de aynı zod şemasından geçer (tek doğrulama kaynağı, iki tüketici).

### Bu adımın kapsamı DIŞINDA kalanlar

- `raw` katman verisi eklemek (bu adım yalnızca mevcut 116 `verified` ürünü taşır).
- Icecat'ten otomatik veri çekme pipeline'ı.
- Editör onay arayüzü.

Bunlar, DB plumbing'inin **kanıtlanmış çalıştığı** doğrulandıktan sonraki ayrı fazlardır.

---

## 4. Talep-Odaklı Önceliklendirme Mekanizması (tasarım, kod değil)

Sorunun özü: 500-1000 ürünlük bir kataloğu **hangi sırayla** büyütmeliyiz? Rastgele/alfabetik değil, **kullanıcının gerçekten aradığı ama bulamadığı** ürünlere göre.

### 4.1 Sinyal toplama

- **GA4 custom event:** Uyumluluk aracında veya kategori sayfası aramasında bir sorgu **0 sonuç** döndürdüğünde `search_no_results` event'i gönderilir. Event parametreleri: `query_text`, `category_guess` (hangi kategori sayfasından geldiği), `timestamp`.
- **İkinci sinyal kaynağı:** Ürün detay sayfası 404'leri (`/[kategori]/[slug]` bulunamayan slug'lar) — bu, kullanıcının doğrudan bir ürün adı arayıp linke tıkladığı ama kataloğumuzda olmadığı durumları yakalar. Next.js `not-found.tsx` üzerinden aynı GA4 event'ine yönlendirilebilir.

### 4.2 Toplama ve sıralama

- GA4'ten BigQuery export'u (veya GA4 Data API ile haftalık bir cron job) bu event'leri çeker.
- Basit bir `demand_signals` tablosuna aggregate edilir:

```sql
create table demand_signals (
  id             uuid primary key default gen_random_uuid(),
  query_text     text not null,
  category_guess text,
  occurrence_count integer not null default 1,
  first_seen     timestamptz not null,
  last_seen      timestamptz not null,
  status         text not null default 'open'
                   check (status in ('open','covered','rejected'))
);
```

- Haftalık bir özetleme job'ı: aynı sorguları normalize eder (küçük harfe çevirme, boşluk temizliği, basit fuzzy-eşleştirme), `occurrence_count`'a göre sıralar.
- Mevcut katalogda zaten karşılığı olan sorgular (`slug`/`name` fuzzy-match ile) otomatik `status='covered'` işaretlenir — editörün zamanı yalnızca **gerçek boşluklara** gitsin diye.

### 4.3 Editöre çıktı, otomatik ekleme değil

Bu mekanizmanın çıktısı **sıralı bir "eksik ürün" listesi** olmalı, otomatik katalog girişi değil. Örnek haftalık rapor:

```
1. "ryzen 9 9950x3d"      — 340 arama, kategori: işlemci, DURUM: açık
2. "rtx 5070"              — 210 arama, kategori: ekran-kartı, DURUM: açık
3. "corsair 4000d"         — 95 arama,  kategori: kasa, DURUM: açık (Icecat'te Corsair kapalı — manuel giriş gerekir)
```

Editör bu listeden bir ürün seçtiğinde: önce Icecat/TechPowerUp'ta arar (varsa `raw` tier ile hızlı ekler), yoksa manuel `verified` giriş yapar. Bu, kullanıcı talebini veri kalitesi ilkesinden ödün vermeden önceliklendirmenin yolu.

---

## 5. Bu Mimarinin Sitede Etkilediği / Etkilemediği Alanlar

| Bileşen/Dosya | Etkilenir mi? | Nasıl |
| --- | --- | --- |
| `lib/data.ts` | ✅ Evet (iç yapı) | JSON import yerine DB sorgusu; **dışa açık fonksiyon imzaları aynı kalır** |
| `lib/types.ts` | ✅ Evet (ek) | Mevcut interface'ler dokunulmaz, `ProductMeta` alanları eklenir |
| `lib/schemas.ts` | ✅ Evet (ek) | `.extend()` ile yeni alanlar; mevcut doğrulamalar değişmez |
| `lib/compatibility.ts` | ✅ Evet (genişleme) | Fonksiyonlar `boolean` yerine `{ compatible, confidence }` döndürecek şekilde genişler (geriye dönük uyumlu: `.compatible` eski `boolean` yerine geçer) |
| `lib/compatibility.test.ts` (100 test) | ⚠️ Kısmen | Mevcut testler **değişmeden** geçmeye devam eder (§3 Adım 5); yeni `raw`/confidence senaryoları için **ek** testler yazılır, mevcutlar silinmez |
| `app/[kategori]/[slug]/page.tsx` | ✅ Evet | `generateStaticParams` DB'den slug listesi çeker; yeni DB ürünleri için `revalidate` (ISR) eklenir ki tam redeploy gerekmesin |
| `components/SpecTable` | ✅ Evet | `raw_specs` JSONB alanını gösterme + `tier='raw'` için "doğrulanmadı" rozeti |
| `components/ProductCard` | ✅ Evet (küçük) | Rozet gösterimi eklenir |
| `components/RetailerLinks` | ❌ Hayır | Ürün adı + fiyat aralığına göre arama linki üretiyor, DB kaynağından bağımsız |
| `app/uyumluluk-araci/page.tsx` | ✅ Evet | Sonuç ekranı "Uyumlu" yerine "Uyumlu" / "Muhtemelen uyumlu (doğrulanmadı)" ayrımı gösterecek |
| `next-sitemap` config | ⚠️ Kısmen | SSG + ISR modeli korunursa yapı aynı kalır; `raw` tier sayfaları `noindex` olacağı için sitemap'ten hariç tutma kuralı eklenir |
| `scripts/validateData.ts` | ✅ Evet (genişleme) | DB'ye yazmadan önce de aynı zod şemasından geçirilir (tek doğrulama, iki hedef: JSON export + DB) |
| İçerik/rehber sayfaları (`content/rehber/*.md`) | ❌ Hayır | Markdown pipeline'ı DB'den tamamen bağımsız, hiç etkilenmez |
| Reklam/çerez altyapısı (Faz 8) | ❌ Hayır | İlgisiz katman |

---

## 6. Sonuç ve Önerilen İlk Somut Adım

İki rapor birlikte şunu gösteriyor: Icecat, kataloğu **tek başına** binlerce ürüne taşıyamaz (CPU boşluğu, marka kısıtları, GPU TDP eksikliği) ama kasa/anakart/RAM için güçlü, doğrulanmış bir birincil kaynak olabilir. Bu nedenle iki katmanlı mimari hem gerekli hem de mevcut veri kalitesi standardını koruyacak şekilde tasarlanabilir.

**Önerilen ilk kod adımı — dar kapsamlı, geri alınabilir:**

Bölüm 3'te tarif edilen **Adım 1-3'ü** (Supabase şema kurulumu + 116 ürünün idempotent seed'i + parite doğrulama scripti) tek başına, izole bir PR olarak uygulamak. Bu adım:

- Yeni veri eklemez, `raw` katman mantığı içermez, uyumluluk motorunu değiştirmez.
- Tek başarı ölçütü nettir: **parite scripti 0 fark raporlar.**
- Başarısız olursa etkisi sıfırdır (JSON dosyaları hâlâ tek kaynak, DB sadece paralel bir kopya).

Bu kanıtlandıktan sonra sırasıyla: `lib/data.ts` adaptör geçişi (Adım 4-5) → editör onay arayüzü olmadan **tek bir** Icecat `raw` kaydıyla uçtan uca pipeline'ı test etme → GA4 talep sinyali toplamaya başlama. Her adım bir öncekinin doğrulanmasına bağlı, büyük patlama (big-bang) geçişi yok.
