

// Delivery costs by district
const deliveryCosts = {
    'miraflores': 15.00,
    'san-isidro': 15.00,
    'surco': 20.00,
    'la-molina': 20.00,
    'san-borja': 18.00,
    'barranco': 15.00,
    'chorrillos': 25.00
};

// Function to load products from API
async function loadAllProductsFromAPI() {
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Products loaded from API');
            return data;
        }
    } catch (error) {
        console.log('⚠️ API not available, loading default products (offline mode)');
    }
    
    // Fallback to default products if API is not available
    const defaultProducts = getDefaultProducts();
    console.log('📦 Using default products:', Object.keys(defaultProducts));
    return defaultProducts;
}

// Default products (fallback)
function getDefaultProducts() {
    return {
    products: [
        {
            id: 1,
            name: "Ramo Emma",
            category: "Ramos",
            price: 209.9,
            originalPrice: 249.9,
            discount: 40,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "SALE"
        },
        {
            id: 2,
            name: "Mini Ramo Catalina",
            category: "Mini Ramos",
            price: 119.9,
            originalPrice: 149.9,
            discount: 30,
            image: "https://images.unsplash.com/photo-1563582420-f7b9e5c5f8c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "SALE"
        },
        {
            id: 3,
            name: "Ramo Nerea",
            category: "Ramos",
            price: 209.9,
            originalPrice: 219.9,
            discount: 10,
            image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "SALE"
        },
        {
            id: 4,
            name: "Caja Clásica Alba",
            category: "Cajas Clásicas",
            price: 199.9,
            originalPrice: 229.9,
            discount: 30,
            image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "SALE"
        },
        {
            id: 5,
            name: "Orquídea Blanca",
            category: "Orquídeas",
            price: 159.9,
            originalPrice: null,
            discount: 0,
            image: "https://images.unsplash.com/photo-1583743089695-4b816a340f82?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: null
        },
        {
            id: 6,
            name: "Mini Ramo Matilda",
            category: "Mini Ramos",
            price: 139.9,
            originalPrice: 159.9,
            discount: 20,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "SALE"
        }
    ],
    ofertas: [
        {
            id: 7,
            name: "Ramo Halloween Especial",
            category: "Ramos",
            price: 119.9,
            originalPrice: 149.9,
            discount: 30,
            image: "https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "SALE"
        },
        {
            id: 8,
            name: "Caja de Rosas Rojas",
            category: "Cajas",
            price: 189.9,
            originalPrice: 299.9,
            discount: 110,
            image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "SALE"
        },
        {
            id: 9,
            name: "Mini Ramo Bianca",
            category: "Mini Ramos",
            price: 139.9,
            originalPrice: 159.9,
            discount: 20,
            image: "https://images.unsplash.com/photo-1563582420-f7b9e5c5f8c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "SALE"
        }
    ],
    vendidos: [
        {
            id: 10,
            name: "Ramo Clásico Rojo",
            category: "Ramos",
            price: 179.9,
            originalPrice: null,
            discount: 0,
            image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: null,
            description: "Elegante ramo de rosas rojas perfectas para expresar amor y pasión."
        },
        {
            id: 11,
            name: "Caja Premium",
            category: "Cajas",
            price: 249.9,
            originalPrice: null,
            discount: 0,
            image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: null,
            description: "Caja de lujo con flores mixtas de la más alta calidad."
        },
        {
            id: 12,
            name: "Barril de Flores",
            category: "Barriles",
            price: 199.9,
            originalPrice: null,
            discount: 0,
            image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: null,
            description: "Hermoso barril rústico con flores variadas de temporada."
        },
        {
            id: 13,
            name: "Ramo de Girasoles",
            category: "Ramos",
            price: 159.9,
            originalPrice: null,
            discount: 0,
            image: "https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: null,
            description: "Brillantes girasoles que transmiten alegría y energía positiva."
        },
        {
            id: 14,
            name: "Torta de Chocolate",
            category: "Postres",
            price: 89.9,
            originalPrice: null,
            discount: 0,
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "NUEVO",
            description: "Deliciosa torta de chocolate artesanal, perfecta para acompañar las flores."
        },
        {
            id: 15,
            name: "Planta Suculenta Premium",
            category: "Plantas",
            price: 45.9,
            originalPrice: null,
            discount: 0,
            image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: null,
            description: "Hermosa suculenta en maceta decorativa, regalo perfecto y duradero."
        }
    ],
    
    // New category for special occasions
    especiales: [
        {
            id: 16,
            name: "Ramo Nupcial Elegante",
            category: "Matrimonios",
            price: 399.9,
            originalPrice: 459.9,
            discount: 60,
            image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: "EXCLUSIVO",
            description: "Ramo nupcial con rosas blancas, peonías y eucalipto. Diseño exclusivo."
        },
        {
            id: 17,
            name: "Centro de Mesa Dorado",
            category: "Eventos",
            price: 299.9,
            originalPrice: null,
            discount: 0,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: null,
            description: "Elegante centro de mesa con flores doradas para eventos especiales."
        },
        {
            id: 18,
            name: "Arreglo Funeral",
            category: "Condolencias",
            price: 179.9,
            originalPrice: null,
            discount: 0,
            image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            badge: null,
            description: "Respetuoso arreglo floral para expresar condolencias en momentos difíciles."
        }
    ]
    };
}

