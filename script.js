(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = n => n.toLocaleString("ru-RU").replace(/\u00a0/g, " ") + " so’m";
  const safe = fn => { try { return fn(); } catch { return null; } };

  /* ---------- Data ---------- */
  const CATS = [
    { id: "all", name: "All", icon: "🛍️" },
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "fashion", name: "Fashion", icon: "👟" },
    { id: "home", name: "Home", icon: "🛋️" },
    { id: "beauty", name: "Beauty", icon: "💄" },
    { id: "kids", name: "Kids", icon: "🧸" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "grocery", name: "Grocery", icon: "🍇" },
    { id: "books", name: "Books", icon: "📚" }
  ];
  const PRODUCTS = [
    { id: 1, name: "Smartphone 128 GB, dual camera", cat: "electronics", icon: "📱", price: 2890000, old: 3490000, rate: 4.8, rev: 2310, bg: "#efe3ff" },
    { id: 2, name: "Wireless noise‑cancelling headphones", cat: "electronics", icon: "🎧", price: 489000, old: 790000, rate: 4.7, rev: 1840, bg: "#e0f0ff" },
    { id: 3, name: "Ultrabook 14\" 16 GB RAM", cat: "electronics", icon: "💻", price: 7450000, old: 8200000, rate: 4.9, rev: 640, bg: "#e6e9f5" },
    { id: 4, name: "Smart watch with heart‑rate sensor", cat: "electronics", icon: "⌚", price: 649000, old: 999000, rate: 4.5, rev: 920, bg: "#ffe8ef" },
    { id: 5, name: "Everyday running sneakers", cat: "fashion", icon: "👟", price: 359000, old: 590000, rate: 4.6, rev: 3120, bg: "#ffeedd" },
    { id: 6, name: "Leather crossbody bag", cat: "fashion", icon: "👜", price: 279000, old: 420000, rate: 4.4, rev: 755, bg: "#f7e6d6" },
    { id: 7, name: "Warm quilted winter coat", cat: "fashion", icon: "🧥", price: 849000, old: 1290000, rate: 4.7, rev: 410, bg: "#e1f2ea" },
    { id: 8, name: "Non‑stick frying pan 28 cm", cat: "home", icon: "🍳", price: 129000, old: 199000, rate: 4.6, rev: 1980, bg: "#fff4cc" },
    { id: 9, name: "Soft corner sofa, 3 seats", cat: "home", icon: "🛋️", price: 4990000, old: 6200000, rate: 4.5, rev: 180, bg: "#ece3ff" },
    { id: 10, name: "Vitamin C face serum 30 ml", cat: "beauty", icon: "💄", price: 89000, old: 140000, rate: 4.8, rev: 2670, bg: "#ffe3ee" },
    { id: 11, name: "Building blocks set, 500 pieces", cat: "kids", icon: "🧸", price: 159000, old: 250000, rate: 4.9, rev: 1320, bg: "#e0f7e9" },
    { id: 12, name: "Size 5 football, match quality", cat: "sports", icon: "⚽", price: 119000, old: 175000, rate: 4.6, rev: 860, bg: "#e6f1ff" },
    { id: 13, name: "Organic dried fruit mix, 1 kg", cat: "grocery", icon: "🍇", price: 74000, old: 95000, rate: 4.7, rev: 1540, bg: "#f1e1ff" },
    { id: 14, name: "Bestselling novel, hardcover", cat: "books", icon: "📚", price: 69000, old: 99000, rate: 4.8, rev: 590, bg: "#fff0dc" }
  ];
  const BRANDS = ["Samsung", "Xiaomi", "Apple", "Nike", "Adidas", "LG", "Philips", "Lego", "Artel", "Zara", "Sony", "Puma"];

  /* ---------- State ---------- */
  const store = {
    cart: safe(() => JSON.parse(localStorage.getItem("um-cart"))) || {},
    fav: new Set(safe(() => JSON.parse(localStorage.getItem("um-fav"))) || []),
    cat: "all", q: ""
  };
  const save = () => safe(() => {
    localStorage.setItem("um-cart", JSON.stringify(store.cart));
    localStorage.setItem("um-fav", JSON.stringify([...store.fav]));
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$("[data-count]", e.target).concat(e.target.matches("[data-count]") ? [e.target] : []).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  const watch = (root = document) => $$("[data-anim]:not(.in)", root).forEach(el => io.observe(el));

  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now(), dur = 1600;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 4)));
      el.textContent = v.toLocaleString("en-US") + (p === 1 && end >= 1000 && !suf ? "+" : suf);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Render ---------- */
  function renderChips() {
    $("#catChips").innerHTML = CATS.map(c => `<button class="chip ${c.id === store.cat ? "on" : ""}" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join("");
    $("#tabs").innerHTML = CATS.slice(0, 6).map(c => `<button class="chip ${c.id === store.cat ? "on" : ""}" data-cat="${c.id}">${c.name}</button>`).join("");
  }
  function renderTiles() {
    $("#tiles").innerHTML = CATS.slice(1).map((c, i) => `<button class="tile" data-anim="zoom" style="--i:${i}" data-cat="${c.id}"><span>${c.icon}</span>${c.name}</button>`).join("");
    watch($("#tiles"));
  }
  function cardHTML(p, i) {
    const off = Math.round((1 - p.price / p.old) * 100), monthly = Math.round(p.price / 12 / 1000) * 1000;
    return `<article class="card" data-anim="up" style="--i:${i % 6}" data-id="${p.id}"><div class="inner">
      <div class="pic" style="background:${p.bg}"><span>${p.icon}</span><i class="badge">−${off}%</i>
        <button class="heart ${store.fav.has(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Add to favourites">${store.fav.has(p.id) ? "♥" : "♡"}</button></div>
      <div class="info"><div class="name">${p.name}</div><div class="rate"><b>★</b> ${p.rate} · ${p.rev.toLocaleString("en-US")} reviews</div>
        <div class="price"><b>${fmt(p.price)}</b><s>${fmt(p.old)}</s></div>
        <span class="inst">${fmt(monthly)} / month × 12</span>
        <button class="btn add" data-add="${p.id}">Add to cart</button></div></div></article>`;
  }
  function renderGrid() {
    const q = store.q.trim().toLowerCase();
    const list = PRODUCTS.filter(p => (store.cat === "all" || p.cat === store.cat) && (!q || p.name.toLowerCase().includes(q) || p.cat.includes(q)));
    $("#grid").innerHTML = list.map(cardHTML).join("");
    $("#empty").hidden = list.length > 0;
    watch($("#grid"));
  }
  function renderFlash() {
    $("#flashRow").innerHTML = PRODUCTS.slice().sort((a, b) => b.old / b.price - a.old / a.price).slice(0, 6).map(cardHTML).join("");
    $$("#flashRow .card").forEach(c => c.classList.add("in"));
  }
  $("#brandTrack").innerHTML = [...BRANDS, ...BRANDS].map(b => `<span>${b}</span>`).join("");

  /* ---------- Filters & search ---------- */
  document.addEventListener("click", e => {
    const c = e.target.closest("[data-cat]");
    if (c) { store.cat = c.dataset.cat; renderChips(); renderGrid(); $("#products").scrollIntoView({ behavior: "smooth" }); }
  });
  $("#search").addEventListener("input", e => { store.q = e.target.value; renderGrid(); });
  $("#searchForm").addEventListener("submit", e => { e.preventDefault(); $("#products").scrollIntoView({ behavior: "smooth" }); });
  $("#catalogBtn").addEventListener("click", () => $("#tiles").scrollIntoView({ behavior: "smooth", block: "center" }));

  /* ---------- Cart ---------- */
  const drawer = $("#drawer"), overlay = $("#overlay");
  const openCart = o => {
    drawer.classList.toggle("open", o); overlay.classList.toggle("open", o);
    drawer.setAttribute("aria-hidden", !o);
    document.body.style.overflow = o ? "hidden" : "";
  };
  ["#cartBtn", "#cartBtn2"].forEach(s => $(s).addEventListener("click", () => openCart(true)));
  $("#closeCart").addEventListener("click", () => openCart(false));
  overlay.addEventListener("click", () => openCart(false));
  addEventListener("keydown", e => e.key === "Escape" && openCart(false));

  const bump = el => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };
  function renderCart() {
    const items = Object.entries(store.cart).map(([id, q]) => ({ p: PRODUCTS.find(x => x.id == id), q })).filter(x => x.p);
    $("#cartList").innerHTML = items.length ? items.map(({ p, q }) => `<div class="line"><div class="t" style="background:${p.bg}">${p.icon}</div>
      <div><b>${p.name}</b><small>${fmt(p.price)}</small></div>
      <div class="qty"><button data-dec="${p.id}" aria-label="Less">−</button><span>${q}</span><button data-inc="${p.id}" aria-label="More">+</button></div></div>`).join("")
      : `<div class="cart-empty"><span>🍇</span>Your cart is empty.<br>Add something tasty.</div>`;
    const count = items.reduce((s, x) => s + x.q, 0);
    $("#cartCount").textContent = count; bump($("#cartCount"));
    $("#favCount").textContent = store.fav.size;
    $("#cartTotal").textContent = fmt(items.reduce((s, x) => s + x.p.price * x.q, 0));
    save();
  }
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove("show"), 2200);
  }
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]"), fav = e.target.closest("[data-fav]"),
          inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
    if (add) { const id = add.dataset.add; store.cart[id] = (store.cart[id] || 0) + 1; renderCart(); toast("Added to cart 🛒"); }
    if (fav) {
      const id = +fav.dataset.fav; store.fav.has(id) ? store.fav.delete(id) : store.fav.add(id);
      $$(`[data-fav="${id}"]`).forEach(b => { const on = store.fav.has(id); b.classList.toggle("on", on); b.textContent = on ? "♥" : "♡"; });
      $("#favCount").textContent = store.fav.size; bump($("#favCount")); save();
    }
    if (inc) { store.cart[inc.dataset.inc]++; renderCart(); }
    if (dec) { const id = dec.dataset.dec; if (--store.cart[id] <= 0) delete store.cart[id]; renderCart(); }
  });
  $("#checkout").addEventListener("click", () => {
    if (!Object.keys(store.cart).length) return toast("Your cart is empty");
    store.cart = {}; renderCart(); openCart(false); toast("Order placed! This is a demo 🎉");
  });
  $("#newsForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast("Subscribed. Check your inbox 💌"); });

  /* ---------- Ripple + 3D tilt ---------- */
  document.addEventListener("pointerdown", e => {
    const b = e.target.closest(".btn"); if (!b) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement("span");
    s.className = "ripple"; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s); setTimeout(() => s.remove(), 600);
  });
  document.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const card = e.target.closest(".card"); if (!card) return;
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height, inner = $(".inner", card);
    inner.style.setProperty("--rx", ((.5 - y) * 10).toFixed(1) + "deg");
    inner.style.setProperty("--ry", ((x - .5) * 10).toFixed(1) + "deg");
    $(".pic", card).style.setProperty("--mx", x * 100 + "%"); $(".pic", card).style.setProperty("--my", y * 100 + "%");
  });
  document.addEventListener("pointerout", e => {
    const card = e.target.closest(".card"); if (!card || card.contains(e.relatedTarget)) return;
    const inner = $(".inner", card); inner.style.setProperty("--rx", "0deg"); inner.style.setProperty("--ry", "0deg");
  });

  /* ---------- Hero slider ---------- */
  const slides = $$(".slide"), dots = $("#dots"); let cur = 0, timer;
  dots.innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}"></button>`).join("");
  const go = i => {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("active", k === cur));
    $$("button", dots).forEach((d, k) => d.classList.toggle("on", k === cur));
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5500); };
  $("#prev").onclick = () => { go(cur - 1); auto(); };
  $("#next").onclick = () => { go(cur + 1); auto(); };
  dots.addEventListener("click", e => { const i = $$("button", dots).indexOf(e.target); if (i > -1) { go(i); auto(); } });
  let sx = 0; const hero = $(".hero");
  hero.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  hero.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) { go(cur + (d < 0 ? 1 : -1)); auto(); } });
  go(0); auto();

  /* ---------- Countdown to end of day ---------- */
  const pad = n => String(n).padStart(2, "0");
  function tick() {
    const now = new Date(), end = new Date(now); end.setHours(23, 59, 59, 999);
    const s = Math.floor((end - now) / 1000), v = { th: pad(Math.floor(s / 3600)), tm: pad(Math.floor(s % 3600 / 60)), ts: pad(s % 60) };
    for (const k in v) { const el = $("#" + k); if (el.textContent !== v[k]) { el.textContent = v[k]; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } }
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Header + to-top ---------- */
  addEventListener("scroll", () => {
    $("#header").classList.toggle("stuck", scrollY > 10);
    $("#toTop").classList.toggle("show", scrollY > 700);
  }, { passive: true });
  $("#toTop").onclick = () => scrollTo({ top: 0, behavior: "smooth" });

  /* ---------- Theme ---------- */
  const setTheme = t => { document.documentElement.dataset.theme = t; $("#themeBtn").textContent = t === "dark" ? "☀️" : "🌙"; safe(() => localStorage.setItem("um-theme", t)); };
  setTheme(safe(() => localStorage.getItem("um-theme")) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("#themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

  /* ---------- Init ---------- */
  renderChips(); renderTiles(); renderFlash(); renderGrid(); renderCart(); watch();
})();