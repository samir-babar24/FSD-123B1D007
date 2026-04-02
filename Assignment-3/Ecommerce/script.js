// --- CONFIG & UTILS ---
const PRODUCTS = [
    { id: 1, name: "Velvet Lounge Chair", price: 299, img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500" },
    { id: 2, name: "Golden Analog Watch", price: 150, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500" },
    { id: 3, name: "Minimalist Lamp", price: 89, img: "https://www.figliving.com/cdn/shop/files/28.png?v=1755055410&width=1000" },
    { id: 4, name: "Leather Travel Bag", price: 210, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
    { id: 5, name: "Designer Sunglasses", price: 120, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500" },
    { id: 6, name: "Ceramic Vase Set", price: 65, img: "https://m.media-amazon.com/images/I/61csWTsH+CL._SX679_.jpg" },
];

// Initialize State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// Run on every page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavUI();

    // Page Specific Logic triggers
    if (document.getElementById('product-list')) renderProducts();
    if (document.getElementById('cart-items')) renderCartPage();
    if (document.getElementById('profile-content')) renderProfilePage();
});

// --- NAVIGATION UI ---
function updateNavUI() {
    const navAuth = document.getElementById('nav-auth');
    const cartCount = document.getElementById('cart-count');

    // Update Cart Badge
    if (cartCount) cartCount.innerText = cart.length;

    // Update Auth Links
    if (currentUser) {
        navAuth.innerHTML = `
            <a href="profile.html" style="margin-right: 30px"><i class="fas fa-user"></i> ${currentUser.name.split(' ')[0]}</a>
            <a href="#" onclick="logout()" style="color:var(--alert)">Logout</a>
        `;
    } else {
        navAuth.innerHTML = `<a href="login.html">Login</a>`;
    }
}

// --- AUTH FUNCTIONS ---
function registerUser(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if (users.some(u => u.email === email)) {
        alert("User already exists!");
        return;
    }

    const newUser = { name, email, pass, orders: [] };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert("Account created! Please login.");
    window.location.href = 'login.html';
}

function loginUser(e) {
    e.preventDefault();
    const email = document.getElementById('log-email').value;
    const pass = document.getElementById('log-pass').value;
    const user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert("Invalid credentials!");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// --- SHOPPING LOGIC ---
function renderProducts() {
    const grid = document.getElementById('product-list');
    grid.innerHTML = PRODUCTS.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}">
            <div class="card-body">
                <h3 class="card-title">${p.name}</h3>
                <span class="card-price">$${p.price}</span>
                <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        const product = PRODUCTS.find(p => p.id === id);
        cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateNavUI();
}

// --- CART PAGE LOGIC ---
function renderCartPage() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = `<tr><td colspan="4" style="text-align:center;">Your cart is empty.</td></tr>`;
        totalEl.innerText = "0";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
        <tr>
            <td><img src="${item.img}" class="cart-img"></td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td><button class="btn-outline" style="padding:5px 10px; border:1px solid red; color:red;" onclick="removeFromCart(${index})">&times;</button></td>
        </tr>`;
    }).join('');

    totalEl.innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
    updateNavUI();
}

function checkout() {
    if (!currentUser) {
        alert("Please login to checkout");
        window.location.href = 'login.html';
        return;
    }

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        total: cart.reduce((sum, i) => sum + (i.price * i.qty), 0),
        items: [...cart]
    };

    const userIndex = users.findIndex(u => u.email === currentUser.email);

    // Add order
    users[userIndex].orders.unshift(order);

    // Save updated users
    localStorage.setItem('users', JSON.stringify(users));

    // 🔥 IMPORTANT FIX
    currentUser = users[userIndex];
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));

    alert("Order Placed Successfully!");
    window.location.href = 'index.html';
}

// --- PROFILE LOGIC ---
function renderProfilePage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Refresh user data from DB to get latest orders
    const userRecord = users.find(u => u.email === currentUser.email);

    document.getElementById('user-name').innerText = userRecord.name;
    document.getElementById('user-email').innerText = userRecord.email;

    const ordersContainer = document.getElementById('order-history');
    if (userRecord.orders.length === 0) {
        ordersContainer.innerHTML = "<p>No orders yet.</p>";
        return;
    }

    ordersContainer.innerHTML = userRecord.orders.map(order => `
        <div class="order-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <strong>Order #${order.id}</strong>
                <span style="color:green">$${order.total}</span>
            </div>
            <p style="font-size:0.85rem; color:#666;">${order.date}</p>
            <div style="margin-top:10px; padding-top:10px; border-top:1px solid #eee;">
                ${order.items.map(i => `<span style="margin-right:10px; font-size:0.8rem; background:#eee; padding:2px 8px; border-radius:4px;">${i.name}</span>`).join('')}
            </div>
        </div>
    `).join('');
}


function searchProducts() {
    const value = document.getElementById("searchInput").value.toLowerCase();
    const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(value)
    );
    renderFilteredProducts(filtered);
}

function filterPrice(type) {
    let filtered = PRODUCTS;

    if (type === "low")
        filtered = PRODUCTS.filter(p => p.price < 100);
    else if (type === "mid")
        filtered = PRODUCTS.filter(p => p.price >= 100 && p.price <= 200);
    else if (type === "high")
        filtered = PRODUCTS.filter(p => p.price > 200);

    renderFilteredProducts(filtered);
}

function renderFilteredProducts(products) {
    const grid = document.getElementById('product-list');
    grid.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}">
            <div class="card-body">
                <h3>${p.name}</h3>
                <span>$${p.price}</span>
                <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}