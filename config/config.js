// Lima Rose Florería - Configuration
export const CONFIG = {
    // Site Information
    SITE: {
        name: 'Lima Rose Florería',
        description: 'Flores frescas para toda ocasión',
        phone: '+51977713388',
        email: 'info@limaroseflores.pe',
        address: 'Lima, Perú'
    },

    // API Configuration (for future backend integration)
    API: {
        baseUrl: 'https://api.limaroseflores.pe',
        endpoints: {
            products: '/products',
            orders: '/orders',
            auth: '/auth',
            users: '/users'
        }
    },

    // Payment Configuration
    PAYMENT: {
        currency: 'PEN',
        symbol: 'S/',
        methods: ['card', 'yape', 'transfer']
    },

    // Delivery Configuration
    DELIVERY: {
        cutoffTime: '15:00', // 3:00 PM
        sameDayAvailable: true,
        freeDeliveryMinimum: 200, // Free delivery over S/ 200
        defaultDistricts: {
            'miraflores': 15.00,
            'san-isidro': 15.00,
            'surco': 20.00,
            'la-molina': 20.00,
            'san-borja': 18.00,
            'barranco': 15.00,
            'chorrillos': 25.00,
            'san-miguel': 20.00,
            'pueblo-libre': 22.00,
            'magdalena': 20.00
        }
    },

    // UI Configuration
    UI: {
        productsPerPage: 12,
        maxCartItems: 50,
        maxWishlistItems: 100,
        animationDuration: 300,
        notificationTimeout: 4000
    },

    // Feature Flags
    FEATURES: {
        wishlist: true,
        reviews: true,
        socialShare: true,
        newsletter: true,
        blog: true,
        liveChat: true,
        productRecommendations: true
    },

    // Social Media
    SOCIAL: {
        facebook: 'https://www.facebook.com/limaroseflores',
        instagram: 'https://www.instagram.com/limaroseflores',
        tiktok: 'https://www.tiktok.com/@limaroseflores',
        whatsapp: 'https://api.whatsapp.com/send/?phone=51977713388'
    },

    // SEO Configuration
    SEO: {
        keywords: 'flores, florería, ramos, lima, delivery, arreglos florales',
        ogImage: '/assets/images/og-image.jpg',
        twitterCard: 'summary_large_image'
    }
};

// Export individual configurations for easier imports
export const SITE_CONFIG = CONFIG.SITE;
export const API_CONFIG = CONFIG.API;
export const PAYMENT_CONFIG = CONFIG.PAYMENT;
export const DELIVERY_CONFIG = CONFIG.DELIVERY;
export const UI_CONFIG = CONFIG.UI;
export const FEATURES_CONFIG = CONFIG.FEATURES;
export const SOCIAL_CONFIG = CONFIG.SOCIAL;
export const SEO_CONFIG = CONFIG.SEO;