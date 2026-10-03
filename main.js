/* boztas design — giriş animasyonu ve sayfa hareketleri
   Furkan'ın çizimi (30 Eyl): üst yarı lacivert, alt yarı altın. "boztas" sol üstten eğriyle ortanın üstüne,
   "design" sağ alttan eğriyle ortanın altına gelir; design'daki "ı"ya nokta düşüp "i" olur (hafif pop sesi);
   kelimeler geldikleri yoldan geri gider, ekran açılır ve site büyüyerek görünür.
   1 Eki Furkan: "yazıların gelişi olmamış; harf harf gelsin, yavaştan hızlıya". Bu yüzden:
   - her harf köşede belirir, önce yavaş sonra hızlanarak eğriden kayar (ease "in"), yerine oturunca esner;
   - harflerin ardışıklığı da hızlanır: ilk aralıklar geniş, sonrakiler sıklaşır (stagger ease "out");
   - sayfa başlıkları da aynı ritimle harf harf gelir.
   Performans: yalnız transform/opacity; giriş oturumda bir kez; hareket azaltma tercihine uyar. */
(() => {
  const govde = document.body;
  const giris = document.getElementById("giris");
  const azHareket = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Harflerin ardışıklığı yavaştan hızlıya: başlangıç zamanlarını "out" eğrisiyle dağıtmak aralıkları giderek daraltır
  const HIZLANAN = amount => ({ amount, ease: "power2.out" });

  // ---------- metni harflere böl (kelimeler bölünmesin, boşluklar kalsın) ----------
  function harflereBol(el) {
    if (el.dataset.bolundu) return el.querySelectorAll(".harf");
    const yuru = dugum => {
      [...dugum.childNodes].forEach(c => {
        if (c.nodeType === 3) {
          const parca = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(k => {
            if (!k) return;
            if (/^\s+$/.test(k)) { parca.appendChild(document.createTextNode(" ")); return; }
            const kelime = document.createElement("span");
            kelime.className = "kelime-sar";
            [...k].forEach(h => {
              const s = document.createElement("span");
              s.className = "harf";
              s.textContent = h;
              kelime.appendChild(s);
            });
            parca.appendChild(kelime);
          });
          c.replaceWith(parca);
        } else if (c.nodeType === 1) yuru(c);
      });
    };
    yuru(el);
    el.dataset.bolundu = "1";
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    return el.querySelectorAll(".harf");
  }

  // başlık harfleri maskeden yükselerek, yavaştan hızlıya sırayla gelir
  function basligiGetir(el, gecikme = 0) {
    const harfler = harflereBol(el);
    return gsap.fromTo(harfler, { yPercent: 115, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: .55, ease: "back.out(1.6)", stagger: HIZLANAN(Math.min(.9, harfler.length * .045)), delay: gecikme });
  }

  // ---------- sayfa: görününce belir, videolar yalnız görünürken oynar ----------
  function sayfayiHazirla() {
    const belirler = document.querySelectorAll(
      ".bolum-bas p, .kart, .hizmet-liste li, .surec-izgara > div, .iletisim > p, .iletisim .dugmeler");
    belirler.forEach(el => el.classList.add("belir"));
    const gozcu = new IntersectionObserver(girdiler => {
      girdiler.forEach(g => { if (g.isIntersecting) { g.target.classList.add("gorundu"); gozcu.unobserve(g.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    belirler.forEach(el => gozcu.observe(el));


    // portfolyo sekmeleri: süzme yalnız kartları gizler/gösterir, sayfa konumuna dokunmaz
    const sekmeler = [...document.querySelectorAll(".sekmeler [role=tab]")];
    if (sekmeler.length) {
      const alan = document.getElementById("portfoy");
      const kartlar = [...alan.querySelectorAll(".kart")];
      const sayac = document.getElementById("sayac");
      const sec = (sek, odak) => {
        const f = sek.dataset.filtre;
        sekmeler.forEach(b => { const acik = b === sek; b.setAttribute("aria-selected", acik); b.tabIndex = acik ? 0 : -1; });
        alan.setAttribute("aria-labelledby", sek.id);
        let n = 0;
        kartlar.forEach(k => {
          const goster = f === "hepsi" || k.dataset.kat.split(" ").includes(f);
          if (goster && k.hidden) { k.classList.remove("gir"); void k.offsetWidth; k.classList.add("gir"); }
          k.hidden = !goster; if (goster) n++;
        });
        alan.querySelectorAll(".kart-izgara").forEach(g => {
          const bos = !g.querySelector(".kart:not([hidden])");
          g.hidden = bos;
          alan.querySelector('.grup-baslik[data-grup="' + g.dataset.grup + '"]').hidden = bos;
        });
        sayac.textContent = n + " iş" + (f === "hepsi" ? "" : " · " + sek.textContent);
        if (odak) sek.focus();
      };
      sekmeler.forEach((b, i) => {
        b.addEventListener("click", () => sec(b));
        b.addEventListener("keydown", e => {
          const git = { ArrowRight: (i + 1) % sekmeler.length, ArrowLeft: (i - 1 + sekmeler.length) % sekmeler.length, Home: 0, End: sekmeler.length - 1 }[e.key];
          if (git === undefined) return;
          e.preventDefault(); sec(sekmeler[git], true);
        });
      });
      sec(sekmeler[0]);
    }

    // bölüm başlıkları görününce harf harf
    const basliklar = document.querySelectorAll(".bolum-bas h2:not([data-parcacik]), .iletisim .dev-baslik");
    if (window.gsap && !azHareket) {
      basliklar.forEach(h => gsap.set(harflereBol(h), { yPercent: 115, opacity: 0 }));
      const baslikGozcu = new IntersectionObserver(girdiler => {
        girdiler.forEach(g => { if (g.isIntersecting) { basligiGetir(g.target); baslikGozcu.unobserve(g.target); } });
      }, { rootMargin: "0px 0px -12% 0px" });
      basliklar.forEach(h => baslikGozcu.observe(h));
    }

    const videoGozcu = new IntersectionObserver(girdiler => {
      girdiler.forEach(g => {
        const v = g.target;
        if (g.isIntersecting) {
          if (azHareket) return;
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      });
    }, { threshold: .35 });
    document.querySelectorAll("video[data-src]").forEach(v => videoGozcu.observe(v));

    // stüdyo katmanı: bulunulan bölüm adı, zemin rengine uyum, menüde güncel bağlantı, Denizli saati
    const hudBolum = document.getElementById("hud-bolum");
    const bolumGozcu = new IntersectionObserver(girdiler => {
      girdiler.forEach(g => {
        if (!g.isIntersecting) return;
        hudBolum.textContent = g.target.dataset.bolum;
        govde.dataset.zemin = g.target.dataset.zemin || "";
        document.querySelectorAll(".ust-bar nav a").forEach(a =>
          a.getAttribute("href") === "#" + g.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
        govde.dataset.bolum = g.target.dataset.bolum;
      });
    }, { rootMargin: "-96% 0px 0px 0px" });   // görüş alanının alt şeridi: HUD yazısı orada durur
    document.querySelectorAll("[data-bolum]").forEach(b => bolumGozcu.observe(b));
    const saat = document.getElementById("hud-saat");
    const saatYaz = () => { saat.textContent = "denizli " + new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(new Date()); };
    saatYaz(); setInterval(saatYaz, 20000);

    // üst bar kahramanı geçince dolar
    const bar = document.querySelector(".ust-bar");
    const kahraman = document.querySelector(".kahraman");
    new IntersectionObserver(([g]) => bar.classList.toggle("dolu", !g.isIntersecting), { rootMargin: "-72px 0px 0px 0px" })
      .observe(kahraman);
  }

  function kahramanGirisi() {
    if (azHareket || !window.gsap) return;
    let gecikme = 0;
    document.querySelectorAll(".kahraman .satir > span").forEach(satir => {
      basligiGetir(satir, gecikme);
      gecikme += .32;
    });
    gsap.from(".kahraman .ust-yazi, .kahraman-alt", { opacity: 0, y: 24, duration: 1, ease: "power3.out", delay: .5, stagger: .12 });
  }

  function girisiKapat() {
    giris.remove();
    govde.classList.remove("giris-var");
  }

  // ---------- hafif "pop" sesi (Web Audio ile üretilir, dosya yok) ----------
  // Tarayıcılar kullanıcı etkileşimi olmadan ses çalmaya izin vermez: ilk dokunuş/tıklamada ses açılır,
  // açılmadıysa nokta sessiz düşer (sayfa yine çalışır).
  let sesBaglam = null;
  function sesiAc() {
    try {
      sesBaglam = sesBaglam || new (window.AudioContext || window.webkitAudioContext)();
      if (sesBaglam.state === "suspended") sesBaglam.resume();
    } catch (e) { sesBaglam = null; }
  }
  function pop() {
    try {
      if (!sesBaglam) sesiAc();
      if (!sesBaglam || sesBaglam.state !== "running") return;
      const t = sesBaglam.currentTime;
      const osc = sesBaglam.createOscillator();
      const kazanc = sesBaglam.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + .12);
      kazanc.gain.setValueAtTime(.0001, t);
      kazanc.gain.exponentialRampToValueAtTime(.16, t + .008);
      kazanc.gain.exponentialRampToValueAtTime(.0001, t + .16);
      osc.connect(kazanc).connect(sesBaglam.destination);
      osc.start(t);
      osc.stop(t + .18);
    } catch (e) { /* ses isteğe bağlı */ }
  }

  // ---------- giriş ----------
  function girisiOynat() {
    const W = innerWidth, H = innerHeight;
    const ust = document.getElementById("k-ust");
    const alt = document.getElementById("k-alt");
    const ustHarfler = ust.querySelectorAll("span");
    const altHarfler = alt.querySelectorAll(":scope > span");
    const nokta = alt.querySelector(".nokta");
    const iHarf = alt.querySelector(".i-harf");

    gsap.registerPlugin(MotionPathPlugin);
    gsap.set(ust, { xPercent: -50, yPercent: -100 });
    gsap.set(alt, { xPercent: -50, yPercent: 0 });

    // 1 Eki Furkan: "pipetten sıvı çeker gibi olsun". Harfler TEK bir kanaldan (pipet), birbirine yapışık bir dizi
    // halinde akar: kelime, çizimdeki eğriyi (sol üstten aşağı inip sağa kıvrılarak) yılan gibi izler; emilir gibi
    // yavaş başlar hızlanır, eğride kanalın yönüne döner, hızlandıkça akış yönünde uzar, yerine varınca çalkalanıp durur.
    // Alt kelime aynası: sağ alttan yukarı çıkıp sola kıvrılır.
    const MP = MotionPathPlugin;
    const boyut = o => .28 + .72 * o ** 1.5;   // yolun başında %28 boy, yol boyunca önce yavaş sonra hızlı büyür
    function pipetKur(kap, harfler, yon) {           // yon 1: soldan sağa akar ("boztas"), -1: sağdan sola ("design")
      const r = kap.getBoundingClientRect();
      // Her harf yol üzerindeki kendi ORTA-TABAN noktasından taşınır ve TAM o noktanın etrafında döner.
      // (1 Eki Furkan: "1. saniyede dönerken bir yere çarpıyormuş gibi". Sebep: harf sol üst köşesinden yola
      // konup başka bir noktadan döndürülüyordu; dönüşte savrulup komşusuna biniyordu.)
      const xs = [...harfler].map(h => h.offsetLeft + h.offsetWidth / 2);
      const ys = [...harfler].map(h => h.offsetTop + h.offsetHeight * .8);
      const satirY = ys[0];
      const n = harfler.length, bas = yon === 1 ? xs[0] : xs[n - 1], son = yon === 1 ? xs[n - 1] : xs[0];
      const geride = xs.map(x => Math.abs(son - x));     // her harfin önde gidenden uzaklığı (dizide sabit)
      const sx = yon === 1 ? -r.left : W - r.left, sy = yon === 1 ? -r.top : H - r.top;   // ekran köşesi (yerel)
      // 1 Eki Furkan: "çeyrek çember çizgisinde gelsin". Yol: dikey düz iniş (gerekirse) -> tam çeyrek çember ->
      // kelimenin satırı. Çember satıra teğet biner (kırılma yok). Yarıçap ekrana sığacak kadar büyük, en az ekranın %28'i.
      const dikey = Math.abs(sy - satirY) - .06 * H;               // satırdan ekran kenarına (içeriden) dikey boşluk
      const yatay = Math.abs(bas - (sx + yon * .045 * W));         // satır başından yan kenara yatay boşluk
      // KÖŞE: görünüşü çeyrek çember, ama dönüş sıfırdan başlayıp yavaşça artar ve yine yavaşça biter
      // (eğrilik iki ucta sıfır; yol ve demiryolu virajlarındaki geçiş eğrisi gibi). 1 Eki Furkan: "bir yere çarpıp
      // dönüyormuş gibi" -> ölçüm (test/donus_olc.mjs): düz inişten çembere geçişte dönüş hızı TEK karede 0'dan
      // 2,5 derece/kareye sıçrıyordu.
      // ağız her ekranda GÖRÜNÜR (telefonda köşeyi büyütmek için dışarı taşınca kelime yolun çoğunu görünmeden alıyordu)
      const c = Math.max(40, Math.min(dikey, yatay));
      const ek = Math.max(0, dikey - c);                           // köşeden önceki düz iniş
      const ADIM = 400, egri = [];
      let ex = 0, ey = 0;
      for (let k = 0; k <= ADIM; k++) {                            // yön açısı: 90° (aşağı) -> 0° (sağa), yumuşak
        const u = k / ADIM, yumusak = u * u * (3 - 2 * u), fi = Math.PI / 2 * (1 - yumusak);
        if (k % 4 === 0) egri.push([ex, ey]);
        ex += Math.cos(fi) / ADIM; ey += Math.sin(fi) / ADIM;
      }
      egri.push([ex, ey]);
      const olcek = c / ex, oran = ey / ex;
      const nokta = (ox, oy) => ({ x: bas + yon * ox, y: satirY + yon * oy });
      // sık noktalı hassas çizgi (yumuşatma algoritması düz iniş ile köşenin birleşiminde yolu düğümlüyordu)
      const noktalar = [nokta(-c, -c * oran - ek)]
        .concat(egri.map(([x, y]) => nokta(-c + x * olcek, -c * oran + y * olcek)))
        .concat([nokta(Math.abs(son - bas), 0)]);
      const yol = MP.stringToRawPath("M" + noktalar.map(q => `${q.x},${q.y}`).join(" L"));
      const L = MP.cacheRawPathMeasurements(yol).totalLength || yol.totalLength;
      let onceki = 0, uzama = 0;
      function ciz(bas_) {                                // bas_: önde giden harfin pipette aldığı yol
        const hiz = Math.abs(bas_ - onceki); onceki = bas_;
        uzama += (Math.min(.5, hiz * .022) - uzama) * .45;    // hızla uzar, yavaşlayınca toparlanır (sıvı)
        // 1 Eki Furkan: "küçük yazıdan kaydıkça büyüyebilir". Harf pipetin ağzından küçük çıkar, yol boyunca büyür,
        // satırına varınca tam boyuna ulaşır. Küçükken aralar da orantılı küçülür (dizi sıvı gibi yapışık kalsın).
        const bOn = boyut(Math.max(0, bas_) / L);
        harfler.forEach((h, i) => {
          const s = bas_ - geride[i] * bOn;
          if (s < 0) { gsap.set(h, { opacity: 0 }); return; }
          const oran = Math.min(1, s / L);
          const p = MP.getPositionOnPath(yol, oran);
          // yön: harfin 8 px önü ve arkasındaki noktalardan (tek minik parçanın yönü kare kare titriyordu)
          const pa = MP.getPositionOnPath(yol, Math.max(0, (s - 8) / L)), pb = MP.getPositionOnPath(yol, Math.min(1, (s + 8) / L));
          let aci = Math.atan2(pb.y - pa.y, pb.x - pa.x) * 180 / Math.PI - (yon === 1 ? 0 : 180);
          aci = ((aci + 540) % 360) - 180;
          // 1 Eki Furkan'ın ekran görüntüsü: harf yolla tam dönünce "design" yukarı giderken yazısı aşağı okunuyordu
          // (kelime geri geri gidiyor gibi). Harfler DİK kalır, eğriye yalnız hafifçe eğilir; dizi iniş/çıkışta
          // yukarıdan aşağı okunan bir sütun gibi akar.
          aci *= .22;
          const b = bOn;   // tüm dizi birlikte büyür (harf harf boy farkı "b o z t a s" gibi seyrek görünüyordu)
          gsap.set(h, { opacity: 1, x: p.x - xs[i], y: p.y - ys[i], rotation: Math.max(-90, Math.min(90, aci)),
            scaleX: b * (1 + uzama), scaleY: b * (1 - uzama * .5), transformOrigin: "50% 80%" });
        });
      }
      return { L, ciz, sonGeride: Math.max(...geride) };
    }
    const pU = pipetKur(ust, ustHarfler, 1), pA = pipetKur(alt, altHarfler, -1);
    const bU = { v: 0 }, bA = { v: 0 };
    pU.ciz(0); pA.ciz(0);
    const AKIS = 2.3;   // emilme süresi (1 Eki Furkan: "biraz daha yavaş": 1,7 -> 2,3 sn)
    // emilme eğrisi: yavaş başlar, hızlanır (t=.75'e dek karesel), sonra pipetin ucuna yaklaşırken yumuşakça frenler.
    // İki parçanın hızı birleşim noktasında eşit (sıçrama yok). Gemini 1 Eki: "en hızlı anda aniden kilitleniyor".
    // hız eğrisi: yavaş başlar, t≈.74'te en hızlı, sonra yumuşakça frenler. İvme de süreklidir (en hızlı andan frene
    // geçişte ani sıçrama yok; eskisi iki parçalıydı, tepede ivme birden tersine dönüyordu).
    const EMILME = t => 1 - (1 - t ** 3) ** 2;

    const tl = gsap.timeline({ onComplete: bitir });
    tl.to(bU, { v: pU.L, duration: AKIS, ease: EMILME, onUpdate: () => pU.ciz(bU.v) }, 0)
      .to(bA, { v: pA.L, duration: AKIS, ease: EMILME, onUpdate: () => pA.ciz(bA.v) }, .1)
      // varınca YUMUŞAKÇA durur. (1 Eki Furkan: "bir yere çarpıp dönüyormuş gibi": varışta kelimenin ileri fırlayıp
      // yaylanarak geri gelmesi ve harflerin yay gibi titremesi çarpıp sekme gibi görünüyordu; kaldırıldı.)
      .to([ustHarfler, altHarfler], { scaleX: 1, scaleY: 1, rotation: 0, duration: .35, ease: "power2.out" }, AKIS + .1);

    // "ı" -> "i": nokta yukarıdan düşer, harf hafifçe esner, pop
    const inis = AKIS + .75;
    tl.set(nokta, { y: -.32 * H, opacity: 1 }, inis)
      .to(nokta, { y: 0, duration: .38, ease: "power2.in" }, inis)
      .call(pop, null, inis + .38)
      .to(iHarf, { scaleY: .86, scaleX: 1.08, transformOrigin: "50% 100%", duration: .08, ease: "power2.out" }, inis + .38)
      .to(iHarf, { scaleY: 1, scaleX: 1, duration: .45, ease: "elastic.out(1, .4)" }, inis + .46)
      .to(nokta, { y: -.06 * H, duration: .14, ease: "power2.out" }, inis + .38)
      .to(nokta, { y: 0, duration: .2, ease: "bounce.out" }, inis + .52);

    // aynı pipetten geri emilir (hızlanarak); perde açılır; site büyüyerek gelir
    const cikis = inis + 1.3;
    tl.to(bU, { v: -1, duration: 1, ease: "power3.in", onUpdate: () => pU.ciz(bU.v) }, cikis)
      .to(bA, { v: -1, duration: 1, ease: "power3.in", onUpdate: () => pA.ciz(bA.v) }, cikis)
      .to(giris.querySelector(".ust"), { yPercent: -100, duration: .85, ease: "power4.inOut" }, cikis + .55)
      .to(giris.querySelector(".alt"), { yPercent: 100, duration: .85, ease: "power4.inOut" }, cikis + .55)
      .from(".kahraman", { scale: .9, borderRadius: 28, duration: 1, ease: "power3.out", transformOrigin: "50% 50%", clearProps: "all" }, cikis + .65)
      .add(kahramanGirisi, cikis + .7);

    function bitir() {
      girisiKapat();
      try { sessionStorage.setItem("giris-goruldu", "1"); } catch (e) {}
    }
    // geç: animasyonu sona sar
    document.getElementById("gec").addEventListener("click", () => tl.progress(1), { once: true });
    window.__giris = tl;   // test ve ince ayar için (zararsız)
    return tl;
  }

  // ---------- başlat ----------
  sayfayiHazirla();
  let gorulduMu = false;
  try { gorulduMu = sessionStorage.getItem("giris-goruldu") === "1"; } catch (e) {}

  // ilk dokunuşta ses izni (giriş sırasında tıklayan pop'u duyar)
  ["pointerdown", "keydown", "touchstart"].forEach(olay =>
    addEventListener(olay, sesiAc, { once: true, passive: true }));

  if (!window.gsap || !window.MotionPathPlugin || azHareket || gorulduMu) {
    // kütüphane yüklenemediyse, hareket azaltma açıksa ya da bu oturumda görüldüyse kısa geçiş
    if (window.gsap && !azHareket) {
      gsap.to(giris, { opacity: 0, duration: .45, onComplete: () => { girisiKapat(); kahramanGirisi(); } });
    } else {
      girisiKapat();
    }
    return;
  }
  // yazı tipi yüklenmeden başlarsa harf genişlikleri kayar; ama en çok 200 ms bekle (açılış boş kalmasın)
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 200))])
    .then(girisiOynat);
})();
