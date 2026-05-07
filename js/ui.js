/* ===== UI AND APP INITIALIZATION ===== */

// Load configuration from config.js
// config.js must be loaded before this script in index.html
if (typeof window.SHOPIFY_CONFIG === 'undefined') {
    console.error('⚠️ SHOPIFY_CONFIG not found. Make sure config.js is loaded before ui.js');
}

const SHOPIFY_STORE = window.SHOPIFY_CONFIG?.store?.name || 'bys-store-2893582-948316';
const SHOPIFY_TOKEN = window.SHOPIFY_CONFIG?.api?.token || '';

// Initialize Shopify API
const shopifyAPI = new ShopifyAPI(SHOPIFY_STORE, SHOPIFY_TOKEN);
window.shopifyAPI = shopifyAPI;

// UI Manager
class UIManager {
    constructor() {
        this.inventoryCache = new Map();
        this.inventoryRefreshInterval = null;
        this.initializeEventListeners();
        this.loadProducts();
        this.restoreCart();
        this.initializeHeaderScroll();
        this.startInventoryRefresh();
    }

    initializeHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        let isHeaderVisible = true;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Scroll down - hide header
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                if (isHeaderVisible) {
                    header.classList.add('hidden');
                    isHeaderVisible = false;
                }
            }
            // Scroll up - show header
            else if (scrollTop < lastScrollTop) {
                if (!isHeaderVisible) {
                    header.classList.remove('hidden');
                    isHeaderVisible = true;
                }
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }

    initializeEventListeners() {
        // Cart drawer toggle
        const cartBtn = document.getElementById('cart-button');
        const closeCartBtn = document.getElementById('close-cart');
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');

        cartBtn.addEventListener('click', () => this.openCartDrawer());
        closeCartBtn.addEventListener('click', () => this.closeCartDrawer());
        cartOverlay.addEventListener('click', () => this.closeCartDrawer());

        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => {
            window.cartManager.checkout();
        });

        // Close cart on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCartDrawer();
            }
        });
    }

    openCartDrawer() {
        document.getElementById('cart-drawer').classList.add('open');
        document.getElementById('cart-overlay').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    closeCartDrawer() {
        document.getElementById('cart-drawer').classList.remove('open');
        document.getElementById('cart-overlay').classList.remove('open');
        document.body.style.overflow = '';
    }

    async loadProducts() {
        try {
            const grid = document.getElementById('products-grid');
            grid.innerHTML = this.createSkeletons(6);

            const response = await shopifyAPI.getProducts(12);
            const products = response.products.edges;

            if (products.length === 0) {
                grid.innerHTML = '';
                const emptyMsg = document.createElement('p');
                emptyMsg.style.gridColumn = '1/-1';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.style.color = 'var(--color-text-light)';
                emptyMsg.textContent = 'Aucun produit disponible';
                grid.appendChild(emptyMsg);
                return;
            }

            grid.innerHTML = '';
            products.forEach(edge => {
                const productCard = this.createProductCard(edge.node);
                grid.appendChild(productCard);
            });

            // Add event listeners to product buttons
            document.querySelectorAll('.product-button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const variantId = btn.dataset.variantId;
                    window.cartManager.addItem(variantId, 1);
                });
            });
        } catch (error) {
            console.error('Error loading products:', error);
            const grid = document.getElementById('products-grid');
            grid.innerHTML = '';
            const errorMsg = document.createElement('p');
            errorMsg.style.gridColumn = '1/-1';
            errorMsg.style.textAlign = 'center';
            errorMsg.style.color = 'var(--color-or)';
            errorMsg.textContent = 'Erreur lors du chargement des produits';
            grid.appendChild(errorMsg);
        }
    }

    createProductCard(product) {
        const variant = product.variants.edges[0]?.node;
        const image = product.images.edges[0]?.node;
        const price = variant ? parseFloat(variant.priceV2.amount) : 0;
        const quantity = variant?.quantityAvailable || 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer';
        card.dataset.productHandle = product.handle;

        const img = document.createElement('img');
        img.src = image?.url || '';
        img.alt = image?.altText || product.title;
        img.className = 'product-image';
        img.loading = 'lazy';
        card.appendChild(img);

        const title = document.createElement('h3');
        title.className = 'product-name';
        title.textContent = product.title;
        card.appendChild(title);

        // Stock badge
        const stockBadge = document.createElement('div');
        stockBadge.className = 'stock-badge';

        if (quantity === 0) {
            stockBadge.textContent = 'Stock epuise';
            stockBadge.className = 'stock-badge out-of-stock';
        } else if (quantity < 5) {
            stockBadge.textContent = `Derniers articles! (${quantity})`;
            stockBadge.className = 'stock-badge low-stock';
        } else {
            stockBadge.textContent = `En stock (${quantity})`;
            stockBadge.className = 'stock-badge in-stock';
        }
        card.appendChild(stockBadge);

        const priceDiv = document.createElement('div');
        priceDiv.className = 'product-price';
        // NOTE: Prices displayed are HT (before VAT) for consistency across product pages
        // Final price with TVA will be calculated at checkout
        priceDiv.textContent = `${price.toFixed(2)} CHF`;
        card.appendChild(priceDiv);

        // Add VAT notice for price transparency
        const taxNoteDiv = document.createElement('div');
        taxNoteDiv.style.fontSize = '11px';
        taxNoteDiv.style.color = 'var(--color-text-light)';
        taxNoteDiv.style.marginBottom = '8px';
        taxNoteDiv.style.fontStyle = 'italic';
        taxNoteDiv.textContent = 'Prix TTC au panier';
        card.appendChild(taxNoteDiv);

        const button = document.createElement('button');
        button.className = 'product-button';
        button.dataset.variantId = variant?.id || '';

        // Determine button state based on quantity
        if (quantity === 0) {
            button.disabled = true;
            button.textContent = 'Rupture de stock';
            button.classList.add('disabled');
        } else {
            button.disabled = false;
            button.textContent = 'Ajouter au panier';
            button.classList.remove('disabled');
        }

        card.appendChild(button);

        // Make entire card clickable to open product detail (except button)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.product-button')) {
                this.openProductDetail(product.handle);
            }
        });

        return card;
    }

    // Open product detail page
    openProductDetail(handle) {
        window.location.href = `/product-detail.html?handle=${encodeURIComponent(handle)}`;
    }

    createSkeletons(count) {
        return Array.from({ length: count })
            .map(
                () => `
                <div class="product-skeleton">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-text" style="height: 18px;"></div>
                    <div class="skeleton-text" style="height: 16px; width: 80px;"></div>
                    <div class="skeleton-text" style="height: 40px;"></div>
                </div>
            `
            )
            .join('');
    }

    async restoreCart() {
        // Check if there's a stored cart ID
        if (window.cartManager.cartId) {
            try {
                await window.cartManager.fetchCart();
            } catch (error) {
                console.error('Error restoring cart:', error);
                // Clear invalid cart
                localStorage.removeItem(window.cartManager.getStorageKey());
            }
        }
    }

    // ===== INVENTORY MANAGEMENT =====

    // Start inventory refresh polling (every 30 seconds)
    startInventoryRefresh() {
        console.log('[STOCK] Demarrage du polling du stock (30s)');

        // Refresh immediately on start
        this.refreshAllInventory();

        // Then refresh every 30 seconds
        this.inventoryRefreshInterval = setInterval(() => {
            this.refreshAllInventory();
        }, 30000);
    }

    // Refresh inventory for all visible products
    async refreshAllInventory() {
        try {
            console.log('[STOCK] Refresh du stock en cours...');
            const grid = document.getElementById('products-grid');

            if (!grid) return;

            const productCards = grid.querySelectorAll('.product-card');

            for (const card of productCards) {
                const handle = card.dataset.productHandle;
                if (handle) {
                    await this.updateProductInventory(handle);
                }
            }
        } catch (error) {
            console.error('[STOCK] Erreur lors du refresh du stock:', error);
        }
    }

    // Update inventory for a specific product
    async updateProductInventory(handle) {
        try {
            const response = await shopifyAPI.getProductInventory(handle);
            const product = response.productByHandle;

            if (!product) return;

            const variant = product.variants.edges[0]?.node;
            if (!variant) return;

            const quantity = variant.quantityAvailable || 0;
            const oldQuantity = this.inventoryCache.get(handle) || null;

            // Log quantity changes
            if (oldQuantity !== null && oldQuantity !== quantity) {
                console.log(`[STOCK] ${product.title}: ${oldQuantity} -> ${quantity} unites`);
            }

            // Update cache
            this.inventoryCache.set(handle, quantity);

            // Update UI for this product
            this.updateProductCardInventory(handle, quantity);
        } catch (error) {
            console.error(`[STOCK] Erreur refresh pour ${handle}:`, error);
        }
    }

    // Update product card inventory UI
    updateProductCardInventory(handle, quantity) {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        const cards = Array.from(grid.querySelectorAll('.product-card'));
        const card = cards.find(c => c.dataset.productHandle === handle);

        if (!card) return;

        // Update stock badge/info
        let stockBadge = card.querySelector('.stock-badge');
        if (!stockBadge) {
            stockBadge = document.createElement('div');
            stockBadge.className = 'stock-badge';

            // Insert after product name
            const productName = card.querySelector('.product-name');
            if (productName) {
                productName.parentNode.insertBefore(stockBadge, productName.nextSibling);
            }
        }

        const button = card.querySelector('.product-button');

        // Update badge and button based on quantity
        if (quantity === 0) {
            stockBadge.textContent = 'Stock epuise';
            stockBadge.className = 'stock-badge out-of-stock';
            button.disabled = true;
            button.textContent = 'Rupture de stock';
            button.classList.add('disabled');
        } else if (quantity < 5) {
            stockBadge.textContent = `Derniers articles! (${quantity})`;
            stockBadge.className = 'stock-badge low-stock';
            button.disabled = false;
            button.textContent = 'Ajouter au panier';
            button.classList.remove('disabled');
        } else {
            stockBadge.textContent = `En stock (${quantity})`;
            stockBadge.className = 'stock-badge in-stock';
            button.disabled = false;
            button.textContent = 'Ajouter au panier';
            button.classList.remove('disabled');
        }
    }

    // Manual inventory refresh method
    async refreshInventory(handle = null) {
        if (handle) {
            console.log(`[STOCK] Refresh manuel pour: ${handle}`);
            await this.updateProductInventory(handle);
        } else {
            console.log('[STOCK] Refresh manuel pour tous les produits');
            await this.refreshAllInventory();
        }
    }

    // Stop inventory refresh
    stopInventoryRefresh() {
        if (this.inventoryRefreshInterval) {
            clearInterval(this.inventoryRefreshInterval);
            this.inventoryRefreshInterval = null;
            console.log('[STOCK] Polling du stock arrêté');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if API token is configured
    if (SHOPIFY_TOKEN === 'YOUR_STOREFRONT_API_TOKEN_HERE') {
        console.error('❌ SHOPIFY_TOKEN not configured in ui.js');
        document.getElementById('products-grid').innerHTML =
            '<p style="grid-column: 1/-1; text-align: center; color: red;">⚠️ API non configurée. Voir console.</p>';
        return;
    }

    window.uiManager = new UIManager();
    console.log('✅ LUMIRÉ app initialized');
});

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
});

// Analytics placeholder
window.trackEvent = (eventName, eventData = {}) => {
    console.log(`📊 Event: ${eventName}`, eventData);
};
