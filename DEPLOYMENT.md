# Guide de Déploiement LUMIRÉ sur Vercel

## Prérequis

- Compte GitHub (gratuit)
- Compte Vercel (gratuit, lié à GitHub)
- Token Shopify Storefront API (généré dans Shopify Admin)
- Domaine personnalisé: `beautylumire.com` (optionnel pour démarrer)

---

## Étape 1: Créer un Repo GitHub

### Option A: Via GitHub Web (Plus facile)

1. **Créer un repo vide**
   - Va sur https://github.com/new
   - Nom du repo: `lumire-site`
   - Description: "LUMIRÉ - Site Headless Shopify (Beauté Dropshipping)"
   - Sélectionne "Public" (pour Vercel gratuit)
   - **Ne pas initialiser** README/gitignore (on va les pusher)
   - Clique "Create repository"

2. **Ajouter les fichiers au repo**
   ```bash
   cd C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site\
   
   # Initialiser git
   git init
   git add .
   git commit -m "🚀 Initial commit: LUMIRÉ headless Shopify site"
   
   # Ajouter la remote GitHub
   git remote add origin https://github.com/YOUR_USERNAME/lumire-site.git
   git branch -M main
   git push -u origin main
   ```

### Option B: Via Git CLI (Automatisé)

```bash
# Cloner le repo créé
git clone https://github.com/YOUR_USERNAME/lumire-site.git
cd lumire-site

# Copier les fichiers
cp -r ../SOURCE_FOLDER/* .

# Pousser vers GitHub
git add .
git commit -m "🚀 Initial commit: LUMIRÉ headless Shopify site"
git push origin main
```

**Remplace `YOUR_USERNAME` par ton username GitHub réel.**

---

## Étape 2: Déployer sur Vercel

### Option A: Via Dashboard Vercel (Interface web)

1. **Connecter ton compte GitHub à Vercel**
   - Va sur https://vercel.com
   - Clique "Sign up" → Sélectionne "GitHub"
   - Autorise l'accès à tes repos

2. **Importer le projet**
   - Une fois connecté, tu vois un bouton "New Project"
   - Clique "Import Project"
   - Cherche `lumire-site`
   - Clique "Import"

3. **Configurer le projet**
   - Framework: "Other" (site statique)
   - Root Directory: `.` (défaut)
   - Build Command: Laisser vide (site statique)
   - Output Directory: Laisser vide
   - Clique "Deploy"

4. **Ajouter les variables d'environnement (optionnel)**
   - Va dans "Settings" → "Environment Variables"
   - Ajoute:
     ```
     SHOPIFY_STORE = bys-store-2893582-948316
     SHOPIFY_TOKEN = shpat_xxxxxxxxxx (ton token réel)
     ```
   - Clique "Deploy" pour redéployer

### Option B: Via CLI Vercel (Terminal)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer depuis le dossier du projet
cd C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site\
vercel

# Répondre aux questions:
# - Which scope? → Choose your GitHub username
# - Link to existing project? → No
# - What's your project's name? → lumire-site
# - In which directory is your code? → .
# - Want to modify vercel.json? → No

# Envoyer vers production
vercel --prod
```

---

## Étape 3: Configurer le Domaine `beautylumire.com`

### Option A: Domaine chez Vercel

1. **Acheter le domaine via Vercel** (si dispo)
   - Va dans Vercel Dashboard → Settings → Domains
   - Clique "Add Domain"
   - Tape `beautylumire.com`
   - Achète directement (recommandé: gestion simplifiée)

2. **Assigner au projet**
   - Le domaine s'assigne automatiquement
   - Attends 24-48h pour la propagation DNS

### Option B: Domaine Externe (Registrar externe)

1. **Ajouter le domaine à Vercel**
   - Va dans Vercel Dashboard → Settings → Domains
   - Clique "Add Domain"
   - Tape `beautylumire.com`
   - Clique "Continue"

2. **Configurer les DNS**
   - Vercel te donne les records DNS à ajouter
   - Exemple:
     ```
     A Record:  76.76.19.131
     CNAME:     cname.vercel-dns.com (optionnel)
     ```
   - Va dans ton registrar (GoDaddy, Namecheap, OVH, etc.)
   - Zone DNS → Ajoute les records
   - Attends 24-48h pour la propagation

3. **Vérifier dans Vercel**
   - Une fois DNS propagé, Vercel confirme automatiquement
   - Tu verras "Valid Configuration" en vert

### Test du domaine

```bash
# Vérifie que le domaine pointe sur Vercel
nslookup beautylumire.com

