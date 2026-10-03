// Yazım hatasına dayanıklı, yapay zekâsız soru eşleştirici. Ağ yok, anahtar yok; tarayıcıda ve Node'da aynı çalışır.
// Sıra: Türkçe sadeleştirme -> sözcük eşleşmesi (önek / tek harf hatası / sesli harfsiz kısaltma) -> puan -> karar.
(function () {
  "use strict";

  var HARF = { "ı": "i", "İ": "i", "ş": "s", "ğ": "g", "ü": "u", "ö": "o", "ç": "c", "â": "a", "î": "i", "û": "u" };
  function duz(s) {
    return String(s == null ? "" : s)
      .replace(/[ıİşğüöçâîû]/g, function (h) { return HARF[h]; })
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/(.)\1{2,}/g, "$1$1")
      .replace(/\s+/g, " ")
      .trim();
  }

  var DURAK = {};
  "mi mu bir ve da de ne var yok icin ile nasil bu su o ben biz siz misiniz musunuz midir miyim muyum olur mu hangi ama cok biraz lutfen merhaba selam iyi gunler gunaydin acaba istiyorum isterim bilgi almak alabilir miyim".split(" ").forEach(function (w) { DURAK[w] = 1; });

  function iskelet(w) { return w.replace(/[aeiou]/g, ""); }

  // Damerau-Levenshtein (komşu harf yer değiştirmesi dahil), eşiği aşınca erken çıkar.
  function mesafe(a, b, sinir) {
    if (a === b) return 0;
    var n = a.length, m = b.length;
    if (Math.abs(n - m) > sinir) return sinir + 1;
    var onceki2 = null, onceki = [], i, j;
    for (j = 0; j <= m; j++) onceki[j] = j;
    for (i = 1; i <= n; i++) {
      var simdiki = [i], enAz = i;
      for (j = 1; j <= m; j++) {
        var maliyet = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        var d = Math.min(onceki[j] + 1, simdiki[j - 1] + 1, onceki[j - 1] + maliyet);
        if (onceki2 && i > 1 && j > 1 && a.charCodeAt(i - 1) === b.charCodeAt(j - 2) && a.charCodeAt(i - 2) === b.charCodeAt(j - 1)) d = Math.min(d, onceki2[j - 2] + 1);
        simdiki[j] = d;
        if (d < enAz) enAz = d;
      }
      if (enAz > sinir) return sinir + 1;
      onceki2 = onceki; onceki = simdiki;
    }
    return onceki[m];
  }

  // Sorgudaki bir sözcük, bir anahtar sözcüğü ne kadar tutuyor? 0 = hiç, 3 = tam/önek, 2.2 = tek harf hatası, 1.6 = kısaltma
  function sozcukPuani(w, k) {
    if (w === k) return 3;
    var n = k.length;
    if (n >= 3 && w.length >= n && w.slice(0, n) === k) return 3;
    if (n >= 6 && w.length >= 5 && k.slice(0, w.length) === w && n - w.length <= 2) return 2.4;
    if (n >= 6) {
      var tol = n <= 7 ? 1 : 2;
      var kesit = w.slice(0, Math.min(w.length, n + 1));
      if (w.length >= n - 1 && (mesafe(kesit, k, tol) <= tol || mesafe(w.slice(0, n), k, tol) <= tol)) return 2.2;
    } else if (n === 5 && w.length === 5 && w.split("").sort().join("") === k.split("").sort().join("") && mesafe(w, k, 1) <= 1) return 2.2;
    if (w.length >= 3 && n >= 4 && w.indexOf("a") + w.indexOf("e") + w.indexOf("i") + w.indexOf("o") + w.indexOf("u") === -5) {
      var ik = iskelet(k), iw = iskelet(w);
      if (iw.length >= 3 && iw === ik.slice(0, iw.length) && ik.length - iw.length <= 1) return 1.6;
    }
    return 0;
  }

  // ifade: tüm sözcükler (sıra gözetmeksizin, komşu olmasa da) tutmalı; kısa/dolgu sözcükler birebir bulunmalı
  function anahtarPuani(tokenlar, k, tum) {
    var ham = k.split(" "), anlamli = [], i, j;
    for (i = 0; i < ham.length; i++) {
      if (ham[i].length <= 2 || DURAK[ham[i]]) { if (tum.indexOf(ham[i]) < 0) return 0; }
      else anlamli.push(ham[i]);
    }
    if (!anlamli.length) return 0;
    var toplam = 0;
    for (i = 0; i < anlamli.length; i++) {
      var en = 0;
      for (j = 0; j < tokenlar.length; j++) { var p = sozcukPuani(tokenlar[j], anlamli[i]); if (p > en) en = p; }
      if (en < 1.5) return 0;
      toplam += en;
    }
    return anlamli.length === 1 && ham.length === 1 ? toplam : toplam / anlamli.length + (ham.length > 1 ? 1.2 : 0);
  }

  function degerlendir(soru, sss) {
    var q = duz(soru);
    var tum = q.split(" ").filter(Boolean);
    var tokenlar = tum.filter(function (x) { return !DURAK[x]; });
    var sonuc = sss.map(function (e) {
      var toplam = 0, say = 0, gorulen = {};
      (e.k || []).forEach(function (kw) {
        var k = duz(kw);
        if (!k || gorulen[k]) return;
        gorulen[k] = 1;
        var p = anahtarPuani(tokenlar, k, tum);
        if (p > 0) { toplam += p; say++; }
      });
      // en güçlü eşleşme ana puan, ek eşleşmeler küçük destek
      var puan = say ? 0 : 0;
      if (say) {
        var enIyi = 0;
        (e.k || []).forEach(function (kw) { var p = anahtarPuani(tokenlar, duz(kw), tum); if (p > enIyi) enIyi = p; });
        puan = enIyi + Math.min(1, (toplam - enIyi) * 0.25);
      }
      return { e: e, puan: puan * (e.agirlik || 1) };
    }).filter(function (r) { return r.puan > 0; }).sort(function (a, b) { return b.puan - a.puan; });
    return { q: q, tokenlar: tokenlar, siralama: sonuc };
  }

  // tur: "cevap" | "oneri" (emin değil: "şunu mu demek istediniz") | "belirsiz" (iki yakın aday) | "yok"
  function cozumle(soru, sss) {
    var d = degerlendir(soru, sss), s = d.siralama;
    if (!d.tokenlar.length) return { tur: "yok", neden: "bos" };
    if (!s.length) return { tur: "yok", neden: "eslesme-yok", puan: 0 };
    var a = s[0], b = s[1];
    if (a.puan >= 1.8) {
      if (b && b.puan >= 1.8 && a.puan - b.puan < 0.35) return { tur: "belirsiz", adaylar: [a.e, b.e], puan: a.puan };
      return { tur: "cevap", e: a.e, puan: a.puan };
    }
    if (a.puan >= 1.3) return { tur: "oneri", e: a.e, puan: a.puan };
    return { tur: "yok", neden: "dusuk", puan: a.puan };
  }

  var API = { duz: duz, mesafe: mesafe, sozcukPuani: sozcukPuani, cozumle: cozumle, degerlendir: degerlendir };
  if (typeof window !== "undefined") window.Eslestir = API;
  if (typeof module !== "undefined") module.exports = API;
})();
