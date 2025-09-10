// Elements
const grid = document.querySelector(".grid");
const searchInput = document.querySelector(".input");
const categorySelect = document.querySelectorAll(".select")[0];
const sortSelect = document.querySelectorAll(".select")[1];

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Load JSON
async function loadProducts() {
  const res = await fetch("products.json");
  products = await res.json();
  renderProducts(products);
  updateCounts(); // refresh counts after load
}

// Render Products
function renderProducts(list) {
  grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb">
        <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div class="content">
        <div class="tag">${p.category}</div>
        <h3 class="name">${p.name}</h3>
        <p class="muted">${p.desc}</p>
        <div class="bottom">
          <div class="price">₹${p.price.toLocaleString()}</div>
          <div style="display:flex;gap:6px;">
            <a class="btn" href="${p.link}" target="_blank">Buy</a>
            <button class="btn" data-action="cart" data-id="${p.id}">🛒</button>
            <button class="btn" data-action="wish" data-id="${p.id}">❤</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Button Events
  document.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", handleAction);
  });
}

// Handle Cart + Wishlist
function handleAction(e) {
  const id = Number(e.target.dataset.id);
  const action = e.target.dataset.action;
  const product = products.find(p => p.id === id);

  if (action === "cart") {
    if (!cart.find(p => p.id === id)) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(product.name + " added to cart ✅");
    } else {
      alert("Already in cart!");
    }
  }

  if (action === "wish") {
    if (!wishlist.find(p => p.id === id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(product.name + " added to wishlist ❤");
    } else {
      alert("Already in wishlist!");
    }
  }

  updateCounts(); // update header counts
}

// Filter + Search + Sort
function applyFilters() {
  let list = [...products];
  const search = searchInput.value.toLowerCase();
  const category = categorySelect.value;
  const sort = sortSelect.value;

  if (search) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.desc.toLowerCase().includes(search)
    );
  }

  if (category !== "All Categories") {
    list = list.filter(p => p.category === category);
  }

  if (sort === "Price: Low → High") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "Price: High → Low") {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === "Latest") {
    list.reverse();
  }

  renderProducts(list);
}

// --- Update Counts in Header ---
function updateCounts() {
  const cartCount = document.getElementById("cartCount");
  const wishCount = document.getElementById("wishCount");

  if (cartCount) cartCount.textContent = cart.length;
  if (wishCount) wishCount.textContent = wishlist.length;

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// --- Add to Cart (direct call) ---
function addToCart(item) {
  if (!cart.find(p => p.id === item.id)) {
    cart.push(item);
    updateCounts();
    alert(item.name + " added to Cart!");
  } else {
    alert("Already in cart!");
  }
}

// --- Add to Wishlist (direct call) ---
function addToWishlist(item) {
  if (!wishlist.find(p => p.id === item.id)) {
    wishlist.push(item);
    updateCounts();
    alert(item.name + " added to Wishlist!");
  } else {
    alert("Already in wishlist!");
  }
}

// Events
searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

// Init
loadProducts();