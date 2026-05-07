/* ===== SHOPIFY STOREFRONT API WRAPPER ===== */

class ShopifyAPI {
    constructor(storeName, accessToken) {
        this.storeName = storeName;
        this.accessToken = accessToken;
        this.endpoint = `https://${storeName}.myshopify.com/api/2024-01/graphql.json`;
        this.currency = 'CHF';
    }

    async query(query, variables = {}) {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            // Only add token header if token is provided
            if (this.accessToken && this.accessToken !== 'test_token') {
                headers['X-Shopify-Storefront-Access-Token'] = this.accessToken;
            }

            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            const data = await response.json();

            if (data.errors) {
                console.error('Shopify API Error:', data.errors);
                throw new Error(`API Error: ${data.errors[0].message}`);
            }

            return data.data;
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    // Get all products
    async getProducts(first = 12) {
        const query = `
            query GetProducts($first: Int!) {
                products(first: $first) {
                    edges {
                        node {
                            id
                            handle
                            title
                            description
                            priceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            images(first: 1) {
                                edges {
                                    node {
                                        url
                                        altText
                                    }
                                }
                            }
                            variants(first: 1) {
                                edges {
                                    node {
                                        id
                                        title
                                        priceV2 {
                                            amount
                                            currencyCode
                                        }
                                        availableForSale
                                        quantityAvailable
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        return this.query(query, { first });
    }

    // Get single product by handle
    async getProductByHandle(handle) {
        const query = `
            query GetProductByHandle($handle: String!) {
                productByHandle(handle: $handle) {
                    id
                    handle
                    title
                    description
                    descriptionHtml
                    availableForSale
                    totalInventory
                    priceRange {
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    images(first: 10) {
                        edges {
                            node {
                                url
                                altText
                            }
                        }
                    }
                    variants(first: 50) {
                        edges {
                            node {
                                id
                                title
                                priceV2 {
                                    amount
                                    currencyCode
                                }
                                availableForSale
                                quantityAvailable
                            }
                        }
                    }
                    options {
                        id
                        name
                        values
                    }
                }
            }
        `;

        return this.query(query, { handle });
    }

    // Create cart
    async createCart(lines = []) {
        const query = `
            mutation CreateCart($lines: [CartLineInput!]!) {
                cartCreate(input: { lines: $lines }) {
                    cart {
                        id
                        checkoutUrl
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        return this.query(query, { lines });
    }

    // Add items to cart
    // NOTE: subtotalAmount = Prix HT (avant TVA/taxes)
    //       totalAmount = Prix TTC (après TVA/taxes)
    async addToCart(cartId, lines) {
        const query = `
            mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
                cartLinesAdd(cartId: $cartId, lines: $lines) {
                    cart {
                        id
                        lines(first: 100) {
                            edges {
                                node {
                                    id
                                    merchandise {
                                        ... on ProductVariant {
                                            id
                                            title
                                            priceV2 {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                title
                                                handle
                                                images(first: 1) {
                                                    edges {
                                                        node {
                                                            url
                                                            altText
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    quantity
                                }
                            }
                        }
                        cost {
                            subtotalAmount {
                                amount
                                currencyCode
                            }
                            totalAmount {
                                amount
                                currencyCode
                            }
                        }
                        checkoutUrl
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        return this.query(query, { cartId, lines });
    }

    // Remove from cart
    // NOTE: subtotalAmount = Prix HT (avant TVA/taxes)
    //       totalAmount = Prix TTC (après TVA/taxes)
    async removeFromCart(cartId, lineIds) {
        const query = `
            mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
                cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                    cart {
                        id
                        lines(first: 100) {
                            edges {
                                node {
                                    id
                                    merchandise {
                                        ... on ProductVariant {
                                            id
                                            title
                                            priceV2 {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                title
                                                handle
                                                images(first: 1) {
                                                    edges {
                                                        node {
                                                            url
                                                            altText
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    quantity
                                }
                            }
                        }
                        cost {
                            subtotalAmount {
                                amount
                                currencyCode
                            }
                            totalAmount {
                                amount
                                currencyCode
                            }
                        }
                        checkoutUrl
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        return this.query(query, { cartId, lineIds });
    }

    // Update cart line quantity
    // NOTE: subtotalAmount = Prix HT (avant TVA/taxes)
    //       totalAmount = Prix TTC (après TVA/taxes)
    async updateCartLineQuantity(cartId, lineId, quantity) {
        const query = `
            mutation UpdateCartLine($cartId: ID!, $lineId: ID!, $quantity: Int!) {
                cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
                    cart {
                        id
                        lines(first: 100) {
                            edges {
                                node {
                                    id
                                    quantity
                                    merchandise {
                                        ... on ProductVariant {
                                            id
                                            title
                                            priceV2 {
                                                amount
                                                currencyCode
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        cost {
                            subtotalAmount {
                                amount
                                currencyCode
                            }
                            totalAmount {
                                amount
                                currencyCode
                            }
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        return this.query(query, { cartId, lineId, quantity });
    }

    // Get cart details
    // NOTE: subtotalAmount = Prix HT (avant TVA/taxes)
    //       totalAmount = Prix TTC (après TVA/taxes)
    async getCart(cartId) {
        const query = `
            query GetCart($cartId: ID!) {
                cart(id: $cartId) {
                    id
                    lines(first: 100) {
                        edges {
                            node {
                                id
                                merchandise {
                                    ... on ProductVariant {
                                        id
                                        title
                                        priceV2 {
                                            amount
                                            currencyCode
                                        }
                                        product {
                                            title
                                            handle
                                            images(first: 1) {
                                                edges {
                                                    node {
                                                        url
                                                        altText
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                quantity
                            }
                        }
                    }
                    cost {
                        subtotalAmount {
                            amount
                            currencyCode
                        }
                        totalAmount {
                            amount
                            currencyCode
                        }
                    }
                    checkoutUrl
                }
            }
        `;

        return this.query(query, { cartId });
    }

    // Get product inventory by handle (for stock refresh)
    async getProductInventory(handle) {
        const query = `
            query GetProductInventory($handle: String!) {
                productByHandle(handle: $handle) {
                    id
                    handle
                    title
                    variants(first: 50) {
                        edges {
                            node {
                                id
                                title
                                quantityAvailable
                                availableForSale
                            }
                        }
                    }
                }
            }
        `;

        return this.query(query, { handle });
    }
}

// Export for use
window.ShopifyAPI = ShopifyAPI;
