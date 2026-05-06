# Système de Synchronisation de Stock Shopify - LUMIRÉ

## Vue d'ensemble

Ce système synchronise le stock disponible de Shopify en temps réel sur le frontend. Il affiche:
- Le nombre d'articles disponibles pour chaque produit
- Un badge "Stock épuisé" si quantité = 0
- Un badge "Derniers articles!" en rouge si quantité < 5
- Un badge "En stock" si quantité > 5

Le stock s'actualise automatiquement toutes les 30 secondes via polling GraphQL.

---

## Architecture

### 1. **shopify-api.js** - API Wrapper

#### Modifications apportées:

**a) Requêtes GraphQL enrichies**
- Ajout de `quantityAvailable` dans `getProducts()`
- Ajout de `quantityAvailable` dans `getProductByHandle()`

**b) Nouvelle méthode: `getProductInventory(handle)`**
```javascript
async getProductInventory(handle) {
    // Query dédiée au refresh du stock
    // Retourne l'inventaire pour toutes les variantes d'un produit
}
```

### 2. **ui.js** - Gestionnaire UI (Page d'accueil)

#### Propriétés de la classe UIManager:
- `inventoryCache`: Map pour tracker les anciens stocks et détecter les changements
- `inventoryRefreshInterval`: ID du setInterval pour le polling

#### Nouvelles méthodes:

**startInventoryRefresh()**
- Lance le polling toutes les 30 secondes
- Log: `[STOCK] Demarrage du polling du stock (30s)`

**refreshAllInventory()**
- Actualise le stock pour tous les produits visibles
- Log: `[STOCK] Refresh du stock en cours...`

**updateProductInventory(handle)**
- Récupère le stock d'un produit spécifique
- Log les changements: `[STOCK] Produit: 10 -> 5 unites`

**updateProductCardInventory(handle, quantity)**
- Mise à jour visuelle du badge et du bouton

**refreshInventory(handle?)**
- Méthode publique pour refresh manuel

**stopInventoryRefresh()**
- Arrête le polling

#### Mise à jour de createProductCard():
- Ajoute `data-product-handle` au card pour tracking
- Crée un badge `.stock-badge` avec la classe appropriée
- Désactive le bouton si quantité = 0

### 3. **product-detail.js** - Gestionnaire Page Produit

#### Nouvelles propriétés:
- `inventoryRefreshInterval`: ID du setInterval
- `inventoryCache`: Map pour tracker les changements

#### Nouvelles méthodes:

**startInventoryRefresh()**
- Lance le polling toutes les 30 secondes dès l'affichage du produit

**refreshProductInventory()**
- Actualise le stock du produit actuellement affiché

**updateProductStockUI(variant, quantity)**
- Met à jour le badge et le bouton basé sur la quantité

**stopInventoryRefresh()**
- Arrête le polling

#### Mise à jour de renderProductInfo():
- Affiche la quantité sur le badge stock
- Lance le polling au rendu

---

## Styles CSS (components.css)

### Classe `.stock-badge`

```css
.stock-badge {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

/* Vert: En stock */
.stock-badge.in-stock {
    background-color: #d4edda;
    color: #155724;
}

/* Jaune clignotant: Derniers articles */
.stock-badge.low-stock {
    background-color: #fff3cd;
    color: #856404;
    animation: pulse-warning 2s ease-in-out infinite;
}

/* Rouge: Stock épuisé */
.stock-badge.out-of-stock {
    background-color: #f8d7da;
    color: #721c24;
}
```

### Classe `.product-button` (global.css)

Ajout de states:
- `:disabled` → grisé, cursor: not-allowed, opacity: 0.6
- `.disabled` → même style que `:disabled`

---

## Console Logs - Guide de débogage

### Au chargement de la page (accueil):
```
[STOCK] Demarrage du polling du stock (30s)
[STOCK] Refresh du stock en cours...
```

### À chaque refresh (toutes les 30s):
```
[STOCK] Refresh du stock en cours...
```

### Quand le stock change:
```
[STOCK] Produit X: 10 -> 5 unites
[STOCK] Produit Y: 15 -> 0 unites
```

### Sur la page produit:
```
[STOCK] Demarrage du polling pour: product-handle
[STOCK] Refresh du stock en cours...
[STOCK] Produit: 10 -> 5 unites
```

---

## Instructions de Test

### Test 1: Vérifier l'affichage du stock (Page d'accueil)

1. Ouvrir la page d'accueil
2. Consulter la console (F12)
3. Vérifier les logs:
   - `[STOCK] Demarrage du polling du stock (30s)`
   - Chaque badge produit affiche la quantité

4. Les badges doivent montrer:
   - "Stock épuisé" si qty = 0 (badge rouge)
   - "Derniers articles! (4)" si qty < 5 (badge jaune/orange, animation)
   - "En stock (12)" si qty > 5 (badge vert)

