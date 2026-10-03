/* boztas design — kaydırmaya bağlı sahneler. Ton: yumuşak, zarif, sakin. Her sahne ayrı işlev; hepsi gsap zamanına bağlı
   (test/kaydir_cek.mjs kare kare çekebilsin diye). Hareket azaltma tercihinde hiçbiri çalışmaz. */
(() => {
  const azHareket = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (azHareket || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const kok = document.documentElement;
  const telefon = matchMedia("(max-width: 760px)").matches || matchMedia("(pointer: coarse)").matches;
  const zayif = telefon || (navigator.hardwareConcurrency || 8) <= 2;
  const sinir = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  // deterministik sahte rastgele (kare kare çekimde aynı sonuç)
  const rnd = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  /* ---------- 1) mono etiketler: karışık karakterlerden doğrusuna çözülür ---------- */
  function etiketCozulmesi() {
    const HARF = "abcdefghijklmnoprstuvyz0123456789/<>_-+";
    const gozcu = new IntersectionObserver(girdiler => girdiler.forEach(g => {
      if (!g.isIntersecting) return;
      gozcu.unobserve(g.target);
      g.target.__cozul();
    }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".etiket").forEach((el, k) => {
      const son = el.textContent;
      const gizli = document.createElement("span");
      gizli.className = "sr-only"; gizli.textContent = son;
      const gor = document.createElement("span");
      gor.className = "cozul"; gor.setAttribute("aria-hidden", "true"); gor.textContent = son; gor.style.opacity = 0;
      el.textContent = ""; el.append(gizli, gor);
      const harfler = [...son];
      el.__cozul = () => {
        const durum = { p: 0 };
        const sure = .55 + harfler.length * .035;
        const ciz = () => {
          const kare = Math.floor(durum.p * sure * 16);   // saniyede 16 değişim: sakin titreşim
          let m = "";
          harfler.forEach((h, i) => {
            if (/[\s()·.]/.test(h)) { m += h; return; }
            const bitis = (i / harfler.length) * .78 + rnd(i + k * 31) * .22;
            m += durum.p >= bitis ? h : HARF[Math.floor(rnd(i * 7.3 + kare * 13.1 + k) * HARF.length)];
          });
          gor.textContent = m;
        };
        ciz();
        gor.style.opacity = 1;
        gsap.to(durum, { p: 1, duration: sure, ease: "none", onUpdate: ciz, onComplete: () => { gor.textContent = son; } });
      };
      gozcu.observe(el);
    });
  }

  /* ---------- 2) kahramandan portfolyoya: "markanızı"nın ilk "a" harfinin içinden geçiş ---------- */
  function harfIcindenGecis() {
    const sar = document.querySelector(".gecis-sar");
    const sahne = sar && sar.querySelector(".gecis-sahne");
    const kahraman = sar && sar.querySelector(".kahraman");
    const baslik = kahraman && kahraman.querySelector(".dev-baslik");
    const harf = baslik && baslik.querySelectorAll(".satir")[0].querySelectorAll(".harf")[1];
    if (!harf || harf.textContent !== "a") return;

    // harfin iç boşluğunu (a'nın gözü) tuvalde bul: dıştan taşan dolgu + sınıra uzaklık haritası
    const karsiBul = () => {
      const cs = getComputedStyle(harf), F = parseFloat(cs.fontSize), K = 3;
      const w = Math.ceil(F * 1.5 * K), h = Math.ceil(F * 1.7 * K), x0 = Math.round(F * .25 * K), yb = Math.round(F * 1.3 * K);
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.font = `${cs.fontWeight} ${F * K}px ${cs.fontFamily}`; g.fillStyle = "#000"; g.fillText("a", x0, yb);
      const a = g.getImageData(0, 0, w, h).data, n = w * h;
      const dolu = new Uint8Array(n), dis = new Uint8Array(n);
      for (let i = 0; i < n; i++) dolu[i] = a[i * 4 + 3] > 127 ? 1 : 0;
      const yigin = [];
      const it = (i) => { if (!dolu[i] && !dis[i]) { dis[i] = 1; yigin.push(i); } };
      for (let x = 0; x < w; x++) { it(x); it((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { it(y * w); it(y * w + w - 1); }
      while (yigin.length) {
        const i = yigin.pop(), x = i % w;
        if (x > 0) it(i - 1); if (x < w - 1) it(i + 1); if (i >= w) it(i - w); if (i < n - w) it(i + w);
      }
      const d = new Float32Array(n);
      for (let i = 0; i < n; i++) d[i] = dolu[i] ? 0 : 1e9;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = y * w + x; let v = d[i];
        if (x > 0) v = Math.min(v, d[i - 1] + 1);
        if (y > 0) { v = Math.min(v, d[i - w] + 1); if (x > 0) v = Math.min(v, d[i - w - 1] + 1.414); if (x < w - 1) v = Math.min(v, d[i - w + 1] + 1.414); }
        d[i] = v;
      }
      let en = -1, ei = -1;
      for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
        const i = y * w + x; let v = d[i];
        if (x < w - 1) v = Math.min(v, d[i + 1] + 1);
        if (y < h - 1) { v = Math.min(v, d[i + w] + 1); if (x < w - 1) v = Math.min(v, d[i + w + 1] + 1.414); if (x > 0) v = Math.min(v, d[i + w - 1] + 1.414); }
        d[i] = v;
        if (!dolu[i] && !dis[i] && v > en) { en = v; ei = i; }
      }
      if (ei < 0) return null;
      return { dx: ((ei % w) - x0) / K, dy: (Math.floor(ei / w) - yb) / K, r: en / K };
    };
    const kahramandaKonum = (el) => { let x = 0, y = 0; for (; el && el !== kahraman; el = el.offsetParent) { x += el.offsetLeft; y += el.offsetTop; } return el ? { x, y } : null; };

    let goz = null, taban = null, sol = null;
    const konumla = () => {
      goz = karsiBul();
      const sonda = document.createElement("span");
      sonda.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
      harf.appendChild(sonda);
      taban = kahramandaKonum(sonda); sol = kahramandaKonum(harf);
      sonda.remove();
      return !!(goz && taban && sol);
    };
    if (!konumla()) return;

    const isik = document.createElement("div");
    isik.className = "gz-isik"; isik.setAttribute("aria-hidden", "true");
    sahne.insertBefore(isik, kahraman);
    const ekstra = kahraman.querySelectorAll(".ust-yazi, .kahraman-alt");
    const bar = document.querySelector(".ust-bar");
    const ez = gsap.parseEase("power2.inOut");
    const durum = { H: 0, ih: 0, W: 0, cx: 0, cy: 0, topv: 0, S: 1, uygun: false };

    const olc = () => {
      const ih = innerHeight, W = document.documentElement.clientWidth;
      const H = kahraman.offsetHeight;
      durum.uygun = H - ih <= 260 && H > 0 && konumla();
      sar.classList.toggle("gz-aktif", durum.uygun);
      if (!durum.uygun) return;
      durum.H = H; durum.ih = ih; durum.W = W;
      durum.topv = Math.min(0, ih - H);
      durum.cx = sol.x + goz.dx; durum.cy = taban.y + goz.dy;
      durum.S = Math.min(telefon ? 40 : 56, Math.hypot(W, ih) / 2 * 1.08 / goz.r);
      sar.style.setProperty("--gz-h", H + "px");
      sar.style.setProperty("--gz-l", Math.round(ih * (telefon ? 1 : 1.1)) + "px");
      sar.style.setProperty("--gz-top", durum.topv + "px");
    };
    const ciz = (u) => {
      if (!durum.uygun) return;
      const { cx, cy, W, ih, topv, S } = durum;
      const z = ez(sinir((u - .03) / .84));
      const s = Math.exp(Math.log(S) * z);
      const tx = (W / 2 - cx) * z, ty = (ih / 2 - (cy + topv)) * z;
      const sol_ = sinir(u / .13);
      gsap.set(baslik, {
        transformOrigin: `${cx - baslik.offsetLeft}px ${cy - baslik.offsetTop}px`,
        x: tx, y: ty, scale: s, force3D: false,
        opacity: 1 - ez(sinir((u - .84) / .1))
      });
      gsap.set(ekstra, { opacity: 1 - sol_, y: -26 * sol_ });
      gsap.set(isik, {
        x: cx + tx, y: cy + ty, scale: goz.r * s * 1.35 / 100,
        opacity: ez(sinir(u / .2)) * (1 - ez(sinir((u - .86) / .14)))
      });
      bar.classList.toggle("gz-bar", u > .015 && u < .999);
    };

    ScrollTrigger.addEventListener("refreshInit", olc);
    olc();
    const pr = { u: 0 };
    gsap.timeline({
      scrollTrigger: {
        trigger: sar, scrub: .6, invalidateOnRefresh: true,
        start: () => sar.getBoundingClientRect().top + scrollY + (durum.uygun ? Math.max(0, durum.H - durum.ih) : 1e6),
        end: () => sar.getBoundingClientRect().top + scrollY + (durum.uygun ? Math.max(0, durum.H - durum.ih) + parseFloat(sar.style.getPropertyValue("--gz-l")) : 1e6 + 1)
      }
    }).to(pr, { u: 1, ease: "none", duration: 1, onUpdate: () => ciz(pr.u) });
    ScrollTrigger.refresh();
  }

  /* ---------- 3) iletişime gelirken: altın ince çizgi kalınlaşır, yuvarlak köşeli kutuya dönüşür, bölümü kaplar ---------- */
  function cizgidenKutu() {
    const sar = document.querySelector(".kutu-sar");
    const tuval = sar && sar.querySelector(".kutu-tuval");
    if (!tuval) return;
    const g = tuval.getContext("2d");
    const e2 = gsap.parseEase("power2.inOut"), e3 = gsap.parseEase("power3.inOut");
    const ALTIN = "#E8B220";
    let W = 0, H = 0, son = -1;
    const boyut = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = tuval.parentNode.clientWidth; H = tuval.parentNode.clientHeight;
      tuval.width = Math.round(W * dpr); tuval.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (son >= 0) ciz(son);
    };
    const ciz = (t) => {
      son = t;
      g.clearRect(0, 0, W, H);
      const kenar = Math.min(48, Math.max(16, W * .04));
      const wl = Math.min(W - kenar * 2, 920);          // çizginin / kutunun ilk eni
      const hb = Math.min(H * .34, 300);                 // kutunun ilk boyu
      const a = e2(sinir(t / .2)), b = e2(sinir((t - .2) / .3)), c = e3(sinir((t - .5) / .45));
      let w = wl * a, h = 2 + (hb - 2) * b, r0 = Math.min(h / 2, 28);
      w = w + (W - wl) * c; h = h + (H - hb) * c;
      const r = r0 * (1 - c);
      if (w < .5) return;
      g.fillStyle = ALTIN;
      g.beginPath();
      g.roundRect((W - w) / 2, (H - h) / 2, w, h, Math.min(r, h / 2, w / 2));
      g.fill();
      // alt-bar rengi: kutu dolunca HUD yazısı koyulaşsın (main.js yalnız bölüm kesişiminde değiştirir)
      const koyu = c > .72;
      if (koyu !== ciz.koyu) { ciz.koyu = koyu; document.body.dataset.zemin = koyu ? "altin" : ""; }
    };
    boyut();
    ScrollTrigger.addEventListener("refresh", boyut);
    addEventListener("resize", boyut);
    const pr = { t: 0 };
    gsap.timeline({ scrollTrigger: { trigger: sar, start: "top 55%", end: "bottom bottom", scrub: .6 } })
      .to(pr, { t: 1, ease: "none", duration: 1, onUpdate: () => ciz(pr.t) });
    ciz(0);
  }

  function sekilDalgasi() {
    const bolum = document.querySelector("#hizmetler");
    if (!bolum) return;
    const tuval = document.createElement("canvas");
    tuval.className = "dalga-tuval"; tuval.setAttribute("aria-hidden", "true");
    bolum.insertBefore(tuval, bolum.firstChild);
    const g = tuval.getContext("2d");
    const ALTIN = "232,178,32";
    // nokta -> kare -> baklava -> hap
    const GEN = [1, 1.04, .84, 2.1], YUK = [1, 1.04, .84, .5], DON = [0, 0, Math.PI / 4, 0], KOSE = [1, .2, .2, 1];
    const lerp = (a, b, t) => a + (b - a) * t;
    let W = 0, H = 0, aralik = 44, son = 0;
    const boyut = () => {
      const dpr = Math.min(telefon ? 1.5 : 2, devicePixelRatio || 1);
      W = bolum.clientWidth; H = bolum.clientHeight;
      aralik = telefon ? 40 : 46;
      tuval.width = Math.round(W * dpr); tuval.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      ciz(son);
    };
    const ciz = (p) => {
      son = p;
      g.clearRect(0, 0, W, H);
      const sut = Math.ceil(W / aralik), sat = Math.ceil(H / aralik);
      const ox = (W - (sut - 1) * aralik) / 2, oy = (H - (sat - 1) * aralik) / 2;
      for (let j = 0; j < sat; j++) for (let i = 0; i < sut; i++) {
        const x = ox + i * aralik, y = oy + j * aralik;
        // çapraz ilerleyen tek dalga: faz hem konuma hem kaydırmaya bağlı
        const faz = (i / sut) * .55 + (j / sat) * .9 - p * 1.7;
        const d = .5 + .5 * Math.sin(faz * Math.PI * 2);        // 0..1
        const m = d * 3, k = Math.min(2, Math.floor(m)), f = m - k;
        const e = f * f * (3 - 2 * f);
        const w = lerp(GEN[k], GEN[k + 1], e), h = lerp(YUK[k], YUK[k + 1], e);
        const r0 = lerp(DON[k], DON[k + 1], e), kose = lerp(KOSE[k], KOSE[k + 1], e);
        const boy = aralik * (.2 + .16 * d);
        const ww = w * boy, hh = h * boy;
        g.globalAlpha = .035 + .075 * d;
        g.save(); g.translate(x, y); g.rotate(r0);
        g.fillStyle = "rgb(" + ALTIN + ")";
        g.beginPath(); g.roundRect(-ww / 2, -hh / 2, ww, hh, Math.min(ww, hh) / 2 * kose); g.fill();
        g.restore();
      }
      g.globalAlpha = 1;
    };
    boyut();
    ScrollTrigger.addEventListener("refresh", boyut);
    addEventListener("resize", boyut);
    const pr = { p: 0 };
    gsap.timeline({ scrollTrigger: { trigger: bolum, start: "top bottom", end: "bottom top", scrub: .8 } })
      .to(pr, { p: 1, ease: "none", duration: 1, onUpdate: () => ciz(pr.p) });
  }

  function parcacikBaslik() {
    const h2 = document.querySelector("h2[data-parcacik]");
    if (!h2) return;
    const ust = h2.parentNode;
    gsap.set(h2, { opacity: 0 });
    const giris = (fn) => {
      const io = new IntersectionObserver(gs => gs.forEach(g => { if (g.isIntersecting) { io.disconnect(); fn(); } }), { rootMargin: "0px 0px -12% 0px" });
      io.observe(h2);
    };
    if (zayif) {
      gsap.set(h2, { y: 18 });
      giris(() => gsap.to(h2, { opacity: 1, y: 0, duration: .9, ease: "power2.out" }));
      return;
    }
    giris(() => {
      const kr = h2.getBoundingClientRect();
      const px = 110, py = 90;
      const sol = Math.max(0, kr.left - px), ustY = kr.top - py;
      const gen = Math.min(innerWidth, kr.right + px) - sol, yuk = kr.height + py * 2;
      const pr = ust.getBoundingClientRect();
      const tuval = document.createElement("canvas");
      tuval.className = "parcacik-tuval"; tuval.setAttribute("aria-hidden", "true");
      tuval.style.cssText = "left:" + (sol - pr.left) + "px;top:" + (ustY - pr.top) + "px;width:" + gen + "px;height:" + yuk + "px";
      const dpr = Math.min(2, devicePixelRatio || 1);
      tuval.width = Math.round(gen * dpr); tuval.height = Math.round(yuk * dpr);
      ust.appendChild(tuval);
      // gerçek harf konumlarını (satır içi kutular) bir ara tuvale çiz, pikselleri parçacık hedefi yap
      const ara = document.createElement("canvas"); ara.width = Math.round(gen); ara.height = Math.round(yuk);
      const a = ara.getContext("2d", { willReadFrequently: true });
      const renk = getComputedStyle(h2).color;
      a.fillStyle = renk; a.textBaseline = "alphabetic";
      const yuru = document.createTreeWalker(h2, NodeFilter.SHOW_TEXT);
      const aralik = document.createRange();
      for (let n; (n = yuru.nextNode());) {
        const cs = getComputedStyle(n.parentElement);
        a.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
        const asc = a.measureText("x").fontBoundingBoxAscent;
        const t = n.textContent;
        for (let i = 0; i < t.length; i++) {
          if (/\s/.test(t[i])) continue;
          aralik.setStart(n, i); aralik.setEnd(n, i + 1);
          const r = aralik.getBoundingClientRect();
          if (r.width) a.fillText(t[i], r.left - sol, r.top - ustY + asc);
        }
      }
      const adim = 3, veri = a.getImageData(0, 0, ara.width, ara.height).data;
      const P = [];
      for (let y = 0; y < ara.height; y += adim) for (let x = 0; x < ara.width; x += adim) {
        if (veri[(y * ara.width + x) * 4 + 3] < 140) continue;
        const k = P.length, ac = rnd(k * 3 + 1) * Math.PI * 2, d = 70 + rnd(k * 3 + 2) * 190;
        P.push({ x, y, bx: x + Math.cos(ac) * d * 1.5, by: y + Math.sin(ac) * d * .8, gec: (x / ara.width) * .35 + rnd(k * 3 + 3) * .15 });
      }
      const g = tuval.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const ez = gsap.parseEase("expo.out");
      const ciz = (u) => {
        g.clearRect(0, 0, gen, yuk);
        g.fillStyle = renk;
        for (const q of P) {
          const e = ez(sinir((u - q.gec) / (1 - .5)));
          const al = sinir(e * 2.2);
          if (al <= .01) continue;
          g.globalAlpha = al;
          const x = q.bx + (q.x - q.bx) * e, y = q.by + (q.y - q.by) * e;
          g.fillRect(x - .2, y - .2, 2.2, 2.2);
        }
        g.globalAlpha = 1;
      };
      const pr2 = { u: 0 };
      ciz(0);
      gsap.timeline()
        .to(pr2, { u: 1, duration: 2.4, ease: "none", onUpdate: () => ciz(pr2.u) })
        .to(h2, { opacity: 1, duration: .6, ease: "power2.inOut" }, "-=.55")
        .to(tuval, { opacity: 0, duration: .6, ease: "power2.inOut", onComplete: () => tuval.remove() }, "<");
    });
  }

  function puanHalkasi() {
    const img = document.querySelector('img[src$="haritalar-karnesi.webp"]');
    const fig = img && img.parentNode;
    if (!fig) return;
    const tuval = document.createElement("canvas");
    tuval.className = "halka-tuval"; tuval.setAttribute("aria-hidden", "true");
    fig.appendChild(tuval);
    const g = tuval.getContext("2d");
    // görselin kendi koordinatları (1000x667): halka merkezi, yarıçap, puan
    const CX = 676, CY = 125.2, R = 44.5, PUAN = 53;
    let W = 0, H = 0, u = 0;
    const boyut = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = fig.clientWidth; H = fig.clientHeight;
      tuval.width = Math.round(W * dpr); tuval.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      ciz(u);
    };
    const ciz = (v) => {
      u = v;
      g.clearRect(0, 0, W, H);
      const o = Math.max(W / 1000, H / 667), oy = (H - 667 * o) / 2, ox = (W - 1000 * o) / 2;
      g.save(); g.translate(ox, oy); g.scale(o, o);
      const kap = g.createRadialGradient(CX, CY, 0, CX, CY, 55);
      kap.addColorStop(0, "rgb(8,16,41)"); kap.addColorStop(.93, "rgb(8,16,41)"); kap.addColorStop(1, "rgba(8,16,41,0)");
      g.fillStyle = kap; g.beginPath(); g.arc(CX, CY, 55, 0, Math.PI * 2); g.fill();
      g.lineWidth = 3.9; g.strokeStyle = "rgb(37,45,68)";
      g.beginPath(); g.arc(CX, CY, R, 0, Math.PI * 2); g.stroke();
      if (v > 0) {
        g.strokeStyle = "#E8B220"; g.lineCap = "round";
        g.beginPath(); g.arc(CX, CY, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * PUAN / 100 * v); g.stroke();
      }
      g.textAlign = "center"; g.fillStyle = "#f4f1e8";
      g.font = '38px "Times New Roman", Tinos, "Liberation Serif", serif';
      g.fillText(String(Math.round(PUAN * v)), CX, CY + 8);
      g.fillStyle = "rgb(150,158,182)"; g.font = '10px "Courier New", monospace';
      if (g.letterSpacing !== undefined) g.letterSpacing = "1.5px";
      g.fillText("/ 100", CX, CY + 21);
      if (g.letterSpacing !== undefined) g.letterSpacing = "0px";
      g.restore();
    };
    boyut();
    ScrollTrigger.addEventListener("refresh", boyut);
    addEventListener("resize", boyut);
    ciz(0);
    const io = new IntersectionObserver(gs => gs.forEach(x => {
      if (!x.isIntersecting) return;
      io.disconnect();
      const pr = { v: 0 };
      gsap.to(pr, { v: 1, duration: 1.9, ease: "power3.out", delay: .25, onUpdate: () => ciz(pr.v) });
    }), { threshold: .55 });
    io.observe(fig);
  }

  function fiyatSayaci() {
    const sema = document.querySelector(".sema");
    if (!sema) return;
    const bs = [...sema.querySelectorAll(".sema-satir b")].map(b => {
      const m = b.textContent.match(/\d[\d.]*(?:,(\d+))?/);
      if (!m) return null;
      const ondalik = m[1] ? m[1].length : 0;
      const hedef = parseFloat(m[0].replace(/\./g, "").replace(",", "."));
      const yaz = (x) => b.textContent = b.dataset.son.replace(m[0], x.toLocaleString("tr-TR", { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }));
      b.dataset.son = b.textContent;
      return { b, hedef, yaz };
    }).filter(Boolean);
    bs.forEach(o => o.yaz(0));
    const io = new IntersectionObserver(gs => gs.forEach(x => {
      if (!x.isIntersecting) return;
      io.disconnect();
      bs.forEach((o, i) => {
        const pr = { v: 0 };
        gsap.to(pr, { v: o.hedef, duration: 1.3, delay: .15 + i * .22, ease: "power2.out", onUpdate: () => o.yaz(pr.v), onComplete: () => { o.b.textContent = o.b.dataset.son; } });
      });
    }), { threshold: .6 });
    io.observe(sema);
  }

  function kapanis() {
    const sar = document.querySelector(".kapanis-sar");
    if (!sar) return;
    const yazi = sar.querySelector(".kap-yazi"), sahne = sar.querySelector(".kapanis-sahne");
    const isik = sar.querySelector(".kap-isik"), son = sar.querySelector(".kap-son");
    const halka = sar.querySelector(".kap-halka"), hg = halka.getContext("2d");
    const noktalar = [...sar.querySelectorAll(".kap-nokta")].slice(0, telefon ? 2 : 3);
    sar.querySelectorAll(".kap-nokta").forEach((n, i) => { if (i >= noktalar.length) n.remove(); });
    "boztas.design".split("").forEach(ch => { const s = document.createElement("span"); s.textContent = ch; if (ch === ".") s.className = "nk"; yazi.appendChild(s); });
    const harfler = [...yazi.children];
    const ez = gsap.parseEase("power3.out"), ei = gsap.parseEase("power2.inOut"), ex = gsap.parseEase("expo.out");
    const E = gsap.parseEase("sine.inOut");
    let G = [], YW = 0, YH = 0, SW = 0, SH = 0;
    const olc = () => {
      YW = yazi.offsetWidth; YH = yazi.offsetHeight; SW = sahne.clientWidth; SH = sahne.clientHeight;
      G = harfler.map(h => ({ x: h.offsetLeft + h.offsetWidth / 2 - YW / 2, y: h.offsetTop + h.offsetHeight / 2 - YH / 2 }));
      const dpr = Math.min(2, devicePixelRatio || 1);
      halka.width = halka.height = Math.round(140 * dpr); hg.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const halkaCiz = (v) => {
      hg.clearRect(0, 0, 140, 140);
      if (v <= 0) return;
      hg.strokeStyle = "rgba(232,178,32,.85)"; hg.lineWidth = 1.5; hg.lineCap = "round";
      hg.beginPath(); hg.arc(70, 70, 34, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * v); hg.stroke();
    };
    const ciz = (u) => {
      // 0 - .5 harfler yörüngeden oturur; .12 - .78 noktalar dolanır; .38 - .7 ışık; .72 - .94 tek noktaya; .9 - 1 çember
      const rx = Math.min(SW * .46, 560), ry = Math.min(SH * .34, 300);
      const kuc = ei(sinir((u - .72) / .22));
      harfler.forEach((h, i) => {
        const g = G[i]; if (!g) return;
        const e = ez(sinir((u - i * .012) / .46));
        const th = rnd(i + 3) * Math.PI * 2 + (1 - e) * Math.PI * (1.1 + rnd(i + 9));
        const ox = rx * Math.cos(th), oy = ry * Math.sin(th);
        const tx = (1 - e) * (ox - g.x) - kuc * g.x, ty = (1 - e) * (oy - g.y) - kuc * g.y;
        const sc = (.5 + .5 * e) * (1 - kuc);
        h.style.transform = "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0) rotate(" + ((1 - e) * (i % 2 ? 160 : -160)).toFixed(1) + "deg) scale(" + Math.max(sc, 0).toFixed(3) + ")";
        h.style.opacity = String(sinir(e * 2.6) * (1 - sinir((kuc - .55) / .45)));
      });
      const gir = ex(sinir((u - .12) / .22));
      noktalar.forEach((n, k) => {
        const fi = k * (Math.PI * 2 / noktalar.length) + .7 + u * Math.PI * 2 * 1.7;
        const R = 1 - kuc;
        const px = (YW * .56 + 30 + k * 22) * Math.cos(fi) * R, py = (YH * .95 + 24 + k * 14) * Math.sin(fi) * R;
        const ac = -.14, x = px * Math.cos(ac) - py * Math.sin(ac), y = px * Math.sin(ac) + py * Math.cos(ac);
        const d = Math.sin(fi);                                   // + ise yazının önünden geçer
        n.style.zIndex = d > 0 ? 4 : 1;
        n.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) scale(" + (gir * (.7 + .4 * d) * (1 - kuc * .7)).toFixed(3) + ")";
        n.style.opacity = String(gir * (.55 + .45 * (d + 1) / 2) * (1 - sinir((kuc - .7) / .3)));
      });
      const il = sinir((u - .38) / .32);
      isik.style.opacity = String(Math.sin(il * Math.PI));
      isik.style.transform = "translate3d(" + ((il - .3) * 40).toFixed(2) + "%,0,0)";
      const sc = ei(sinir((kuc - .35) / .65));
      son.style.opacity = String(sinir(kuc * 3));
      son.style.transform = "scale(" + (.2 + .8 * sc).toFixed(3) + ")";
      halkaCiz(ei(sinir((u - .9) / .1)));
    };
    olc(); ciz(0);
    ScrollTrigger.addEventListener("refreshInit", olc);
    ScrollTrigger.addEventListener("refresh", () => ciz(pr.u));
    const pr = { u: 0 };
    gsap.timeline({ scrollTrigger: { trigger: sar, start: "top 55%", end: "bottom bottom", scrub: .6 } })
      .to(pr, { u: 1, ease: "none", duration: 1, onUpdate: () => ciz(pr.u) });
  }

  // kahraman girişi (harflerin yükselmesi) bitmeden ölçülmesin
  function girisBitinceBaslat(is) {
    let deneme = 0;
    const yoklama = setInterval(() => {
      const harfler = document.querySelectorAll(".kahraman .harf");
      const alt = document.querySelector(".kahraman-alt");
      const bitti = harfler.length && alt && [...harfler].every(h => gsap.getProperty(h, "opacity") > .999 && Math.abs(gsap.getProperty(h, "yPercent")) < .01) && gsap.getProperty(alt, "opacity") > .999;
      if (bitti || ++deneme > 150) { clearInterval(yoklama); if (bitti) is(); }
    }, 200);
  }

  kok.classList.add("kg");
  const baslat = () => {
    etiketCozulmesi();
    cizgidenKutu();
    sekilDalgasi();
    parcacikBaslik();
    puanHalkasi();
    fiyatSayaci();
    kapanis();
    if (document.querySelector(".gecis-sar")) girisBitinceBaslat(() => { harfIcindenGecis(); window.__kg.gecis = true; });
    window.__kg = { hazir: true };
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(baslat);
})();
