const products = [
  {
    id: "p1",
    name: "Signature Heel — Black",
    type: "heels",
    color: "black",
    price: 389000,
    sizes: [35,36,37,38,39,40,41,42,43,44,45],
    image: "assets/heels-black.jpg",
    tags: ["Timeless", "Formal", "8 cm"]
  },
  {
    id: "p2",
    name: "Lace Flats — Silver",
    type: "flats",
    color: "silver",
    price: 259000,
    sizes: [35,36,37,38,39,40,41,42,43,44,45],
    image: "assets/flats-silver.jpg",
    tags: ["Soft", "Daily", "3 cm"]
  },
  {
    id: "p3",
    name: "Lace Flats — Brown",
    type: "flats",
    color: "brown",
    price: 259000,
    sizes: [35,36,37,38,39,40,41,42,43,44,45],
    image: "assets/flats-brown.jpg",
    tags: ["Warm tone", "Daily", "3 cm"]
  },
  {
    id: "p4",
    name: "Lace Flats — Black",
    type: "flats",
    color: "black",
    price: 259000,
    sizes: [35,36,37,38,39,40,41,42,43,44,45],
    image: "assets/flats-black.jpg",
    tags: ["Classic", "Daily", "3 cm"]
  },
  {
    id: "p5",
    name: "Mary Jane — Cream",
    type: "flats",
    color: "cream",
    price: 289000,
    sizes: [35,36,37,38,39,40,41,42,43,44,45],
    image: "assets/maryjane-cream.jpg",
    tags: ["Elegant", "Office", "Strap"]
  },
  {
    id: "p6",
    name: "Mary Jane — Brown",
    type: "flats",
    color: "brown",
    price: 289000,
    sizes: [35,36,37,38,39,40,41,42,43,44,45],
    image: "assets/maryjane-brown.jpg",
    tags: ["Mocha", "Office", "Strap"]
  },
];

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const grid = document.getElementById("productGrid");
const filterType = document.getElementById("filterType");
const filterColor = document.getElementById("filterColor");
const filterSize = document.getElementById("filterSize");
const searchInput = document.getElementById("searchInput");

const cartDrawer = document.getElementById("cartDrawer");
const btnOpenCart = document.getElementById("btnOpenCart");
const btnCloseCart = document.getElementById("btnCloseCart");
const closeCartOverlay = document.getElementById("closeCartOverlay");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartCount = document.getElementById("cartCount");

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

document.getElementById("year").textContent = new Date().getFullYear();

let cart = []; // {id, qty}

function openCart(){
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart(){
  cartDrawer.setAttribute("aria-hidden", "true");
}
btnOpenCart.addEventListener("click", openCart);
btnCloseCart.addEventListener("click", closeCart);
closeCartOverlay.addEventListener("click", closeCart);

hamburger.addEventListener("click", () => {
  const isOpen = mobileNav.style.display === "block";
  mobileNav.style.display = isOpen ? "none" : "block";
  mobileNav.setAttribute("aria-hidden", isOpen ? "true" : "false");
});

function addToCart(productId){
  const idx = cart.findIndex(i => i.id === productId);
  if(idx >= 0) cart[idx].qty += 1;
  else cart.push({id: productId, qty: 1});
  renderCart();
  openCart();
}

function decQty(productId){
  const idx = cart.findIndex(i => i.id === productId);
  if(idx < 0) return;
  cart[idx].qty -= 1;
  if(cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}

function incQty(productId){
  const idx = cart.findIndex(i => i.id === productId);
  if(idx < 0) return;
  cart[idx].qty += 1;
  renderCart();
}

function getFilteredProducts(){
  const t = filterType.value;
  const c = filterColor.value;
  const s = filterSize.value;
  const q = (searchInput.value || "").trim().toLowerCase();

  return products.filter(p => {
    const okType = (t === "all") || (p.type === t);
    const okColor = (c === "all") || (p.color === c);
    const okSize = (s === "all") || (p.sizes.includes(Number(s)));
    const okQuery = (!q) || (p.name.toLowerCase().includes(q)) || (p.tags.join(" ").toLowerCase().includes(q));
    return okType && okColor && okSize && okQuery;
  });
}

function renderGrid(){
  const list = getFilteredProducts();

  grid.innerHTML = "";
  if(list.length === 0){
    grid.innerHTML = `<div style="grid-column:1/-1;padding:18px;border:1px solid rgba(0,0,0,.10);border-radius:18px;background:#fff;">
      <p style="margin:0;color:#6b6158;">Produk tidak ditemukan. Coba ubah filter atau kata kunci.</p>
    </div>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img class="card__img" src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="card__body">
        <h3 class="card__title">${p.name}</h3>
        <div class="card__meta">
          <span class="chip">${p.type === "heels" ? "Heels" : "Flats"}</span>
          <span class="chip">${p.color}</span>
          <span class="chip">Size 35–45</span>
        </div>
        <div class="card__price">${rupiah(p.price)}</div>
        <div class="card__actions">
          <button class="btn btn--primary btn--mini" data-add="${p.id}">Add to Cart</button>
          <button class="btn btn--ghost btn--mini" data-detail="${p.id}">View Detail</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add")));
  });

  grid.querySelectorAll("[data-detail]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-detail");
      const p = products.find(x => x.id === id);
      alert(
        `${p.name}\n\n` +
        `Type: ${p.type}\nColor: ${p.color}\nPrice: ${rupiah(p.price)}\nSizes: ${p.sizes.join(", ")}\n\n` +
        `Untuk tugas UAS, detail page bisa dibuat halaman terpisah (opsional).`
      );
    });
  });
}

function renderCart(){
  const count = cart.reduce((a, b) => a + b.qty, 0);
  cartCount.textContent = String(count);

  if(cart.length === 0){
    cartItems.innerHTML = `<div style="padding:14px;border:1px dashed rgba(0,0,0,.15);border-radius:16px;color:#6b6158;background:rgba(242,237,230,.25)">
      Keranjang masih kosong. Silakan pilih produk.
    </div>`;
    cartSubtotal.textContent = "Rp0";
    return;
  }

  let subtotal = 0;
  cartItems.innerHTML = "";
  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    const line = p.price * item.qty;
    subtotal += line;

    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div>
        <h4>${p.name}</h4>
        <p>${rupiah(p.price)} • Qty: ${item.qty}</p>
        <div class="cart-item__actions">
          <button class="qty-btn" data-dec="${p.id}">−</button>
          <button class="qty-btn" data-inc="${p.id}">+</button>
        </div>
      </div>
    `;
    cartItems.appendChild(el);
  });

  cartSubtotal.textContent = rupiah(subtotal);

  cartItems.querySelectorAll("[data-dec]").forEach(btn => {
    btn.addEventListener("click", () => decQty(btn.getAttribute("data-dec")));
  });
  cartItems.querySelectorAll("[data-inc]").forEach(btn => {
    btn.addEventListener("click", () => incQty(btn.getAttribute("data-inc")));
  });
}

[filterType, filterColor, filterSize].forEach(el => el.addEventListener("change", renderGrid));
searchInput.addEventListener("input", renderGrid);

document.getElementById("btnCheckout").addEventListener("click", () => {
  alert("Checkout untuk tugas UAS: bisa diarahkan ke WhatsApp / Google Form / halaman konfirmasi.");
});

renderGrid();
renderCart();
