# ✅ Checklist Déploiement Complet LUMIRÉ

## Préparation Technique

### 1. Structure GitHub
- [x] `.gitignore` créé
- [x] `.vercelignore` créé
- [x] `vercel.json` configuré
- [x] `package.json` à jour
- [x] Structure projet validée

### 2. Configuration Vercel
- [x] `vercel.json` avec config statique
- [x] Headers de sécurité configurés
- [x] Redirects pour pages légales configurées
- [x] Build command: site statique (aucun build)

### 3. Documentation
- [x] `README.md` - Documentation générale ✅
- [x] `DEPLOYMENT.md` - Guide déploiement Vercel ✅
- [x] `GITHUB_SETUP.md` - Guide GitHub ✅
- [x] `PRODUCT_CHECKLIST.md` - Liste produits ✅

---

## À Faire: Ordre d'Exécution

### PHASE 1: GitHub (30 min)
**Objectif:** Avoir le code sur GitHub prêt pour Vercel

**Étapes:**
1. **Créer le repo GitHub**
   - [ ] Va sur https://github.com/new
   - [ ] Repo name: `lumire-site`
   - [ ] Public
   - [ ] Sans init README/gitignore
   - [ ] Create

2. **Initialiser Git localement**
   ```bash
   cd "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site\"
   git init
   git add .
   git commit -m "🚀 Initial commit: LUMIRÉ Shopify Headless Site"
   git remote add origin https://github.com/YOUR_USERNAME/lumire-site.git
   git branch -M main
   git push -u origin main
   ```

3. **Vérifier sur GitHub.com**
   - [ ] Tous les fichiers poussés
   - [ ] `.gitignore` présent
   - [ ] `vercel.json` présent
   - [ ] README s'affiche sur la page d'accueil du repo

**Validation:**
- [ ] Repo accessible sur GitHub
- [ ] URL: `https://github.com/YOUR_USERNAME/lumire-site`

---

### PHASE 2: Vercel (15 min)
**Objectif:** Site accessible sur Vercel (temporary URL)

**Étapes:**
1. **Créer compte Vercel (si pas encore fait)**
   - [ ] Va sur https://vercel.com
   - [ ] Sign up with GitHub
   - [ ] Autorise l'accès

2. **Importer le projet**
   - [ ] Dashboard → "New Project"
   - [ ] Importe `lumire-site`
   - [ ] Framework: "Other" (statique)
   - [ ] Deploy

3. **Vérifier le déploiement**
   - [ ] Vercel donne une URL: `https://lumire-site.vercel.app`
   - [ ] Ouvre dans le navigateur
   - [ ] Site s'affiche ✅
   - [ ] Pas d'erreurs 404 sur assets

**Validation:**
- [ ] Site fonctionne sur `https://lumire-site.vercel.app`
- [ ] Logo LUMIRÉ visible
- [ ] Section Hero s'affiche
- [ ] Aucune erreur en console (F12)

---

### PHASE 3: Domaine Personnalisé (30-60 min)

**Option A: Acheter le domaine via Vercel (Recommandé)**
- [ ] Va sur Vercel Dashboard → Settings → Domains
- [ ] Add Domain: `beautylumire.com`
- [ ] Buy domain (Vercel handles DNS)
- [ ] Attends 24-48h pour propagation

**Option B: Domaine Externe**
- [ ] Achète le domaine chez GoDaddy/Namecheap/OVH/etc.
- [ ] Vercel Dashboard → Settings → Domains
- [ ] Add: `beautylumire.com`
- [ ] Configure les DNS records fournis par Vercel dans ton registrar
- [ ] Attends 24-48h

**Validation:**
- [ ] `beautylumire.com` pointe vers Vercel
- [ ] SSL/HTTPS fonctionne (cadenas vert)
- [ ] Site accessible via `https://beautylumire.com`

---

### PHASE 4: Configuration Shopify Token (15 min)
**Objectif:** Token Storefront API prêt

**Étapes:**
1. **Générer le token dans Shopify Admin**
   - [ ] Settings → Apps and sales channels
   - [ ] App and sales channel settings
   - [ ] Développement d'applications
   - [ ] Nouvelle application: "LUMIRÉ Site Headless"
   - [ ] Configuration → Admin API scopes
   - [ ] Active: `unauthenticated_read_products`, etc.
   - [ ] Sauvegarde
   - [ ] Va dans API Credentials → Storefront API
   - [ ] Copie le token (commence par `shpat_`)

2. **Ajouter le token à Vercel** (2 options)

   **Option A: Via Dashboard**
   - [ ] Vercel → Project Settings → Environment Variables
   - [ ] Add: `SHOPIFY_TOKEN` = `shpat_xxxxx`
   - [ ] Add: `SHOPIFY_STORE` = `bys-store-2893582-948316`
   - [ ] Vercel redéploie

   **Option B: Via CLI**
   ```bash
   vercel env add SHOPIFY_TOKEN
   # Paste: shpat_xxxxx
   
   vercel env add SHOPIFY_STORE
   # Paste: bys-store-2893582-948316
   
   vercel --prod
   ```

3. **Optionnel: Mettre à jour le code**
   - [ ] Ouvre `js/ui.js`
   - [ ] Remplace le token test par le réel
   - [ ] `git add js/ui.js`
   - [ ] `git commit -m "🔑 Update Shopify token"`
   - [ ] `git push origin main`

**Validation:**
- [ ] Token configuré dans Vercel
- [ ] Site peut appeler l'API Shopify
- [ ] Pas d'erreur "Unauthorized" en console

---

### PHASE 5: Ajouter les Produits (Continu)
**Objectif:** 4 produits initiaux visibles sur le site

