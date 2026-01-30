// Cart array to store items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartCountEl = document.querySelector('.cart-count');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const foodCards = document.querySelectorAll('.food-card');
const foodCategories = document.querySelectorAll('.food-category');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Update cart count display
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }

    updateCartCount();
    showNotification(name + ' added to cart!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Buy now - go directly to order page
function buyNow(id, name, price) {
    // Clear cart and add only this item
    cart = [{
        id: id,
        name: name,
        price: parseFloat(price),
        quantity: 1
    }];
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'order.html';
}

// Category filter
function filterByCategory(category) {
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        foodCategories.forEach(cat => cat.classList.remove('hidden'));
    } else {
        foodCategories.forEach(cat => {
            if (cat.dataset.category === category) {
                cat.classList.remove('hidden');
            } else {
                cat.classList.add('hidden');
            }
        });
    }
}

// Search functionality
function searchFood(query) {
    query = query.toLowerCase().trim();

    if (query === '') {
        foodCards.forEach(card => card.classList.remove('hidden'));
        foodCategories.forEach(cat => cat.classList.remove('hidden'));
        return;
    }

    foodCategories.forEach(cat => cat.classList.remove('hidden'));

    foodCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        if (name.includes(query) || category.includes(query)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    // Hide empty categories
    foodCategories.forEach(cat => {
        const visibleCards = cat.querySelectorAll('.food-card:not(.hidden)');
        if (visibleCards.length === 0) {
            cat.classList.add('hidden');
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Add to cart buttons
    document.querySelectorAll('.add-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.food-card');
            addToCart(card.dataset.id, card.dataset.name, card.dataset.price);
        });
    });

    // Buy now buttons
    document.querySelectorAll('.buy-now').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.food-card');
            buyNow(card.dataset.id, card.dataset.name, card.dataset.price);
        });
    });

    // Category filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterByCategory(this.dataset.category);
        });
    });

    // Search
    searchInput.addEventListener('input', function() {
        searchFood(this.value);
    });

    document.querySelector('.search-btn').addEventListener('click', function() {
        searchFood(searchInput.value);
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
});

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