// Load products
let products = {};

// Initialize products
async function initializeProducts() {
    products = await loadAllProductsFromAPI();
    loadProducts(currentFilter);
}

// Function to refresh products (called when returning from admin)
async function refreshProducts() {
    products = await loadAllProductsFromAPI();
    loadProducts(currentFilter);
}

// Listen for storage changes (when admin adds products)
window.addEventListener('storage', function(e) {
    if (e.key && e.key.startsWith('products_')) {
        refreshProducts();
    }
});

// Refresh products when page becomes visible (returning from admin)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        refreshProducts();
    }
});

// Shopping cart
let cart = [];
let currentFilter = 'destacados';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('.cart-total');
const cartSubtotal = document.getElementById('cart-subtotal');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    setupFilterTabs();
    updateCartDisplay();
});

// Setup filter tabs functionality
function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the filter type
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            
            // Load products for the selected filter
            loadProducts(filter);
        });
    });
}

// Load and display products
function loadProducts(filter) {
    let productList = [];
    
    // Handle different data structures (API vs fallback)
    if (filter === 'destacados') {
        productList = products.products || products.destacados || [];
    } else {
        productList = products[filter] || [];
    }
    
    console.log(`📋 Loading ${filter} products:`, productList.length);
    
    productsGrid.innerHTML = '';
    
    productList.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Display filtered products
function displayProducts(productList) {
    productsGrid.innerHTML = '';
    
    if (productList.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                <h3 style="color: #666;">No se encontraron productos</h3>
                <p style="color: #999;">Intenta con otra categoría o filtro</p>
            </div>
        `;
        return;
    }
    
    productList.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discountValue = parseFloat(product.discount) || 0;
    const discountText = discountValue > 0 ? `Descuento: S/ ${discountValue.toFixed(2)}` : '';
    
    card.innerHTML = `
        <div class="product-image" onclick="openProductDetail(${product.id}, '${currentFilter}')">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name" onclick="openProductDetail(${product.id}, '${currentFilter}')">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">S/ ${parseFloat(product.price || 0).toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">S/ ${parseFloat(product.originalPrice).toFixed(2)}</span>` : ''}
            </div>
            ${discountText ? `<div class="discount">${discountText}</div>` : ''}
            <button class="add-to-cart" onclick="addToCart(${product.id}, '${currentFilter}')">
                Agregar al Carrito
            </button>
        </div>
    `;
    
    // Add cursor pointer for clickable elements
    const productImage = card.querySelector('.product-image');
    const productName = card.querySelector('.product-name');
    productImage.style.cursor = 'pointer';
    productName.style.cursor = 'pointer';
    
    return card;
}

// Add product to cart
function addToCart(productId, filter) {
    const product = products[filter].find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showCartNotification();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    renderCartItems();
}

// Update quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    updateCartDisplay();
    renderCartItems();
}

// Update cart display (counter and total)
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `S/ ${totalAmount.toFixed(2)}`;
    cartSubtotal.textContent = `S/ ${totalAmount.toFixed(2)}`;
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        return;
    }
    
    // Add scroll indicator if there are many items
    let scrollIndicator = '';
    if (cart.length > 4) {
        scrollIndicator = `
            <div class="cart-scroll-hint" style="text-align: center; padding: 10px; background: #f8f9fa; margin-bottom: 15px; border-radius: 8px; font-size: 12px; color: #666;">
                <i class="fas fa-arrows-alt-v"></i> Desliza para ver más productos
            </div>
        `;
    }
    
    cartItems.innerHTML = scrollIndicator + cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">S/ ${parseFloat(item.price || 0).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 10px; color: #dc3545;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        renderCartItems();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Show cart notification
function showCartNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Producto agregado al carrito';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Newsletter subscription
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    if (email) {
        alert('¡Gracias por suscribirte! Recibirás noticias en: ' + email);
        this.querySelector('input[type="email"]').value = '';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip empty anchors or just '#'
        if (!href || href === '#' || href.length <= 1) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search functionality
document.querySelector('.search-box input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm) {
            searchProducts(searchTerm);
        }
    }
});

function searchProducts(searchTerm) {
    // Simple search implementation
    const allProducts = [...products.destacados, ...products.ofertas, ...products.vendidos];
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; font-size: 18px; color: #6c757d;">No se encontraron productos para tu búsqueda.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('mobile-active');
}

// Navbar dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Handle click on dropdown link
        const dropdownLink = dropdown.querySelector('a');
        dropdownLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.style.opacity = '0';
                    otherMenu.style.visibility = 'hidden';
                    otherMenu.style.transform = 'translateY(-10px)';
                }
            });
            
            // Toggle current dropdown
            if (menu.style.opacity === '1') {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            } else {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            }
        });
        
        // Don't prevent clicks on dropdown menu items
        menu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                // Let the onclick handler execute first, then close dropdown
                setTimeout(() => {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                }, 100);
            }
        });
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-10px)';
        });
    }
});

// Close cart when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        toggleCart();
    }
});

// Checkout functionality (basic)
document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Redirigiendo al proceso de pago...\nTotal: S/ ${total.toFixed(2)}`);
});



// Enhanced checkout system
function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    const modal = document.getElementById('checkout-modal-overlay');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Populate checkout items
    populateCheckoutItems();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('#checkout-form input[type="date"]').min = today;
    document.querySelector('#checkout-form input[type="date"]').value = today;
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal-overlay');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function populateCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const deliveryCostEl = document.getElementById('delivery-cost');
    const totalEl = document.getElementById('checkout-total');
    
    let subtotal = 0;
    
    checkoutItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="summary-item">
                <div class="summary-item-name">${item.name} (x${item.quantity})</div>
                <div class="summary-item-price">S/ ${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');
    
    subtotalEl.textContent = `S/ ${subtotal.toFixed(2)}`;
    
    // Update delivery cost when district changes
    const districtSelect = document.querySelector('#checkout-form select');
    districtSelect.addEventListener('change', function() {
        const selectedDistrict = this.value;
        const deliveryCost = deliveryCosts[selectedDistrict] || 0;
        const total = subtotal + deliveryCost;
        
        deliveryCostEl.textContent = `S/ ${deliveryCost.toFixed(2)}`;
        totalEl.textContent = `S/ ${total.toFixed(2)}`;
    });
    
    // Initial calculation
    const initialDelivery = 0;
    deliveryCostEl.textContent = `S/ ${initialDelivery.toFixed(2)}`;
    totalEl.textContent = `S/ ${subtotal.toFixed(2)}`;
}

// Handle checkout form submission
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(this);
    
    // Calculate total
    const subtotal = calculateSubtotal();
    const deliveryCost = calculateDeliveryCost(formData.get('district'));
    const totalAmount = subtotal + deliveryCost;
    
    const orderData = {
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        items: cart,
        delivery: {
            district: formData.get('district'),
            address: formData.get('address'),
            reference: formData.get('reference'),
            date: formData.get('date'),
            time: formData.get('time')
        },
        payment: formData.get('payment'),
        total: `S/ ${totalAmount.toFixed(2)}`
    };
    
    // Simulate order processing
    processOrder(orderData);
});

