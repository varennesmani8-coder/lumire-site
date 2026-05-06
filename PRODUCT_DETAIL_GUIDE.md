# Guide d'Intégration - Page Produit Détaillée LUMIRÉ

## Fichiers Créés/Modifiés

### Nouveaux fichiers

#### 1. `product-detail.html`
Page HTML complète pour l'affichage détaillé d'un produit avec:
- **Carrousel d'images** avec navigation au clavier et souris
- **Informations produit** (titre, description, prix)
- **Sélecteur de variantes** (si applicable)
- **Sélecteur de quantité** intuitif
- **Boutons d'action** (Ajouter au panier, Continuer shopping)
- **Informations de livraison** (délai, frais)
- **Section avis clients** (placeholder si aucun avis)
- **Produits similaires** (chargés dynamiquement)
- **Panier intégré** (drawer rétractable)

#### 2. `css/product-detail.css`
Feuille de styles spécifique pour la page produit avec:
- **Carrousel d'images** responsive avec thumbnails
- **Mise en page desktop/mobile** optimisée
- **Design cohérent** avec le reste du site LUMIRÉ
- **Animations fluides** (hover, transitions)
- **Support mobile** complet (breakpoints: 1024px, 768px, 480px)
- **Accessibilité** (focus states, aria-labels)

#### 3. `js/product-detail.js`
Gestionnaire JavaScript pour la page produit:

**Classe: `ProductDetailManager`**

Méthodes principales:
- `loadProductFromUrl()` - Charge les données produit depuis l'URL query parameter `?handle=`
- `renderProductDetail()` - Affiche tous les détails du produit
- `renderCarousel()` - Crée le carrousel d'images avec thumbnails
- `selectImage(index)` - Sélectionne une image
- `previousImage() / nextImage()` - Navigation du carrousel
- `renderProductInfo()` - Affiche titre, description, prix, stock
- `renderVariants()` - Affiche options de variantes si disponibles
- `updateQuantity(newValue)` - Gère le sélecteur de quantité
- `addToCart()` - Ajoute le produit au panier via CartManager
- `continueShopping()` - Retour à la page produits
- `loadSimilarProducts()` - Charge produits similaires
- `openProduct(handle)` - Navigation vers autre produit

### Fichiers Modifiés

#### `js/ui.js`
Changements:
```javascript
// Dans createProductCard():
// - Ajout de cursor: 'pointer' au card
// - Event listener sur la carte (sauf le bouton)
// - Appel à openProductDetail() au clic

// Nouvelle méthode:
openProductDetail(handle)
  // Navigue vers /product-detail.html?handle=[handle]
```

#### `index.html`
Changements:
```html
<!-- Ajout de preload pour optimisation -->
<link rel="preload" href="product-detail.html" as="document">
```

## Fonctionnalités

### 1. Carrousel d'Images
- **Navigation souris**: Flèches gauche/droite
- **Navigation clavier**: Touches Arrow Left/Right
- **Thumbnails cliquables**: Sélection directe d'image
- **Compteur**: Affiche position courante / total
- **Responsive**: Dimensions adaptées à tous les écrans

### 2. Données Produit
- **Titre & Description**: Depuis Shopify API
- **Prix**: Formaté en CHF avec 2 décimales
- **Stock**: Badge coloré (En stock / Rupture)
- **Images**: Jusqu'à 10 images par produit
- **Variantes**: Sélection si le produit a des options

### 3. Panier Intégré
- Réutilise les fonctions existantes (`window.cartManager`)
- Notifications toast lors de l'ajout
- Gestion de la quantité (min: 1, max: 999)
- Validation de disponibilité avant ajout

### 4. Produits Similaires
- Charge 4 produits similaires automatiquement
- Exclut le produit courant
- Cartes cliquables pour navigation
- Boutons "Ajouter au panier" fonctionnels

### 5. Responsive Design
| Breakpoint | Comportement |
|------------|------------|
| Desktop (> 1024px) | 2 colonnes (images + info) |
| Tablet (768px - 1024px) | 1 colonne, layout adapté |
| Mobile (< 768px) | Full-width, images stacked |
| Petit mobile (< 480px) | Images 1:1, petites police |

## Intégration avec l'API Shopify

### Points de Connexion
1. **ShopifyAPI.getProductByHandle(handle)** 
   - Requête GraphQL pour récupérer un produit
   - Retourne: id, title, description, images, variants, options

2. **ShopifyAPI.getProducts(first)**
   - Utilisé pour les produits similaires
   - Filtre et limite automatiquement

