---
title: "Güç Kaynağı (PSU) Kaç Watt Olmalı? Hesaplama Rehberi"
seoTitle: "PSU Kaç Watt Olmalı? Hesaplama Rehberi"
description: "Bileşen bazlı güç tüketimi mantığı, tampon payı neden gerekli ve sisteminiz için doğru güç kaynağını nasıl seçeceğiniz."
date: "2026-08-06"
keyword: "psu kaç watt olmalı hesaplama"
relatedGuides:
  - "rtx-4060-mu-rx-7600-mu"
  - "5000-tl-ekran-karti-onerisi-2026"
relatedProducts:
  - { kategori: "guc-kaynagi", slug: "corsair-cv550" }
  - { kategori: "guc-kaynagi", slug: "asus-tuf-gaming-650b" }
  - { kategori: "ekran-karti", slug: "nvidia-rtx-4060" }
---

Güç kaynağı (PSU), sisteminizin en görmezden gelinen ama en kritik parçalarından biridir. Yetersiz bir güç kaynağı; ani kapanmalara, yeniden başlatmalara, yoğun yükte performans düşüşüne ve en kötü senaryoda bileşenlere zarar vermeye kadar giden sorunlara yol açabilir. Bu rehberde doğru watt değerini nasıl hesaplayacağınızı anlatıyoruz.

## Neden Fazladan Güç Payı Bırakmalısınız?

Bir bileşenin üzerinde yazan **TDP (Thermal Design Power)** değeri, o parçanın _tipik_ maksimum ısı/güç üretimini gösterir; ama gerçek kullanımda anlık tüketim (özellikle oyun içi ani yüklerde veya aşırı performans/"boost" modlarında) bu değerin üzerine çıkabilir. Ayrıca sisteminizde depolama, fanlar, RGB aydınlatma ve anakart gibi diğer bileşenlerin de bir güç payı vardır. Bu yüzden yalnızca CPU + GPU TDP'sini toplayıp güç kaynağı almak riskli olur.

YükseltPC'nin [uyumluluk aracında](/uyumluluk-araci) kullandığımız basit ve güvenli formül şu şekildedir:

```
Gerekli Watt = İşlemci TDP + Ekran Kartı TDP + 150W tampon
```

150W'lık tampon; anakart, RAM, depolama, fanlar ve ani yük dalgalanmalarını kapsayacak şekilde belirlenmiş, orta seviye bir sistem için makul bir güvenlik payıdır.

## Örnek Hesaplama

Sitemizdeki örnek bileşenlerle bir hesaplama yapalım:

- [AMD Ryzen 5 5600](/islemci/amd-ryzen-5-5600): 65W TDP
- [NVIDIA GeForce RTX 4060](/ekran-karti/nvidia-rtx-4060): 115W TDP

Gerekli Watt = 65 + 115 + 150 = **330W**

Bu durumda piyasada bulunan 550W'lık bir güç kaynağı (örneğin [Corsair CV550](/guc-kaynagi/corsair-cv550)) bu sistem için fazlasıyla yeterlidir; hatta ileride ekran kartı yükseltmesi yapmak isterseniz de belli bir pay bırakır.

Daha güçlü bir ekran kartıyla, örneğin [AMD Radeon RX 7600](/ekran-karti/amd-rx-7600) (165W TDP) kullanırsanız:

Gerekli Watt = 65 + 165 + 150 = **380W**

Bu senaryoda da 550W bir güç kaynağı hâlâ rahat çalışır, ancak gelecekte daha güçlü bir işlemci veya ekran kartına geçmeyi planlıyorsanız [ASUS TUF Gaming 650B](/guc-kaynagi/asus-tuf-gaming-650b) gibi 650W'lık bir modeli tercih etmek daha uzun ömürlü bir yatırım olur.

## Kendi Sisteminiz İçin Hızlı Kontrol

Kendi bileşenlerinizle bu hesabı elle yapmak yerine [uyumluluk aracını](/uyumluluk-araci) kullanabilirsiniz: işlemci ve ekran kartınızı seçtiğinizde gerekli watt değeri otomatik hesaplanır, ardından sahip olduğunuz (veya almayı düşündüğünüz) güç kaynağını seçtiğinizde yeterli olup olmadığını yeşil/kırmızı bir sonuçla anında görürsünüz.

## Sertifika ve Modülerlik: Watt Kadar Önemli mi?

Watt değeri kadar dikkat edilmesi gereken iki nokta daha var:

- **80+ Sertifikası** (Bronze, Gold, Platinum gibi): Güç kaynağının elektrik enerjisini ne kadar verimli kullandığını gösterir. Daha yüksek sertifika, daha az ısı ve daha düşük elektrik faturası anlamına gelir, ancak fiyatı da artırır. Orta seviye bir sistem için 80+ Bronze genellikle yeterlidir.
- **Modülerlik:** Modüler güç kaynaklarında yalnızca ihtiyacınız olan kabloları takarsınız, bu da kasa içi hava akışını ve kablo yönetimini kolaylaştırır. Modüler olmayan modeller biraz daha ekonomiktir.

## Aşırı Performans (Overclock) Yapıyorsanız Ekstra Pay Bırakın

Standart formülümüzdeki 150W'lık tampon, fabrika ayarlarında çalışan bir sistem için hesaplanmıştır. İşlemcinizi veya ekran kartınızı aşırı performans (overclock) ile daha yüksek saat hızlarında çalıştırıyorsanız, güç tüketimi TDP değerinin belirgin şekilde üzerine çıkabilir. Bu durumda hesapladığınız değere ek olarak %10-20 daha pay bırakmanız daha güvenli olur.

## Güç Kaynağını Değiştirmeden Önce Sorun

Yeni bir güç kaynağı almadan önce şu soruları kendinize sorun:

- **Mevcut güç kaynağım gerçekten yetersiz mi, yoksa arızalı mı?** Bazı "yetersiz güç" belirtileri (ani kapanma, yeniden başlama) aslında arızalı veya yaşlanmış bir güç kaynağından kaynaklanabilir, watt yetersizliğinden değil.
- **Gelecekte yükseltme planlıyor muyum?** Sadece şu anki ihtiyacınıza göre değil, 1-2 yıl içinde yapmayı düşündüğünüz bir ekran kartı yükseltmesini de hesaba katarak biraz daha yüksek watt'lı bir model seçmek uzun vadede tasarruf sağlar.
- **Kablolarım yeterli mi?** Yeni nesil yüksek TDP'li ekran kartları bazen ek PCIe güç konektörleri gerektirir; aldığınız güç kaynağının bu konektörleri desteklediğinden emin olun.

## Genel Öneriler

- **Giriş seviye sistemler** (entegre grafik veya düşük TDP'li ekran kartı): 450-500W genellikle yeterlidir.
- **Orta seviye sistemler** (örn. Ryzen 5 + RTX 4060 sınıfı): 550-650W rahat bir seçimdir.
- **Üst seviye sistemler** (yüksek TDP'li ekran kartları, çift depolama, aşırı performans ayarları): 750W ve üzeri düşünülmelidir.

Her zaman hesapladığınız minimum değerin biraz üzerinde bir güç kaynağı seçmek; hem sistem kararlılığı hem de ileride yapacağınız yükseltmeler için mantıklıdır. Gücü fazla tutmak neredeyse hiçbir zaman israf değildir — güç kaynağı yalnızca sistemin ihtiyacı kadar tüketir, kapasitesinin tamamını değil.
