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
        return 'lumire_cart_id';
    }

    getStoredCartId() {
        return localStorage.getItem(this.getStorageKey());
    }

    saveCartId(cartId) {
        localStorage.setItem(this.getStorageKey(), cartId);
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
            if (!this.cartId) return;

            const response = await window.shopifyAPI.removeFromCart(this.cartId, [lineId]);

            if (response.cartLinesRemove.userErrors.length > 0) {
                throw new Error(response.cartLinesRemove.userErrors[0].message);
            }

            await this.fetchCart();
            this.showNotification('Produit supprimé du panier');
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification('Erreur lors de la suppression', 'error');
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
            cartItemsContainer.innerHTML = this.items
                .map(
                    item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.altText}" class="cart-item-image" />
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.title}</div>
                            <div class="cart-item-price">${item.price.toFixed(2)} CHF</div>
                            <div class="cart-item-qty">
                                <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.lineId}', ${item.quantity - 1})">−</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.lineId}', ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-btn" onclick="window.cartManager.removeItem('${item.lineId}')">Supprimer</button>
                        </div>
                    </div>
                `
                )
                .join('');
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
            window.location.href = this.checkoutUrl;
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize cart manager globally
window.cartManager = new CartManager();
