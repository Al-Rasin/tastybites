let cart = JSON.parse(localStorage.getItem('cart')) || [];

const DELIVERY_FEE = 50;
const TAX_RATE = 0.05;

const foodImages = {
    '1': 'images/margherita-pizza.jpg',
    '2': 'images/pepperoni-pizza.jpg',
    '3': 'images/bbq-chicken-pizza.jpg',
    '4': 'images/classic-cheeseburger.jpg',
    '5': 'images/double-bacon-burger.jpg',
    '6': 'images/veggie-burger.jpg',
    '7': 'images/chicken-biriyani.jpg',
    '8': 'images/mutton-biriyani.jpg',
    '9': 'images/veg-biriyani.jpg',
    '10': 'images/mango-smoothie.jpg',
    '11': 'images/iced-coffee.jpg',
    '12': 'images/fresh-lemonade.jpg',
    '13': 'images/chocolate-brownie.jpg',
    '14': 'images/cheesecake.jpg',
    '15': 'images/ice-cream-sundae.jpg',
    '16': 'images/veggie-supreme-pizza.jpg',
    '17': 'images/meat-lovers-pizza.jpg',
    '18': 'images/spicy-chicken-burger.jpg',
    '19': 'images/mushroom-swiss-burger.jpg',
    '20': 'images/beef-kacchi-biriyani.jpg',
    '21': 'images/prawn-biriyani.jpg',
    '22': 'images/borhani.png',
    '23': 'images/lassi.jpg',
    '24': 'images/faluda.jpg',
    '25': 'images/rasgulla.webp',
    '26': 'images/mishit-doi.webp',
    '27': 'images/gulab-jamun.webp'
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
        const itemTotal = item.price * item.quantity;
        const imgSrc = foodImages[item.id] || 'https://via.placeholder.com/80';

        const itemHTML = `
            <div class="order-item" data-id="${item.id}">
                <img src="${imgSrc}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">৳${item.price} each</div>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn decrease">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn increase">+</button>
                </div>
                <div class="item-total">৳${itemTotal}</div>
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
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + DELIVERY_FEE + tax;

    subtotalEl.textContent = '৳' + subtotal;
    deliveryFeeEl.textContent = '৳' + DELIVERY_FEE;
    taxEl.textContent = '৳' + tax;
    totalPriceEl.textContent = '৳' + total;
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

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
