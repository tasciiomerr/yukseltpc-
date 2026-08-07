---
title: "Ekran Kartı Kasaya Sığar mı? Ölçü ve Uyumluluk Rehberi"
seoTitle: "Ekran Kartı Kasaya Sığar mı?"
description: "Ekran kartı uzunluğu, kasa iç ölçüleri ve satın almadan önce hangi kaynaklara bakmanız gerektiği — adım adım kontrol rehberi."
date: "2026-08-09"
keyword: "ekran kartı kasaya sığmıyor ne yapmalıyım"
relatedGuides:
  - "rtx-4060-mu-rx-7600-mu"
  - "hangi-parcayi-once-yukseltmeliyim"
relatedProducts:
  - { kategori: "kasa", slug: "cooler-master-nr200" }
  - { kategori: "kasa", slug: "corsair-5000d-airflow" }
  - { kategori: "ekran-karti", slug: "nvidia-rtx-4090" }
---

Yeni bir ekran kartı sipariş ettiniz, kutu geldi ve kasanıza sığmadığını fark ettiniz — bu, önlenebilecek en can sıkıcı yükseltme hatalarından biridir. Bu rehberde satın almadan önce nasıl kontrol edeceğinizi adım adım anlatıyoruz.

## Neden Bazı Ekran Kartları Kasaya Sığmaz?

Modern ekran kartları, özellikle üst segment modeller, büyük soğutucular nedeniyle oldukça uzun olabilir. Örneğin yüksek performanslı bir [RTX 4090](/ekran-karti/nvidia-rtx-4090) modeli, AIB (partner) versiyonlarında 330-350mm aralığına çıkabilir — bu, kompakt kasaların çoğunda ciddi bir sorun yaratır. Kasanızın "iç GPU bölmesi uzunluğu" bu değerden kısaysa, kart kasaya fiziksel olarak sığmaz; yan panel kapanmaz veya kart hiç yerleşmez.

## Kontrol Etmeniz Gereken İki Ölçü

### 1. Ekran Kartının Uzunluğu (mm)

Bu bilgiyi üreticinin ürün sayfasında veya bizim [ekran kartı kategori sayfamızdaki](/ekran-karti) spesifikasyon tablosunda bulabilirsiniz. Dikkat: **aynı model farklı üreticilerde (AIB) farklı uzunluklarda olabilir** — örneğin bir RTX 4070'in referans tasarımı ile bir AIB'nin "OC" versiyonu birkaç santimetre farklı uzunlukta olabilir. Bu yüzden tam olarak satın almayı düşündüğünüz modelin sayfasına bakın, genel model adına güvenmeyin.

### 2. Kasanın Maksimum GPU Uzunluğu (mm)

Kasa üreticileri genellikle "maksimum ekran kartı uzunluğu" veya "VGA compatibility" olarak bu bilgiyi belirtir. Kompakt kasalarda ([Cooler Master NR200](/kasa/cooler-master-nr200) gibi) bu değer genellikle 300-330mm civarındayken, büyük ATX kasalarda ([Corsair 5000D Airflow](/kasa/corsair-5000d-airflow) gibi) 420mm'ye kadar çıkabilir.

**Kural basit:** Ekran kartı uzunluğu ≤ kasanın maksimum GPU uzunluğu olmalı. Eşit olduğu sınır durumlarda bile teorik olarak sığar, ama birkaç milimetrelik pay bırakmak (kablo toleransı için) her zaman daha güvenlidir.

## Diğer Fiziksel Faktörler

Uzunluk en yaygın sorun olsa da, tek faktör değildir:

- **Kalınlık (slot sayısı):** Güçlü ekran kartları genellikle 2.5-3.5 slot kalınlığındadır ve yan yana PCIe slotlarını kapatabilir — anakartınızdaki diğer genişletme kartlarıyla (ses kartı, ek NVMe kartı gibi) çakışabilir.
- **Yükseklik:** Nadiren sorun olsa da, bazı kompakt kasalarda kartın yüksekliği yan panelle çakışabilir.
- **Güç konektörü yönü ve kablo boşluğu:** Kartın arkasındaki güç kablosu için yeterli boşluk olup olmadığını da göz önünde bulundurun, özellikle dar kasalarda.

## Satın Almadan Önce Hızlı Kontrol Listesi

1. Almayı düşündüğünüz **tam modelin** (AIB dahil) ürün sayfasından uzunluğunu (mm) not edin.
2. Kasanızın üretici sayfasından maksimum GPU uzunluğunu bulun.
3. İki değeri karşılaştırın — kartın uzunluğu kasanın limitinden küçük veya eşit olmalı.
4. Kasanızda zaten bir ön fan veya radyatör varsa, bunun etkin uzunluğu birkaç santimetre azaltabileceğini unutmayın (bazı kasa üreticileri bu senaryo için ayrı bir "radyatör ile" ölçüsü paylaşır).
5. Emin değilseniz [uyumluluk aracımızı](/uyumluluk-araci) kullanın — kasanızı ve ekran kartınızı seçtiğinizde sığıp sığmadığını anında gösterir.

## Ekran Kartı Zaten Elinizdeyse Ne Yapabilirsiniz?

Eğer ekran kartı zaten elinizdeyse ve kasanıza sığmıyorsa seçenekleriniz:

- **Daha büyük bir kasaya geçmek** — en garantili çözüm.
- **Ön fanı veya radyatörü çıkarmak** (varsa) — bazı durumlarda birkaç santimetre kazandırabilir, ama soğutmayı etkiler.
- **Kartı iade etmek/değiştirmek** — mağazanın iade politikasına göre, daha kompakt bir modele (örneğin daha kısa bir AIB versiyonuna) geçmek.

## Özet

Ekran kartı-kasa uyumsuzluğu, satın almadan önce iki basit ölçüyü karşılaştırarak tamamen önlenebilir bir sorundur: kartın uzunluğu ve kasanın maksimum GPU kapasitesi. Her iki değeri de tam model bazında (genel isim değil) kontrol edin ve emin değilseniz [uyumluluk aracımızdan](/uyumluluk-araci) doğrulayın.
