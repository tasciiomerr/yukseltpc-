---
title: "Darboğaz (Bottleneck) Nedir? İşlemci-Ekran Kartı Dengesi Nasıl Kurulur"
seoTitle: "Darboğaz (Bottleneck) Nedir?"
description: "Darboğaz kavramının sade anlatımı, işlemci mi ekran kartı mı darboğaz yapıyor nasıl anlaşılır ve yaygın yanlış eşleştirme örnekleri."
date: "2026-08-09"
keyword: "işlemci darboğaz yapıyor mu nasıl anlarım"
relatedGuides:
  - "bilgisayarim-neden-yavas"
  - "hangi-parcayi-once-yukseltmeliyim"
relatedProducts:
  - { kategori: "islemci", slug: "amd-ryzen-5-5600" }
  - { kategori: "ekran-karti", slug: "nvidia-rtx-4070-super" }
---

"Darboğaz yapıyor mu?" sorusu, yükseltme yapmadan önce en sık sorulan sorulardan biridir ama çoğu zaman yanlış anlaşılır. Bu rehberde darboğazın gerçekte ne olduğunu, nasıl tespit edileceğini ve en yaygın hataları açıklıyoruz.

## Darboğaz (Bottleneck) Nedir?

Darboğaz, sisteminizdeki bir bileşenin diğerinin potansiyelini tam kullanmasını engellemesi durumudur. En sık konuşulan senaryo **işlemci-ekran kartı darboğazıdır**: güçlü bir ekran kartınız olsa bile, zayıf veya eski bir işlemci ona yeterli "veri" gönderemezse, ekran kartı tam kapasitede çalışamaz ve beklenen FPS'i alamazsınız.

Önemli bir nokta: **darboğaz her zaman kötü bir şey değildir.** Her sistemde teknik olarak bir bileşen diğerinden "daha güçlüdür" — asıl sorun bu dengesizliğin ciddi performans kaybına yol açacak kadar büyük olmasıdır.

## Darboğazı Nasıl Tespit Edersiniz?

En pratik yöntem, oyun oynarken görev yöneticisinden (Ctrl+Shift+Esc) CPU ve GPU kullanım oranlarını izlemektir:

- **GPU kullanımı %95-100, CPU kullanımı %50-70 civarı:** Ekran kartı darboğazı — sistem dengeli veya GPU'nun işi CPU'dan ağır, bu normal ve beklenen bir durumdur.
- **CPU kullanımı %90-100'e yakın, GPU kullanımı düşük (%60'ın altı):** İşlemci darboğazı — işlemci ekran kartını "besleyemiyor", bu istenmeyen bir dengesizliktir.
- **Her ikisi de yüksek:** Sistem dengeli çalışıyor, darboğaz söz konusu değil.

## Yaygın Yanlış Eşleştirme Örnekleri

### Örnek 1: Eski İşlemci + Üst Segment Ekran Kartı

Örneğin 4 çekirdekli, eski nesil bir işlemciyle [RTX 4070 Super](/ekran-karti/nvidia-rtx-4070-super) gibi güçlü bir ekran kartı eşleştirmek, özellikle 1080p çözünürlükte belirgin bir CPU darboğazına yol açar — çünkü düşük çözünürlükte GPU'nun işi azalır, CPU'nun işi (fizik hesaplamaları, oyun mantığı, çizim komutları hazırlama) öne çıkar.

### Örnek 2: Çözünürlük Faktörü

Aynı sistem 1440p veya 4K'da oynatıldığında darboğaz etkisi azalır çünkü GPU'nun işi artar, CPU'nun görece önemi düşer. Bu yüzden "bu işlemci bu ekran kartıyla darboğaz yapar mı?" sorusunun cevabı **hangi çözünürlükte oynadığınıza göre değişir.**

### Örnek 3: Bütçe Ekran Kartı + Güçlü İşlemci

Tam tersi de mümkündür: [AMD Ryzen 5 5600](/islemci/amd-ryzen-5-5600) gibi dengeli bir işlemciyle çok bütçe bir ekran kartı eşleştirirseniz, bu sefer GPU darboğazı yaşarsınız — işlemci boşta beklerken ekran kartı sınırlarında çalışır. Bu aslında normal ve beklenen bir durumdur; sorun değildir.

## Darboğaz "Sıfırlanabilir mi"?

Gerçekte tamamen darboğazsız bir sistem kurmak neredeyse imkansızdır — her zaman bir bileşen diğerinden biraz daha güçlü olur. Amaç mükemmel dengeyi bulmak değil, **ciddi ve gereksiz bir dengesizlikten kaçınmaktır.** Örneğin bütçenizin çoğunu ekran kartına ayırıp işlemciyi ihmal etmek (veya tam tersi), paranızın bir kısmının boşa gitmesine neden olur.

## Pratik Öneriler

1. **Çözünürlüğünüzü belirleyin.** 1080p'de oynuyorsanız işlemci daha kritik hale gelir; 4K'da GPU öne çıkar.
2. **Bileşenleri aynı segmentte tutun.** Üst segment bir ekran kartını orta segment bir işlemciyle, ya da tam tersini eşleştirmekten kaçının.
3. **Yükseltme yaparken dengeyi koruyun.** Sadece ekran kartını yükseltip işlemciyi hiç değiştirmediğinizde, bir süre sonra işlemci darboğaza dönüşebilir — detaylar için [Hangi Parçayı Önce Yükseltmeliyim?](/rehber/hangi-parcayi-once-yukseltmeliyim) rehberimize bakın.
4. **Genel yavaşlık ile darboğazı karıştırmayın.** Sisteminiz her türlü kullanımda yavaşsa (sadece oyunda değil), sorun darboğazdan çok RAM/disk/ısınma kaynaklı olabilir — bkz. [Bilgisayarım Neden Yavaş?](/rehber/bilgisayarim-neden-yavas)

## Özet

Darboğaz, sisteminizdeki bir bileşenin diğerini "beklettiği" durumdur ve genellikle işlemci-ekran kartı dengesizliğinden kaynaklanır. Görev yöneticisinden CPU/GPU kullanım oranlarını karşılaştırarak hangi bileşenin darboğaz yaptığını tespit edebilir, bileşenlerinizi benzer performans segmentinde tutarak bu riski en aza indirebilirsiniz. Mükemmel dengeyi aramak yerine, ciddi dengesizliklerden kaçınmaya odaklanın.
