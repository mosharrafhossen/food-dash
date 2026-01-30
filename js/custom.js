/* ===================================================
   FoodDash – Final Clean JavaScript
   Works with index.html + style.css
=================================================== */

/* ================= PRODUCTS ================= */
const PRODUCTS = [
  {
    id: 1,
    title: "Mega Stack Burger",
    category: "Burger",
    price: 34.0,
    img: "img/mega-stack-burger.jpg",
    desc: "Juicy beef patties, melted cheese, crisp lettuce, tomato and our house sauce."
  },
  {
    id: 2,
    title: "Margherita Pizza",
    category: "Pizza",
    price: 12.5,
    img: "img/margherita-pizza.jpg",
    desc: "Classic margherita with fresh basil and buffalo mozzarella."
  },
  {
    id: 3,
    title: "Crispy Fries",
    category: "Fries",
    price: 4.5,
    img: "img/crispy-fries.jpg",
    desc: "Hand-cut fries, twice-fried for extra crispiness."
  },
  {
    id: 4,
    title: "Garden Salad",
    category: "Salad",
    price: 6.0,
    img: "img/garden-salad.jpg",
    desc: "Mixed greens, cherry tomatoes, cucumbers and vinaigrette."
  },
  {
    id: 5,
    title: "Chicken Wrap",
    category: "Wraps",
    price: 8.75,
    img: "img/chicken-wrap.jpg",
    desc: "Grilled chicken with fresh veggies wrapped in a soft flatbread."
  },
  {
    id: 6,
    title: "Sushi Box",
    category: "Sushi",
    price: 16.0,
    img: "img/sushi-box.webp",
    desc: "Assorted sushi pieces with soy sauce, wasabi and pickled ginger."
  },
  {
    id: 7,
    title: "Veggie Deluxe Pizza",
    category: "Pizza",
    price: 13.5,
    img: "img/veggie-deluxe-pizza.jpg",
    desc: "Loaded with peppers, onions, mushrooms and olives."
  },
  {
    id: 8,
    title: "Chocolate Shake",
    category: "Drinks",
    price: 5.5,
    img: "img/chocolate-shake.avif",
    desc: "Creamy chocolate milkshake topped with whipped cream."
  },
  {
    id: 9,
    title: "Spicy Chicken Wings",
    category: "Chicken",
    price: 9.99,
    img: "img/spicy-chicken-wings.jpg",
    desc: "Crispy hot wings tossed in spicy buffalo sauce with a creamy ranch dip."
  },
  {
    id: 10,
    title: "Beef Steak Platter",
    category: "Steak",
    price: 18.5,
    img: "img/beef-steak-platter.jpg",
    desc: "Tender grilled beef steak served with mashed potatoes and sautéed veggies."
  },
  {
    id: 11,
    title: "Cheese Loaded Nachos",
    category: "Snacks",
    price: 7.25,
    img: "img/cheese-loaded-nachos.avif",
    desc: "Crispy tortilla chips topped with melted cheese, salsa, jalapeños and sour cream."
  },
  {
    id: 12,
    title: "Fresh Fruit Smoothie",
    category: "Drinks",
    price: 4.99,
    img: "img/fresh-fruit-smoothie.jpg",
    desc: "A refreshing blend of mango, pineapple, banana and yogurt."
  }
];

/* ================= CATEGORIES ================= */
const CATEGORIES = [
  "All",
  "Popular",
  "Burger",
  "Pizza",
  "Fries",
  "Salad",
  "Wraps",
  "Sushi",
  "Drinks",
  "Chicken",
  "Steak",
  "Snacks"
];

/* ================= STATE ================= */
const state = {
  products: PRODUCTS,
  category: "All",
  cart: {}
};

/* ================= HELPERS ================= */
const $ = selector => document.querySelector(selector);

/* ================= RENDER CATEGORIES ================= */
function renderCategories() {
  const container = $("#categories");
  if (!container) return;

  container.innerHTML = "";

  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat === state.category ? " active" : "");
    btn.textContent = cat;
    btn.onclick = () => filterCategory(cat);
    container.appendChild(btn);
  });
}