function processOrder(orderData) {
    // Show loading state
    const submitBtn = document.querySelector('button[form="checkout-form"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Confirmar Pedido';
    if (submitBtn) {
        submitBtn.textContent = 'Procesando...';
        submitBtn.disabled = true;
    }
    
    // Simulate API call
    setTimeout(() => {
        const orderNumber = generateOrderNumber();
        
        // Close checkout modal
        closeCheckoutModal();
        
        // Show success message
        showOrderConfirmation(orderNumber, orderData);
        
        // Reset button
        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 2000);
}

function generateOrderNumber() {
    return 'LRF-' + Date.now().toString(36).toUpperCase();
}

function showOrderConfirmation(orderNumber, orderData) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    
    // Verificar si el pago es con Yape o Plin
    if (orderData.payment === 'yape' || orderData.payment === 'plin') {
        modal.innerHTML = generateYapePlinConfirmation(orderNumber, orderData);
    } else {
        modal.innerHTML = generateStandardConfirmation(orderNumber, orderData);
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function generateYapePlinConfirmation(orderNumber, orderData) {
    const subtotal = calculateSubtotal();
    const deliveryCost = calculateDeliveryCost(orderData.delivery.district);
    const total = subtotal + deliveryCost;
    
    return `
        <div class="modal large">
            <div class="modal-header" style="background: linear-gradient(135deg, #6a1b9a, #8e44ad); color: white; text-align: center;">
                <h3 style="margin: 0; font-size: 24px;"><i class="fas fa-mobile-alt"></i> Paga con YAPE o PLIN 100% seguro</h3>
                <button class="close-modal" onclick="clearCartAndCloseModal(this)" style="color: white;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content" style="background: linear-gradient(to bottom, #f8f9fa, #ffffff);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h4 style="color: #d63384; margin-bottom: 20px;">Escanea el siguiente QR:</h4>
                    
                    <div style="display: flex; justify-content: center; margin-bottom: 30px;">
                        <div style="text-align: center;">
                            <div style="background: linear-gradient(135deg, #6a1b9a, #8e44ad); padding: 20px; border-radius: 15px; box-shadow: 0 8px 25px rgba(106, 27, 154, 0.3); margin: 0 auto 15px; max-width: 320px;">
                                <div style="width: 280px; height: 380px; border-radius: 15px; background: white; padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto;">
                                    <div style="color: #6a1b9a; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
                                        <i class="fas fa-mobile-alt"></i> yape
                                    </div>
                                    <div style="width: 180px; height: 180px; background: #6a1b9a; margin: 20px 0; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; text-align: center;">
                                        QR CODE<br>YAPE<br><br>Luis Benjamin<br>Baldeon Quispe<br><br>965131163
                                    </div>
                                    <div style="background: #00d4aa; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 14px;">
                                        Paga aquí con Yape
                                    </div>
                                    <div style="color: #6a1b9a; font-weight: bold; margin-top: 15px; text-align: center;">
                                        Luis Benjamin Baldeon Quispe
                                    </div>
                                </div>
                            </div>
                            <p style="font-weight: bold; color: #6a1b9a; font-size: 18px;">
                                <i class="fas fa-mobile-alt"></i> Escanea con YAPE o PLIN
                            </p>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                        <p style="margin-bottom: 10px;"><strong>o agrega el siguiente Número:</strong></p>
                        <p style="font-size: 24px; font-weight: bold; color: #d63384; margin-bottom: 10px;">965131163</p>
                        <p style="margin-bottom: 5px;"><strong>Titular:</strong> Luis Benjamin Baldeon Quispe</p>
                    </div>
                    
                    <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                        <p style="margin-bottom: 10px; font-weight: bold; color: #0066cc;">Una vez realizado el abono enviar la constancia a nuestro WhatsApp:</p>
                        <p style="font-size: 20px; font-weight: bold; color: #25d366; margin-bottom: 10px;">
                            <i class="fab fa-whatsapp"></i> 965 131 163
                        </p>
                        <p style="font-weight: bold; color: #d63384;">¡Muchas Gracias!</p>
                    </div>
                </div>
                
                <div style="background: #fff; border: 2px solid #dee2e6; border-radius: 10px; padding: 20px;">
                    <h4 style="margin-bottom: 15px; color: #333;"><i class="fas fa-receipt"></i> Detalles del pedido</h4>
                    
                    <div style="border-bottom: 1px solid #dee2e6; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; font-weight: bold; padding-bottom: 10px;">
                            <span>Producto</span>
                            <span>Total</span>
                        </div>
                    </div>
                    
                    ${generateOrderItemsList()}
                    
                    <div style="border-top: 2px solid #dee2e6; padding-top: 15px; margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Subtotal:</span>
                            <span>S/ ${subtotal.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Envío:</span>
                            <span>S/ ${deliveryCost.toFixed(2)} vía ${getDistrictText(orderData.delivery.district)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Método de pago:</span>
                            <span>Paga con YAPE O PLIN 100% seguro</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #d63384;">
                            <span>Total:</span>
                            <span>S/ ${total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                        <h5 style="margin-bottom: 10px; color: #333;">Dirección de entrega</h5>
                        <p style="margin: 5px 0;"><strong>${orderData.customer.name}</strong></p>
                        <p style="margin: 5px 0;">${orderData.delivery.address}</p>
                        <p style="margin: 5px 0;">${orderData.delivery.reference || ''}</p>
                        <p style="margin: 5px 0;">${getDistrictText(orderData.delivery.district)}</p>
                        <p style="margin: 5px 0;">${orderData.customer.phone}</p>
                        <p style="margin: 5px 0;">${orderData.customer.email}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding: 20px; background: #d4edda; border-radius: 10px;">
                        <h4 style="color: #155724; margin-bottom: 10px;">Gracias. Tu pedido ha sido recibido.</h4>
                        <p style="margin: 5px 0;"><strong>Número de pedido:</strong> ${orderNumber}</p>
                        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-PE')}</p>
                        <p style="margin: 5px 0;"><strong>Total:</strong> S/ ${total.toFixed(2)}</p>
                        <p style="margin: 5px 0;"><strong>Método de pago:</strong> Paga con YAPE O PLIN</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn-primary" onclick="clearCartAndCloseModal(this)">
                        Continuar Comprando
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStandardConfirmation(orderNumber, orderData) {
    return `
        <div class="modal">
            <div class="modal-content" style="text-align: center; padding: 40px;">
                <i class="fas fa-check-circle" style="font-size: 64px; color: #28a745; margin-bottom: 20px;"></i>
                <h3 style="color: #28a745; margin-bottom: 15px;">¡Pedido Confirmado!</h3>
                <p style="margin-bottom: 20px;">Tu pedido #${orderNumber} ha sido procesado exitosamente.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <p><strong>Total:</strong> ${orderData.total}</p>
                    <p><strong>Entrega:</strong> ${orderData.delivery.date} (${getTimeSlotText(orderData.delivery.time)})</p>
                    <p><strong>Distrito:</strong> ${getDistrictText(orderData.delivery.district)}</p>
                </div>
                <p style="color: #6c757d; margin-bottom: 25px;">
                    Recibirás una confirmación por WhatsApp y email con los detalles de seguimiento.
                </p>
                <button class="btn-primary" onclick="clearCartAndCloseModal(this)">
                    Continuar Comprando
                </button>
            </div>
        </div>
    `;
}

function generateOrderItemsList() {
    return cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0;">
            <span>${item.name} × ${item.quantity}</span>
            <span>S/ ${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}

function getTimeSlotText(timeSlot) {
    const slots = {
        'morning': '9:00 AM - 12:00 PM',
        'afternoon': '2:00 PM - 6:00 PM',
        'evening': '6:00 PM - 9:00 PM'
    };
    return slots[timeSlot] || timeSlot;
}

function getDistrictText(district) {
    return district ? district.charAt(0).toUpperCase() + district.slice(1).replace('-', ' ') : '';
}

function calculateSubtotal() {
    return cart.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);
}

function calculateDeliveryCost(district) {
    return deliveryCosts[district] || 0;
}

function clearCartAndCloseModal(button) {
    // Clear the cart
    cart = [];
    updateCartDisplay();
    
    // Close the modal
    document.body.removeChild(button.closest('.modal-overlay'));
    
    // Reset body overflow
    document.body.style.overflow = '';
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const colorMap = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colorMap[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 4000;
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.innerHTML = `<i class="${iconMap[type]}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
}

// Update checkout button to use new modal
document.querySelector('.checkout-btn').removeEventListener('click', function() {});
document.querySelector('.checkout-btn').addEventListener('click', openCheckoutModal);

// Advanced search with filters
function initializeAdvancedSearch() {
    const searchInput = document.querySelector('.search-box input');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = this.value.toLowerCase().trim();
            if (query.length >= 2) {
                performAdvancedSearch(query);
            } else if (query.length === 0) {
                loadProducts(currentFilter);
            }
        }, 300);
    });
}