**Produits à ajouter:** Voir `PRODUCT_CHECKLIST.md`

**Pour chaque produit:**
1. [ ] Récolter les images
2. [ ] Aller dans Shopify Admin → Products
3. [ ] "Add Product"
4. [ ] Remplir:
   - Title
   - Description
   - Images (5+ par produit)
   - Price (CHF)
   - SKU
   - Quantity
5. [ ] "Published" ✅
6. [ ] Vérifier sur le site (1-2 min de sync Shopify)

**Produits prioritaires:**
1. LED Face Mask (CHF 89)
2. Ice Globes (CHF 34)
3. Electric Gua Sha (CHF 59)
4. Snail Mucin Serum (CHF 45)

**Timeline:**
- [ ] LED Face Mask - publié
- [ ] Ice Globes - publié
- [ ] Electric Gua Sha - publié
- [ ] Snail Mucin Serum - publié
- [ ] Tous visibles sur le site

---

## Tests de Validation

### Test 1: Accès au Site
```bash
# Test URL Vercel
curl -I https://lumire-site.vercel.app/
# Doit répondre 200 OK

# Test domaine personnalisé
curl -I https://beautylumire.com/
# Doit répondre 200 OK
```

### Test 2: Assets & CSS
- [ ] F12 → Network → aucune erreur 404
- [ ] Images se chargent
- [ ] CSS/JS se chargent
- [ ] Responsive OK (test mobile en F12)

### Test 3: Panier
- [ ] Ajouter un produit au panier
- [ ] Compteur panier se met à jour
- [ ] Panier persiste après refresh de page
- [ ] Checkout button active

### Test 4: API Shopify
- [ ] F12 → Console
- [ ] Aucune erreur "Unauthorized"
- [ ] Products se chargent depuis Shopify
- [ ] Pas de CORS errors

### Test 5: Mobile
- [ ] F12 → Responsive design
- [ ] Test iPhone 12, iPhone SE, Android
- [ ] Layout s'adapte
- [ ] Panier accessible
- [ ] Touch interactions OK

### Test 6: Performance
- [ ] Lighthouse score > 80
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 3s
- [ ] Images optimisées

---

## Monitoring Post-Déploiement

### Jour 1
- [ ] Site accessible
- [ ] Pas d'erreurs critiques
- [ ] Produits visibles
- [ ] Panier fonctionne

### Semaine 1
- [ ] Consulter Vercel Analytics
- [ ] Vérifier uptime (100% ?)
- [ ] Monitorer erreurs en console
- [ ] Test cross-browser (Chrome, Firefox, Safari, Edge)

### Mensuel
- [ ] Analyser conversion/panier
- [ ] Vérifier l'ordre des produits
- [ ] Optimiser images si lent
- [ ] Update produits si nécessaire

---

## Commandes Clés (Copie-Colle)

### GitHub - Initialisation
```bash
cd "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site\"
git init
git add .
git commit -m "🚀 Initial commit: LUMIRÉ Shopify Headless Site"
git remote add origin https://github.com/YOUR_USERNAME/lumire-site.git
git branch -M main
git push -u origin main
```

### Vercel - Déployer une mise à jour
```bash
# Depuis le dossier du projet
git add .
git commit -m "Description du changement"
git push origin main
# Vercel redéploie automatiquement en ~2-3 minutes
```

### Vercel CLI - Ajouter des variables
```bash
npm install -g vercel  # Installer si pas fait
cd "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site\"
vercel env add SHOPIFY_TOKEN
# Paste: shpat_xxxxx
vercel --prod
```

---

## Résumé Statut

| Phase | Tâche | Statut | ETA |
|-------|-------|--------|-----|
| 1 | GitHub setup | 📋 Ready | 30 min |
| 2 | Vercel import | 📋 Ready | 15 min |
| 3 | Domaine | 📋 Ready | 30-60 min + DNS |
| 4 | Token Shopify | 📋 Ready | 15 min |
| 5 | Produits | 📋 Ready (continu) | 1h per product |

**Total préparation:** ~2-3 heures (sans DNS)
**Prêt à déployer:** ✅ OUI

---

## Support & Ressources

**Documentation Interne:**
- `README.md` - Vue d'ensemble
- `DEPLOYMENT.md` - Détails Vercel
- `GITHUB_SETUP.md` - Détails GitHub
- `PRODUCT_CHECKLIST.md` - Produits

**Ressources Externes:**
- Vercel Docs: https://vercel.com/docs
- Shopify Storefront API: https://shopify.dev/api/storefront
- Git Guide: https://git-scm.com/doc

**Contact/Help:**
- Vercel Support: support@vercel.com (Pro) ou dashboard chat
- Shopify Help: https://help.shopify.com
- Git Issues: GitHub repo issues

---

## Notes Importantes

⚠️ **AVANT PRODUCTION:**
- [ ] Token Shopify JAMAIS en hard-code (utiliser env vars)
- [ ] SSL/HTTPS obligatoire
- [ ] DNS propagation peut prendre 24-48h
- [ ] Tester sur mobile/desktop
- [ ] Vérifier la console (F12) pour erreurs

🚀 **APRÈS LANCEMENT:**
- [ ] Ajouter Google Analytics
- [ ] Ajouter une newsletter (Klaviyo)
- [ ] Configurer les emails transactionnels Shopify
- [ ] Ajouter SSL/TLS certificate (Vercel auto)
- [ ] Monitorer l'uptime

---

**Checklist créée:** 2026-05-06
**Version:** 1.0
**Prêt à déployer:** ✅ YES - Il ne reste que l'exécution!
