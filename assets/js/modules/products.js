// Products Module - Handle product display, filtering, and interactions
import { EventEmitter, Utils, NotificationService } from './services.js';

class ProductsManager extends EventEmitter {
    constructor() {
        super();
        this.products = [];
        this.filteredProducts = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.currentSort = 'default';
        this.priceRange = { min: 0, max: 1000 };
        this.searchQuery = '';
        this.notification = new NotificationService();
    }

    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.renderProducts();
            this.renderCategories();
        } catch (error) {
            console.error('Error initializing products:', error);
            this.notification.error('Error al cargar los productos');
        }
    }

    async loadProducts() {
        try {
            // Try to load from external JSON file first
            const response = await fetch('./data/products.json');
            if (response.ok) {
                const data = await response.json();
                this.products = data.products || data;
            } else {
                // Fallback to default products
                this.products = this.getDefaultProducts();
            }

            this.filteredProducts = [...this.products];
            this.extractCategories();
            this.calculatePriceRange();
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = this.getDefaultProducts();
            this.filteredProducts = [...this.products];
            this.extractCategories();
            this.calculatePriceRange();
        }
    }

    getDefaultProducts() {
        return [
            {
                id: 1,
                name: "Ramo de Rosas Rojas",
                category: "ramos",
                price: 89.90,
                originalPrice: 109.90,
                image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
                description: "Hermoso ramo de 12 rosas rojas frescas, perfecto para expresar amor y pasión.",
                rating: 4.8,
                reviews: 156,
                inStock: true,
                featured: true,
                tags: ["romántico", "aniversario", "san valentín"]
            },
            {
                id: 2,
                name: "Arreglo de Lirios Blancos",
                category: "arreglos",
                price: 75.50,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
                description: "Elegante arreglo floral con lirios blancos y follaje verde en base de cerámica.",
                rating: 4.6,
                reviews: 89,
                inStock: true,
                featured: false,
                tags: ["elegante", "condolencias", "paz"]
            },
            {
                id: 3,
                name: "Bouquet de Tulipanes",
                category: "ramos",
                price: 65.00,
                originalPrice: 80.00,
                image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400",
                description: "Colorido bouquet de tulipanes frescos en tonos primavera, ideal para celebraciones.",
                rating: 4.7,
                reviews: 124,
                inStock: true,
                featured: true,
                tags: ["primavera", "colorido", "celebración"]
            },
            {
                id: 4,
                name: "Corona Fúnebre",
                category: "coronas",
                price: 150.00,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                description: "Corona fúnebre tradicional con flores blancas y follaje verde, elaborada con respeto.",
                rating: 4.9,
                reviews: 67,
                inStock: true,
                featured: false,
                tags: ["condolencias", "respeto", "tradicional"]
            },
            {
                id: 5,
                name: "Cesta de Flores Mixtas",
                category: "cestas",
                price: 95.00,
                originalPrice: 115.00,
                image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400",
                description: "Hermosa cesta con variedad de flores de temporada y colores vibrantes.",
                rating: 4.5,
                reviews: 203,
                inStock: true,
                featured: true,
                tags: ["variado", "temporada", "vibrante"]
            },
            {
                id: 6,
                name: "Orquídea Phalaenopsis",
                category: "plantas",
                price: 45.00,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1516640000687-34c403c2921b?w=400",
                description: "Elegante orquídea blanca en maceta decorativa, perfecta para decoración interior.",
                rating: 4.4,
                reviews: 78,
                inStock: true,
                featured: false,
                tags: ["decoración", "interior", "elegante", "duradero"]
            }
        ];
    }

    extractCategories() {
        const categorySet = new Set(this.products.map(product => product.category));
        this.categories = Array.from(categorySet);
    }

    calculatePriceRange() {
        const prices = this.products.map(product => product.price);
        this.priceRange = {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }

    setupEventListeners() {
        // Category filters
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tab')) {
                e.preventDefault();
                this.setFilter(e.target.dataset.filter);
            }

            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                const productId = parseInt(e.target.dataset.productId);
                this.emit('addToCart', { productId, quantity: 1 });
            }

            if (e.target.closest('.product-name') || e.target.closest('.product-image')) {
                console.log('🔍 Click detectado en producto');
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productId = parseInt(productCard.dataset.productId);
                    console.log('🔍 Emitiendo evento showProductDetail para ID:', productId);
                    this.emit('showProductDetail', productId);
                } else {
                    console.warn('⚠️ No se encontró product-card');
                }
            }
        });

        // Advanced filters
        const filtersToggle = document.querySelector('.filter-toggle');
        const filtersDropdown = document.querySelector('.filters-dropdown');
        
        if (filtersToggle && filtersDropdown) {
            filtersToggle.addEventListener('click', (e) => {
                e.preventDefault();
                filtersDropdown.classList.toggle('active');
                filtersToggle.classList.toggle('active');
            });

            // Apply filters
            const applyBtn = filtersDropdown.querySelector('.btn-apply');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    this.applyAdvancedFilters();
                    filtersDropdown.classList.remove('active');
                    filtersToggle.classList.remove('active');
                });
            }

            // Clear filters
            const clearBtn = filtersDropdown.querySelector('.btn-clear');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.clearFilters();
                });
            }
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            const debouncedSearch = Utils.debounce((query) => {
                this.setSearchQuery(query);
            }, 300);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }

        // Close filters when clicking outside
        document.addEventListener('click', (e) => {
            if (filtersDropdown && !e.target.closest('.advanced-filters')) {
                filtersDropdown.classList.remove('active');
                if (filtersToggle) {
                    filtersToggle.classList.remove('active');
                }
            }
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-filter="${filter}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        this.applyFilters();
    }

    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase();
        this.applyFilters();
    }

    applyAdvancedFilters() {
        const sortSelect = document.querySelector('#sort-by');
        const priceMinInput = document.querySelector('#price-min');
        const priceMaxInput = document.querySelector('#price-max');

        if (sortSelect) {
            this.currentSort = sortSelect.value;
        }

        if (priceMinInput && priceMaxInput) {
            this.priceRange.filterMin = parseFloat(priceMinInput.value) || 0;
            this.priceRange.filterMax = parseFloat(priceMaxInput.value) || this.priceRange.max;
        }

        this.applyFilters();
    }

    clearFilters() {
        this.currentFilter = 'all';
        this.currentSort = 'default';
        this.searchQuery = '';
        this.priceRange.filterMin = undefined;
        this.priceRange.filterMax = undefined;

        // Reset form elements
        const sortSelect = document.querySelector('#sort-by');
        const priceMinInput = document.querySelector('#price-min');
        const priceMaxInput = document.querySelector('#price-max');
        const searchInput = document.querySelector('.search-input');

        if (sortSelect) sortSelect.value = 'default';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (searchInput) searchInput.value = '';

        // Reset filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const allTab = document.querySelector('[data-filter="all"]');
        if (allTab) {
            allTab.classList.add('active');
        }

        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.products];

        // Category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentFilter);
        }

        // Search filter
        if (this.searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery) ||
                product.description.toLowerCase().includes(this.searchQuery) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(this.searchQuery)))
            );
        }

        // Price filter
        if (this.priceRange.filterMin !== undefined || this.priceRange.filterMax !== undefined) {
            const min = this.priceRange.filterMin || 0;
            const max = this.priceRange.filterMax || this.priceRange.max;
            filtered = filtered.filter(product => product.price >= min && product.price <= max);
        }

        // Sort
        filtered = this.sortProducts(filtered, this.currentSort);

        this.filteredProducts = filtered;
        this.renderProducts();
        this.emit('productsFiltered', { count: filtered.length, total: this.products.length });
    }

    sortProducts(products, sortBy) {
        switch (sortBy) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'name':
                return [...products].sort((a, b) => a.name.localeCompare(b.name));
            case 'rating':
                return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'newest':
                return [...products].sort((a, b) => (b.id || 0) - (a.id || 0));
            default:
                return products;
        }
    }

    renderProducts() {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        if (this.filteredProducts.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        container.innerHTML = this.filteredProducts.map(product => this.getProductHTML(product)).join('');
        
        // Add loading animation
        container.classList.add('fade-in');
    }

    renderCategories() {
        const container = document.querySelector('.filter-tabs');
        if (!container) return;

        const allTab = `<button class="filter-tab active" data-filter="all">Todos</button>`;
        const categoryTabs = this.categories.map(category => 
            `<button class="filter-tab" data-filter="${category}">
                ${this.formatCategoryName(category)}
            </button>`
        ).join('');

        container.innerHTML = allTab + categoryTabs;
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

    getProductHTML(product) {
        const discountPercentage = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${Utils.sanitizeHtml(product.name)}" loading="lazy">
                    ${product.originalPrice ? `<div class="product-badge">-${discountPercentage}%</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${this.formatCategoryName(product.category)}</div>
                    <h3 class="product-name">${Utils.sanitizeHtml(product.name)}</h3>
                    ${this.getProductRatingHTML(product)}
                    <div class="product-price">
                        <span class="current-price">${Utils.formatCurrency(product.price)}</span>
                        ${product.originalPrice ? `<span class="original-price">${Utils.formatCurrency(product.originalPrice)}</span>` : ''}
                        ${discountPercentage > 0 ? `<span class="discount">-${discountPercentage}%</span>` : ''}
                    </div>
                    <button class="add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? '<i class="fas fa-shopping-cart"></i> Agregar al Carrito' : 'Agotado'}
                    </button>
                </div>
            </div>
        `;
    }

    getProductRatingHTML(product) {
        if (!product.rating) return '';

        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return `
            <div class="product-rating">
                <div class="stars">${starsHTML}</div>
                <span class="rating-text">(${product.reviews || 0})</span>
            </div>
        `;
    }

    getEmptyStateHTML() {
        return `
            <div class="products-empty">
                <i class="fas fa-search"></i>
                <p>No se encontraron productos con los filtros aplicados.</p>
                <button class="btn-primary" onclick="window.productsManager.clearFilters()">
                    Limpiar Filtros
                </button>
            </div>
        `;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    searchProducts(query) {
        this.setSearchQuery(query);
        return this.filteredProducts;
    }
}

export default ProductsManager;