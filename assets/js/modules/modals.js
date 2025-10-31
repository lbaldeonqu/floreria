// Modals Module - Handle modal functionality
import { EventEmitter, Utils, NotificationService } from './services.js';

class ModalManager extends EventEmitter {
    constructor() {
        super();
        this.activeModal = null;
        this.notification = new NotificationService();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createModalOverlay();
    }

    setupEventListeners() {
        // Modal triggers
        document.addEventListener('click', (e) => {
            // Login modal
            if (e.target.classList.contains('login-trigger')) {
                e.preventDefault();
                this.showLoginModal();
            }

            // Product detail modal
            if (e.target.closest('.product-name') || e.target.closest('.product-image')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productId = parseInt(productCard.dataset.productId);
                    this.showProductDetailModal(productId);
                }
            }

            // Modal close buttons
            if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-overlay')) {
                e.preventDefault();
                this.closeActiveModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeActiveModal();
            }
        });

        // Prevent modal content clicks from closing modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-content')) {
                e.stopPropagation();
            }
        });
    }

    createModalOverlay() {
        if (document.querySelector('.modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 9998;
        `;
        
        document.body.appendChild(overlay);
    }

    showModal(modalElement) {
        if (!modalElement) return;

        // Close any active modal first
        this.closeActiveModal();

        this.activeModal = modalElement;
        const overlay = document.querySelector('.modal-overlay');

        // Show overlay
        if (overlay) {
            overlay.style.display = 'block';
        }

        // Show modal
        modalElement.classList.add('active');
        modalElement.style.display = 'flex';

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus management
        const firstFocusable = modalElement.querySelector('input, button, textarea, select');
        if (firstFocusable) {
            firstFocusable.focus();
        }

        this.emit('modalOpened', modalElement);
    }

    closeActiveModal() {
        if (!this.activeModal) return;

        const modal = this.activeModal;
        const overlay = document.querySelector('.modal-overlay');

        // Hide modal
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);

        // Hide overlay
        if (overlay) {
            overlay.style.display = 'none';
        }

        // Restore body scroll
        document.body.style.overflow = '';

        this.emit('modalClosed', modal);
        this.activeModal = null;
    }

    showLoginModal() {
        let modal = document.getElementById('login-modal');
        
        if (!modal) {
            modal = this.createLoginModal();
        }

        this.showModal(modal);
    }

    showProductDetailModal(productId) {
        console.log('🔍 showProductDetailModal llamado con ID:', productId);
        
        const product = window.productsManager?.getProductById(productId);
        
        if (!product) {
            console.error('❌ Producto no encontrado:', productId);
            this.notification.error('Producto no encontrado');
            return;
        }

        console.log('✅ Producto encontrado:', product);

        let modal = document.getElementById('product-detail-modal');
        
        if (!modal) {
            console.log('📦 Creando modal de detalle');
            modal = this.createProductDetailModal();
        }

        this.populateProductDetailModal(modal, product);
        this.showModal(modal);
        console.log('✅ Modal mostrado');
    }

    showCheckoutModal(cartData) {
        let modal = document.getElementById('checkout-modal');
        
        if (!modal) {
            modal = this.createCheckoutModal();
        }

        this.populateCheckoutModal(modal, cartData);
        this.showModal(modal);
    }

    createLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'login-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Iniciar Sesión</h2>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">Correo Electrónico</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Contraseña</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="remember-me"> Recordarme
                            </label>
                        </div>
                        <button type="submit" class="btn-primary">Iniciar Sesión</button>
                        <div class="text-center mt-3">
                            <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
                        </div>
                        <div class="text-center mt-3">
                            <span>¿No tienes cuenta? </span>
                            <a href="#" class="register-link">Regístrate aquí</a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup form handler
        const form = modal.querySelector('#login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(form);
        });

        return modal;
    }

    createProductDetailModal() {
        const modal = document.createElement('div');
        modal.id = 'product-detail-modal';
        modal.className = 'modal product-detail-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Detalle del Producto</h2>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="product-detail-content">
                        <div class="product-detail-image">
                            <img id="detail-image" src="" alt="">
                        </div>
                        <div class="product-detail-info">
                            <div class="product-detail-category" id="detail-category"></div>
                            <h2 id="detail-name"></h2>
                            <div class="product-detail-rating" id="detail-rating"></div>
                            <div class="product-detail-price" id="detail-price"></div>
                            <div class="product-detail-description" id="detail-description"></div>
                            
                            <div class="quantity-selector">
                                <label for="detail-quantity">Cantidad:</label>
                                <div class="quantity-controls">
                                    <button type="button" class="quantity-btn" data-action="decrease">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="number" id="detail-quantity" class="quantity-input" value="1" min="1" max="99">
                                    <button type="button" class="quantity-btn" data-action="increase">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="product-actions">
                                <button class="btn-add-cart" id="detail-add-cart">
                                    <i class="fas fa-shopping-cart"></i>
                                    Agregar al Carrito
                                </button>
                                <button class="btn-favorite" id="detail-favorite">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupProductDetailModalEvents(modal);
        return modal;
    }

    createCheckoutModal() {
        const modal = document.createElement('div');
        modal.id = 'checkout-modal';
        modal.className = 'modal checkout-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Finalizar Compra</h2>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="checkout-steps">
                        <div class="checkout-step">
                            <div class="step-number active" data-step="1">1</div>
                            <div class="step-title active">Información</div>
                        </div>
                        <div class="checkout-step">
                            <div class="step-number" data-step="2">2</div>
                            <div class="step-title">Pago</div>
                        </div>
                        <div class="checkout-step">
                            <div class="step-number" data-step="3">3</div>
                            <div class="step-title">Confirmación</div>
                        </div>
                    </div>

                    <div id="checkout-content">
                        <!-- Dynamic content will be loaded here -->
                    </div>
                </div>
                <div class="modal-nav">
                    <button class="btn-prev" id="checkout-prev" style="display: none;">Anterior</button>
                    <button class="btn-next" id="checkout-next">Continuar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupCheckoutModalEvents(modal);
        return modal;
    }

    setupProductDetailModalEvents(modal) {
        // Quantity controls
        const quantityInput = modal.querySelector('#detail-quantity');
        const quantityBtns = modal.querySelectorAll('.quantity-btn');

        quantityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const currentValue = parseInt(quantityInput.value) || 1;
                
                if (action === 'increase' && currentValue < 99) {
                    quantityInput.value = currentValue + 1;
                } else if (action === 'decrease' && currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
        });

        // Add to cart
        const addCartBtn = modal.querySelector('#detail-add-cart');
        addCartBtn.addEventListener('click', () => {
            const productId = parseInt(modal.dataset.productId);
            const quantity = parseInt(quantityInput.value) || 1;
            const product = window.productsManager?.getProductById(productId);

            if (product) {
                window.cartManager?.addItem(product, quantity);
                this.closeActiveModal();
            }
        });

        // Favorite button
        const favoriteBtn = modal.querySelector('#detail-favorite');
        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('active');
            const isActive = favoriteBtn.classList.contains('active');
            
            const icon = favoriteBtn.querySelector('i');
            icon.className = isActive ? 'fas fa-heart' : 'far fa-heart';
            
            this.notification.info(isActive ? 'Agregado a favoritos' : 'Eliminado de favoritos');
        });
    }

    setupCheckoutModalEvents(modal) {
        const nextBtn = modal.querySelector('#checkout-next');
        const prevBtn = modal.querySelector('#checkout-prev');
        let currentStep = 1;

        nextBtn.addEventListener('click', () => {
            if (currentStep < 3) {
                currentStep++;
                this.updateCheckoutStep(modal, currentStep);
            } else {
                this.processOrder(modal);
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                this.updateCheckoutStep(modal, currentStep);
            }
        });
    }

    populateProductDetailModal(modal, product) {
        modal.dataset.productId = product.id;
        
        modal.querySelector('#detail-image').src = product.image;
        modal.querySelector('#detail-image').alt = product.name;
        modal.querySelector('#detail-category').textContent = this.formatCategoryName(product.category);
        modal.querySelector('#detail-name').textContent = product.name;
        modal.querySelector('#detail-description').textContent = product.description;
        
        // Price
        const priceContainer = modal.querySelector('#detail-price');
        const discountPercentage = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

        priceContainer.innerHTML = `
            <span class="current-price">${Utils.formatCurrency(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">${Utils.formatCurrency(product.originalPrice)}</span>` : ''}
            ${discountPercentage > 0 ? `<span class="discount">-${discountPercentage}%</span>` : ''}
        `;

        // Rating
        if (product.rating) {
            const ratingContainer = modal.querySelector('#detail-rating');
            ratingContainer.innerHTML = this.getProductRatingHTML(product);
            ratingContainer.style.display = 'flex';
        } else {
            modal.querySelector('#detail-rating').style.display = 'none';
        }

        // Reset quantity
        modal.querySelector('#detail-quantity').value = 1;
    }

    populateCheckoutModal(modal, cartData) {
        modal.dataset.cartData = JSON.stringify(cartData);
        this.updateCheckoutStep(modal, 1);
    }

    updateCheckoutStep(modal, step) {
        const steps = modal.querySelectorAll('.step-number');
        const stepTitles = modal.querySelectorAll('.step-title');
        const content = modal.querySelector('#checkout-content');
        const nextBtn = modal.querySelector('#checkout-next');
        const prevBtn = modal.querySelector('#checkout-prev');

        // Update step indicators
        steps.forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            stepTitles[index].classList.remove('active');
            
            if (index + 1 < step) {
                stepEl.classList.add('completed');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
                stepTitles[index].classList.add('active');
            }
        });

        // Update content
        const cartData = JSON.parse(modal.dataset.cartData || '{}');
        
        switch (step) {
            case 1:
                content.innerHTML = this.getCheckoutStep1HTML(cartData);
                nextBtn.textContent = 'Continuar';
                prevBtn.style.display = 'none';
                break;
            case 2:
                content.innerHTML = this.getCheckoutStep2HTML(cartData);
                nextBtn.textContent = 'Finalizar Compra';
                prevBtn.style.display = 'block';
                break;
            case 3:
                content.innerHTML = this.getCheckoutStep3HTML(cartData);
                nextBtn.textContent = 'Confirmar Pedido';
                prevBtn.style.display = 'block';
                break;
        }
    }

    getCheckoutStep1HTML(cartData) {
        return `
            <div class="checkout-section active">
                <h3>Información de Contacto</h3>
                <form id="contact-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="checkout-name">Nombre completo *</label>
                            <input type="text" id="checkout-name" required>
                        </div>
                        <div class="form-group">
                            <label for="checkout-phone">Teléfono *</label>
                            <input type="tel" id="checkout-phone" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="checkout-email">Correo electrónico *</label>
                        <input type="email" id="checkout-email" required>
                    </div>
                    <div class="form-group">
                        <label for="checkout-address">Dirección de entrega *</label>
                        <textarea id="checkout-address" required placeholder="Ingrese la dirección completa"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="checkout-notes">Notas especiales</label>
                        <textarea id="checkout-notes" placeholder="Instrucciones adicionales para la entrega"></textarea>
                    </div>
                </form>

                <div class="order-summary">
                    <h4>Resumen del Pedido</h4>
                    <div class="summary-item">
                        <span>Subtotal:</span>
                        <span>${Utils.formatCurrency(cartData.totals?.subtotal || 0)}</span>
                    </div>
                    <div class="summary-item">
                        <span>Envío:</span>
                        <span>${Utils.formatCurrency(cartData.totals?.shipping || 0)}</span>
                    </div>
                    <div class="summary-total">
                        <span>Total:</span>
                        <span>${Utils.formatCurrency(cartData.totals?.total || 0)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutStep2HTML(cartData) {
        return `
            <div class="checkout-section active">
                <h3>Método de Pago</h3>
                <div class="payment-methods">
                    <div class="payment-method" data-method="card">
                        <i class="fas fa-credit-card"></i>
                        <span>Tarjeta</span>
                    </div>
                    <div class="payment-method" data-method="transfer">
                        <i class="fas fa-university"></i>
                        <span>Transferencia</span>
                    </div>
                    <div class="payment-method" data-method="cash">
                        <i class="fas fa-money-bill"></i>
                        <span>Efectivo</span>
                    </div>
                </div>
                
                <div id="payment-details" style="display: none;">
                    <div class="form-group">
                        <label for="card-number">Número de Tarjeta</label>
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="card-expiry">Vencimiento</label>
                            <input type="text" id="card-expiry" placeholder="MM/YY">
                        </div>
                        <div class="form-group">
                            <label for="card-cvv">CVV</label>
                            <input type="text" id="card-cvv" placeholder="123">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutStep3HTML(cartData) {
        return `
            <div class="checkout-section active">
                <div class="text-center">
                    <i class="fas fa-check-circle text-success" style="font-size: 4rem; margin-bottom: 20px;"></i>
                    <h3>¡Pedido Confirmado!</h3>
                    <p>Gracias por tu compra. Hemos recibido tu pedido y te contactaremos pronto para coordinar la entrega.</p>
                    
                    <div class="order-summary">
                        <h4>Detalles del Pedido</h4>
                        <div class="summary-item">
                            <span>Número de pedido:</span>
                            <span>#${Utils.generateId().toUpperCase()}</span>
                        </div>
                        <div class="summary-item">
                            <span>Total:</span>
                            <span>${Utils.formatCurrency(cartData.totals?.total || 0)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Fecha estimada de entrega:</span>
                            <span>${Utils.formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000))}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    formatCategoryName(category) {
        const names = {
            'ramos': 'Ramos',
            'arreglos': 'Arreglos',
            'coronas': 'Coronas',
            'cestas': 'Cestas',
            'plantas': 'Plantas'
        };
        return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    getProductRatingHTML(product) {
        if (!product.rating) return '';

        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return `
            <div class="product-rating">
                <div class="stars">${starsHTML}</div>
                <span class="rating-text">(${product.reviews || 0} reseñas)</span>
            </div>
        `;
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        // Basic validation
        if (!email || !password) {
            this.notification.error('Por favor complete todos los campos');
            return;
        }

        // Simulate login
        this.notification.success('Inicio de sesión exitoso');
        this.closeActiveModal();
        
        this.emit('loginSuccess', { email });
    }

    processOrder(modal) {
        // Clear cart and close modal
        window.cartManager?.clearCart();
        this.notification.success('¡Pedido realizado con éxito! Te contactaremos pronto.');
        
        setTimeout(() => {
            this.closeActiveModal();
        }, 2000);
    }
}

export default ModalManager;