function performAdvancedSearch(query) {
    const allProducts = [...products.destacados, ...products.ofertas, ...products.vendidos, ...products.especiales];
    const filteredProducts = allProducts.filter(product => {
        return product.name.toLowerCase().includes(query) ||
               product.category.toLowerCase().includes(query) ||
               (product.description && product.description.toLowerCase().includes(query));
    });
    
    displaySearchResults(filteredProducts, query);
}

function displaySearchResults(products, query) {
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 48px; color: #6c757d; margin-bottom: 20px;"></i>
                <h3 style="color: #6c757d; margin-bottom: 10px;">No encontramos resultados</h3>
                <p style="color: #6c757d;">No hay productos que coincidan con "${query}"</p>
                <button class="btn-primary" onclick="loadProducts('destacados')" style="margin-top: 20px;">
                    Ver todos los productos
                </button>
            </div>
        `;
        return;
    }
    
    // Add search results header
    const header = document.createElement('div');
    header.style.cssText = 'grid-column: 1 / -1; margin-bottom: 20px; text-align: center;';
    header.innerHTML = `
        <h3 style="color: #333; margin-bottom: 10px;">Resultados para "${query}"</h3>
        <p style="color: #6c757d;">${products.length} producto(s) encontrado(s)</p>
    `;
    productsGrid.appendChild(header);
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Initialize intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Advanced Filters Functions
let filtersVisible = false;

function toggleAdvancedFilters() {
    const dropdown = document.getElementById('filters-dropdown');
    const toggle = document.querySelector('.filter-toggle');
    
    filtersVisible = !filtersVisible;
    
    if (filtersVisible) {
        dropdown.classList.add('active');
        toggle.classList.add('active');
    } else {
        dropdown.classList.remove('active');
        toggle.classList.remove('active');
    }
}

function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const occasionFilter = document.getElementById('occasion-filter').value;
    
    let filteredProducts = [];
    
    // Get all products
    Object.values(products).forEach(categoryProducts => {
        filteredProducts = filteredProducts.concat(categoryProducts);
    });
    
    // Apply category filter
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase().includes(categoryFilter.toLowerCase())
        );
    }
    
    // Apply price filter
    if (priceFilter) {
        filteredProducts = filteredProducts.filter(product => {
            const price = product.price;
            switch (priceFilter) {
                case '0-100':
                    return price >= 0 && price <= 100;
                case '100-200':
                    return price > 100 && price <= 200;
                case '200-300':
                    return price > 200 && price <= 300;
                case '300+':
                    return price > 300;
                default:
                    return true;
            }
        });
    }
    
    // Apply occasion filter (based on category mapping)
    if (occasionFilter) {
        const occasionMap = {
            'amor': ['ramos', 'cajas'],
            'cumpleaños': ['ramos', 'mini ramos', 'postres'],
            'matrimonios': ['matrimonios', 'ramos'],
            'condolencias': ['condolencias', 'ramos'],
            'eventos': ['eventos', 'cajas', 'barriles']
        };
        
        const allowedCategories = occasionMap[occasionFilter] || [];
        filteredProducts = filteredProducts.filter(product => 
            allowedCategories.some(cat => 
                product.category.toLowerCase().includes(cat.toLowerCase())
            )
        );
    }
    
    // Display results
    displayFilteredResults(filteredProducts, { categoryFilter, priceFilter, occasionFilter });
    
    // Close dropdown
    toggleAdvancedFilters();
}

function displayFilteredResults(products, filters) {
    productsGrid.innerHTML = '';
    
    // Create filter summary
    const activeFilters = [];
    if (filters.categoryFilter) activeFilters.push(`Categoría: ${filters.categoryFilter}`);
    if (filters.priceFilter) activeFilters.push(`Precio: ${filters.priceFilter}`);
    if (filters.occasionFilter) activeFilters.push(`Ocasión: ${filters.occasionFilter}`);
    
    if (activeFilters.length > 0) {
        const header = document.createElement('div');
        header.style.cssText = 'grid-column: 1 / -1; margin-bottom: 20px;';
        header.innerHTML = `
            <div style="background: #e7f3ff; padding: 15px; border-radius: 10px; border-left: 4px solid #d63384;">
                <h4 style="margin: 0 0 8px 0; color: #333;">Filtros aplicados:</h4>
                <p style="margin: 0; color: #6c757d;">${activeFilters.join(' • ')}</p>
                <button onclick="clearFilters()" style="background: none; border: none; color: #d63384; font-weight: 600; margin-top: 8px; cursor: pointer;">
                    <i class="fas fa-times"></i> Limpiar filtros
                </button>
            </div>
        `;
        productsGrid.appendChild(header);
    }
    
    if (products.length === 0) {
        const noResults = document.createElement('div');
        noResults.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 60px 20px;';
        noResults.innerHTML = `
            <i class="fas fa-filter" style="font-size: 48px; color: #6c757d; margin-bottom: 20px;"></i>
            <h3 style="color: #6c757d; margin-bottom: 10px;">No hay productos que coincidan</h3>
            <p style="color: #6c757d;">Intenta ajustar los filtros o limpiarlos para ver más opciones</p>
            <button class="btn-primary" onclick="clearFilters()" style="margin-top: 20px;">
                Limpiar filtros
            </button>
        `;
        productsGrid.appendChild(noResults);
        return;
    }
    
    // Add results count
    const count = document.createElement('div');
    count.style.cssText = 'grid-column: 1 / -1; text-align: center; margin-bottom: 20px;';
    count.innerHTML = `<p style="color: #6c757d;">${products.length} producto(s) encontrado(s)</p>`;
    productsGrid.appendChild(count);
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function clearFilters() {
    // Reset all filter dropdowns
    document.getElementById('category-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('occasion-filter').value = '';
    
    // Reset to current filter tab
    loadProducts(currentFilter);
    
    // Close dropdown if open
    if (filtersVisible) {
        toggleAdvancedFilters();
    }
}

// Filter by category from navbar
function filterByCategory(category) {
    // Close dropdown menus
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(-10px)';
    });
    
    // Update title and show breadcrumb
    document.getElementById('products-title').textContent = `Productos - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    document.getElementById('current-filter').textContent = category;
    document.getElementById('filter-breadcrumb').style.display = 'flex';
    
    // Filter products by category
    const allProducts = Object.values(products).flat();
    const filteredProducts = allProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
    );
    
    // Display filtered products
    displayProducts(filteredProducts);
    
    // Scroll to products section
    document.getElementById('productos').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
    });
}

