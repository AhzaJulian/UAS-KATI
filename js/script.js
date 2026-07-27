/* =========================================================
   DEKU & CO — script.js
   Data produk + logika transaksi (localStorage dipakai untuk
   memindahkan data antar halaman: detail -> transaksi -> invoice)
   ========================================================= */

const PRODUCTS = [
  { id: 1, name: "Sneakers Classic White", category: "Sneakers", price: 450000,
    img: "images/sneakers.jpg",
    desc: "Sneakers putih bersih dengan siluet klasik. Cocok dipakai harian maupun santai, ringan dan mudah dipadukan dengan outfit apa saja.",
    specs: ["Material: Kanvas + sol karet", "Warna: Putih", "Berat: 320 gram/sebelah", "Cocok untuk: Harian, kampus"] },
  { id: 2, name: "Sneakers Canvas Batik", category: "Sneakers", price: 380000,
    img: "images/sepatu-batik.jpg",
    desc: "Sneakers kanvas dengan motif batik khas, desain unik yang stylish untuk pemakaian sehari-hari.",
    specs: ["Material: Kanvas tebal", "Warna: Hitam/Batik", "Sol: Karet anti slip", "Cocok untuk: Harian, jalan-jalan"] },
  { id: 3, name: "Boots Leather Formal", category: "Boots", price: 750000,
    img: "images/boots-formal.jpg",
    desc: "Boots kulit asli warna hitam, dibuat untuk daya tahan tinggi dengan jahitan rapi.",
    specs: ["Material: Kulit sapi asli", "Warna: Hitam", "Sol: TPR anti slip", "Cocok untuk: Outdoor, formal"] },
  { id: 4, name: "Sepatu Formal Pantofel", category: "Formal", price: 650000,
    img: "images/pantofel-pria.jpg",
    desc: "Sepatu pantofel formal pria pilihan tepat untuk acara resmi maupun kerja kantoran.",
    specs: ["Material: Kulit sintetis premium", "Warna: Hitam", "Sol: Kulit + karet", "Cocok untuk: Kantor, acara formal"] },
  { id: 5, name: "Sandal Slip-on Casual", category: "Sandal", price: 320000,
    img: "images/slip-on.jpg",
    desc: "Sandal slip-on yang nyaman dipakai untuk aktivitas santai, ringan dan mudah dilepas-pasang.",
    specs: ["Material: Synthetic Leather", "Warna: Hitam/Putih", "Sol: EVA empuk", "Cocok untuk: Santai, liburan"] },
  { id: 6, name: "Sepatu Lari Running", category: "Olahraga", price: 550000,
    img: "images/sepatu-olahraga.jpg",
    desc: "Sepatu lari dengan bantalan responsif dan sirkulasi udara baik, menemani setiap kilometer dengan nyaman.",
    specs: ["Material: Mesh breathable", "Warna: Abu-abu", "Sol: EVA + karet", "Cocok untuk: Lari, gym"] },
  { id: 7, name: "Sepatu Kulit Modern", category: "Formal", price: 600000,
    img: "images/sepatu-kulit.jpg",
    desc: "Sepatu kulit berbahan lembut dengan sentuhan elegan, cocok dipakai semi formal maupun kasual.",
    specs: ["Material: Kulit sintetis pilihan", "Warna: Hitam", "Sol: Karet tipis", "Cocok untuk: Semi formal, kerja"] },
  { id: 8, name: "Flat Shoes Slip-on", category: "Casual", price: 400000,
    img: "images/flat-shoes.jpg",
    desc: "Sepatu slip-on kasual praktis dipakai kapan saja dengan bahan adem dan empuk.",
    specs: ["Material: Synthetics", "Warna: Coklat/Krem", "Sol: Karet ringan", "Cocok untuk: Harian, jalan-jalan"] },
  { id: 9, name: "Sepatu Casual Anak", category: "Sneakers", price: 350000,
    img: "images/sepatu-anak.jpg",
    desc: "Sepatu anak dengan desain atraktif dan bahan fleksibel untuk pergerakan aktif.",
    specs: ["Material: Kanvas + sintetis", "Warna: Putih motif", "Sol: Karet vulkanisir", "Cocok untuk: Sekolah, harian"] },
];

