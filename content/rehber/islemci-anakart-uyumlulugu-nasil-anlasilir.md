---
title: "İşlemci-Anakart Uyumluluğu Nasıl Anlaşılır? Soket Rehberi"
seoTitle: "İşlemci-Anakart Uyumluluğu Nasıl Anlaşılır?"
description: "AM4, AM5 ve LGA1700 soketlerinin ne anlama geldiği, işlemci-anakart uyumluluğunu kontrol ederken dikkat etmeniz gereken noktalar."
date: "2026-08-06"
keyword: "işlemci soket uyumluluğu nasıl anlaşılır"
relatedGuides:
  - "ddr4-mu-ddr5-mi"
  - "rtx-4060-mu-rx-7600-mu"
relatedProducts:
  - { kategori: "islemci", slug: "amd-ryzen-5-5600" }
  - { kategori: "islemci", slug: "intel-core-i5-13400f" }
  - { kategori: "anakart", slug: "asus-b550m-a" }
  - { kategori: "anakart", slug: "msi-pro-b760m-a" }
---

Bilgisayar toplarken veya yükseltirken yapılan en yaygın hatalardan biri, işlemci ile anakartın soket uyumsuzluğudur. İyi haber şu ki bu, kontrol edilmesi en kolay uyumluluk kriterlerinden biri — doğru bilgiyle birkaç dakikada netleştirebilirsiniz.

## Soket Nedir, Neden Önemlidir?

Soket, işlemcinin anakart üzerine fiziksel olarak takıldığı bağlantı noktasıdır. Her işlemci ailesi belirli bir soket standardına göre üretilir ve **yalnızca o soketi destekleyen anakartlara takılabilir.** Soket uyuşmuyorsa işlemci anakarta hiçbir şekilde oturmaz — bu bir yazılım veya BIOS sorunu değil, tamamen fiziksel bir kısıtlamadır.

## Güncel Soket Aileleri

### AMD Tarafı

- **AM4:** Ryzen 1000'den 5000 serisine kadar (ve bazı 5000G/PRO modelleri dahil) çoğu masaüstü Ryzen işlemcisini kapsayan, uzun ömürlü bir sokettir. [AMD Ryzen 5 5600](/islemci/amd-ryzen-5-5600) gibi işlemciler AM4 soketini kullanır ve DDR4 bellek ile çalışır.
- **AM5:** Ryzen 7000 ve sonrası yeni nesil işlemcilerin kullandığı sokettir; yalnızca DDR5 bellek destekler.

AM4 ve AM5 birbiriyle **fiziksel olarak uyumlu değildir** — AM4 için alınan bir soğutucu bile bazı durumlarda AM5'te farklı montaj kiti gerektirebilir (though çoğu hava soğutucusunda üretici AM5 için de uyumlu montaj kiti sunar).

### Intel Tarafı

- **LGA1700:** 12., 13. ve 14. Nesil Intel Core işlemcilerinin (i5, i7, i9 dahil) kullandığı sokettir. [Intel Core i5-13400F](/islemci/intel-core-i5-13400f) bu sokete örnektir.
- **LGA1200:** Daha eski 10. ve 11. Nesil Intel işlemcilerin soketidir, LGA1700 ile uyumlu değildir.

Intel tarafında dikkat edilmesi gereken ek bir nokta: aynı LGA1700 soketini kullanan anakartlar bile bazen yalnızca DDR4, bazen yalnızca DDR5 destekler — bu yüzden soket uyumu tek başına yeterli değildir, RAM tipini de ayrıca kontrol etmeniz gerekir (detaylar için [DDR4 mü DDR5 mi?](/rehber/ddr4-mu-ddr5-mi) rehberimize bakabilirsiniz).

## Uyumluluğu Nereden Kontrol Edersiniz?