// Filter by occasion from navbar  
function filterByOccasion(occasion) {
    // Close dropdown menus
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(-10px)';
    });
    
    // Update title and show breadcrumb
    document.getElementById('products-title').textContent = `Productos para ${occasion.charAt(0).toUpperCase() + occasion.slice(1)}`;
    document.getElementById('current-filter').textContent = `Ocasión: ${occasion}`;
    document.getElementById('filter-breadcrumb').style.display = 'flex';
    
    // Filter products by occasion
    const allProducts = Object.values(products).flat();
    const filteredProducts = allProducts.filter(product => 
        product.occasion && product.occasion.toLowerCase().includes(occasion.toLowerCase())
    );
    
    // Display filtered products
    displayProducts(filteredProducts);
    
    // Scroll to products section
    document.getElementById('productos').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
    });
}

// Clear category filter and return to all products
function clearCategoryFilter() {
    // Hide breadcrumb
    document.getElementById('filter-breadcrumb').style.display = 'none';
    
    // Reset title
    document.getElementById('products-title').textContent = 'Favoritos por categoría';
    
    // Load all products with current filter
    loadProducts(currentFilter);
}

// Close filters dropdown when clicking outside
document.addEventListener('click', function(e) {
    const filtersDropdown = document.getElementById('filters-dropdown');
    const filterToggle = document.querySelector('.filter-toggle');
    
    if (filtersVisible && 
        !filtersDropdown.contains(e.target) && 
        !filterToggle.contains(e.target)) {
        toggleAdvancedFilters();
    }
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced search
    initializeAdvancedSearch();
    
    // Animate elements
    setTimeout(() => {
        document.querySelectorAll('.product-card, .feature-card, .testimonial-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 100);
    
    // Initialize testimonials slider (simple auto-scroll)
    initializeTestimonialsSlider();
});

// Simple testimonials slider
function initializeTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    let currentSlide = 0;
    const slides = slider.children;
    const totalSlides = slides.length;
    
    // Auto-slide every 5 seconds
    setInterval(() => {
        // Add fade effect to current testimonial
        if (slides[currentSlide]) {
            slides[currentSlide].style.opacity = '0.7';
        }
        
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // Restore opacity to new current slide
        setTimeout(() => {
            if (slides[currentSlide]) {
                slides[currentSlide].style.opacity = '1';
            }
        }, 500);
    }, 5000);
}

// Product Detail Modal Functions
let currentProductDetail = null;

function openProductDetail(productId, filter) {
    // Find the product in any category
    let product = null;
    let productFilter = filter;
    
    // Search in all categories if not found in current filter
    if (!products[filter]) {
        productFilter = 'destacados';
    }
    
    // Look for the product in all categories
    for (const category of Object.keys(products)) {
        product = products[category].find(p => p.id === productId);
        if (product) {
            productFilter = category;
            break;
        }
    }
    
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    currentProductDetail = { ...product, filter: productFilter };
    
    // Populate modal with product data
    populateProductDetail(product);
    
    // Show modal
    const modal = document.getElementById('product-detail-overlay');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load related products
    loadRelatedProducts(product);
}

function closeProductDetail() {
    const modal = document.getElementById('product-detail-overlay');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentProductDetail = null;
}

function populateProductDetail(product) {
    // Basic product info
    document.getElementById('product-detail-title').textContent = product.name;
    document.getElementById('product-detail-name').textContent = product.name;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-name-breadcrumb').textContent = product.name;
    
    // Main image and thumbnails
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.image;
    mainImage.alt = product.name;
    
    // Generate additional images for gallery (using variations of the same image)
    const thumbnails = document.querySelectorAll('.thumbnail img');
    const imageVariations = [
        product.image,
        product.image.replace('w=500', 'w=500&sat=-20'),
        product.image.replace('w=500', 'w=500&hue=30'),
        product.image.replace('w=500', 'w=500&blur=0.5')
    ];
    
    thumbnails.forEach((thumb, index) => {
        thumb.src = imageVariations[index] || product.image;
        thumb.alt = `${product.name} - Vista ${index + 1}`;
    });
    
    // Add click handlers for thumbnails
    setupThumbnailGallery();
    
    // Badges
    const badgesContainer = document.getElementById('product-badges');
    badgesContainer.innerHTML = product.badge ? 
        `<div class="product-badge">${product.badge}</div>` : '';
    
    // Price
    document.getElementById('product-price-detail').textContent = `S/ ${parseFloat(product.price || 0).toFixed(2)}`;
    
    const originalPriceEl = document.getElementById('product-original-price-detail');
    if (product.originalPrice) {
        originalPriceEl.textContent = `S/ ${parseFloat(product.originalPrice).toFixed(2)}`;
        originalPriceEl.style.display = 'inline';
    } else {
        originalPriceEl.style.display = 'none';
    }
    
    const discountBadge = document.getElementById('product-discount-badge');
    const discountValue = parseFloat(product.discount) || 0;
    if (discountValue > 0) {
        discountBadge.textContent = `Ahorra S/ ${discountValue.toFixed(2)}`;
        discountBadge.style.display = 'inline-block';
    } else {
        discountBadge.style.display = 'none';
    }
    
    // Description
    const description = product.description || 
        `Hermoso ${product.category.toLowerCase()} "${product.name}" elaborado con las flores más frescas y de mejor calidad. Perfecto para expresar tus sentimientos en cualquier ocasión especial.`;
    document.getElementById('product-description-text').textContent = description;
    
    // Reset quantity and note
    document.getElementById('product-quantity').value = 1;
    document.getElementById('product-note').value = '';
    
    // Setup share buttons
    setupShareButtons(product);
}

function setupThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const thumbImg = this.querySelector('img');
            mainImage.src = thumbImg.src;
            mainImage.alt = thumbImg.alt;
        });
    });
}

