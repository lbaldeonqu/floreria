// Cart Module - Handle shopping cart functionality
import { EventEmitter, StorageService, Utils, NotificationService } from './services.js';

class CartManager extends EventEmitter {
    constructor() {
        super();
        this.items = [];
        this.isOpen = false;
        this.storage = new StorageService();
        this.notification = new NotificationService();
        
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartUI();
        this.updateCartBadge();
    }

    setupEventListeners() {
        // Cart toggle
        const cartTriggers = document.querySelectorAll('.cart-trigger, .floating-cart');
        cartTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart();
            });
        });

        // Cart close
        const cartClose = document.querySelector('.cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Cart overlay
        const cartOverlay = document.querySelector('.cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Cart actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-quantity-btn')) {
                e.preventDefault();
                const action = e.target.dataset.action;
                const itemId = parseInt(e.target.closest('.cart-item').dataset.itemId);
                
                if (action === 'increase') {
                    this.increaseQuantity(itemId);
                } else if (action === 'decrease') {
                    this.decreaseQuantity(itemId);
                }
            }

            if (e.target.classList.contains('cart-item-remove')) {
                e.preventDefault();
                const itemId = parseInt(e.target.closest('.cart-item').dataset.itemId);
                this.removeItem(itemId);
            }

            if (e.target.classList.contains('btn-clear-cart')) {
                e.preventDefault();
                this.clearCart();
            }

            if (e.target.classList.contains('btn-checkout')) {
                e.preventDefault();
                this.checkout();
            }

            if (e.target.classList.contains('btn-continue-shopping')) {
                e.preventDefault();
                this.closeCart();
            }
        });

        // Quantity input changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('cart-quantity')) {
                const itemId = parseInt(e.target.closest('.cart-item').dataset.itemId);
                const newQuantity = parseInt(e.target.value) || 1;
                this.updateQuantity(itemId, newQuantity);
            }
        });

        // Prevent cart close when clicking inside cart
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar) {
            cartSidebar.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });
    }

    addItem(product, quantity = 1) {
        if (!product || quantity <= 0) {
            this.notification.error('Error al agregar producto al carrito');
            return;
        }

        const existingItemIndex = this.items.findIndex(item => item.id === product.id);

        if (existingItemIndex !== -1) {
            // Update quantity of existing item
            this.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.updateCartBadge();
        this.showFloatingCart();
        
        this.notification.success(`${product.name} agregado al carrito`);
        this.emit('itemAdded', { product, quantity, total: this.getTotalItems() });
    }

    removeItem(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            
            this.saveCart();
            this.updateCartUI();
            this.updateCartBadge();
            
            this.notification.info(`${removedItem.name} eliminado del carrito`);
            this.emit('itemRemoved', { item: removedItem, total: this.getTotalItems() });
        }
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            const oldQuantity = item.quantity;
            item.quantity = newQuantity;
            
            this.saveCart();
            this.updateCartUI();
            this.updateCartBadge();
            
            this.emit('quantityUpdated', { 
                productId, 
                oldQuantity, 
                newQuantity, 
                total: this.getTotalItems() 
            });
        }
    }

    increaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }

    decreaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            this.updateQuantity(productId, item.quantity - 1);
        } else if (item) {
            this.removeItem(productId);
        }
    }

    clearCart() {
        if (this.items.length === 0) {
            this.notification.info('El carrito ya está vacío');
            return;
        }

        // Show confirmation
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            this.items = [];
            this.saveCart();
            this.updateCartUI();
            this.updateCartBadge();
            this.hideFloatingCart();
            
            this.notification.info('Carrito vaciado');
            this.emit('cartCleared');
        }
    }

    toggleCart() {
        if (this.isOpen) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    openCart() {
        this.isOpen = true;
        
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        if (cartSidebar) {
            cartSidebar.classList.add('active');
        }
        
        if (cartOverlay) {
            cartOverlay.classList.add('active');
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        this.emit('cartOpened');
    }

    closeCart() {
        this.isOpen = false;
        
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
        }
        
        if (cartOverlay) {
            cartOverlay.classList.remove('active');
        }

        // Restore body scroll
        document.body.style.overflow = '';
        
        this.emit('cartClosed');
    }

    checkout() {
        if (this.items.length === 0) {
            this.notification.warning('No hay productos en el carrito');
            return;
        }

        this.closeCart();
        this.emit('checkoutRequested', {
            items: [...this.items],
            total: this.getTotal(),
            subtotal: this.getSubtotal(),
            tax: this.getTax(),
            shipping: this.getShipping()
        });
    }

    updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartEmpty = document.querySelector('.cart-empty');
        const cartSummary = document.querySelector('.cart-summary');

        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            // Show empty cart
            if (cartItemsContainer) cartItemsContainer.style.display = 'none';
            if (cartEmpty) cartEmpty.style.display = 'flex';
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            // Show cart items
            if (cartItemsContainer) cartItemsContainer.style.display = 'block';
            if (cartEmpty) cartEmpty.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'block';

            // Render cart items
            cartItemsContainer.innerHTML = this.items.map(item => this.getCartItemHTML(item)).join('');

            // Update totals
            this.updateCartSummary();
        }
    }

    updateCartSummary() {
        const subtotalElement = document.querySelector('.cart-subtotal .price');
        const totalElement = document.querySelector('.cart-total .price');

        if (subtotalElement) {
            subtotalElement.textContent = Utils.formatCurrency(this.getSubtotal());
        }

        if (totalElement) {
            totalElement.textContent = Utils.formatCurrency(this.getTotal());
        }
    }

    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const totalItems = this.getTotalItems();

        badges.forEach(badge => {
            if (totalItems > 0) {
                badge.textContent = totalItems > 99 ? '99+' : totalItems;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    showFloatingCart() {
        const floatingCart = document.querySelector('.floating-cart');
        if (floatingCart && this.items.length > 0) {
            floatingCart.classList.add('visible');
        }
    }

    hideFloatingCart() {
        const floatingCart = document.querySelector('.floating-cart');
        if (floatingCart) {
            floatingCart.classList.remove('visible');
        }
    }

    getCartItemHTML(item) {
        return `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${Utils.sanitizeHtml(item.name)}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${Utils.sanitizeHtml(item.name)}</h4>
                    <div class="cart-item-price">${Utils.formatCurrency(item.price)}</div>
                    <div class="cart-item-controls">
                        <div class="cart-quantity-controls">
                            <button class="cart-quantity-btn" data-action="decrease">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="cart-quantity" value="${item.quantity}" min="1" max="99">
                            <button class="cart-quantity-btn" data-action="increase">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="cart-item-remove" title="Eliminar producto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTax() {
        const config = window.AppConfig || {};
        const taxRate = config.tax?.rate || 0.18; // 18% IGV in Peru
        return this.getSubtotal() * taxRate;
    }

    getShipping() {
        const config = window.AppConfig || {};
        const subtotal = this.getSubtotal();
        
        if (subtotal >= (config.shipping?.freeThreshold || 100)) {
            return 0; // Free shipping
        }
        
        return config.shipping?.cost || 15;
    }

    getTotal() {
        return this.getSubtotal() + this.getTax() + this.getShipping();
    }

    getCartData() {
        return {
            items: [...this.items],
            totals: {
                subtotal: this.getSubtotal(),
                tax: this.getTax(),
                shipping: this.getShipping(),
                total: this.getTotal()
            },
            itemCount: this.getTotalItems()
        };
    }

    loadCart() {
        const savedCart = this.storage.get('cart');
        if (savedCart && Array.isArray(savedCart)) {
            this.items = savedCart;
        }
    }

    saveCart() {
        this.storage.set('cart', this.items);
    }

    // Public API methods
    isEmpty() {
        return this.items.length === 0;
    }

    hasItem(productId) {
        return this.items.some(item => item.id === productId);
    }

    getItem(productId) {
        return this.items.find(item => item.id === productId);
    }

    getItemCount(productId) {
        const item = this.getItem(productId);
        return item ? item.quantity : 0;
    }
}

export default CartManager;