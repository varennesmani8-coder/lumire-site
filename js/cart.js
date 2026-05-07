/* ===== CART MANAGEMENT ===== */

class CartManager {
    constructor() {
        this.cartId = this.getStoredCartId();
        this.items = [];
        this.total = 0;
        this.checkoutUrl = null;
        this.currency = 'CHF';
    }

    // LocalStorage keys
    getStorageKey() {
        return 'lumire_cart';
    }

    getUserHash() {
        return btoa(navigator.userAgent).substring(0, 20);
    }

    getStoredCartId() {
        try {
            const stored = localStorage.getItem(this.getStorageKey());
            if (!stored) return null;

            const { cartId, expiresAt, userHash } = JSON.parse(stored);

            // Check expiration (24 hours)
            if (Date.now() > expiresAt) {
                localStorage.removeItem(this.getStorageKey());
                return null;
            }

            // Check user hash for XSS/hijacking protection
            if (userHash !== this.getUserHash()) {
                localStorage.removeItem(this.getStorageKey());
                return null;
            }

            return cartId;
        } catch {
            localStorage.removeItem(this.getStorageKey());
            return null;
        }
    }

    saveCartId(cartId) {
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        localStorage.setItem(
            this.getStorageKey(),
            JSON.stringify({
                cartId,
                expiresAt,
                userHash: this.getUserHash(),
            })
        );
        this.cartId = cartId;
    }

