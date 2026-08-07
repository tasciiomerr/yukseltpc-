---
title: "Sıfır mı 2. El mi Almalı? Bilgisayar Parçası Alırken Karar Rehberi"
seoTitle: "Sıfır mı 2. El mi Almalı? Karar Rehberi"
description: "Bilgisayar parçası alırken sıfır ile 2. el arasındaki risk/getiri dengesi, hangi parçalarda 2. el mantıklı, hangilerinde risklidir?"
date: "2026-08-06"
keyword: "sıfır mı 2. el mi almalı"
relatedGuides:
  - "5000-tl-ekran-karti-onerisi-2026"
  - "hangi-parcayi-once-yukseltmeliyim"
relatedProducts:
  - { kategori: "ekran-karti", slug: "amd-rx-7600" }
  - { kategori: "islemci", slug: "amd-ryzen-5-5600" }
---

Bütçenizi zorlamadan daha güçlü bir sisteme sahip olmanın en bilinen yolu 2. el piyasasıdır. Ama her parça için 2. el almak aynı derecede mantıklı değildir — bazı bileşenlerde risk düşükken bazılarında ciddi riskler var. Bu rehberde parça bazında karar vermenize yardımcı olacak somut kriterler sunuyoruz.

## Genel Prensip: Hareketli Parça mı, Sabit Parça mı?

En basit kural şu: **içinde hareketli/aşınan parça olmayan bileşenler** (anakart, RAM, kasa gibi) 2. el almak için görece güvenlidir; **yoğun ısı/yük altında çalışan veya hareketli parça içeren bileşenler** (ekran kartı, güç kaynağı, HDD, fanlı soğutucular) daha dikkatli değerlendirilmelidir.

## Parça Parça Sıfır/2. El Değerlendirmesi

### İşlemci (CPU) — Genelde Güvenli

İşlemcilerin hareketli parçası yoktur ve normal kullanımda aşınmazlar (aşırı performans/overclock ve uzun süreli aşırı ısınma dışında). 2. el bir [AMD Ryzen 5 5600](/islemci/amd-ryzen-5-5600) gibi bir işlemci, satıcı güvenilirse genellikle sıfırından çok az risklidir ve belirgin bir tasarruf sağlar.

**Dikkat:** Pin veya soket üzerinde fiziksel hasar olup olmadığını, ürünün "tray" (perakende kutusuz) mü "box" mu olduğunu ve garantinin devam edip etmediğini sorun.

### Anakart — Dikkatli Olun ama Genelde Makul

Anakartlarda kondansatör şişmesi, yanık iz veya BIOS pil sorunları gibi görsel olarak tespit edilebilecek arızalar olabilir. Güvenilir bir satıcıdan, çalışır durumda test edilmiş bir anakart almak genelde makul bir risktir.

### RAM — Düşük Risk

RAM modüllerinin arıza oranı düşüktür ve çoğu üretici uzun garanti (bazen ömür boyu) sunar. 2. el RAM almak, tip (DDR4/DDR5) ve hız uyumluluğunu doğruladığınız sürece genellikle güvenlidir.

### Ekran Kartı (GPU) — En Dikkatli Olunması Gereken Parça

Ekran kartları hem yüksek ısı altında çalışır hem de (özellikle geçmiş dönemlerde) kripto para madenciliğinde yoğun kullanılmış olabilir. 7/24 yüksek yükte çalıştırılmış bir kart, kısa vadede sorunsuz görünse bile fan rulmanları ve termal macun/pad ömrü açısından daha riskli olabilir.

2. el ekran kartı alırken:

- Satıcıdan kartın madencilik amaçlı kullanılıp kullanılmadığını sorun.
- Mümkünse GPU-Z gibi bir araçla çalışma süresini (varsa) veya en azından görsel olarak toz/yıpranma durumunu kontrol edin.
- Fiyat farkının makul olup olmadığını [ekran kartı kategori sayfamızdaki](/ekran-karti) sıfır/2. el fiyat aralıklarıyla karşılaştırın — örneğin [RX 7600](/ekran-karti/amd-rx-7600) için sıfır ve 2. el arasındaki fark küçükse, sıfır almak daha güvenli bir tercih olabilir.

### Güç Kaynağı (PSU) — Önerilmez (veya Çok Dikkatli)

Güç kaynağı, arızalandığında diğer tüm bileşenlere zarar verebilecek tek parçadır. Kalitesiz veya yıpranmış bir güç kaynağının garanti dışı arızası, işlemci, anakart ve ekran kartınızı da beraberinde götürebilir. Bu yüzden güç kaynağında **sıfır almak** ciddi şekilde önerilir; 2. el alacaksanız yalnızca güvenilir, garantisi devam eden ve tanıdığınız bir kaynaktan alın.

### Depolama (SSD/HDD) — Karma

SSD'lerde yazma/silme döngüsü sınırı vardır ama modern SSD'ler için bu sınır normal kullanıcı için pratikte çok yüksektir; SMART verisiyle "sağlık" durumu kontrol edilebiliyorsa 2. el SSD makul bir risktir. HDD'lerde ise mekanik aşınma daha belirgindir — çalışma saatini (power-on hours) mutlaka sorun.

### Kasa ve Soğutucu — Düşük Risk

Kasa ve hava soğutucular temelde mekanik/yapısal parçalardır, elektronik arıza riski düşüktür. Sıvı soğutucularda (AIO) ise pompa ömrü ve sızıntı riski nedeniyle sıfır almak biraz daha güvenli bir tercih olabilir.

## Hızlı Karar Tablosu

| Bileşen              | 2. El İçin Uygunluk                                   |
| -------------------- | ----------------------------------------------------- |
| İşlemci              | Yüksek — genelde güvenli                              |
| Anakart              | Orta-Yüksek — görsel kontrol yapın                    |
| RAM                  | Yüksek — düşük risk                                   |
| Ekran Kartı          | Orta — satıcı geçmişini mutlaka sorgulayın            |
| Güç Kaynağı          | Düşük — mümkünse sıfır tercih edin                    |
| SSD                  | Orta-Yüksek — SMART verisi kontrol edilebiliyorsa iyi |
| HDD                  | Orta — çalışma saatine dikkat                         |
| Kasa / Hava Soğutucu | Yüksek — düşük risk                                   |
| Sıvı Soğutucu (AIO)  | Orta — pompa ömrüne dikkat                            |

## Özet

2. el almak her zaman "riskli" değildir — asıl önemli olan parçanın doğasına göre riski değerlendirmektir. İşlemci, RAM ve kasa gibi bileşenlerde 2. el genellikle güvenli bir tasarruf sağlarken; güç kaynağı gibi kritik ve arızası zincirleme hasar yaratabilecek parçalarda sıfır almak daha akıllıca olur. Her ürün sayfamızda hem sıfır hem 2. el fiyat aralığını yan yana görebilir, kendi risk toleransınıza göre karar verebilirsiniz.