/* ================= RENDER PRODUCTS ================= */
function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = state.products.filter(p => {
    if (state.category === "All") return true;
    if (state.category === "Popular") {
      return p.price <= 8 || p.title.toLowerCase().includes("burger");
    }
    return p.category === state.category;
  });

  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="media">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="meta">
        <div class="name">${p.title}</div>
        <div class="price">$${p.price.toFixed(2)}</div>
      </div>
      <div class="desc">${p.desc}</div>
      <div class="card-foot">
        <button class="small-btn" data-view>Details</button>
        <button class="primary" data-add>Add</button>
      </div>
    `;

    card.querySelector("[data-add]").onclick = () => addToCart(p.id);
    card.querySelector("[data-view]").onclick = () => openModal(p.id);

    grid.appendChild(card);
  });
}

/* ================= CART LOGIC ================= */
function addToCart(id, qty = 1) {
  state.cart[id] = (state.cart[id] || 0) + qty;
  renderCart();
}


function changeQty(id, delta) {
  state.cart[id] += delta;
  if (state.cart[id] <= 0) delete state.cart[id];
  renderCart();
}

function removeFromCart(id) {
  delete state.cart[id];
  renderCart();
}

function clearCart() {
  state.cart = {};
  renderCart();
}

/* ================= RENDER CART ================= */
function renderCart() {
  const list = $("#cartItems");
  const totalEl = $("#cartTotal");
  const countEl = $("#cartCount");

  const ids = Object.keys(state.cart);
  let total = 0;
  let count = 0;

  if (ids.length === 0) {
    list.innerHTML = `<div class="muted">Your cart is empty.</div>`;
    totalEl.textContent = "$0.00";
    countEl.textContent = "0";
    return;
  }

  list.innerHTML = "";

  ids.forEach(id => {
    const p = state.products.find(x => x.id == id);
    const qty = state.cart[id];

    total += p.price * qty;
    count += qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div style="flex:1">
        <strong>${p.title}</strong>
        <div class="muted">$${p.price.toFixed(2)} × ${qty}</div>
      </div>
      <div>
        <button class="small-btn" data-minus>−</button>
        <button class="small-btn" data-plus>+</button>
        <button class="small-btn" data-remove>✕</button>
      </div>
    `;

    row.querySelector("[data-minus]").onclick = () => changeQty(id, -1);
    row.querySelector("[data-plus]").onclick = () => changeQty(id, 1);
    row.querySelector("[data-remove]").onclick = () => removeFromCart(id);

    list.appendChild(row);
  });

  totalEl.textContent = "$" + total.toFixed(2);
  countEl.textContent = count;
}

/* ================= PRODUCT MODAL ================= */
function openModal(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;

  $("#modalImg").src = p.img;
  $("#modalTitle").textContent = p.title;
  $("#modalCategory").textContent = p.category;
  $("#modalDesc").textContent = p.desc;
  $("#modalPrice").textContent = "$" + p.price.toFixed(2);

  $("#modalAdd").onclick = () => {
    addToCart(p.id);
    closeModal();
  };

  $("#overlay").style.display = "flex";
  $("#overlay").setAttribute("aria-hidden", "false");
}

function closeModal() {
  $("#overlay").style.display = "none";
  $("#overlay").setAttribute("aria-hidden", "true");
}

/* ================= ORDER MODAL ================= */
function openOrderModal() {
  $("#orderOverlay").style.display = "flex";
  $("#orderOverlay").setAttribute("aria-hidden", "false");
}

function closeOrderModal() {
  $("#orderOverlay").style.display = "none";
  $("#orderOverlay").setAttribute("aria-hidden", "true");
}

/* ================= FILTER ================= */
function filterCategory(cat) {
  state.category = cat;
  renderCategories();
  renderProducts();
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts();
  renderCart();

  $("#orderNowBtn")?.addEventListener("click", () =>
    $("#productsSection")?.scrollIntoView({ behavior: "smooth" })
  );

  $("#openCartBtn")?.addEventListener("click", () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
  );

  $("#closeModal")?.addEventListener("click", closeModal);

  $("#overlay")?.addEventListener("click", e => {
    if (e.target.id === "overlay") closeModal();
  });

  $("#clearCartBtn")?.addEventListener("click", clearCart);

  $("#checkoutBtn")?.addEventListener("click", () => {
    if (!Object.keys(state.cart).length) {
      alert("Your cart is empty!");
      return;
    }
    openOrderModal();
  });

  $("#closeOrderModal")?.addEventListener("click", closeOrderModal);

  $("#orderForm")?.addEventListener("submit", e => {
    e.preventDefault();

    const phone = $("#orderPhone").value.trim();
    const email = $("#orderEmail").value.trim();
    const address = $("#orderAddress").value.trim();

    if (!phone || !email || !address) {
      alert("Please fill in all fields.");
      return;
    }

    closeOrderModal();
    clearCart();

    setTimeout(() => {
      alert(
        "🎉 Order Confirmed!\n\n" +
        "Thank you for ordering with FoodDash.\n" +
        "Your delicious food will be delivered soon 🍔🍕\n\n" +
        "A confirmation has been sent to:\n" +
        email
      );
    }, 300);
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
});


