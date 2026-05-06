/* ===== PRODUCT DETAIL PAGE MANAGER ===== */

class ProductDetailManager {
    constructor() {
        this.product = null;
        this.currentImageIndex = 0;
        this.quantity = 1;
        this.selectedVariant = null;
        this.inventoryRefreshInterval = null;
        this.inventoryCache = new Map();

        this.initializeEventListeners();
        this.loadProductFromUrl();
    }

    // Get product handle from URL query parameter
    getProductHandleFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('handle') || params.get('product');
    }

    // Load product data from Shopify API
    async loadProductFromUrl() {
        try {
            const handle = this.getProductHandleFromUrl();

            if (!handle) {
                this.showError('Aucun produit sélectionné. Retour à l\'accueil...');
                setTimeout(() => window.location.href = '/', 2000);
                return;
            }

            // Show loading state
            this.showLoadingState();

            // Fetch product from API
            const response = await window.shopifyAPI.getProductByHandle(handle);
            this.product = response.productByHandle;

            if (!this.product) {
                this.showError('Produit non trouvé');
                setTimeout(() => window.location.href = '/', 2000);
                return;
            }

            // Render product details
            this.renderProductDetail();
            this.loadSimilarProducts();

        } catch (error) {
            console.error('Error loading product:', error);
            this.showError('Erreur lors du chargement du produit');
        }
    }

    // Render all product details
    renderProductDetail() {
        // Update page title and meta
        document.title = `${this.product.title} | LUMIRÉ`;

        // Breadcrumb
        document.getElementById('breadcrumb-product').textContent = this.product.title;

        // Images carousel
        this.renderCarousel();

        // Product info
        this.renderProductInfo();

        // Variants if available
        if (this.product.options && this.product.options.length > 0) {
            this.renderVariants();
        }

        // Set first variant as default
        if (this.product.variants.edges.length > 0) {
            this.selectedVariant = this.product.variants.edges[0].node;
        }

        // Remove loading state
        document.body.classList.remove('product-loading');
    }

    // Render carousel
    renderCarousel() {
        const images = this.product.images.edges;
        const mainImage = document.getElementById('main-image');
        const imageTotal = document.getElementById('image-total');
        const thumbnailsContainer = document.getElementById('carousel-thumbnails');

        // Set first image
        if (images.length > 0) {
            mainImage.src = images[0].node.url;
            mainImage.alt = images[0].node.altText || this.product.title;
        }

        // Update total images
        imageTotal.textContent = images.length;

        // Create thumbnails
        thumbnailsContainer.innerHTML = '';
        images.forEach((edge, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;

            const img = document.createElement('img');
            img.src = edge.node.url;
            img.alt = edge.node.altText || `${this.product.title} - Image ${index + 1}`;
            img.loading = 'lazy';

            thumbnail.appendChild(img);
            thumbnail.addEventListener('click', () => this.selectImage(index));

            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    // Select specific image
    selectImage(index) {
        this.currentImageIndex = index;
        const images = this.product.images.edges;

        if (index >= 0 && index < images.length) {
            const mainImage = document.getElementById('main-image');
            mainImage.src = images[index].node.url;
            mainImage.alt = images[index].node.altText || this.product.title;

            // Update counter
            document.getElementById('image-current').textContent = index + 1;

            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        }
    }

    // Navigate carousel
    previousImage() {
        const images = this.product.images.edges;
        let newIndex = this.currentImageIndex - 1;
        if (newIndex < 0) {
            newIndex = images.length - 1;
        }
        this.selectImage(newIndex);
    }

    nextImage() {
        const images = this.product.images.edges;
        let newIndex = this.currentImageIndex + 1;
        if (newIndex >= images.length) {
            newIndex = 0;
        }
        this.selectImage(newIndex);
    }

    // Render product info
    // NOTE: priceV2.amount is displayed as HT (before VAT)
    // Final price with TVA/taxes will be shown at checkout
    renderProductInfo() {
        const variant = this.product.variants.edges[0]?.node;
        const price = variant ? parseFloat(variant.priceV2.amount) : 0;
        const available = variant ? variant.availableForSale : false;
        const quantity = variant?.quantityAvailable || 0;

        // Title
        document.getElementById('product-title').textContent = this.product.title;

        // Description
        document.getElementById('product-description').textContent =
            this.product.description || 'Aucune description disponible';

        // Price display with TVA note for transparency
        const priceSection = document.querySelector('.price-section');
        if (priceSection) {
            const priceDisplay = priceSection.querySelector('.price-display');
            if (priceDisplay) {
                priceDisplay.innerHTML = `
                    <span class="price-label">Prix:</span>
                    <span id="product-price" class="price-value">${price.toFixed(2)} CHF</span>
                    <span style="font-size: 12px; color: var(--color-text-light); margin-left: 8px; font-style: italic;">Prix TTC au panier</span>
                `;
            }
        }

        // Stock status with quantity
        const stockBadge = document.getElementById('stock-status');
        if (quantity === 0) {
            stockBadge.textContent = 'Stock epuise';
            stockBadge.className = 'stock-badge out-of-stock';
        } else if (quantity < 5) {
            stockBadge.textContent = `Derniers articles! (${quantity} restants)`;
            stockBadge.className = 'stock-badge low-stock';
        } else {
            stockBadge.textContent = `En stock (${quantity} disponibles)`;
            stockBadge.className = 'stock-badge in-stock';
        }

        // Cache initial inventory
        this.inventoryCache.set(this.product.handle, quantity);

        // Update button state
        this.updateAddToCartButton();

        // Start inventory refresh for this product
        this.startInventoryRefresh();
    }

    // Render variant options
    renderVariants() {
        const variantsSection = document.getElementById('variants-section');
        const variantsContainer = document.getElementById('variants-container');

        variantsSection.style.display = 'block';
        variantsContainer.innerHTML = '';

        this.product.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'variant-option-group';

            const label = document.createElement('div');
            label.className = 'variant-label';
            label.textContent = option.name;

            const optionsWrapper = document.createElement('div');
            optionsWrapper.className = 'variant-options';

            option.values.forEach(value => {
                const btn = document.createElement('button');
                btn.className = 'variant-option';
                btn.textContent = value;
                btn.addEventListener('click', () => {
                    // Update selection UI
                    optionsWrapper.querySelectorAll('.variant-option').forEach(b => {
                        b.classList.remove('selected');
                    });
                    btn.classList.add('selected');
                });

                optionsWrapper.appendChild(btn);
            });

            optionDiv.appendChild(label);
            optionDiv.appendChild(optionsWrapper);
            variantsContainer.appendChild(optionDiv);
        });
    }

    // Update quantity
    updateQuantity(newValue) {
        const input = document.getElementById('quantity-input');
        const quantity = Math.max(1, Math.min(999, parseInt(newValue) || 1));
        this.quantity = quantity;
        input.value = quantity;
    }

    // Add to cart
    async addToCart() {
        if (!this.selectedVariant) {
            this.showMessage('Veuillez sélectionner une variante', 'error');
            return;
        }

        if (!this.selectedVariant.availableForSale) {
            this.showMessage('Ce produit n\'est pas disponible', 'error');
            return;
        }

        try {
            const addBtn = document.getElementById('add-to-cart-btn');
            addBtn.disabled = true;
            addBtn.textContent = 'Ajout en cours...';

            // Add to cart via cart manager
            await window.cartManager.addItem(this.selectedVariant.id, this.quantity);

            this.showMessage('Produit ajouté au panier!', 'success');

            // Reset button
            setTimeout(() => {
                addBtn.disabled = false;
                addBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-right: 8px;">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Ajouter au panier
                `;
            }, 1500);

        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showMessage('Erreur lors de l\'ajout au panier', 'error');
        }
    }

    // Continue shopping
    continueShopping() {
        window.location.href = '/#produits';
    }

    // Load similar products
    async loadSimilarProducts() {
        try {
            const grid = document.getElementById('similar-products-grid');
            grid.innerHTML = this.createSkeletons(4);

            const response = await window.shopifyAPI.getProducts(8);
            const allProducts = response.products.edges;

            // Filter out current product and get similar ones
            const similarProducts = allProducts
                .filter(edge => edge.node.handle !== this.product.handle)
                .slice(0, 4);

            grid.innerHTML = '';
            similarProducts.forEach(edge => {
                const card = window.uiManager.createProductCard(edge.node);
                // Make card clickable
                card.style.cursor = 'pointer';
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.product-button')) {
                        window.productDetailManager.openProduct(edge.node.handle);
                    }
                });
                grid.appendChild(card);
            });

            // Add event listeners to similar product buttons
            grid.querySelectorAll('.product-button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const variantId = btn.dataset.variantId;
                    window.cartManager.addItem(variantId, 1);
                });
            });

        } catch (error) {
            console.error('Error loading similar products:', error);
        }
    }

    // Open product detail page
    openProduct(handle) {
        window.location.href = `/product-detail.html?handle=${encodeURIComponent(handle)}`;
    }

    // Update add to cart button state
    updateAddToCartButton() {
        const btn = document.getElementById('add-to-cart-btn');
        const quantity = this.selectedVariant?.quantityAvailable || 0;
        const available = quantity > 0;

        btn.disabled = !available;
        btn.textContent = available ? 'Ajouter au panier' : 'Rupture de stock';

        if (!available) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    }

    // ===== INVENTORY MANAGEMENT =====

    // Start inventory refresh polling (every 30 seconds)
    startInventoryRefresh() {
        console.log(`[STOCK] Demarrage du polling pour: ${this.product.handle}`);

        // Refresh immediately
        this.refreshProductInventory();

        // Then refresh every 30 seconds
        this.inventoryRefreshInterval = setInterval(() => {
            this.refreshProductInventory();
        }, 30000);
    }

    // Stop inventory refresh
    stopInventoryRefresh() {
        if (this.inventoryRefreshInterval) {
            clearInterval(this.inventoryRefreshInterval);
            this.inventoryRefreshInterval = null;
            console.log(`[STOCK] Polling arrete pour: ${this.product.handle}`);
        }
    }

    // Refresh product inventory
    async refreshProductInventory() {
        try {
            if (!this.product?.handle) return;

            const response = await window.shopifyAPI.getProductInventory(this.product.handle);
            const product = response.productByHandle;

            if (!product) return;

            const variant = product.variants.edges[0]?.node;
            if (!variant) return;

            const quantity = variant.quantityAvailable || 0;
            const oldQuantity = this.inventoryCache.get(this.product.handle);

            // Log changes
            if (oldQuantity !== undefined && oldQuantity !== quantity) {
                console.log(`[STOCK] ${this.product.title}: ${oldQuantity} -> ${quantity} unites`);
            }

            // Update cache
            this.inventoryCache.set(this.product.handle, quantity);

            // Update UI
            this.updateProductStockUI(variant, quantity);
        } catch (error) {
            console.error('[STOCK] Erreur lors du refresh:', error);
        }
    }

    // Update product stock UI
    updateProductStockUI(variant, quantity) {
        const stockBadge = document.getElementById('stock-status');

        // Update stock badge
        if (quantity === 0) {
            stockBadge.textContent = 'Stock epuise';
            stockBadge.className = 'stock-badge out-of-stock';
        } else if (quantity < 5) {
            stockBadge.textContent = `Derniers articles! (${quantity} restants)`;
            stockBadge.className = 'stock-badge low-stock';
        } else {
            stockBadge.textContent = `En stock (${quantity} disponibles)`;
            stockBadge.className = 'stock-badge in-stock';
        }

        // Update selected variant quantity
        if (this.selectedVariant) {
            this.selectedVariant.quantityAvailable = quantity;
        }

        // Update button state
        this.updateAddToCartButton();
    }

    // Show loading state
    showLoadingState() {
        document.body.classList.add('product-loading');
        document.getElementById('product-title').textContent = 'Chargement...';
    }

    // Show error message
    showError(message) {
        const detailContainer = document.querySelector('.product-detail-container');
        if (detailContainer) {
            detailContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <p style="color: var(--color-or); font-size: 18px; margin-bottom: 20px;">${message}</p>
                    <a href="/#produits" style="color: var(--color-or); text-decoration: underline;">Retour aux produits</a>
                </div>
            `;
        }

        // Stop inventory refresh on error
        this.stopInventoryRefresh();
    }

    // Show toast message
    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'product-toast';
        toast.style.backgroundColor = type === 'success' ? 'var(--color-or)' :
                                       type === 'error' ? '#d4634f' : 'var(--color-text)';
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Create skeletons for loading
    createSkeletons(count) {
        return Array.from({ length: count })
            .map(() => `
                <div class="product-skeleton">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-text" style="height: 18px;"></div>
                    <div class="skeleton-text" style="height: 16px; width: 80px;"></div>
                    <div class="skeleton-text" style="height: 40px;"></div>
                </div>
            `)
            .join('');
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Carousel navigation
        document.getElementById('carousel-prev').addEventListener('click', () => {
            this.previousImage();
        });
        document.getElementById('carousel-next').addEventListener('click', () => {
            this.nextImage();
        });

        // Quantity controls
        document.getElementById('quantity-minus').addEventListener('click', () => {
            this.updateQuantity(this.quantity - 1);
        });
        document.getElementById('quantity-plus').addEventListener('click', () => {
            this.updateQuantity(this.quantity + 1);
        });
        document.getElementById('quantity-input').addEventListener('change', (e) => {
            this.updateQuantity(e.target.value);
        });

        // Action buttons
        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            this.addToCart();
        });
        document.getElementById('continue-shopping-btn').addEventListener('click', () => {
            this.continueShopping();
        });

        // Keyboard navigation for carousel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });

        // Cart drawer (from ui.js)
        const cartBtn = document.getElementById('cart-button');
        const closeCartBtn = document.getElementById('close-cart');
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');

        cartBtn.addEventListener('click', () => {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        closeCartBtn.addEventListener('click', () => {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });

        cartOverlay.addEventListener('click', () => {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });

        // Checkout
        document.getElementById('checkout-btn').addEventListener('click', () => {
            window.cartManager.checkout();
        });

        // Close cart on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                cartDrawer.classList.remove('open');
                cartOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
}

// Initialize product detail manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (!window.shopifyAPI) {
        console.error('ShopifyAPI not initialized');
        return;
    }

    window.productDetailManager = new ProductDetailManager();
    console.log('✅ Product Detail Manager initialized');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.productDetailManager) {
        window.productDetailManager.stopInventoryRefresh();
    }
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
