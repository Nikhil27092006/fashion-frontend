// Load footer dynamically
fetch("footer.html")
  .then(res => res.text())
  .then(data => {
      document.getElementById("footer").innerHTML = data;
  });


// CART COUNT
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cartCount").innerText = cart.length;
}
updateCartCount();

// ---------- FILTER + SEARCH + SORT SYSTEM ---------- //

function updatePriceText() {
    const price = document.getElementById("priceRange").value;
    document.getElementById("priceText").innerText = `Max: ₹${price}`;
}

function renderProducts(list) {
    const container = document.getElementById("productGrid");
    container.innerHTML = "";

    list.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" class="product-img">
                <h3>${p.name}</h3>
                <p class="price">₹${p.price} <span class="old-price">₹${p.oldPrice}</span></p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        `;
    });
}

// Main Filtering Function
function filterProducts() {
    let list = [...products];

    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const priceLimit = document.getElementById("priceRange").value;
    const sort = document.getElementById("sortFilter").value;

    // Search
    list = list.filter(p => p.name.toLowerCase().includes(search));

    // Category
    if (category !== "all") list = list.filter(p => p.category === category);

    // Price
    list = list.filter(p => p.price <= priceLimit);

    // Sorting
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));

    renderProducts(list);
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
});

// ---------------- CART SYSTEM ---------------- //

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = products.find(p => p.id === id);

    cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Product added to cart!");
}
// ---------------- CART PAGE RENDERING ---------------- //

function loadCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        document.getElementById("totalAmount").innerText = 0;
        return;
    }

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * (item.qty || 1);

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}">
                <div>
                    <h3>${item.name}</h3>
                    <p>₹${item.price}</p>
                </div>

                <div class="quantity-box">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty || 1}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>

                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    document.getElementById("totalAmount").innerText = total;
}

// Change quantity
function changeQty(index, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart[index].qty) cart[index].qty = 1;
    cart[index].qty += delta;

    if (cart[index].qty <= 0) cart[index].qty = 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Remove item
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Load cart automatically
document.addEventListener("DOMContentLoaded", loadCart);
// ---------------- ORDER PAGE ---------------- //

function loadOrderPage() {
    const box = document.getElementById("orderItems");
    if (!box) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    box.innerHTML = "";
    cart.forEach(item => {
        total += item.price * (item.qty || 1);
        box.innerHTML += `
            <div class="order-item">
                <h3>${item.name} (x${item.qty || 1})</h3>
                <p>₹${item.price * (item.qty || 1)}</p>
            </div>`;
    });

    document.getElementById("orderAmount").innerText = total;
}

document.addEventListener("DOMContentLoaded", loadOrderPage);


// Place order (Mock Backend)
function placeOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart)
    })
    .then(res => res.json())
    .then(() => {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "index.html";
    });
}


