// Tuz & Maya Fırın (KURGUSAL marka): işletmenin onayladığı cevaplar. Asistan yalnız bunları gösterir.
// k: eşleşme sözcükleri (aksansız yazılabilir; yazım hatası ve kısaltma toleranslıdır). Birden çok sözcüklü ifade tam eşleşir.
// eylem: wa = WhatsApp'a hazır mesajla yönlendir, tel = ara, bag = sayfa içi bağlantı.
(function () {
  "use strict";
  var ISLETME = {
    ad: "Tuz & Maya",
    kisa: "Tuz & Maya Fırın",
    tel: "+90 258 000 00 00",
    guncelleme: "3 Ekim 2026"
  };

  var SSS = [
    {
      id: "saat",
      s: "Çalışma saatleriniz nedir?",
      c: "Salı'dan Pazar'a 07:00 – 19:00 arası açığız. Pazartesi günleri kapalıyız; resmî tatillerde duyuruyu kapıya asıyoruz.",
      k: ["saat", "acik", "kapali", "kacta", "kaca kadar", "calisma", "mesai", "pazartesi", "pazar", "cumartesi", "bayram", "tatil", "ne zaman acil", "acilis", "kapanis"]
    },
    {
      id: "sicak",
      s: "Ekmek ne zaman fırından çıkıyor?",
      c: "Ekşi mayalı ekmekler günde iki partidir: sabah 07:30 ve öğleden sonra 15:00. İkinci parti sınırlıdır, akşama kadar kalmayabilir.",
      k: ["firindan", "sicak ekmek", "taze", "parti", "ne zaman cikiyor", "ekmek ne zaman", "cikis saati", "tukeniyor", "bitiyor", "kalir mi", "ekmek saat"],
      eylem: [{ tur: "bag", ad: "Bugünün fırını", href: "#firin" }]
    },
    {
      id: "urunler",
      s: "Hangi ürünleriniz var?",
      c: "Ekşi mayalı ekmekler, zeytinli ve çavdarlı çeşitler, tahinli çörek ve simit, tatlı tarafta poğaça ve günlük pasta. Kahvaltı servisimiz yok. Güncel liste ve saatler sayfadaki 'Bugün fırında' bölümünde.",
      k: ["urun", "cesit", "menu", "simit", "pogaca", "borek", "neler var", "ne var", "kahvalti", "corek", "tatli", "baget", "kruvasan", "ne satiyorsunuz"],
      eylem: [{ tur: "bag", ad: "Bugün fırında", href: "#firin" }]
    },
    {
      id: "siparis",
      agirlik: 0.85,
      s: "Önceden sipariş verip ayırtabilir miyim?",
      c: "Evet. Bir önceki gün 20:00'ye kadar WhatsApp'tan yazarsanız ekmeğinizi adınıza ayırır, ertesi gün tezgâhta hazır bekletiriz. Ödemeyi teslim alırken yaparsınız.",
      k: ["siparis", "ayirt", "ayirtabilir", "rezerv", "onceden", "adima", "hazir bekle", "bir gun once"],
      eylem: [{ tur: "wa", ad: "Siparişi WhatsApp'tan yaz", mesaj: "Merhaba, yarın için ekmek ayırtmak istiyorum: " }]
    },
    {
      id: "pasta",
      s: "Doğum günü pastası yaptırmak istiyorum.",
      c: "Pastalarımız en az 3 gün önceden, 6 kişilik ve üstü olarak yapılır. Tat ve boy seçimi için WhatsApp'tan yazmanız yeter; fiyat boya göre netleşir, ben burada rakam vermem.",
      k: ["pasta", "dogum gunu", "yas pasta", "ozel gun", "tart", "kutlama", "surpriz", "yildonumu", "mum"],
      eylem: [{ tur: "wa", ad: "Pasta için yazın", mesaj: "Merhaba, doğum günü pastası yaptırmak istiyorum. Kişi sayısı: , tarih: " }]
    },
    {
      id: "alerjen",
      s: "Alerji / gluten konusunda ne yapıyorsunuz?",
      c: "Tek mutfakta çalışıyoruz; ürünlerde gluten, süt, yumurta, fındık ve susam bulunabilir ve çapraz bulaşma olabilir. Glutensiz ürünümüz yok. Alerjiniz varsa kesin bilgi için tezgâhtaki alerjen listesine bakın ya da bize yazın.",
      k: ["gluten", "glutensiz", "alerji", "alerjen", "colyak", "fistik", "findik", "susam", "intolerans", "hassasiyet", "icinde ne var", "icerik"],
      eylem: [{ tur: "wa", ad: "Alerjiyi yazarak sorun", mesaj: "Merhaba, alerjim var: . Şu ürünün içeriğini öğrenmek istiyorum: " }]
    },
    {
      id: "vegan",
      s: "Vegan ya da sütsüz ürününüz var mı?",
      c: "Ekşi mayalı sade ekmek, zeytinli ekmek ve tahinli çörek hamurunda süt ve yumurta kullanmıyoruz. Poğaça, börek ve pastalarda süt ürünü var. Güncel liste için tezgâhtaki kartı kontrol edin.",
      k: ["vegan", "sutsuz", "yumurtasiz", "bitkisel", "vejetaryen", "hayvansal"]
    },
    {
      id: "adres",
      s: "Neredesiniz, nasıl gelirim?",
      c: "Örnek Mah. Maya Sk. No: 3, Denizli (kurgusal adres). Önümüzde kısa süreli park yeri var; yürüyerek gelmek en rahatı. Yol tarifi için bize yazabilirsiniz.",
      k: ["adres", "nerede", "neredesiniz", "konum", "yol tarifi", "harita", "nasil gelirim", "otopark", "park yeri", "ulasim", "hangi mahalle", "nerde"],
      eylem: [{ tur: "wa", ad: "Yol tarifi isteyin", mesaj: "Merhaba, fırına nasıl gelebilirim? Şu noktadan geliyorum: " }]
    },
    {
      id: "odeme",
      s: "Nasıl ödeme yapabilirim?",
      c: "Nakit ve kredi/banka kartı geçerli. Yemek kartı ve taksit şu an yok.",
      k: ["odeme", "kart", "nakit", "yemek karti", "taksit", "pos", "kredi", "banka", "multinet", "sodexo", "temassiz", "havale"]
    },
    {
      id: "teslimat",
      s: "Eve teslim ya da kargo var mı?",
      c: "Eve teslim ve kargo yok; ürünleri fırından teslim alıyorsunuz. Yoğun saatlerde beklememek için önceden ayırtmanızı öneririz.",
      k: ["kurye", "eve teslim", "paket servis", "teslimat", "kargo", "getir", "gonder", "adrese", "eve gelir", "yemeksepeti", "trendyol yemek", "online siparis"]
    },
    {
      id: "fiyat",
      s: "Fiyatlar ne kadar?",
      c: "Güncel fiyatları tezgâhta ve sayfadaki fırın listesinde gösteriyoruz; hammadde fiyatı değişince liste de değişiyor. Bu sayfadaki rakamlar örnektir. Sizin için kesin bilgi: tezgâhtaki liste ya da WhatsApp.",
      k: ["fiyat", "kac para", "ucret", "kac tl", "ne kadar", "pahali", "ucuz", "indirim", "kampanya", "liste", "tutar", "bedel"],
      eylem: [{ tur: "bag", ad: "Fırın listesi", href: "#firin" }]
    },
    {
      id: "oturma",
      s: "Fırında oturup çay ya da kahve içilir mi?",
      c: "İçeride 12 kişilik küçük bir bar masa var. Filtre kahve ve çay yapıyoruz. Bilgisayarla uzun çalışmak için uygun bir yer değil, burası fırın.",
      k: ["oturmak", "oturabilir", "kahve", "cay", "masa", "kafe", "wifi", "internet", "calisabilir", "laptop", "bar", "sandalye", "yer var mi"]
    },
    {
      id: "toplu",
      s: "Toplu ya da kurumsal sipariş alıyor musunuz?",
      c: "Evet; ofis kahvaltısı, etkinlik ve toplantı ikramları için 20 kişiye kadar bir gün önceden, daha fazlası için 3 gün önceden yazmanızı rica ederiz. Tür ve kişi sayısına göre ayrı teklif hazırlarız.",
      k: ["toplu", "kurumsal", "etkinlik", "dugun", "ikram", "kisilik", "catering", "toplanti", "ofis", "organizasyon", "toptan", "bayi", "sirket"],
      eylem: [{ tur: "wa", ad: "Teklif isteyin", mesaj: "Merhaba, toplu sipariş için bilgi almak istiyorum. Tarih: , kişi sayısı: " }]
    },
    {
      id: "atolye",
      s: "Ekşi maya atölyesi ya da maya veriyor musunuz?",
      c: "Ayda bir Cumartesi sabahı 4 kişilik küçük bir ekşi maya atölyesi yapıyoruz. Katılanlara kendi mayalarını veririz. Yer açıldığında duyuruyu burada ve kapıda paylaşırız; kayıt için WhatsApp.",
      k: ["atolye", "kurs", "egitim", "maya ver", "eksi maya", "starter", "ogren", "workshop", "ders", "hamur nasil"],
      eylem: [{ tur: "wa", ad: "Atölyeye yazılın", mesaj: "Merhaba, ekşi maya atölyesi için yer var mı? Kişi sayısı: " }]
    },
    {
      id: "erisim",
      s: "Evcil hayvan, bebek arabası ve engelli erişimi?",
      c: "Kapıda rampa var; bebek arabası ve tekerlekli sandalye girebilir. Evcil hayvanları sağlık kuralları nedeniyle içeri alamıyoruz; kapının önünde su kabı bırakıyoruz.",
      k: ["kopek", "kedi", "evcil", "hayvan", "bebek arabasi", "cocuk", "tekerlekli", "engelli", "erisilebilir", "rampa", "yasli", "bebek"]
    },
    {
      id: "saklama",
      s: "Ekşi mayalı ekmeği nasıl saklarım?",
      c: "Dilimlenmemiş ekmeği kesim yüzü aşağı, bezle ya da kâğıt torbada 3-4 gün saklayabilirsiniz. Daha uzun süre için dilimleyip dondurun, tostta çevirin. Poşette bekletmeyin, kabuk yumuşar.",
      k: ["sakla", "bayatla", "dondur", "buzluk", "kac gun", "dolap", "nasil yenir", "isitma", "yeniden isit", "bayat"]
    },
    {
      id: "sorun",
      s: "Ürünle ilgili bir sorun yaşadım.",
      c: "Bunun için üzgünüm. Bu tür durumları ben çözemem; sizi doğrudan sahibine yönlendiriyorum. Fişiniz ya da fotoğrafınızla yazarsanız aynı gün dönülür.",
      k: ["sikayet", "iade", "bozuk", "yanlis", "hatali", "memnun degil", "sorun", "kotu", "gec kaldi", "eksik", "para iadesi", "kuf", "yabanci madde"],
      eylem: [{ tur: "wa", ad: "Sahibine yazın", mesaj: "Merhaba, aldığım ürünle ilgili bir sorun yaşadım: " }],
      direkt: true
    },
    {
      id: "is",
      s: "İş başvurusu ya da staj yapabilir miyim?",
      c: "Şu an açık ilanımız yok. İlgileniyorsanız kısa tanıtımınızı WhatsApp'tan gönderin, açılış olduğunda size dönelim.",
      k: ["is basvuru", "ilan", "calismak", "staj", "eleman", "personel", "cv", "is ariyorum", "kadro", "usta ol"],
      eylem: [{ tur: "wa", ad: "Tanıtım gönderin", mesaj: "Merhaba, iş/staj için yazıyorum. Kısaca: " }]
    }
  ];

  var FIRIN = [
    { ad: "Ekşi mayalı köy ekmeği", not: "800 g · 36 saat mayalı", fiyat: 95, parti: "07:30 · 15:00" },
    { ad: "Zeytinli ekşi maya", not: "yeşil zeytin, kekik", fiyat: 115, parti: "07:30" },
    { ad: "Çavdarlı bütün buğday", not: "ince dilimlenmeye uygun", fiyat: 105, parti: "07:30 · 15:00" },
    { ad: "Tahinli çörek", not: "susamlı, tek tek sarılır", fiyat: 48, parti: "08:00" },
    { ad: "Tereyağlı simit", not: "ince, çıtır", fiyat: 28, parti: "07:00" }
  ];

  var V = { ISLETME: ISLETME, SSS: SSS, FIRIN: FIRIN };
  if (typeof window !== "undefined") window.TUZMAYA = V;
  if (typeof module !== "undefined") module.exports = V;
})();
