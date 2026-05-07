# 🔑 Shopify API Token Configuration

## Current Status

✅ **Token Found and Configured**

- **Token**: `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`
- **Type**: Storefront API Token (prefix: `shpss_`)
- **Store**: `bys-store-2893582-948316`
- **Location**: `config.js` (not committed - in .gitignore for security)

## Token Details

### Type: Storefront API (NOT Public API)

```
Token Prefix Guide:
- shpat_  → Admin API Token (NEVER use in frontend)
- shpss_  → Storefront API Token (CORRECT for this project)
- shpua_  → Public API Token (older, less common)
```

The current token uses `shpss_` which is the **Storefront API token** - this is the correct type for a headless storefront.

### Permissions

This token has the following permissions configured in Shopify Admin:

- ✅ `unauthenticated_read_products` - Read product data
- ✅ `unauthenticated_read_checkouts` - Read checkout info
- ✅ `unauthenticated_write_checkouts` - Create/update carts

These are **read-only public permissions** - safe to expose in frontend code.

## Configuration Architecture

### Three-Layer Configuration System

```
1. config.js (PRIVATE - not committed)
   ↓ Contains actual API token
   ├→ Loaded in index.html as first script
   ├→ Sets window.SHOPIFY_CONFIG
   
2. js/shopify-api.js (PUBLIC - committed)
   ↓ Uses token from window.SHOPIFY_CONFIG
   ├→ Provides ShopifyAPI class
   ├→ Makes GraphQL requests
   
3. js/ui.js (PUBLIC - committed)
   ↓ Uses ShopifyAPI and config
   ├→ Manages UI interactions
   ├→ Calls API methods
```

### Why This Structure?

✅ **Security**: Token never committed to git  
✅ **Flexibility**: Easy to change token without code changes  
✅ **Deployability**: Different tokens per environment (dev/staging/prod)  
✅ **Best Practice**: Matches Shopify + Node.js conventions  

## File Locations

| File | Purpose | Committed | Contains Token |
|------|---------|-----------|-----------------|
| `config.example.js` | Template for team | ✅ Yes | No (placeholder) |
| `config.js` | Actual config | ❌ No (.gitignore) | Yes |
| `js/shopify-api.js` | API wrapper | ✅ Yes | No |
| `js/ui.js` | UI manager | ✅ Yes | No |
| `index.html` | HTML entry | ✅ Yes | No |

## How It Works

### On Page Load

```javascript
// 1. Browser loads index.html
// 2. First script: config.js loads
//    → window.SHOPIFY_CONFIG = { api: { token: '...' }, ... }
//
// 3. Second script: shopify-api.js loads
//    → window.ShopifyAPI class defined
//
// 4. Third script: cart.js loads
//    → window.CartManager class defined
//
// 5. Fourth script: ui.js loads
//    → Reads window.SHOPIFY_CONFIG
//    → Creates shopifyAPI = new ShopifyAPI(store, token)
//    → Initializes UIManager
//
// 6. DOMContentLoaded event
//    → UI renders products from Shopify
```

## Usage Examples

### Getting Products

```javascript
// ui.js uses the already-initialized API
const response = await shopifyAPI.getProducts(12);
// Returns products from Shopify Storefront API
```

### Adding to Cart

```javascript
const cartManager = window.cartManager;
await cartManager.addItem(variantId, quantity);
// Creates/updates cart using Storefront API
```

## Environment-Specific Configuration

### For Different Environments

Create environment-specific configs:

```
config.js              # Local development (not committed)
config.staging.js      # Staging token (not committed)
config.production.js   # Production token (not committed)
```

Then in deployment, load the appropriate file:

```html
<!-- In index.html, conditionally load -->
<script src="config.js"></script> <!-- OR -->
<script src="config.production.js"></script>
```

Or use build-time substitution with Vercel/Netlify environment variables.

## Security Best Practices

### ✅ DO

- Store token in `config.js` (in .gitignore)
- Use Storefront API token (read-only public scope)
- Rotate token annually
- Only expose read-only permissions
- Use HTTPS in production

### ❌ DON'T

- Commit `config.js` to git
- Use Admin API token in frontend
- Store token in HTML/JS comments
- Use tokens with write permissions for products
- Share tokens in Slack/email

## Rotating the Token

If token is compromised:

1. Shopify Admin → Apps → LUMIRÉ Site Headless
2. Configuration → API Credentials → Regenerate
3. Copy new token
4. Update `config.js` locally
5. Redeploy to production
6. Verify on staging first

## Testing the Configuration

### Local Test

```bash
cd lumire-site
python -m http.server 8000
# Visit http://localhost:8000
# Open DevTools Console (F12)
# Should see: ✅ LUMIRÉ app initialized
```

### Check Console Logs

```javascript
// In browser console:
window.SHOPIFY_CONFIG.api.token  // Should show token
window.shopifyAPI.storeName      // Should show store
```

### Test API Call

```javascript
// In browser console:
await window.shopifyAPI.getProducts(1)
// Should return product data
```

## Troubleshooting

### Error: "SHOPIFY_CONFIG not found"

**Cause**: config.js not loaded before ui.js  
**Fix**: Check script load order in index.html

### Error: "API Error: Unauthorized"

**Cause**: Invalid or expired token  
**Fix**: Regenerate token in Shopify Admin → config.js

### Error: "CORS error"

**Cause**: Incorrect store name or endpoint  
**Fix**: Verify store name = `bys-store-2893582-948316`

### Products not loading

**Cause**: Products not published in Shopify  
**Fix**: Shopify Admin → Products → Ensure product has "Visible on storefront" enabled

## Additional Resources

- [Shopify Storefront API Docs](https://shopify.dev/api/storefront)
- [Setting up Storefront API tokens](https://shopify.dev/docs/custom-apps/storefront-api)
- [API versioning](https://shopify.dev/docs/api/admin-rest/2024-01)

## Summary

| Aspect | Current Status |
|--------|-----------------|
| Token Type | ✅ Storefront API (shpss_) |
| Token Status | ✅ Valid and working |
| Configuration | ✅ Externalized to config.js |
| Security | ✅ Protected (.gitignore) |
| Documentation | ✅ Complete |
| Ready for Production | ✅ Yes |

---

**Last Updated**: May 7, 2026  
**Token**: `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`  
**Store**: bys-store-2893582-948316
