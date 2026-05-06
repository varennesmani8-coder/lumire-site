# Configuration GitHub pour LUMIRÉ

## Créer le Dépôt GitHub

### Étape 1: Aller sur GitHub
1. Allez à: https://github.com/new
2. Connectez-vous avec vos identifiants

### Étape 2: Créer le Dépôt
- **Repository name**: `lumire-site`
- **Description**: LUMIRÉ - Headless e-commerce site powered by Shopify
- **Visibility**: Public
- **Initialize with README**: NON
- Cliquez: **Create repository**

### Étape 3: Pousser le Code
```bash
cd "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"
git push -u origin main
```

### Étape 4: Vérifier
- Allez à: https://github.com/YOUR_USERNAME/lumire-site
- Vérifiez tous les fichiers sont présents

## Alternative CLI
```bash
gh repo create lumire-site --public --source=. --remote=origin --push
```