function formatRupiah(num){
  return "Rp " + Number(num).toLocaleString("id-ID");
}

function getProductById(id){
  return PRODUCTS.find(p => p.id === Number(id));
}

/* ---------------------------------------------------------
   Toast helper
   --------------------------------------------------------- */
function showToast(msg){
  let toast = document.querySelector(".toast");
  if(!toast){
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------------------------------------------------------
   CATALOG PAGE (index.html)
   --------------------------------------------------------- */
function renderCatalog(filter){
  const grid = document.getElementById("productGrid");
  if(!grid) return;
  const list = filter ? PRODUCTS.filter(p => p.category === filter) : PRODUCTS;
  grid.innerHTML = list.map(p => `
    <article class="tag-card">
      <span class="punch"></span>
      <a href="detail.html?id=${p.id}" class="thumb">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </a>
      <p class="cat">${p.category}</p>
      <h4>${p.name}</h4>
      <p class="price">${formatRupiah(p.price)}</p>
      <a class="btn btn-primary btn-block" href="detail.html?id=${p.id}">Beli Sekarang</a>
    </article>
  `).join("");
}

function setupCatalogFilters(){
  const links = document.querySelectorAll("[data-filter]");
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const cat = link.dataset.filter;
      renderCatalog(cat === "all" ? null : cat);
    });
  });
}

/* ---------------------------------------------------------
   DETAIL PAGE (detail.html)
   --------------------------------------------------------- */
function initDetailPage(){
  const wrap = document.getElementById("detailWrap");
  if(!wrap) return;
  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get("id")) || PRODUCTS[0];

  document.title = product.name + " — Deku & Co";
  document.getElementById("detailImg").src = product.img;
  document.getElementById("detailImg").alt = product.name;
  document.getElementById("detailName").textContent = product.name;
  document.getElementById("detailPrice").textContent = formatRupiah(product.price);
  document.getElementById("detailDesc").textContent = product.desc;
  document.getElementById("detailSpecs").innerHTML = product.specs.map(s => `<li>${s}</li>`).join("");

  let selectedSize = null;
  const sizeWrap = document.getElementById("sizeOptions");
  const sizes = [38, 39, 40, 41, 42, 43];
  sizeWrap.innerHTML = sizes.map(s => `<button type="button" class="size-chip" data-size="${s}">${s}</button>`).join("");
  sizeWrap.addEventListener("click", e => {
    const btn = e.target.closest(".size-chip");
    if(!btn) return;
    sizeWrap.querySelectorAll(".size-chip").forEach(c => c.classList.remove("selected"));
    btn.classList.add("selected");
    selectedSize = btn.dataset.size;
    document.getElementById("sizeMsg").textContent = "";
  });

  const qtyInput = document.getElementById("qtyInput");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qtyInput.value = Math.min(10, Number(qtyInput.value) + 1);
  });

  document.getElementById("goCheckout").addEventListener("click", () => {
    if(!selectedSize){
      document.getElementById("sizeMsg").textContent = "Silakan pilih ukuran sepatu terlebih dahulu.";
      return;
    }
    const order = {
      productId: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      size: selectedSize,
      qty: Number(qtyInput.value),
    };
    localStorage.setItem("deku_order", JSON.stringify(order));
    window.location.href = "transaksi.html";
  });
}

/* ---------------------------------------------------------
   TRANSAKSI PAGE (transaksi.html)
   --------------------------------------------------------- */
