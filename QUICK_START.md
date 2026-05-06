# Quick Start - Système de Stock Shopify

## En 2 minutes

### Ce que vous avez obtenu:

✅ Synchronisation de stock toutes les 30 secondes
✅ Affichage quantité disponible sur chaque produit
✅ Badge "Stock épuisé" automatique
✅ Badge "Derniers articles!" (< 5 unités)
✅ Boutons grisés si rupture de stock
✅ Polling Page d'accueil + Page détail produit
✅ Console logs pour debug

---

## Vérification rapide

### 1. Page d'accueil

```
Ouvrir: index.html
Console (F12): Vérifier les logs [STOCK]
```

**Attendu:**
```
[STOCK] Demarrage du polling du stock (30s)
[STOCK] Refresh du stock en cours...
```

### 2. Page produit

```
Cliquer sur un produit
Console (F12): Vérifier les logs [STOCK]
```

**Attendu:**
```
[STOCK] Demarrage du polling pour: product-handle
[STOCK] Refresh du stock en cours...
```

### 3. Test changement de stock

```
1. Dans Shopify Admin: Éditer stock d'un produit
2. Revenir au site
3. Console: Vérifier le log de changement
```

**Attendu:**
```
[STOCK] Produit Name: 10 -> 5 unites
```

---

## Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `js/shopify-api.js` | +`quantityAvailable` dans requêtes |
| `js/ui.js` | +Méthodes polling + refresh |
| `js/product-detail.js` | +Méthodes polling + refresh |
| `css/components.css` | +Stock badges styles |
| `css/global.css` | +Button disabled states |

---

## Code clé

### Dans shopify-api.js:
```javascript
// Nouvelle méthode
async getProductInventory(handle) {
    // Retourne quantityAvailable pour un produit
}
```

### Dans ui.js:
```javascript
// Lance le polling toutes les 30s
this.startInventoryRefresh();

// Refresh manuel
uiManager.refreshInventory(handle);
```

### Dans product-detail.js:
```javascript
// Polling automatique sur page produit
this.startInventoryRefresh();

// Arrêt au changement de page
this.stopInventoryRefresh();
```

---

## Console Logs à surveiller

| Log | Signification |
|-----|--------------|
| `[STOCK] Demarrage...` | Polling a démarré |
| `[STOCK] Refresh...` | Actualisation en cours |
| `[STOCK] Produit: X -> Y` | Changement détecté |
| `[STOCK] Polling arrete` | Polling arrêté |
| `[STOCK] Erreur...` | Problème API |

---

## Badges CSS

```css
/* Vert */
.stock-badge.in-stock
→ "En stock (12)"

/* Jaune animé */
.stock-badge.low-stock
→ "Derniers articles! (3)"

/* Rouge */
.stock-badge.out-of-stock
→ "Stock épuisé"
```

---

## Boutons

```css
/* Normal */
.product-button
→ Couleur orange, clickable

/* Désactivé */
.product-button:disabled
.product-button.disabled
→ Gris, non-clickable, cursor: not-allowed
```

---

## Timing

- **Polling**: Toutes les 30 secondes
- **Premier refresh**: Immédiat au chargement
- **Détection changements**: Instantanée (comparaison cache)

---

## Utilisation en production

```javascript
// Accès global
window.shopifyAPI.getProductInventory(handle)

// Refresh manuel
window.uiManager.refreshInventory()
window.uiManager.refreshInventory(handle)

// Sur page produit
window.productDetailManager.refreshProductInventory()
```

---

## Dépannage

**Pas de logs [STOCK]?**
- Vérifier que console n'est pas filtrée
- Vérifier que index.html charge les bons scripts

**Stock ne change pas?**
- Vérifier que Shopify Admin stock est modifié
- Vérifier Network → requêtes GraphQL
- Vérifier SHOPIFY_TOKEN configuration

**Boutons non-grisés?**
- Vérifier que quantityAvailable = 0 est dans la requête
- Vérifier que CSS du bouton est chargé
- Vérifier classe `.disabled` est ajoutée

---

## Support

Consultez `INVENTORY_SYNC_SYSTEM.md` pour documentation complète
Consultez `CODE_COMPLET_STOCK.md` pour code intégral

---

## Check-list de test

- [ ] Logs [STOCK] apparaissent en console
- [ ] Stock s'affiche sur chaque produit
- [ ] Badge change couleur selon quantité
- [ ] Bouton se grise si stock = 0
- [ ] Polling s'exécute toutes les 30s
- [ ] Changement Shopify → change sur le site
- [ ] Page détail produit a aussi le polling
- [ ] Console logs changements détectés

---

✅ Système prêt à l'emploi!