3. **CartManager.addItem(variantId, quantity)**
   - Ajoute le produit au panier
   - Gère la création du cart si nécessaire

## Utilisation

### Accès à un Produit
```
/product-detail.html?handle=mon-produit
```

### Depuis la Page Accueil
Les cartes produits sont maintenant cliquables:
```javascript
// Un clic sur la carte (sauf le bouton) ouvre la page détail
// La navigation se fait via: openProductDetail(handle)
```

### Navigation Programmatique
```javascript
window.productDetailManager.openProduct('product-handle');
// ou
window.uiManager.openProductDetail('product-handle');
```

## Points Clés d'Implémentation

### 1. Récupération du Handle
```javascript
const params = new URLSearchParams(window.location.search);
const handle = params.get('handle') || params.get('product');
```

### 2. Carrousel avec Boucle
```javascript
// Navigation circulaire
if (newIndex < 0) newIndex = images.length - 1;
if (newIndex >= images.length) newIndex = 0;
```

### 3. Gestion des Événements
- Carrousel: Flèches souris, touches clavier, clics thumbnails
- Quantité: Boutons +/-, input manuel
- Panier: Bouton ajouter, validation stock
- Cart drawer: Ouverture/fermeture, overlay

### 4. Filtrage Produits Similaires
```javascript
const similarProducts = allProducts
    .filter(edge => edge.node.handle !== this.product.handle)
    .slice(0, 4);
```

## Optimisations

### Performance
- **Lazy loading**: Images thumbnails avec `loading="lazy"`
- **Sticky positioning**: Images restent visibles au scroll
- **Preload**: Link preload sur product-detail.html

### UX
- **Notifications toast**: Feedback utilisateur immédiat
- **États de boutons**: Désactivés si rupture de stock
- **Breadcrumb**: Navigation facile
- **Retour**: Lien rapide vers les produits

## Responsive Checklist

✅ Desktop: 2 colonnes, images sticky
✅ Tablet: 1 colonne, layout vertical
✅ Mobile: Full-width, images adaptées
✅ Petit écran: Polices et espacements réduits
✅ Carrousel: Fonctionne sur tous les appareils
✅ Panier: Accessibilité totale
✅ Touches clavier: Navigation complète

## Intégration avec Index.html

Les cartes produits sur la page d'accueil sont maintenant:
1. **Visuellement interactives**: Curseur pointer au hover
2. **Cliquables**: Sauf le bouton "Ajouter au panier"
3. **Liées à la page détail**: Via paramètre `handle`
4. **Dynamiques**: Handle récupéré depuis Shopify API

```javascript
// Exemple de flux
1. Utilisateur clique sur une carte produit
2. Event listener déclenche openProductDetail(product.handle)
3. Navigation vers /product-detail.html?handle=xyz
4. ProductDetailManager charge et affiche le produit
5. Utilisateur peut ajouter au panier ou continuer shopping
```

## Support Navigateurs

- Chrome/Edge: ✅ Complet
- Firefox: ✅ Complet
- Safari: ✅ Complet (iOS 14+)
- Mobile: ✅ Touch-optimisé

## Prochaines Étapes (Optionnel)

- [ ] Intégration des vrais avis clients (API Shopify)
- [ ] Fonction "Ajouter à la wishlist"
- [ ] Avis avec photos
- [ ] Zoom sur image au hover (desktop)
- [ ] Galerie full-screen
- [ ] Partage sur réseaux sociaux

## Fichiers de Référence

- `shopify-api.js`: Requêtes GraphQL Shopify
- `cart.js`: Gestion du panier
- `css/global.css`: Variables de design (couleurs, typo, espacements)
- `css/components.css`: Composants réutilisables
- `css/responsive.css`: Media queries générales

## Dépannage

### Produit ne se charge pas
```javascript
// Vérifier l'URL: ?handle=produit-name
// Vérifier la console pour erreurs API
// S'assurer que ShopifyAPI est initialisé
```

### Images ne s'affichent pas
```javascript
// Vérifier que images.edges existe
// Vérifier les URLs des images
// Vérifier CORS si images d'une autre source
```

### Carrousel ne navigue pas
```javascript
// Vérifier que product.images.edges a du contenu
// Vérifier les event listeners
// Vérifier la console pour erreurs JavaScript
```

---

**Version**: 1.0  
**Date**: Mai 2026  
**Auteur**: Claude Code - LUMIRÉ Team
