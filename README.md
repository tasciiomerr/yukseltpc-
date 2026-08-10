This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## AdSense Kurulumu

Proje, Google AdSense reklamlarını ve Google Analytics'i **çerez onayı
verilmeden yüklemeyecek** ve **`NEXT_PUBLIC_ADSENSE_ENABLED` açıkça
`true` yapılmadan hiçbir reklam alanı render etmeyecek** şekilde
hazırlanmıştır. AdSense hesabı onaylanana kadar hiçbir ek işlem
gerekmez — varsayılan durumda reklam kodu tamamen devre dışıdır ve
build/test süreçlerini etkilemez.

AdSense onayı geldikten sonra aktif etmek için:

1. **AdSense yayıncı kimliğinizi alın.** AdSense hesabınıza giriş yapıp
   "ca-pub-" ile başlayan yayıncı kimliğinizi (publisher ID) kopyalayın.
2. **`.env.local` dosyası oluşturun** (proje kökünde, `.env.example`'ı
   temel alarak):

   ```bash
   cp .env.example .env.local
   ```

3. **Ortam değişkenlerini doldurun** (`.env.local` içinde):

   ```bash
   NEXT_PUBLIC_ADSENSE_ENABLED=true
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

   İsteğe bağlı olarak Google Analytics 4 kullanıyorsanız ölçüm
   kimliğinizi de ekleyin:

   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

4. **AdSense panelinden ürettiğiniz reklam birimi (ad slot) ID'lerini**
   `components/AdSlot.tsx` kullanılan yerlerdeki `slotId` prop
   değerleriyle eşleştirin (ana sayfa, kategori sayfaları, ürün detay
   sayfası, rehber yazıları — bkz. ilgili `app/**/page.tsx` dosyaları).
5. **Deploy platformunuzda (örn. Vercel) aynı ortam değişkenlerini**
   tanımlayın — `NEXT_PUBLIC_` önekli değişkenler build sırasında
   istemci koduna gömüldüğü için, değeri değiştirdikten sonra yeniden
   deploy/build gerekir.
6. **`npm run build` çalıştırarak** hatasız derlendiğini doğrulayın.

Yerel olarak reklam alanlarını test etmek isterseniz, `NEXT_PUBLIC_ADSENSE_ENABLED=true`
yapıp siteyi açtıktan sonra çerez onayı banner'ında "Kabul Et"i
seçmeniz gerekir — onay verilmeden reklam script'i hiç yüklenmez.

## Veritabanı (Supabase) Kurulumu

Ürün kataloğu artık iki katmanlı bir mimariye taşınıyor (bkz.
[`content/veri-mimarisi-tasarimi.md`](content/veri-mimarisi-tasarimi.md)).
**Bu fazda** (Faz 11, Adım 1-3) sadece şema kuruluyor ve mevcut 116 ürün
JSON'dan veritabanına birebir taşınıyor — yeni ürün, Icecat entegrasyonu
veya "raw" katman **henüz aktif değil**.

**Önemli mimari not:** `lib/data.ts`, `components/UyumlulukAraci.tsx` gibi
`"use client"` bileşenler tarafından doğrudan import edildiği için bir DB
istemcisi veya secret **içermez** — bunu içerse, `SUPABASE_SERVICE_ROLE_KEY`
tarayıcıya giden JavaScript paketine sızardı. Bunun yerine veritabanı, her
build'den **önce** (`prebuild` adımı, `scripts/pullDbToJson.ts`) `data/*.json`
dosyalarına "pull" edilir; `lib/data.ts` bu dosyaları her zamanki gibi senkron
okumaya devam eder. Supabase yapılandırılmamışsa (yerel geliştirme gibi) bu
adım sessizce atlanır ve elle yazılmış `data/*.json` dosyaları kullanılır —
yani **Supabase kurmadan da proje tamamen eskisi gibi çalışır.**

### 1. Supabase projesi oluşturma (elle yapılır)

1. [supabase.com](https://supabase.com) üzerinden ücretsiz bir hesap açın ve
   yeni bir proje oluşturun (bölge olarak Avrupa'ya yakın bir bölge önerilir).
2. Proje oluşturulduktan sonra **Project Settings → API** sayfasına gidin ve
   şu iki değeri not edin:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (⚠️ **anon/public key değil** — bu script'ler RLS'i
     bypass ederek yazma yapmalı) → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Şemayı uygulama

`supabase/migrations/20260808120000_create_product_tables.sql` dosyasını
Supabase panelindeki **SQL Editor**'e yapıştırıp çalıştırın (veya
[Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
kuruluysa `supabase db push` ile uygulayın). Bu, 7 kategori tablosunu +
`field_confidence` tablosunu, RLS politikalarıyla birlikte oluşturur. Bu adım
**hiçbir veri eklemez.**

### 3. Ortam değişkenlerini tanımlama

```bash
cp .env.example .env.local
```

`.env.local` içine ekleyin:

```bash
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # service_role key — asla NEXT_PUBLIC_ önekiyle kullanmayın
```

`.env.local` zaten `.gitignore`'da olduğu için commit edilmez.

### 4. Mevcut 116 ürünü aktarma (seed)

```bash
npm run db:seed
```

`data/*.json` dosyalarındaki 116 ürünü, `tier='verified'`, `source='manual'`,
`confidence='high'` ile idempotent olarak (slug/id çakışmasında güncelleyerek)
veritabanına yazar. Script tekrar tekrar çalıştırılabilir.

### 5. Parite doğrulaması ("0 fark" kanıtı)

```bash
npm run db:verify-parity
```

JSON dosyalarındaki her ürünü veritabanındaki karşılığıyla **alan alan**
karşılaştırır. Eksik kayıt, fazla kayıt veya herhangi bir alan uyuşmazlığı
varsa satır satır raporlayıp `exit 1` ile çıkar; hiçbir fark yoksa
`✓ 0 FARK` mesajıyla başarı bildirir. Bu script, taşımanın doğruluğunun tek
kanıtıdır — CI'da da çalıştırılması önerilir.

### 6. Build'in veritabanından veri çekmesi

Yukarıdaki adımlar tamamlandıktan sonra `npm run build` çalıştırıldığında,
`prebuild` adımı otomatik olarak `data/*.json` dosyalarını veritabanından
tazeler (`scripts/pullDbToJson.ts`), ardından `next build` bu güncel
dosyaları kullanarak siteyi üretir. `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`
tanımlı değilse bu adım no-op'tur ve `data/*.json` mevcut haliyle kullanılır.

### Vercel'de deploy

1. Vercel proje ayarlarında **Settings → Environment Variables**'a gidin.
2. `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` değişkenlerini
   **Production** (ve isterseniz **Preview**) ortamı için ekleyin.
3. Bir sonraki deploy'da `prebuild` adımı otomatik çalışıp veritabanındaki
   güncel veriyi çekecektir — ek bir yapılandırma gerekmez.

⚠️ `SUPABASE_SERVICE_ROLE_KEY`'i **asla** `NEXT_PUBLIC_` önekiyle
tanımlamayın — bu önek, değeri istemci (tarayıcı) koduna gömer ve RLS'i
bypass eden bu anahtarın herkese açık hale gelmesine neden olur. Bu proje
bilinçli olarak bu anahtarı yalnızca build-time script'lerinde
(`scripts/pullDbToJson.ts`, `scripts/seedFromJson.ts`,
`scripts/verifyMigrationParity.ts`) kullanır — hiçbir zaman uygulama
kodunda (`app/`, `components/`) veya client bundle'da yer almaz.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
