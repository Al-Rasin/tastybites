let cart = JSON.parse(localStorage.getItem('cart')) || [];

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.08;

const foodImages = {
    '1': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    '2': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    '3': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    '4': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    '5': 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
    '6': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400',
    '7': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    '8': 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400',
    '9': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
    '10': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
    '11': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    '12': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
    '13': 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400',
    '14': 'https://images.unsplash.com/photo-1567327613485-fbc7bf196198?w=400',
    '15': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'
};

const orderItemsContainer = document.getElementById('orderItems');
const emptyCartDiv = document.getElementById('emptyCart');
const subtotalEl = document.getElementById('subtotal');
const deliveryFeeEl = document.getElementById('deliveryFee');
const taxEl = document.getElementById('tax');
const totalPriceEl = document.getElementById('totalPrice');
const cartCountEl = document.querySelector('.cart-count');
const placeOrderBtn = document.getElementById('placeOrderBtn');

function renderOrderItems() {
    if (cart.length === 0) {
        orderItemsContainer.style.display = 'none';
        emptyCartDiv.style.display = 'block';
        document.querySelector('.order-summary-section').style.display = 'none';
        return;
    }

    orderItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        const imgSrc = foodImages[item.id] || 'https://via.placeholder.com/80';

        const itemHTML = `
            <div class="order-item" data-id="${item.id}">
                <img src="${imgSrc}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn decrease">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn increase">+</button>
                </div>
                <div class="item-total">$${itemTotal}</div>
                <button class="remove-btn">Remove</button>
            </div>
        `;

        orderItemsContainer.innerHTML += itemHTML;
    });

    attachEventListeners();
    updateSummary();
}

function attachEventListeners() {
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.closest('.order-item').dataset.id;
            updateQuantity(itemId, 1);
        });
    });

    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.closest('.order-item').dataset.id;
            updateQuantity(itemId, -1);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.closest('.order-item').dataset.id;
            removeItem(itemId);
        });
    });
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeItem(id);
            return;
        }

        saveCart();
        renderOrderItems();
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderOrderItems();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + DELIVERY_FEE + tax;

    subtotalEl.textContent = '$' + subtotal.toFixed(2);
    deliveryFeeEl.textContent = '$' + DELIVERY_FEE.toFixed(2);
    taxEl.textContent = '$' + tax.toFixed(2);
    totalPriceEl.textContent = '$' + total.toFixed(2);
}

placeOrderBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    cart = [];
    saveCart();

    document.getElementById('successModal').classList.add('active');
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function() {
    renderOrderItems();
    updateCartCount();
});
