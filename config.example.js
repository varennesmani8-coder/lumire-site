/* ===== CONFIGURATION FILE ===== */
/*
 * IMPORTANT: Duplicate this file to config.js and fill in your Shopify credentials
 * DO NOT commit this file to version control if it contains real tokens
 */

const SHOPIFY_CONFIG = {
    // Shopify Store Info
    store: {
        name: 'bys-store-2893582-948316',
        domain: 'beautylumire.com',
        currency: 'CHF',
    },

    // Storefront API
    api: {
        token: 'YOUR_STOREFRONT_API_TOKEN_HERE',
        version: '2024-01',
    },

    // Cart Settings
    cart: {
        expiresIn: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        storageKey: 'lumire_cart_id',
    },

    // Product Display
    products: {
        itemsPerPage: 12,
        sortBy: 'RELEVANCE',
    },

    // Branding
    brand: {
        name: 'LUMIRÉ',
        tagline: 'Ton éclat, chaque matin',
        colors: {
            primary: '#C9A96E',      // Or doux
            secondary: '#E8C4B8',    // Rose poudré
            accent: '#F5EDE3',       // Beige chaud
            text: '#1d1d1d',
            textLight: '#6f6f6f',
        },
    },

    // Analytics
    analytics: {
        enabled: false, // Set to true and configure below
        googleAnalyticsId: 'G-XXXXXXXXXX',
        events: {
            trackProductView: true,
            trackAddToCart: true,
            trackCheckout: true,
        },
    },

    // Email/Newsletter
    email: {
        enabled: false,
        provider: 'klaviyo', // or 'mailchimp', 'convertkit', etc.
        apiKey: 'YOUR_EMAIL_PROVIDER_API_KEY',
    },

    // Feature Flags
    features: {
        showProductRatings: false,
        enableWishlist: false,
        enableProductSearch: false,
        enableProductFilters: false,
        showInventoryCount: false,
    },

    // Checkout
    checkout: {
        autoOpenCart: false,
        requireShippingAddress: true,
        language: 'fr',
    },
};

// Export config
window.SHOPIFY_CONFIG = SHOPIFY_CONFIG;