1. **İşlemcinin soket bilgisini bulun.** Kutu üzerinde, üreticinin ürün sayfasında veya bizim [işlemci kategorisi](/islemci) sayfalarımızdaki spesifikasyon tablosunda bu bilgiyi görebilirsiniz.
2. **Anakartın desteklediği soketi bulun.** Anakart ürün adında genellikle soket bilgisi geçer (örn. "AM4" veya "LGA1700" ibaresi) ve [anakart kategori sayfamızdaki](/anakart) spesifikasyon tablosunda net şekilde belirtilir.
3. **İki değeri karşılaştırın.** Aynı soket adına sahip olmaları yeterlidir — örneğin hem işlemci hem anakart "AM4" yazıyorsa uyumludur.
4. **Emin değilseniz aracı kullanın.** [Uyumluluk aracımıza](/uyumluluk-araci) işlemci ve anakartınızı seçin; sistem soket eşleşmesini anında yeşil (uyumlu) veya kırmızı (uyumsuz) olarak gösterir.

## Soket Aynı Olsa Bile Kontrol Edilmesi Gereken Diğer Noktalar

Soket uyumluluğu gerekli ama bazen tek başına yeterli olmayabilir:

- **BIOS güncellemesi gerekebilir:** Aynı soketin farklı nesillerini destekleyen bazı anakartlarda (örneğin yeni çıkan bir işlemciyi eski bir anakartta çalıştırmak için), üreticinin en güncel BIOS sürümünü yüklemeniz gerekebilir. Bu, mağazadan satın almadan önce kontrol edilmesi gereken bir detaydır.
- **Yonga seti (chipset) farkları:** Aynı soketi paylaşan farklı yonga setleri (örneğin B550 ve A520, veya B760 ve H610) performans, aşırı performans (overclock) desteği ve PCIe versiyonu gibi konularda farklılık gösterebilir — bu uyumluluğu değil, özellik setini etkiler.
- **Güç fazları (VRM):** Yüksek TDP'li işlemciler için giriş seviyesi anakartların güç dağıtım devreleri yetersiz kalabilir; bu bir "uyumsuzluk" değildir ama performans ve termal kararlılığı etkileyebilir.

## "Uyumlu" Yazan Bir Anakart Neden Yine de Çalışmayabilir?

Bazen kullanıcılar doğru soketi seçtikleri halde işlemcilerinin anakartta çalışmadığını fark eder. Bunun en yaygın sebebi **BIOS uyumluluğudur**: Aynı soketi uzun süre kullanan üreticiler (özellikle AMD'nin AM4 platformu), zamanla yeni işlemci nesillerini eski anakartlara da destekler hale getirir, ancak bu destek yalnızca güncel bir BIOS sürümü yüklendiğinde aktif olur. Eğer anakart eski bir BIOS ile geliyorsa ve yeni nesil bir işlemci takılırsa, sistem hiç açılmayabilir — bu bir uyumsuzluk değil, güncelleme eksikliğidir.

Bu durumdan kaçınmak için:

- Anakart üreticisinin web sitesinden, ürün sayfasındaki "CPU Support List" (İşlemci Destek Listesi) bölümünden işlemcinizin listelenip listelenmediğini kontrol edin.
- Mağazadan "BIOS güncellemesi gerekebilir" uyarısı varsa, mümkünse mağazadan BIOS'u güncellemesini isteyin veya eski/uyumlu bir işlemci ile ilk açılışı yapıp ardından güncelleme yapın.

## Yeni Sistem Kurarken Soket Seçimi Nasıl Yapılmalı?

Sıfırdan platform seçiyorsanız (henüz ne işlemci ne anakart almadıysanız), karar sırasını şöyle izlemenizi öneririz:

1. Önce bütçenize uygun bir **işlemci ailesi** belirleyin (AMD Ryzen mi, Intel Core mu).
2. Bu ailenin kullandığı **güncel sokete** göre anakart seçeneklerini inceleyin — mümkünse en yeni nesil soketi tercih edin, bu platformun daha uzun süre güncel kalmasını sağlar.
3. Anakart seçerken **RAM tipini** ve **form faktörünü** (kasanıza uygun mu) de aynı anda değerlendirin, çünkü bu üçü birbirine bağlıdır.

## Özet

İşlemci-anakart uyumluluğunun anahtarı sokettir: aynı soket adı (AM4, AM5, LGA1700 gibi) hem işlemcide hem anakartta bulunmalıdır. Bunu doğrulamak için ürün sayfalarındaki spesifikasyon tablolarını karşılaştırabilir, ya da işinizi kolaylaştırmak için doğrudan [uyumluluk aracımızı](/uyumluluk-araci) kullanabilirsiniz.
