/* ===== UI AND APP INITIALIZATION ===== */

// ⚠️ CONFIGURE THESE WITH YOUR SHOPIFY STORE INFO
const SHOPIFY_STORE = 'bys-store-2893582-948316'; // Your store name
const SHOPIFY_TOKEN = ''; // Storefront API token (optional for read-only operations - public API allows unauthenticated reads)

// Initialize Shopify API
const shopifyAPI = new ShopifyAPI(SHOPIFY_STORE, SHOPIFY_TOKEN);
window.shopifyAPI = shopifyAPI;

// UI Manager
class UIManager {
    constructor() {
        this.initializeEventListeners();
        this.loadProducts();
        this.restoreCart();
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

        const card = document.createElement('div');
        card.className = 'product-card';

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

        const priceDiv = document.createElement('div');
        priceDiv.className = 'product-price';
        priceDiv.textContent = `${price.toFixed(2)} CHF`;
        card.appendChild(priceDiv);

        const button = document.createElement('button');
        button.className = 'product-button';
        button.dataset.variantId = variant?.id || '';
        button.disabled = !variant?.availableForSale;
        button.textContent = variant?.availableForSale ? 'Ajouter au panier' : 'Rupture de stock';
        card.appendChild(button);

        return card;
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