5. Les boutons "Ajouter au panier" doivent être:
   - Désactivés (gris) si qty = 0
   - Activés si qty > 0

### Test 2: Vérifier le polling automatique

1. Ouvrir console (F12)
2. Attendre 30 secondes
3. Vérifier que `[STOCK] Refresh du stock en cours...` s'affiche tous les 30s

### Test 3: Vérifier le changement de stock en temps réel

1. Dans un autre onglet/fenêtre, accéder à **Shopify Admin**
2. Aller dans Products → Éditer un produit
3. Modifier la quantité de stock (ex: 10 → 5)
4. Revenir au site frontend
5. Dans la console, vérifier le log:
   ```
   [STOCK] Produit Name: 10 -> 5 unites
   ```
6. Le badge doit s'actualiser visiblement

### Test 4: Vérifier la page détail produit

1. Cliquer sur un produit pour ouvrir la page détail
2. Console doit afficher:
   ```
   [STOCK] Demarrage du polling pour: product-handle
   [STOCK] Refresh du stock en cours...
   ```
3. Le badge stock doit afficher la quantité avec icône/classe correcte
4. Bouton "Ajouter au panier" doit être:
   - Activé si stock > 0
   - Désactivé (gris) si stock = 0
5. Attendre 30s → vérifier refresh automatique
6. Modifier le stock dans Shopify Admin → vérifier la mise à jour

### Test 5: Vérifier l'arrêt du polling

1. Sur page produit, ouvrir console
2. Quitter la page (clic "Retour aux produits")
3. Console doit afficher:
   ```
   [STOCK] Polling arrete pour: product-handle
   ```

---

## Fichiers modifiés

```
js/shopify-api.js
  - Ajout quantityAvailable à getProducts()
  - Ajout quantityAvailable à getProductByHandle()
  - Nouvelle méthode getProductInventory(handle)

js/ui.js
  - Classe UIManager enrichie avec:
    * inventoryCache
    * inventoryRefreshInterval
    * startInventoryRefresh()
    * refreshAllInventory()
    * updateProductInventory()
    * updateProductCardInventory()
    * refreshInventory()
    * stopInventoryRefresh()
  - createProductCard() mis à jour

js/product-detail.js
  - Classe ProductDetailManager enrichie avec:
    * inventoryRefreshInterval
    * inventoryCache
    * startInventoryRefresh()
    * stopInventoryRefresh()
    * refreshProductInventory()
    * updateProductStockUI()
  - renderProductInfo() mis à jour
  - updateAddToCartButton() amélioré

css/components.css
  - Ajout .stock-badge et variantes (in-stock, low-stock, out-of-stock)

css/global.css
  - .product-button avec states :disabled et .disabled
```

---

## Flux de données

```
Shopify GraphQL API
        ↓
shopifyAPI.getProductInventory(handle)
        ↓
UIManager.updateProductInventory()
  ou ProductDetailManager.refreshProductInventory()
        ↓
inventoryCache.set(handle, quantity)
        ↓
updateProductCardInventory() / updateProductStockUI()
        ↓
DOM updated with new badge & button state
        ↓
Console log if changed
```

---

## Performance & Optimisation

- **Polling**: 30 secondes = bon compromis entre fraîcheur et requêtes API
- **Cache**: Détecte les vrais changements et log seulement si quantité change
- **DOM**: Met à jour uniquement les cartes visibles
- **Cleanup**: Arrête le polling au changement de page

---

## Limitations & À améliorer

1. **Variantes multiples**: Code actuel utilise first: 1 variant
   - Pour support complet, itérer toutes les variantes
   
2. **Cache par produit**: Peut être enrichi avec timestamps d'expiration
   
3. **Erreur réseau**: Refresh continue même en cas d'erreur API
   - Idéal pour résilience, mais peut créer de mauvais logs
   
4. **Synchronisation cart**: Stock dans panier n'est pas vérifié
   - Ajouter check avant checkout si besoin critique

---

## Exemple de réponse GraphQL

```json
{
  "data": {
    "productByHandle": {
      "handle": "lumiere-led-neon",
      "title": "Lumière LED Neon",
      "variants": {
        "edges": [
          {
            "node": {
              "id": "gid://shopify/ProductVariant/123456",
              "quantityAvailable": 12,
              "availableForSale": true
            }
          }
        ]
      }
    }
  }
}
```

---

## Support & Debugging

Si le stock ne s'actualise pas:
1. Vérifier les logs console `[STOCK]`
2. Vérifier Network tab → requêtes GraphQL
3. Vérifier que SHOPIFY_TOKEN est configuré (ou est vide pour API publique)
4. Vérifier que quantityAvailable est dans la requête GraphQL

---

Système prêt pour production ! 🚀
