# Guide d'Installation GitHub - LUMIRÉ

## Prérequis

- Git installé (https://git-scm.com/download/win)
- Compte GitHub (gratuit sur https://github.com/signup)

---

## Étape 1: Créer le Repo GitHub

### Via l'Interface Web (Recommandé)

1. **Va sur GitHub.com**
   - URL: https://github.com/new
   - Connecte-toi si nécessaire

2. **Crée un nouveau repo**
   - Repository name: `lumire-site`
   - Description: "LUMIRÉ - Shopify Headless Site for Beauty Dropshipping"
   - Visibility: **Public** (gratuit sur Vercel)
   - ❌ NE PAS cocher "Initialize with README" (on va pusher les nôtres)
   - ❌ NE PAS ajouter .gitignore ni license (on les a déjà)
   - Clique **"Create repository"**

3. **Copie l'URL HTTPS**
   ```
   https://github.com/YOUR_USERNAME/lumire-site.git
   ```

---

## Étape 2: Configurer Git Localement

### Configuration Initiale (Une fois)

```bash
# Vérifie que Git est installé
git --version

# Configure ton identité Git
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"

# Optionnel: Configure Git pour stocker les credentials
git config --global credential.helper wincred  # Windows
# ou:
git config --global credential.helper osxkeychain  # macOS
```

---

## Étape 3: Initialiser le Repo Localement

### Option A: À partir du dossier existant

```bash
# Naviguer vers le dossier du projet
cd "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site\"

# Initialiser un repo Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "🚀 Initial commit: LUMIRÉ Shopify Headless Site

- HTML5 + vanilla JS frontend
- Shopify Storefront API integration
- Responsive design (Apple-like aesthetic)
- Cart management with localStorage
- Ready for Vercel deployment"

# Ajouter la remote GitHub (remplace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/lumire-site.git

# Renommer la branche par défaut en 'main' (si nécessaire)
git branch -M main

# Pousser le code vers GitHub
git push -u origin main
```

### Option B: Cloner d'abord (Alternative)

```bash
# Cloner le repo vide
git clone https://github.com/YOUR_USERNAME/lumire-site.git
cd lumire-site

# Copier les fichiers du projet existant
# (Via l'explorateur ou PowerShell)

# Puis:
git add .
git commit -m "🚀 Initial commit: LUMIRÉ site"
git push origin main
```

---

## Étape 4: Vérifier le Repo GitHub

Après le `git push`, va sur:
```
https://github.com/YOUR_USERNAME/lumire-site
```

Tu devrais voir:
- ✅ Tous les fichiers HTML, CSS, JS, assets
- ✅ `.gitignore` configuré
- ✅ `vercel.json` pour Vercel
- ✅ `README.md` avec instructions
- ✅ `DEPLOYMENT.md` avec guide déploiement
- ✅ `PRODUCT_CHECKLIST.md` avec produits

---

## Commandes Git Courantes

### Ajouter des changements

```bash
# Ajouter un fichier spécifique
git add nom_du_fichier.js

# Ajouter tous les fichiers modifiés
git add .

# Vérifier les changements avant de committer
git status
git diff
```

### Créer des Commits

```bash
# Commit simple
git commit -m "Description du changement"

# Commit avec description longue
git commit -m "Titre du changement" -m "Description détaillée..."

# Amender le dernier commit (avant le push)
git commit --amend
```

### Pousser et Tirer

```bash
# Pousser vers GitHub (après un commit)
git push origin main

# Récupérer les changements du serveur
git pull origin main

# Forcer un push (attention: remplace les changements distants)
git push --force origin main
```

### Créer des Branches

```bash
# Créer une branche pour développer une feature
git checkout -b feature/nouvelle-feature

# Pusher la branche
git push -u origin feature/nouvelle-feature

# Changer de branche
git checkout main

# Lister les branches
git branch -a

# Supprimer une branche locale
git branch -d feature/nouvelle-feature
```

---

## Structure du Repo Après Initialisation

```
lumire-site/
├── .git/                  # Dossier Git (créé automatiquement)
├── .gitignore            # Fichiers à ignorer
├── .vercelignore         # Fichiers ignorés par Vercel
├── vercel.json           # Config Vercel
├── package.json          # Metadata du projet
├── index.html            # Page d'accueil
├── css/
│   ├── global.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── shopify-api.js
│   ├── cart.js
│   └── ui.js
├── assets/               # Images, favicon
├── README.md             # Doc principale
├── DEPLOYMENT.md         # Guide déploiement Vercel
├── PRODUCT_CHECKLIST.md  # Checklist produits
└── GITHUB_SETUP.md       # Ce fichier
```

---

## Intégration GitHub ↔ Vercel

Une fois le repo sur GitHub:

1. **Vercel détecte automatiquement** le repo
2. **À chaque `git push`**, Vercel redéploie
3. **Plus besoin de commandes Vercel** (`vercel --prod`)
4. **Les variables d'environnement** restent configurées dans Vercel

---

## Bonnes Pratiques Git

### Conventions de Commit

```bash
# Format recommandé:
# Type: Description

# Types courants:
# 🚀 feat: Nouvelle feature
# 🐛 fix: Correction de bug
# 📚 docs: Documentation
# 🎨 style: Changements CSS/design
# ♻️ refactor: Refactorisation code
# 🧪 test: Tests
# ⚙️ chore: Maintenance

# Exemples:
git commit -m "🚀 feat: Add product filtering"
git commit -m "🐛 fix: Cart not persisting in localStorage"
git commit -m "📚 docs: Update deployment guide"
git commit -m "🎨 style: Adjust hero section padding"
```

### Ignorer les Fichiers Sensibles

Assure-toi que `.gitignore` contient:
```
config.js           # Fichier avec tokens Shopify
.env                # Variables d'environnement
.env.local
node_modules/
.vercel/
```

**Jamais de tokens Shopify dans le code poussé!**
Utilise les variables d'environnement Vercel à la place.

---

## Dépannage

### ❌ "fatal: not a git repository"
```bash
# Tu n'es pas dans le bon dossier
cd "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site\"
git init
```

### ❌ "Permission denied (publickey)"
```bash
# GitHub n'a pas les credentials
# Solution: Utilise HTTPS au lieu de SSH
git remote set-url origin https://github.com/YOUR_USERNAME/lumire-site.git
```

### ❌ "Updates were rejected because the tip of your current branch is behind"
```bash
# Il y a des changements distants
git pull origin main
# Résous les conflits si nécessaire
git push origin main
```

### ❌ "Your branch is ahead of 'origin/main' by X commits"
```bash
# Tu as des commits non-poussés
git push origin main
```

---

## Prochaines Étapes

1. ✅ **Créer le repo GitHub** (tu es ici)
2. ⬜ **Connecter à Vercel** (voir `DEPLOYMENT.md`)
3. ⬜ **Configurer le domaine** (voir `DEPLOYMENT.md`)
4. ⬜ **Ajouter les produits** (voir `PRODUCT_CHECKLIST.md`)
5. ⬜ **Configurer le token Shopify** (voir `DEPLOYMENT.md`)

---

## Ressources

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- GitHub CLI: https://cli.github.com (optionnel, mais puissant)

---

**Guide créé le:** 2026-05-06
**Version:** 1.0
**Prêt à utiliser:** ✅ YES