function initTransaksiPage(){
  const form = document.getElementById("transaksiForm");
  if(!form) return;

  const order = JSON.parse(localStorage.getItem("deku_order") || "null");
  const summaryBox = document.getElementById("orderSummary");

  if(!order){
    summaryBox.innerHTML = `<p>Belum ada produk dipilih. Silakan pilih produk terlebih dahulu di <a href="index.html">halaman katalog</a>.</p>`;
  } else {
    const subtotal = order.price * order.qty;
    const ongkir = 20000;
    const total = subtotal + ongkir;
    summaryBox.innerHTML = `
      <table>
        <tr><td>Produk</td><td class="num">${order.name}</td></tr>
        <tr><td>Ukuran</td><td class="num">${order.size}</td></tr>
        <tr><td>Jumlah</td><td class="num">${order.qty}</td></tr>
        <tr><td>Subtotal</td><td class="num">${formatRupiah(subtotal)}</td></tr>
        <tr><td>Ongkos Kirim</td><td class="num">${formatRupiah(ongkir)}</td></tr>
        <tr class="total"><td>Total</td><td class="num">${formatRupiah(total)}</td></tr>
      </table>
    `;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if(!order){
      showToast("Tidak ada produk untuk ditransaksikan.");
      return;
    }

    let valid = true;
    const fields = ["custName", "custPhone", "custEmail", "custAddress"];
    fields.forEach(id => {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(id + "Error");
      errorEl.textContent = "";
      if(!input.value.trim()){
        errorEl.textContent = "Wajib diisi.";
        valid = false;
      }
    });

    const emailInput = document.getElementById("custEmail");
    if(emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)){
      document.getElementById("custEmailError").textContent = "Format email tidak valid.";
      valid = false;
    }

    const phoneInput = document.getElementById("custPhone");
    if(phoneInput.value && !/^[0-9+\s-]{8,15}$/.test(phoneInput.value)){
      document.getElementById("custPhoneError").textContent = "Nomor telepon tidak valid.";
      valid = false;
    }

    const payment = form.querySelector('input[name="payment"]:checked');
    const paymentError = document.getElementById("paymentError");
    paymentError.textContent = "";
    if(!payment){
      paymentError.textContent = "Silakan pilih metode pembayaran.";
      valid = false;
    }

    if(!valid) return;

    const subtotal = order.price * order.qty;
    const ongkir = 20000;
    const transaction = {
      ...order,
      subtotal,
      ongkir,
      total: subtotal + ongkir,
      payment: payment.value,
      customer: {
        name: document.getElementById("custName").value.trim(),
        phone: document.getElementById("custPhone").value.trim(),
        email: document.getElementById("custEmail").value.trim(),
        address: document.getElementById("custAddress").value.trim(),
      },
      invoiceNo: "DK-" + Date.now().toString().slice(-8),
      date: new Date().toLocaleString("id-ID"),
    };

    localStorage.setItem("deku_transaction", JSON.stringify(transaction));
    localStorage.removeItem("deku_order");
    window.location.href = "invoice.html";
  });
}

/* ---------------------------------------------------------
   INVOICE PAGE (invoice.html)
   --------------------------------------------------------- */
function initInvoicePage(){
  const box = document.getElementById("invoiceBox");
  if(!box) return;
  const trx = JSON.parse(localStorage.getItem("deku_transaction") || "null");

  if(!trx){
    box.innerHTML = `<p>Belum ada transaksi. Silakan lakukan pemesanan terlebih dahulu di <a href="index.html">halaman katalog</a>.</p>`;
    return;
  }

  document.getElementById("invNumber").textContent = trx.invoiceNo;
  document.getElementById("invDate").textContent = trx.date;
  document.getElementById("invCustName").textContent = trx.customer.name;
  document.getElementById("invCustPhone").textContent = trx.customer.phone;
  document.getElementById("invCustEmail").textContent = trx.customer.email;
  document.getElementById("invCustAddress").textContent = trx.customer.address;
  document.getElementById("invPayment").textContent = trx.payment;

  document.getElementById("invTableBody").innerHTML = `
    <tr>
      <td>${trx.name} (Ukuran ${trx.size})</td>
      <td class="num">${trx.qty}</td>
      <td class="num">${formatRupiah(trx.price)}</td>
      <td class="num">${formatRupiah(trx.price * trx.qty)}</td>
    </tr>
  `;

  document.getElementById("invSubtotal").textContent = formatRupiah(trx.subtotal);
  document.getElementById("invOngkir").textContent = formatRupiah(trx.ongkir);
  document.getElementById("invTotal").textContent = formatRupiah(trx.total);
}

/* ---------------------------------------------------------
   Init on load
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  setupCatalogFilters();
  initDetailPage();
  initTransaksiPage();
  initInvoicePage();

  // Set active menu item based on current page
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-menu a").forEach(a => {
    if(a.getAttribute("href") === path) a.classList.add("active");
  });
});