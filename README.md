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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