# Ou teste via curl
curl -I https://beautylumire.com
# Doit répondre avec un certificat SSL valide et code 200
```

---

## Étape 4: Configurer le Token Shopify

### 1. Générer le Token Storefront API dans Shopify Admin

1. Va dans **Shopify Admin** → **Settings (Paramètres)**
2. Clique sur **Apps and sales channels** (Apps et canaux de vente)
3. Clique sur **App and sales channel settings** (Paramètres des apps)
4. Clique sur **Développement d'applications**
5. Crée une **Nouvelle application**:
   - Nom: `LUMIRÉ Site Headless`
   - Description: "Headless API for LUMIRÉ beauty site"

6. Va dans **Configuration** → **Admin API scopes**
   - Active minimum:
     - `unauthenticated_read_product_inventory`
     - `unauthenticated_read_products`
     - `unauthenticated_write_checkouts`
   - Sauvegarde

7. Va dans **API Credentials** → **Storefront API**
   - Copie le **Storefront API access token** (commence par `shpat_`)
   - Copie le **Storefront API URL** (ton store name)

### 2. Ajouter le Token à Vercel

**Option A: Via Dashboard**
1. Va dans Vercel → Project Settings → Environment Variables
2. Ajoute:
   ```
   SHOPIFY_STORE = bys-store-2893582-948316
   SHOPIFY_TOKEN = shpat_xxxxxxxxxx
   ```
3. Clique "Add" pour chaque
4. Redéploie (Vercel → Deployments → "Redeploy")

**Option B: Via CLI Vercel**
```bash
vercel env add SHOPIFY_TOKEN
# Paste your token: shpat_xxxxxxxxxx

vercel env add SHOPIFY_STORE
# Paste: bys-store-2893582-948316

vercel --prod
```

### 3. Mettre à jour le Code

Ouvre `js/ui.js` et remplace:
```javascript
const SHOPIFY_STORE = 'bys-store-2893582-948316';
const SHOPIFY_TOKEN = 'shpat_YOUR_TEST_TOKEN'; // Old test token
```

Par:
```javascript
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'bys-store-2893582-948316';
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN || '';
```

Ou plus simplement, remplace uniquement le token:
```javascript
const SHOPIFY_TOKEN = 'shpat_YOUR_REAL_TOKEN_HERE';
```

Push la modification:
```bash
git add js/ui.js
git commit -m "🔑 Update Shopify token"
git push origin main
```

Vercel redéploiera automatiquement.

---

## Étape 5: Vérifier le Déploiement

```bash
# Teste que le site répond
curl -I https://lumire-site.vercel.app/

# Teste le domaine personnalisé
curl -I https://beautylumire.com/

# Vérifier les logs de déploiement
vercel logs https://lumire-site.vercel.app
```

### Checklist de Vérification:

- [ ] Site accessible via Vercel URL (`lumire-site.vercel.app`)
- [ ] Site accessible via domaine (`beautylumire.com`)
- [ ] SSL/HTTPS fonctionne (cadenas vert)
- [ ] Header LUMIRÉ s'affiche
- [ ] Section Hero charge
- [ ] Console du navigateur sans erreur 404
- [ ] Panier fonctionne (localStorage)
- [ ] API Shopify répond (F12 → Network → GraphQL calls)

---

## Dépannage

### ❌ "404 Not Found" sur le domaine
**Cause:** DNS pas propagé
**Solution:** Attends 24-48h et réessaie. Ou vérifie les records DNS dans ton registrar.

### ❌ "Invalid configuration" dans Vercel DNS
**Cause:** Records DNS mal ajoutés
**Solution:** Copie exactement les records que Vercel indique. Attends 15-30min.

### ❌ "API Error: Unauthorized"
**Cause:** Token Shopify invalide ou expiré
**Solution:** Génère un nouveau token dans Shopify Admin. Mets à jour dans `js/ui.js` ou env vars Vercel.

### ❌ Produits ne s'affichent pas
**Cause:** Pas de produits publiés dans Shopify
**Solution:** Va dans Shopify Admin → Products → Crée/Publie au moins 1 produit.

### ❌ Site très lent au démarrage
**Cause:** Appels API Shopify lents
**Solution:** Ajoute du caching côté client dans `js/ui.js`:
```javascript
// Cache produits 1h
const CACHE_DURATION = 60 * 60 * 1000;
```

---

## Intégrations Futures

Après déploiement, tu peux ajouter:

- **Google Analytics:** Ajoute ton ID dans `config.js`
- **Klaviyo Newsletter:** Remplace `YOUR_EMAIL_PROVIDER_API_KEY`
- **Stripe (paiements custom):** Configure dans `js/cart.js`
- **Monitoring:** Integre Sentry pour les erreurs en prod

---

## Support

**Besoin d'aide?**
- Docs Vercel: https://vercel.com/docs
- Docs Shopify API: https://shopify.dev/api/storefront
- Issues GitHub: Crée une issue dans ton repo
- Email Support: support@vercel.com (Vercel Pro) ou Shopify support

---

**Déploiement préparé le:** 2026-05-06
**Prêt à déployer:** ✅ OUI
