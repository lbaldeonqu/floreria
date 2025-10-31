// Main Application Entry Point
import { ApiService, StorageService, NotificationService, EventEmitter, Utils } from './modules/services.js';
import ProductsManager from './modules/products.js';
import CartManager from './modules/cart.js';
import ModalManager from './modules/modals.js';

class FloreriaApp extends EventEmitter {
    constructor() {
        super();
        this.config = window.AppConfig || {};
        this.services = {};
        this.managers = {};
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('🌸 Inicializando Lima Rose Florería...');
            
            // Initialize services
            this.initializeServices();
            
            // Initialize managers
            await this.initializeManagers();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Setup scroll effects
            this.setupScrollEffects();
            
            // Setup navigation
            this.setupNavigation();
            
            // Setup search
            this.setupSearch();
            
            // Initialize components
            this.initializeComponents();
            
            this.isInitialized = true;
            console.log('✅ Aplicación inicializada correctamente');
            
            this.emit('appInitialized');
            
        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
            this.services.notification?.error('Error al inicializar la aplicación');
        }
    }

    initializeServices() {
        this.services = {
            api: new ApiService(),
            storage: new StorageService(),
            notification: new NotificationService()
        };

        // Make services globally available
        window.AppServices = this.services;
    }

    async initializeManagers() {
        // Initialize products manager
        this.managers.products = new ProductsManager();
        await this.managers.products.init();

        // Initialize cart manager
        this.managers.cart = new CartManager();

        // Initialize modal manager
        this.managers.modals = new ModalManager();

        // Make managers globally available
        window.productsManager = this.managers.products;
        window.cartManager = this.managers.cart;
        window.modalManager = this.managers.modals;
        
        // Debug functions
        window.testModal = (productId = 1) => {
            console.log('🧪 Probando modal con producto ID:', productId);
            this.managers.modals.showProductDetailModal(productId);
        };
        
        window.debugProducts = () => {
            console.log('🧪 Productos disponibles:', this.managers.products.products);
        };

        // Setup inter-manager communication
        this.setupManagerEvents();
        
        // Debug mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.enableDebugMode();
        }
    }

    setupManagerEvents() {
        // Products to Cart communication
        this.managers.products.on('addToCart', (data) => {
            const product = this.managers.products.getProductById(data.productId);
            if (product) {
                this.managers.cart.addItem(product, data.quantity);
            }
        });

        // Products to Modal communication
        this.managers.products.on('showProductDetail', (productId) => {
            console.log('🔍 Evento showProductDetail recibido en app.js:', productId);
            this.managers.modals.showProductDetailModal(productId);
        });

        // Cart to Modal communication
        this.managers.cart.on('checkoutRequested', (cartData) => {
            this.managers.modals.showCheckoutModal(cartData);
        });

        // Cart events for UI updates
        this.managers.cart.on('itemAdded', () => {
            this.updateCartIndicators();
        });

        this.managers.cart.on('itemRemoved', () => {
            this.updateCartIndicators();
        });

        this.managers.cart.on('cartCleared', () => {
            this.updateCartIndicators();
        });
    }

    setupGlobalEventListeners() {
        // Handle page load
        window.addEventListener('load', () => {
            this.hideLoader();
        });

        // Handle resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 16));

        // Handle online/offline
        window.addEventListener('online', () => {
            this.services.notification.success('Conexión restaurada');
        });

        window.addEventListener('offline', () => {
            this.services.notification.warning('Sin conexión a internet');
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.emit('appHidden');
            } else {
                this.emit('appVisible');
            }
        });
    }

    setupScrollEffects() {
        // Scroll to top button
        const scrollTopBtn = document.querySelector('.scroll-top');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Hide/show navbar on scroll
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    navbar.classList.add('hidden');
                } else {
                    navbar.classList.remove('hidden');
                }
                
                lastScrollTop = scrollTop;
            });
        }

        // Parallax effects
        this.setupParallax();

        // Intersection Observer for animations
        this.setupScrollAnimations();
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = parseFloat(element.dataset.parallax) || 0.5;
                    const yPos = -(scrollTop * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
            });
        }
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if (animatedElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animation = entry.target.dataset.animate;
                        entry.target.classList.add('animated', animation);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(element => {
                observer.observe(element);
            });
        }
    }

    setupNavigation() {
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        }

        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    Utils.scrollTo(targetElement, 80);
                }
            }
        });
    }

    setupSearch() {
        const searchToggle = document.querySelector('.search-toggle');
        const searchBar = document.querySelector('.search-bar');
        const searchInput = document.querySelector('.search-input');
        const searchClose = document.querySelector('.search-close');

        if (searchToggle && searchBar) {
            searchToggle.addEventListener('click', (e) => {
                e.preventDefault();
                searchBar.classList.add('active');
                if (searchInput) {
                    searchInput.focus();
                }
            });
        }

        if (searchClose && searchBar) {
            searchClose.addEventListener('click', (e) => {
                e.preventDefault();
                searchBar.classList.remove('active');
                if (searchInput) {
                    searchInput.value = '';
                }
            });
        }

        // Close search on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchBar?.classList.contains('active')) {
                searchBar.classList.remove('active');
                if (searchInput) {
                    searchInput.value = '';
                }
            }
        });
    }

    initializeComponents() {
        // Initialize hero slider
        this.initializeHeroSlider();
        
        // Initialize testimonials slider
        this.initializeTestimonialsSlider();
        
        // Initialize Instagram gallery
        this.initializeInstagramGallery();
        
        // Initialize newsletter
        this.initializeNewsletter();
        
        // Initialize lazy loading
        this.initializeLazyLoading();
    }

    initializeHeroSlider() {
        const heroSlider = document.querySelector('.hero-slider');
        if (!heroSlider) return;

        const slides = heroSlider.querySelectorAll('.hero-slide');
        const indicators = heroSlider.querySelectorAll('.hero-indicator');
        let currentSlide = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        // Auto-advance slides
        setInterval(nextSlide, 5000);

        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
    }

    initializeTestimonialsSlider() {
        // Implementation would depend on specific slider library or custom implementation
        console.log('Testimonials slider initialized');
    }

    initializeInstagramGallery() {
        const instagramPosts = document.querySelectorAll('.instagram-post');
        
        instagramPosts.forEach(post => {
            post.addEventListener('click', () => {
                // Simulate opening Instagram post
                const postId = post.dataset.postId;
                if (postId) {
                    this.services.notification.info('Abriendo publicación de Instagram...');
                }
            });
        });
    }

    initializeNewsletter() {
        const newsletterForms = document.querySelectorAll('.newsletter-form, .footer-newsletter-form');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const emailInput = form.querySelector('input[type="email"]');
                const email = emailInput?.value;
                
                if (email && Utils.validateEmail(email)) {
                    this.subscribeToNewsletter(email);
                    emailInput.value = '';
                } else {
                    this.services.notification.error('Por favor ingrese un email válido');
                }
            });
        });
    }

    initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Utility methods
    hideLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }

    handleResize() {
        // Handle responsive changes
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', isMobile);
        
        this.emit('resize', { width: window.innerWidth, height: window.innerHeight, isMobile });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollTop / scrollHeight;

        // Update scroll-dependent elements
        const scrollTopBtn = document.querySelector('.scroll-top');
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', scrollTop > 500);
        }

        this.emit('scroll', { scrollTop, scrollProgress });
    }

    updateCartIndicators() {
        // This will be handled by the cart manager
        // but can be used for additional UI updates
        const cartData = this.managers.cart?.getCartData();
        this.emit('cartUpdated', cartData);
    }

    subscribeToNewsletter(email) {
        // Simulate newsletter subscription
        setTimeout(() => {
            this.services.notification.success('¡Suscripción exitosa! Gracias por unirte a nuestra lista.');
        }, 1000);
        
        // Here you would make an API call to subscribe the user
        this.emit('newsletterSubscription', { email });
    }

    // Public API methods
    getProducts() {
        return this.managers.products?.products || [];
    }

    getCart() {
        return this.managers.cart?.getCartData() || null;
    }

    showNotification(message, type = 'info', duration) {
        return this.services.notification?.show(message, type, duration);
    }

    navigateTo(section) {
        const element = document.getElementById(section) || document.querySelector(`[data-section="${section}"]`);
        if (element) {
            Utils.scrollTo(element, 80);
        }
    }

    enableDebugMode() {
        console.log('🔍 Modo debug activado');
        
        // Log clicks on products for debugging
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-card')) {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.productId;
                console.log('🔍 Click en producto:', {
                    productId,
                    element: productCard,
                    target: e.target
                });
            }
            
            if (e.target.closest('.product-name') || e.target.closest('.product-image')) {
                console.log('🔍 Click en nombre/imagen de producto');
            }
        });
        
        // Log manager availability
        setInterval(() => {
            const status = {
                products: !!window.productsManager,
                cart: !!window.cartManager,
                modals: !!window.modalManager,
                productsCount: window.productsManager?.products?.length || 0
            };
            console.log('🔍 Estado de managers:', status);
        }, 5000);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.floreriaApp = new FloreriaApp();
    });
} else {
    window.floreriaApp = new FloreriaApp();
}

// Export for module usage
export default FloreriaApp;