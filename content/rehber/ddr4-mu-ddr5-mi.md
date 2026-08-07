---
title: "DDR4 mü DDR5 mi? Anakartınıza Göre Doğru RAM Seçimi"
seoTitle: "DDR4 mü DDR5 mi? RAM Seçim Rehberi"
description: "DDR4 ve DDR5 arasındaki gerçek farklar, fiyat-performans dengesi ve anakartınıza hangi RAM tipinin uygun olduğunu nasıl anlayacağınız."
date: "2026-08-06"
keyword: "ddr4 mü ddr5 mi almalıyım"
relatedGuides:
  - "islemci-anakart-uyumlulugu-nasil-anlasilir"
  - "hangi-parcayi-once-yukseltmeliyim"
relatedProducts:
  - { kategori: "ram", slug: "kingston-fury-beast-16gb-ddr4-3200" }
  - { kategori: "ram", slug: "corsair-vengeance-32gb-ddr5-6000" }
  - { kategori: "anakart", slug: "asus-b550m-a" }
  - { kategori: "anakart", slug: "msi-pro-b760m-a" }
---

RAM yükseltmesi düşünüyorsanız karşınıza çıkan ilk soru genelde şu olur: DDR4 mü DDR5 mi almalıyım? Cevap aslında bütçenizden çok **anakartınızın hangi tipi desteklediğine** bağlı — çünkü bu iki bellek standardı birbiriyle fiziksel olarak uyumlu değildir, yanlış tipte bir modül anakarta hiçbir şekilde takılmaz.

## DDR4 ve DDR5 Arasındaki Temel Farklar

DDR5, DDR4'ün bir sonraki neslidir ve şu alanlarda fark yaratır:

- **Bant genişliği:** DDR5 modülleri genellikle 4800 MHz'den başlayıp 6000-7200 MHz ve üzerine çıkabilirken, DDR4 modülleri tipik olarak 2666-3600 MHz aralığında kalır. Yüksek bant genişliği; video düzenleme, 3D render ve büyük veri setleriyle çalışma gibi senaryolarda fark yaratır.
- **Güç tüketimi:** DDR5, modül üzerinde entegre voltaj regülatörü (PMIC) kullanır ve 1.1V gibi daha düşük bir çalışma voltajıyla çalışır; DDR4 genelde 1.2V civarındadır. Pratikte fark küçük ama dizüstü bilgisayarlarda pil ömrüne olumlu katkısı olabilir.
- **Gecikme (latency):** DDR5'in CAS Latency (CL) değerleri ham rakam olarak DDR4'ten yüksek görünse de, çok daha yüksek çalışma frekansı sayesinde gerçek (mutlak) gecikme genelde DDR4 ile benzer veya biraz daha iyi seviyededir.
- **Fiyat:** DDR5 modülleri ve DDR5 destekleyen anakartlar, DDR4 muadillerine göre halen daha pahalıdır — özellikle Türkiye'de ithalat/kur etkisiyle bu fark daha belirgin hissedilebilir.
- **Oyun performansı:** Çoğu oyunda DDR4'ten DDR5'e geçişin FPS üzerindeki etkisi sınırlıdır (genellikle tek haneli yüzdeler); asıl fark CPU-yoğun senaryolarda ve üretkenlik uygulamalarında ortaya çıkar.

## Hangi Anakart Hangi RAM Tipini Destekler?

Bu, DDR4/DDR5 kararının en kritik noktasıdır: **bir anakart ya sadece DDR4 ya da sadece DDR5 destekler, ikisini birden değil.** Örneğin sitemizdeki [ASUS B550M-A](/anakart/asus-b550m-a) anakartı DDR4 kullanırken, aynı segmentteki bazı yeni nesil anakartlar sadece DDR5 destekler. Anakart ürün sayfasındaki "RAM Tipi" alanına bakarak bunu doğrudan görebilirsiniz.

Elinizde henüz bir anakart yoksa ve sıfırdan platform kuruyorsanız, işlemci soketiniz genelde RAM tipini de belirler:

| Platform                          | Tipik RAM Desteği                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| AMD AM4                           | Yalnızca DDR4                                                                        |
| AMD AM5                           | Yalnızca DDR5                                                                        |
| Intel LGA1700 (12./13./14. Nesil) | Anakart modeline göre DDR4 **veya** DDR5 (ikisi de üretiliyor, aynı anakartta değil) |

Bu yüzden Intel tarafında anakart seçerken özellikle dikkatli olmak gerekir — aynı nesil işlemci için hem DDR4 hem DDR5 anakart seçenekleri satılıyor olabilir.

## Karar Vermeden Önce Sorun: Yükseltme mi, Sıfırdan Kurulum mu?

- **Mevcut bir DDR4 anakartınız varsa** ve sadece RAM kapasitesini artırmak istiyorsanız, DDR4 ile devam etmek neredeyse her zaman daha mantıklıdır. Anakart değişikliği; işlemci, soğutucu ve bazen kasa değişikliğini de tetikleyen zincirleme bir maliyet artışına yol açar.
- **Sıfırdan bir sistem kuruyorsanız** ve bütçeniz elveriyorsa DDR5, sistemin daha uzun süre güncel kalmasını sağlar; yeni nesil işlemcilerin çoğu artık DDR5'e yöneliyor.
- **Bütçe kısıtlıysa**, DDR4 tabanlı bir platform (örneğin AM4 + DDR4) hâlâ çok iyi bir fiyat/performans sunar ve ikinci el piyasasında geniş seçenek bulunur.

Kendi anakartınızın hangi RAM tipini desteklediğinden emin değilseniz, [uyumluluk aracını](/uyumluluk-araci) kullanarak anakartınızı ve almayı düşündüğünüz RAM'i seçin — sistem soket ve tip uyumunu anında kontrol eder.

## Sık Yapılan Hatalar

1. **DDR4 anakarta DDR5 modül takmaya çalışmak (veya tersi):** Modüllerin çentik (notch) konumu farklı olduğu için bu fiziksel olarak mümkün değildir, ama bazı kullanıcılar internetten yanlış uyumluluk bilgisiyle ürün satın alıyor.
2. **Hız uyumsuzluğu:** Anakart aynı RAM tipini destekleyen farklı hızlardaki modülleri genelde çalıştırabilir (JEDEC standart hızında), ancak modülün üzerinde yazan yüksek hız (örn. 6000 MHz) için XMP/EXPO profilinin BIOS'tan etkinleştirilmesi gerekir — aksi halde RAM daha düşük bir hızda çalışabilir.
3. **Tek modülle çift kanal beklemek:** Performansı maksimize etmek için modülleri anakart kılavuzundaki doğru yuvalara (genelde A2/B2) çift kanal halinde takmak gerekir.

## Özet

DDR4 ile DDR5 arasındaki seçim büyük ölçüde elinizdeki (veya almayı planladığınız) anakartın desteklediği tipe bağlıdır. Yükseltme yapıyorsanız mevcut platformunuzla devam etmek genelde en ekonomik yol; sıfırdan kuruyorsanız bütçeniz izin veriyorsa DDR5 geleceğe daha hazırlıklı bir seçim. Karar vermeden önce [anakart kategorisi](/anakart) sayfasından ilgilendiğiniz modelin RAM tipini kontrol etmeyi unutmayın.
