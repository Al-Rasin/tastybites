let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartCountEl = document.querySelector('.cart-count');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const foodCards = document.querySelectorAll('.food-card');
const foodCategories = document.querySelectorAll('.food-category');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    localStorage.setItem('cart', JSON.stringify(cart));
}

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

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #2c1810 0%, #3d2418 100%);
        color: #d4a853;
        padding: 18px 30px;
        border-radius: 5px;
        border: 2px solid #d4a853;
        z-index: 9999;
        font-family: 'Lora', serif;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function buyNow(id, name, price) {
    cart = [{
        id: id,
        name: name,
        price: parseFloat(price),
        quantity: 1
    }];
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'order.html';
}

function filterByCategory(category, clickedBtn) {
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    if (category === 'all') {
        foodCategories.forEach(cat => cat.classList.remove('hidden'));
        foodCards.forEach(card => card.classList.remove('hidden'));
    } else {
        foodCategories.forEach(cat => {
            if (cat.dataset.category === category) {
                cat.classList.remove('hidden');
            } else {
                cat.classList.add('hidden');
            }
        });
        foodCards.forEach(card => card.classList.remove('hidden'));
    }
}

function searchFood(query) {
    query = query.toLowerCase().trim();

    document.querySelector('.category-btn.active').classList.remove('active');
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');

    if (query === '') {
        foodCards.forEach(card => card.classList.remove('hidden'));
        foodCategories.forEach(cat => cat.classList.remove('hidden'));
        return;
    }

    foodCategories.forEach(cat => cat.classList.remove('hidden'));
    foodCards.forEach(card => card.classList.remove('hidden'));

    foodCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        if (name.includes(query) || category.includes(query)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    foodCategories.forEach(cat => {
        const visibleCards = cat.querySelectorAll('.food-card:not(.hidden)');
        if (visibleCards.length === 0) {
            cat.classList.add('hidden');
        }
    });
}

function updateActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link:not(.cart-link)');
    const sections = {
        'hero': document.querySelector('.hero'),
        'menu': document.getElementById('menu')
    };

    const scrollPos = window.scrollY + 150;

    if (sections.menu && scrollPos >= sections.menu.offsetTop) {
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-link[href="#menu"]').classList.add('active');
    } else {
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-link[href="index.html"]').classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    document.querySelectorAll('.add-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.food-card');
            addToCart(card.dataset.id, card.dataset.name, card.dataset.price);
        });
    });

    document.querySelectorAll('.buy-now').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.food-card');
            buyNow(card.dataset.id, card.dataset.name, card.dataset.price);
        });
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterByCategory(this.dataset.category, this);
        });
    });

    searchInput.addEventListener('input', function() {
        searchFood(this.value);
    });

    document.querySelector('.search-btn').addEventListener('click', function() {
        searchFood(searchInput.value);
    });

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link:not(.cart-link)').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    window.addEventListener('scroll', updateActiveNav);

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

// Carousel scroll function
function scrollCarousel(button, direction) {
    const wrapper = button.parentElement;
    const grid = wrapper.querySelector('.food-grid');
    const cardWidth = 345; // card width + gap
    grid.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
    });
}

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