function changeQuantity(change) {
    const quantityInput = document.getElementById('product-quantity');
    let currentQuantity = parseInt(quantityInput.value);
    let newQuantity = currentQuantity + change;
    
    // Ensure quantity stays within bounds
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;
    
    quantityInput.value = newQuantity;
}

function addToCartFromDetail() {
    if (!currentProductDetail) return;
    
    const quantity = parseInt(document.getElementById('product-quantity').value);
    const note = document.getElementById('product-note').value.trim();
    
    // Create product with additional details
    const productToAdd = {
        ...currentProductDetail,
        note: note,
        quantity: quantity
    };
    
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
        addToCart(currentProductDetail.id, currentProductDetail.filter);
    }
    
    // Show success message
    showNotification(`${productToAdd.name} agregado al carrito (${quantity} unidad${quantity > 1 ? 'es' : ''})`, 'success');
    
    // Optional: Close modal after adding to cart
    // closeProductDetail();
}

function buyNowFromDetail() {
    if (!currentProductDetail) return;
    
    // Add to cart first
    addToCartFromDetail();
    
    // Close product detail modal
    closeProductDetail();
    
    // Open checkout modal after a brief delay
    setTimeout(() => {
        openCheckoutModal();
    }, 500);
}

function toggleWishlist() {
    const wishlistBtn = document.querySelector('.btn-wishlist');
    const isActive = wishlistBtn.classList.contains('active');
    
    if (isActive) {
        wishlistBtn.classList.remove('active');
        showNotification('Removido de favoritos', 'info');
    } else {
        wishlistBtn.classList.add('active');
        showNotification('Agregado a favoritos', 'success');
    }
}

