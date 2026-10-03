// Tuz & Maya SSS asistanı arayüzü. Yapay zekâsız: yalnız veri.js'teki onaylı cevaplar, ağ isteği/çerez/kayıt yok.
(function () {
  "use strict";

  var CSS = "\
.as-ac,.as-kutu{--as-renk:#A9481C;--as-koyu:#2A1D12;--as-un:#F3ECDF;--as-kagit:#FBF7EF;--as-yazi:#221810;--as-mat:#6A5E4F;--as-cizgi:rgba(34,24,16,.14);font-family:'Hanken Grotesk Variable','Hanken Grotesk',system-ui,sans-serif;-webkit-font-smoothing:antialiased}\
.as-ac{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:60;display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 20px 0 16px;border:0;border-radius:999px;background:var(--as-koyu);color:var(--as-un);font:600 15px/1 inherit;font-family:inherit;box-shadow:0 14px 36px -10px rgba(34,24,16,.6),0 0 0 1px rgba(243,236,223,.08) inset;cursor:pointer;transition:transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s}\
.as-ac:hover{transform:translateY(-2px)}\
.as-ac svg{width:20px;height:20px;flex:none;color:#F0B27A}\
.as-ac[hidden],.as-kutu[hidden]{display:none}\
.as-ac:focus-visible,.as-x:focus-visible,.as-chip:focus-visible,.as-btn:focus-visible,.as-giris:focus-visible,.as-yolla:focus-visible{outline:3px solid #F0B27A;outline-offset:2px}\
.as-kutu{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:61;width:min(392px,calc(100vw - 36px));height:min(640px,calc(100svh - 40px));display:flex;flex-direction:column;background:var(--as-un);color:var(--as-yazi);border-radius:20px;overflow:hidden;box-shadow:0 40px 90px -24px rgba(34,24,16,.7),0 0 0 1px rgba(34,24,16,.16);font-size:15px;line-height:1.5;animation:as-gel .32s cubic-bezier(.2,.8,.2,1)}\
@keyframes as-gel{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}\
.as-ust{display:flex;align-items:center;gap:12px;padding:16px 16px 14px 18px;background:var(--as-koyu);color:var(--as-un)}\
.as-logo{flex:none;width:38px;height:38px;border-radius:50%;background:var(--as-renk);display:grid;place-items:center;font:600 18px/1 'Fraunces Variable','Fraunces',Georgia,serif;font-style:italic;color:#FFF3E3}\
.as-ust b{display:block;font-size:16px;font-weight:650;letter-spacing:.01em}\
.as-ust small{display:flex;align-items:center;gap:7px;font-size:12.5px;color:rgba(243,236,223,.78);margin-top:1px}\
.as-ust small i{width:7px;height:7px;border-radius:50%;background:#8FD19E;flex:none}\
.as-ust>div{flex:1;min-width:0}\
.as-x{flex:none;width:44px;height:44px;margin:-6px -6px -6px 0;border-radius:50%;border:0;background:transparent;color:var(--as-un);font-size:26px;line-height:1;cursor:pointer}\
.as-x:hover{background:rgba(243,236,223,.12)}\
.as-akis{flex:1;overflow-y:auto;padding:18px 16px 10px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain;scroll-behavior:smooth}\
.as-m{max-width:90%;padding:11px 14px;border-radius:16px;overflow-wrap:anywhere;animation:as-m .28s ease-out}\
@keyframes as-m{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}\
.as-m.bot{align-self:flex-start;background:var(--as-kagit);border:1px solid var(--as-cizgi);border-bottom-left-radius:5px}\
.as-m.ben{align-self:flex-end;background:var(--as-renk);color:#fff;border-bottom-right-radius:5px;font-weight:500}\
.as-m.sec{background:#fff;border-style:dashed}\
.as-mini{display:block;margin-top:7px;font-size:12px;color:var(--as-mat)}\
.as-yaz{align-self:flex-start;display:flex;gap:5px;padding:14px 16px;background:var(--as-kagit);border:1px solid var(--as-cizgi);border-radius:16px;border-bottom-left-radius:5px}\
.as-yaz i{width:7px;height:7px;border-radius:50%;background:var(--as-mat);animation:as-n 1s infinite ease-in-out}\
.as-yaz i:nth-child(2){animation-delay:.15s}.as-yaz i:nth-child(3){animation-delay:.3s}\
@keyframes as-n{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-3px)}}\
.as-eylem,.as-chips{display:flex;flex-wrap:wrap;gap:8px;align-self:flex-start;max-width:100%}\
.as-btn,.as-chip{font:inherit;font-size:14px;font-weight:600;min-height:44px;display:inline-flex;align-items:center;text-decoration:none;border-radius:999px;padding:0 16px;cursor:pointer;line-height:1.2;text-align:left}\
.as-btn{background:var(--as-renk);color:#fff;border:1px solid var(--as-renk)}\
.as-btn.hat{background:transparent;color:var(--as-yazi);border-color:rgba(34,24,16,.35)}\
.as-btn:hover{filter:brightness(1.08)}\
.as-chip{background:transparent;color:var(--as-yazi);border:1px solid rgba(34,24,16,.3);font-weight:500;padding:6px 14px}\
.as-chip:hover,.as-btn.hat:hover{background:rgba(34,24,16,.07)}\
.as-etiket{align-self:flex-start;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--as-mat);margin:6px 2px -2px}\
.as-wa{align-self:flex-start;max-width:92%;background:#E6F3DE;border:1px solid #BCD9AF;border-radius:14px;padding:10px 13px;font-size:14px;color:#1F3319}\
.as-wa b{display:block;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#3C6A2D;margin-bottom:4px}\
.as-wa p{margin:0;white-space:pre-wrap}\
.as-wa small{display:block;margin-top:8px;color:#4A6A40;font-size:12.5px;line-height:1.45}\
.as-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--as-cizgi);background:var(--as-un)}\
.as-giris{flex:1;min-width:0;font:inherit;font-size:16px;min-height:46px;padding:0 16px;border-radius:999px;border:1px solid rgba(34,24,16,.35);background:#fff;color:var(--as-yazi)}\
.as-giris::placeholder{color:#7A6E5F}\
.as-yolla{flex:none;min-width:64px;min-height:46px;border:0;border-radius:999px;padding:0 18px;background:var(--as-renk);color:#fff;font:inherit;font-weight:650;font-size:15px;cursor:pointer}\
.as-not{padding:0 16px 12px;font-size:12px;color:var(--as-mat);line-height:1.45}\
.as-gizli{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\
@media (max-width:600px){.as-kutu{left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));width:auto;height:min(82svh,680px);border-radius:18px}.as-ac{right:12px;bottom:calc(12px + env(safe-area-inset-bottom))}}\
@media (prefers-reduced-motion:reduce){.as-kutu,.as-m{animation:none}.as-ac{transition:none}.as-akis{scroll-behavior:auto}.as-yaz i{animation:none;opacity:.6}}";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function baslat(ayar) {
    var E = window.Eslestir, SSS = ayar.sss, ISL = ayar.isletme;
    var kisaltma = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

    var ac = el("button", "as-ac"); ac.type = "button";
    ac.setAttribute("aria-haspopup", "dialog"); ac.setAttribute("aria-expanded", "false");
    ac.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l.9-4.2A8 8 0 1 1 20 12z"/><path d="M9 11.5h6M9 14.5h3.5"/></svg>';
    ac.appendChild(el("span", null, "Soru sor"));

    var kutu = el("section", "as-kutu"); kutu.hidden = true;
    kutu.setAttribute("role", "dialog"); kutu.setAttribute("aria-label", ISL.kisa + " soru asistanı");

    var ust = el("div", "as-ust");
    ust.appendChild(el("span", "as-logo", "t&m")); ust.firstChild.setAttribute("aria-hidden", "true");
    var baslikKutu = el("div");
    baslikKutu.appendChild(el("b", null, ISL.ad));
    var alt = el("small"); alt.appendChild(el("i")); alt.firstChild.setAttribute("aria-hidden", "true"); alt.appendChild(el("span", null, "Onaylı cevaplar · yapay zekâ değil"));
    baslikKutu.appendChild(alt);
    var x = el("button", "as-x", "×"); x.type = "button"; x.setAttribute("aria-label", "Soru asistanını kapat");
    ust.appendChild(baslikKutu); ust.appendChild(x);

    var akis = el("div", "as-akis"); akis.setAttribute("role", "log"); akis.setAttribute("aria-live", "polite"); akis.setAttribute("aria-label", "Sohbet");
    var form = el("form", "as-form"); form.setAttribute("aria-label", "Soru sor");
    var giris = el("input", "as-giris"); giris.type = "text"; giris.maxLength = 200; giris.autocomplete = "off"; giris.enterKeyHint = "send";
    giris.placeholder = "Sorunuzu yazın"; giris.setAttribute("aria-label", "Sorunuz");
    var yolla = el("button", "as-yolla", "Sor"); yolla.type = "submit";
    form.appendChild(giris); form.appendChild(yolla);
    var not = el("p", "as-not", "Cevaplar " + ISL.kisa + " tarafından onaylanmıştır. Bilmediğim soruda uydurmam, sizi işletmeye yönlendiririm.");

    kutu.appendChild(ust); kutu.appendChild(akis); kutu.appendChild(form); kutu.appendChild(not);
    document.body.appendChild(ac); document.body.appendChild(kutu);

    var meşgul = false, sorulan = {}, acildi = false;

    function asagi() { akis.scrollTop = akis.scrollHeight; }
    function ekle(n) { akis.appendChild(n); asagi(); return n; }
    function mesaj(metin, kim, ek) {
      var m = el("div", "as-m " + kim, metin);
      if (ek) { var mini = el("small", "as-mini", ek); m.appendChild(mini); }
      return ekle(m);
    }
    function whatsappHref(metin) {
      var n = String(ayar.whatsapp || "").replace(/\D/g, "");
      return "https://wa.me/" + n + "?text=" + encodeURIComponent(metin);
    }
    function dugme(e, soru, hat) {
      if (e.tur === "bag") { var a = el("a", "as-btn" + (hat ? " hat" : ""), e.ad); a.href = e.href; a.addEventListener("click", function () { if (window.innerWidth <= 600) kapat(false); }); return a; }
      if (e.tur === "tel") { var t = el("a", "as-btn" + (hat ? " hat" : ""), e.ad); t.href = "tel:" + e.tel; return t; }
      var mesajMetni = (e.mesaj || "Merhaba, bir sorum var: ") + (e.mesaj ? "" : "") ;
      var b;
      if (ayar.whatsapp) {
        b = el("a", "as-btn" + (hat ? " hat" : ""), e.ad); b.href = whatsappHref(mesajMetni + (soru || "")); b.target = "_blank"; b.rel = "noopener noreferrer";
      } else {
        b = el("button", "as-btn" + (hat ? " hat" : ""), e.ad); b.type = "button";
        b.addEventListener("click", function () { whatsappOnizleme(mesajMetni + (soru || "")); });
      }
      return b;
    }
    function whatsappOnizleme(metin) {
      var k = el("div", "as-wa");
      k.appendChild(el("b", null, "WhatsApp'a gidecek mesaj"));
      k.appendChild(el("p", null, metin));
      k.appendChild(el("small", null, "Demo: gerçek kurulumda burası işletmenin WhatsApp'ını bu mesaj hazır yazılı olarak açar. Bu sayfa kurgusaldır, mesaj gönderilmez."));
      ekle(k);
    }
    function eylemler(liste, soru) {
      if (!liste || !liste.length) return;
      var k = el("div", "as-eylem");
      liste.forEach(function (e, i) { k.appendChild(dugme(e, soru, i > 0)); });
      ekle(k);
    }
    function chipler(liste, etiket) {
      if (!liste.length) return;
      if (etiket) ekle(el("div", "as-etiket", etiket));
      var k = el("div", "as-chips");
      liste.forEach(function (e) {
        var c = el("button", "as-chip", e.s); c.type = "button";
        c.addEventListener("click", function () { sor(e.s, e); });
        k.appendChild(c);
      });
      ekle(k);
    }
    function benzerler(haric, say) {
      var hepsi = SSS.filter(function (e) { return !sorulan[e.id] && e !== haric; });
      return hepsi.slice(0, say);
    }

    var yaziyor;
    function yaziyorGoster() { yaziyor = el("div", "as-yaz"); yaziyor.setAttribute("aria-hidden", "true"); yaziyor.innerHTML = "<i></i><i></i><i></i>"; ekle(yaziyor); }
    function yaziyorKaldir() { if (yaziyor && yaziyor.parentNode) yaziyor.parentNode.removeChild(yaziyor); yaziyor = null; }

    function karsilik(soru, hazir) {
      var r = hazir ? { tur: "cevap", e: hazir } : E.cozumle(soru, SSS);
      if (r.tur === "cevap") {
        sorulan[r.e.id] = 1;
        mesaj(r.e.c, "bot", "Onaylı cevap · " + ISL.guncelleme);
        eylemler(r.e.eylem, r.e.direkt ? soru : "");
        if (!r.e.direkt) chipler(benzerler(r.e, 3), "Bunlar da işinize yarayabilir");
      } else if (r.tur === "oneri") {
        mesaj("Tam emin olamadım. Şunu mu demek istediniz?", "bot");
        chipler([r.e]);
        eylemler([{ tur: "wa", ad: "Hayır, işletmeye yazayım", mesaj: "Merhaba, sitedeki asistana şunu sordum ama cevap bulamadı: " }], soru);
      } else if (r.tur === "belirsiz") {
        mesaj("Bu soru iki konuya yakın düştü. Hangisini soruyorsunuz?", "bot");
        chipler(r.adaylar);
      } else {
        mesaj("Bu konuda " + ISL.ad + "'nın onayladığı bir cevabım yok; yanlış bilgi vermek istemem. Sorunuzu doğrudan işletmeye iletebilirsiniz.", "bot");
        eylemler([{ tur: "wa", ad: "WhatsApp'tan sorun", mesaj: "Merhaba, sitedeki asistana şunu sordum ama cevap bulamadı: " }], soru);
        chipler(benzerler(null, 3), "Şunları sorabilirsiniz");
      }
    }

    function sor(soru, hazir) {
      soru = String(soru || "").replace(/\s+/g, " ").trim().slice(0, 200);
      if (!soru || meşgul) return;
      meşgul = true;
      Array.prototype.forEach.call(akis.querySelectorAll(".as-chips"), function (c) { c.parentNode.removeChild(c); });
      Array.prototype.forEach.call(akis.querySelectorAll(".as-etiket"), function (c) { c.parentNode.removeChild(c); });
      mesaj(soru, "ben");
      yaziyorGoster();
      setTimeout(function () {
        yaziyorKaldir();
        karsilik(soru, hazir);
        meşgul = false;
      }, kisaltma ? 60 : 420);
    }

    function ilk() {
      acildi = true;
      mesaj("Merhaba! Fırınla ilgili sık sorulan sorulara hazır cevaplarım var. Aşağıdan seçebilir ya da kendi sorunuzu yazabilirsiniz.", "bot");
      chipler(SSS.filter(function (e) { return ["saat", "sicak", "siparis", "alerjen", "pasta", "adres"].indexOf(e.id) > -1; }));
    }

    var oncekiOdak = null;
    function ac_(soru) {
      oncekiOdak = document.activeElement;
      kutu.hidden = false; ac.hidden = true; ac.setAttribute("aria-expanded", "true");
      if (!acildi) ilk();
      kaydir();
      if (soru) sor(soru); else giris.focus({ preventScroll: true });
    }
    function kapat(odak) {
      kutu.hidden = true; ac.hidden = false; ac.setAttribute("aria-expanded", "false");
      if (odak !== false) ac.focus({ preventScroll: true });
    }
    // Mobil klavye açılınca panel görünür alana sığsın
    function kaydir() {
      var vv = window.visualViewport;
      if (!vv || window.innerWidth > 600) { kutu.style.height = ""; kutu.style.bottom = ""; return; }
      var altBosluk = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      kutu.style.bottom = (altBosluk + 8) + "px";
      kutu.style.height = Math.min(vv.height - 16, 680) + "px";
      asagi();
    }
    if (window.visualViewport) { window.visualViewport.addEventListener("resize", kaydir); window.visualViewport.addEventListener("scroll", kaydir); }

    ac.addEventListener("click", function () { ac_(); });
    x.addEventListener("click", function () { kapat(); });
    kutu.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { ev.stopPropagation(); kapat(); } });
    form.addEventListener("submit", function (ev) { ev.preventDefault(); var v = giris.value; giris.value = ""; sor(v); });

    return { ac: ac_, kapat: kapat, sor: function (q) { if (kutu.hidden) ac_(); sor(q); } };
  }

  window.Asistan = { baslat: baslat };
})();
