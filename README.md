# LUMIRÉ — Site Headless Shopify

Site HTML + API Shopify pour la boutique LUMIRÉ (dropshipping beauté).

## 🎯 Architecture

- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Backend:** Shopify Storefront API (GraphQL)
- **Design:** Apple-like minimaliste, responsive
- **Panier/Paiement:** Shopify natif

## 📁 Structure

```
lumire-site/
├── index.html          # Page d'accueil
├── css/
│   ├── global.css     # Design system + composants principaux
│   ├── components.css # Composants réutilisables
│   └── responsive.css # Breakpoints mobile/tablet/desktop
├── js/
│   ├── shopify-api.js # Wrapper Storefront API GraphQL
│   ├── cart.js        # Gestion panier (state + localStorage)
│   └── ui.js          # Chargement produits + interactions UI
├── assets/            # Images, favicon, etc.
└── README.md
```

## 🚀 Mise en place

### 1. Récupérer le Storefront API Token

**Via Shopify Admin:**

1. Va dans **Paramètres → Apps et canaux de vente**
2. Clique sur **Développement d'applications**
3. Crée une **Nouvelle application** (ou utilise une existante)
4. Nomme-la: `LUMIRÉ Site Headless`
5. Va dans **Configuration** → **Admin API scopes**
6. Active au minimum:
   - `products:read`
   - `cart:write`
   - `checkout:write`
7. Sauvegarde
8. Va dans **Tokens d'accès API** → Copie le token **Storefront API**

### 2. Configurer le site

Ouvre `js/ui.js` et remplace:

```javascript
const SHOPIFY_STORE = 'bys-store-2893582-948316';
const SHOPIFY_TOKEN = 'YOUR_STOREFRONT_API_TOKEN_HERE';
```

Par tes vraies infos:

```javascript
const SHOPIFY_STORE = 'bys-store-2893582-948316'; // Ne change pas (déjà bon)
const SHOPIFY_TOKEN = 'shpat_1a2b3c4d5e6f7g8h9i0j'; // Colle ton token ici
```

### 3. Ajouter des produits (optionnel)

Les produits sont chargés **automatiquement** depuis Shopify. Ajoute-les dans **Shopify Admin → Produits**. Ils apparaîtront sur le site.

### 4. Déployer

**Option A: Vercel (recommandé)**
1. Push le code sur GitHub
2. Connecte ton repo à Vercel
3. Deploy

**Option B: Netlify**
1. Connecte ton GitHub
2. Sélectionne le dossier `lumire-site`
3. Deploy

**Option C: Serveur personnel**
1. Upload les fichiers sur ton serveur
2. Configure le domaine personnalisé

## 🎨 Design

### Couleurs LUMIRÉ
- Beige chaud: `#F5EDE3`
- Rose poudré: `#E8C4B8`
- Or doux: `#C9A96E`
- Blanc cassé: `#FAFAF8`

### Typos
- Titres: Cormorant Garamond (serif)
- Corps: Inter (sans-serif)

### Responsive
- Mobile: < 480px
- Tablet: 480px - 1024px
- Desktop: > 1024px

## 💳 Panier et Paiement

- **Panier:** Stocké en localStorage + Shopify backend
- **Paiement:** Redirect vers Shopify Checkout natif
- **Devise:** CHF (configurable dans `cart.js`)

## 🔧 Personnalisation

### Ajouter une page produit personnalisée
Crée `product.html` avec:
```html
<script>
    const handle = new URLSearchParams(window.location.search).get('handle');
    shopifyAPI.getProductByHandle(handle).then(renderProduct);
</script>
```

### Ajouter des filtres
Dans `js/ui.js`, ajoute un filtre avant `loadProducts()`:
```javascript
async loadProducts(collection = null) {
    // Filtre par collection Shopify
}
```

### Ajouter un formulaire de newsletter
```html
<form id="newsletter" class="newsletter-form">
    <input type="email" placeholder="Ton email" required>
    <button type="submit">S'abonner</button>
</form>
```

## 📊 Analytics

Les événements sont loggés via `window.trackEvent()`. À remplacer par:
- Google Analytics
- Mixpanel
- Klaviyo
- etc.

## 🐛 Debugging

- **Console:** `F12` → Console pour voir les erreurs
- **Network:** Vérifie les appels API Shopify
- **LocalStorage:** `localStorage.getItem('lumire_cart_id')`

## 📞 Support

Erreurs courantes:

**❌ "API Error: Unauthorized"**
→ Token Shopify invalide ou expiré. Vérifie dans `js/ui.js`.

**❌ "Cart is null"**
→ Le cart a expiré (> 24h). Le panier se réinitialise automatiquement.

**❌ "Products not loading"**
→ Vérifie que tu as au moins 1 produit publié dans Shopify.

## 📚 Ressources

- [Shopify Storefront API Docs](https://shopify.dev/api/storefront)
- [Tailwind CSS](https://tailwindcss.com) (optionnel, pour étendue les styles)
- [LUMIRÉ Stratégie](../01_STRATEGIE_COMPLETE.md)

---

**LUMIRÉ** © 2026 | Beauté premium, accessibility design.
