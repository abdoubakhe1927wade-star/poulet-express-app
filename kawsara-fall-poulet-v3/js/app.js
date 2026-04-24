const PRODUCTS = [
    { id: 1, title: "Poulet de Chair - Standard (1.2kg)", price: 3500, img: "https://images.unsplash.com/photo-1547919307-1ecb10702e6f?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Poulet de Chair - Premium (1.5kg)", price: 3500, img: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Gros Poulet de Chair (2kg+)", price: 3500, img: "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Lot de 5 Poulets Standard", price: 3500, img: "https://images.unsplash.com/photo-1547919307-1ecb10702e6f?auto=format&fit=crop&w=400&q=80" },
    { id: 5, title: "Poulet Découpé (Filets 1kg)", price: 3500, img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80" }
];

let cart = [];

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

function init() {
    renderProducts();
    updateCartCount();
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = PRODUCTS.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.title}">
            <div class="card-content">
                <h3 class="card-title">${p.title}</h3>
                <div class="card-price">${p.price.toLocaleString()} F</div>
                <button class="btn-add" onclick="addToCart(${p.id})">AJOUTER</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    cart.push(product);
    updateCartCount();
    showToast(`${product.title} ajouté !`);
}

function updateCartCount() {
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(b => b.innerText = cart.length);
}

function showCart() {
    const modal = document.getElementById('cart-modal');
    const itemsList = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        itemsList.innerHTML = '<p style="text-align:center; padding:20px; color:#9ca3af;">Votre panier est vide</p>';
        totalEl.innerText = '0 F';
    } else {
        itemsList.innerHTML = cart.map((item, idx) => `
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <span style="font-size:14px; font-weight:500;">${item.title}</span>
                <div style="display:flex; align-items:center;">
                    <span style="font-weight:700; margin-right:15px;">${item.price.toLocaleString()} F</span>
                    <button onclick="removeFromCart(${idx})" style="border:none; background:none; color:#ef4444;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalEl.innerText = total.toLocaleString() + ' F';
    }
    
    modal.style.display = 'flex';
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    updateCartCount();
    showCart();
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function checkoutWhatsApp() {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemsStr = cart.map(item => `- ${item.title}`).join('%0A');
    const message = `Bonjour Kawsara Fall Poulet, je souhaite commander :%0A${itemsStr}%0A%0ATotal : ${total} F%0A%0AVeuillez confirmer ma commande.`;
    window.open(`https://wa.me/225785985894?text=${message}`);
}

function checkoutWave() {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert("Veuillez effectuer le transfert Wave de " + total + " F au 785985894 (Kawsara Fall). Cliquez sur OK une fois le transfert fait pour confirmer via WhatsApp.");
    checkoutWhatsApp();
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #1f2937;
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 13px;
        z-index: 3000;
        animation: fadeInOut 2s forwards;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Add animation to toast
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, 20px); }
    20% { opacity: 1; transform: translate(-50%, 0); }
    80% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, -20px); }
}`;
document.head.appendChild(style);

init();