function setupShareButtons(product) {
    const productUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    const productText = `¡Mira este hermoso ${product.category.toLowerCase()}: ${product.name}! `;
    
    // WhatsApp share
    const whatsappBtn = document.querySelector('.share-btn.whatsapp');
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(productText + productUrl)}`;
    
    // Facebook share
    const facebookBtn = document.querySelector('.share-btn.facebook');
    facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    
    // Twitter share
    const twitterBtn = document.querySelector('.share-btn.twitter');
    twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(productText)}&url=${encodeURIComponent(productUrl)}`;
}

function copyProductLink() {
    const productUrl = `${window.location.origin}${window.location.pathname}?product=${currentProductDetail?.id}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(productUrl).then(() => {
            showNotification('Enlace copiado al portapapeles', 'success');
        });
    } else {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = productUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showNotification('Enlace copiado al portapapeles', 'success');
    }
}

function loadRelatedProducts(product) {
    const relatedGrid = document.getElementById('related-products-grid');
    
    // Find products from the same category or similar categories
    let relatedProducts = [];
    
    // First, try to get products from the same category
    Object.values(products).forEach(categoryProducts => {
        const sameCategory = categoryProducts.filter(p => 
            p.id !== product.id && 
            (p.category === product.category || 
             p.category.toLowerCase().includes(product.category.toLowerCase().split(' ')[0]))
        );
        relatedProducts = relatedProducts.concat(sameCategory);
    });
    
    // If not enough products, add some from other categories
    if (relatedProducts.length < 4) {
        Object.values(products).forEach(categoryProducts => {
            const otherProducts = categoryProducts.filter(p => 
                p.id !== product.id && 
                !relatedProducts.some(rp => rp.id === p.id)
            );
            relatedProducts = relatedProducts.concat(otherProducts);
        });
    }
    
    // Limit to 4 products
    relatedProducts = relatedProducts.slice(0, 4);
    
    // Create related product cards
    relatedGrid.innerHTML = '';
    relatedProducts.forEach(relatedProduct => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer';
        
        card.innerHTML = `
            <div class="product-image">
                ${relatedProduct.badge ? `<div class="product-badge">${relatedProduct.badge}</div>` : ''}
                <img src="${relatedProduct.image}" alt="${relatedProduct.name}">
            </div>
            <div class="product-info">
                <div class="product-category">${relatedProduct.category}</div>
                <h3 class="product-name">${relatedProduct.name}</h3>
                <div class="product-price">
                    <span class="current-price">S/ ${parseFloat(relatedProduct.price || 0).toFixed(2)}</span>
                    ${relatedProduct.originalPrice ? `<span class="original-price">S/ ${parseFloat(relatedProduct.originalPrice).toFixed(2)}</span>` : ''}
                </div>
            </div>
        `;
        
        // Add click handler to open product detail
        card.addEventListener('click', () => {
            openProductDetail(relatedProduct.id, currentFilter);
        });
        
        relatedGrid.appendChild(card);
    });
}

// Close product detail when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const productDetailModal = document.getElementById('product-detail-overlay');
        if (productDetailModal.classList.contains('active')) {
            closeProductDetail();
        }
    }
});

// Contact form functionality
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create WhatsApp message
    const whatsappMessage = `*Nueva consulta desde Lima Rose Florería*%0A%0A` +
        `*Nombre:* ${name}%0A` +
        `*Teléfono:* ${phone}%0A` +
        `*Email:* ${email}%0A` +
        `*Asunto:* ${subject}%0A` +
        `*Mensaje:*%0A${message}`;
    
    // Open WhatsApp
    const whatsappURL = `https://api.whatsapp.com/send/?phone=51977713388&text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');
    
    // Show success message
    const button = this.querySelector('.btn-send-message');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Mensaje Enviado';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        this.reset();
    }, 3000);
});

// Smooth scroll for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip empty anchors or just '#'
        if (!href || href === '#' || href.length <= 1) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Check for product parameter in URL on page load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId) {
        // Wait a bit for products to load, then open the product detail
        setTimeout(() => {
            openProductDetail(parseInt(productId), 'destacados');
        }, 500);
    }
});