    // Add item to cart
    async addItem(variantId, quantity = 1) {
        try {
            if (!this.cartId) {
                // Create new cart if doesn't exist
                const response = await window.shopifyAPI.createCart([
                    {
                        merchandiseId: variantId,
                        quantity: quantity,
                    },
                ]);

                const cart = response.cartCreate.cart;
                this.saveCartId(cart.id);
                this.checkoutUrl = cart.checkoutUrl;
            } else {
                // Add to existing cart
                const response = await window.shopifyAPI.addToCart(this.cartId, [
                    {
                        merchandiseId: variantId,
                        quantity: quantity,
                    },
                ]);

                if (response.cartLinesAdd.userErrors.length > 0) {
                    throw new Error(response.cartLinesAdd.userErrors[0].message);
                }
            }

            await this.fetchCart();
            this.showNotification('Produit ajouté au panier');
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Erreur lors de l\'ajout au panier', 'error');
        }
    }

    // Remove item from cart
    async removeItem(lineId) {
        try {
            // Validation: check cartId
            if (!this.cartId) {
                const errMsg = 'Erreur: Pas de panier actif. Veuillez réessayer.';
                console.error('removeItem: cartId is missing', { cartId: this.cartId });
                this.showNotification(errMsg, 'error');
                throw new Error(errMsg);
            }

            // Validation: check lineId
            if (!lineId) {
                const errMsg = 'Erreur: ID du produit invalide.';
                console.error('removeItem: lineId is required', { lineId });
                this.showNotification(errMsg, 'error');
                throw new Error(errMsg);
            }

            console.log('[DEBUG] removeItem called', { cartId: this.cartId, lineId });

            const response = await window.shopifyAPI.removeFromCart(this.cartId, [lineId]);

            // Handle API errors
            if (response.cartLinesRemove.userErrors.length > 0) {
                const apiError = response.cartLinesRemove.userErrors[0].message;
                console.error('removeItem: API returned userErrors', { userErrors: response.cartLinesRemove.userErrors });
                throw new Error(apiError);
            }

            await this.fetchCart();
            console.log('[DEBUG] Item removed successfully', { lineId });
            this.showNotification('Produit supprimé du panier');
        } catch (error) {
            // Network error or API error handling
            console.error('removeItem: Error occurred', {
                errorMessage: error.message,
                errorType: error.constructor.name,
                stack: error.stack,
                cartId: this.cartId,
                lineId: lineId
            });

            // Provide user-friendly feedback
            const userMessage = error.message || 'Erreur lors de la suppression du produit. Veuillez réessayer.';
            this.showNotification(userMessage, 'error');
        }
    }

    // Update item quantity
    async updateQuantity(lineId, quantity) {
        try {
            if (!this.cartId) return;

            if (quantity <= 0) {
                await this.removeItem(lineId);
                return;
            }

            const response = await window.shopifyAPI.updateCartLineQuantity(
                this.cartId,
                lineId,
                quantity
            );

            if (response.cartLinesUpdate.userErrors.length > 0) {
                throw new Error(response.cartLinesUpdate.userErrors[0].message);
            }

            await this.fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            this.showNotification('Erreur lors de la mise à jour', 'error');
        }
    }

    // Fetch cart details
    async fetchCart() {
        try {
            if (!this.cartId) {
                this.items = [];
                this.total = 0;
                return;
            }

            const response = await window.shopifyAPI.getCart(this.cartId);
            const cart = response.cart;

            if (!cart) {
                this.cartId = null;
                localStorage.removeItem(this.getStorageKey());
                return;
            }

            this.items = cart.lines.edges.map(edge => ({
                lineId: edge.node.id,
                variantId: edge.node.merchandise.id,
                title: edge.node.merchandise.product.title,
                variantTitle: edge.node.merchandise.title,
                price: parseFloat(edge.node.merchandise.priceV2.amount),
                quantity: edge.node.quantity,
                image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
                altText: edge.node.merchandise.product.images.edges[0]?.node.altText || '',
            }));

            this.total = parseFloat(cart.cost.totalAmount.amount);
            this.checkoutUrl = cart.checkoutUrl;

            this.updateUI();
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }

    // Get cart item count
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Get formatted total
    getFormattedTotal() {
        return `${this.total.toFixed(2)} ${this.currency}`;
    }

    // Update cart UI
    updateUI() {
        // Update cart count
        const countElement = document.getElementById('cart-count');
        const count = this.getItemCount();
        if (count > 0) {
            countElement.textContent = count;
            countElement.style.display = 'flex';
        } else {
            countElement.style.display = 'none';
        }

        // Update cart items display
        const cartItemsContainer = document.getElementById('cart-items');
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p>Votre panier est vide</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = '';
            this.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';

                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.altText;
                img.className = 'cart-item-image';
                itemDiv.appendChild(img);

                const infoDiv = document.createElement('div');
                infoDiv.className = 'cart-item-info';

                const nameDiv = document.createElement('div');
                nameDiv.className = 'cart-item-name';
                nameDiv.textContent = item.title;
                infoDiv.appendChild(nameDiv);

                const priceDiv = document.createElement('div');
                priceDiv.className = 'cart-item-price';
                priceDiv.textContent = `${item.price.toFixed(2)} CHF`;
                infoDiv.appendChild(priceDiv);

                const qtyDiv = document.createElement('div');
                qtyDiv.className = 'cart-item-qty';

                const btnMinus = document.createElement('button');
                btnMinus.className = 'qty-btn';
                btnMinus.textContent = '−';
                btnMinus.addEventListener('click', () => this.updateQuantity(item.lineId, item.quantity - 1));
                qtyDiv.appendChild(btnMinus);

                const qtySpan = document.createElement('span');
                qtySpan.className = 'qty-count';
                qtySpan.textContent = item.quantity;
                qtyDiv.appendChild(qtySpan);

                const btnPlus = document.createElement('button');
                btnPlus.className = 'qty-btn';
                btnPlus.textContent = '+';
                btnPlus.addEventListener('click', () => this.updateQuantity(item.lineId, item.quantity + 1));
                qtyDiv.appendChild(btnPlus);

                infoDiv.appendChild(qtyDiv);

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.textContent = 'Supprimer';
                removeBtn.addEventListener('click', () => this.removeItem(item.lineId));
                infoDiv.appendChild(removeBtn);

                itemDiv.appendChild(infoDiv);
                cartItemsContainer.appendChild(itemDiv);
            });
        }

        // Update total
        document.getElementById('cart-total').textContent = this.getFormattedTotal();

        // Enable/disable checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.disabled = this.items.length === 0;
    }

    // Checkout
    checkout() {
        if (this.checkoutUrl) {
            // Shopify returns checkoutUrl with beautylumire.com (custom domain) but
            // Vercel serves that domain — not Shopify. Replace with myshopify.com
            // so the checkout is handled by Shopify's servers.
            const url = this.checkoutUrl.replace(
                'https://beautylumire.com',
                'https://bys-store-2893582-948316.myshopify.com'
            );
            window.location.href = url;
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        const icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.textContent = type === 'success' ? '✓' : '✕';

        const text = document.createElement('span');
        text.textContent = message;

        toast.appendChild(icon);
        toast.appendChild(text);
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize cart manager globally
window.cartManager = new CartManager();
