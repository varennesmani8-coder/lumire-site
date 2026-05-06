# LUMIRÉ - Vercel Deployment (Direct Method)

## Option 1: Deploy Without GitHub (Recommended for Quick Launch)

This method deploys directly to Vercel without needing GitHub.

### Prerequisites
- Vercel account: https://vercel.com/signup
- Vercel CLI installed (see below)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

If npm is not installed, download from: https://nodejs.org/

### Step 2: Authenticate with Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy to Vercel

Navigate to the project directory:

```bash
cd "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"
```

Deploy to Vercel:

```bash
vercel
```

Prompts:
- **Set up and deploy "lumire-site"?** → Type `y`
- **Which scope do you want to deploy to?** → Select your account
- **Link to existing project?** → Type `n` (create new)
- **What's your project's name?** → Press Enter (lumire-site)
- **In which directory is your code located?** → Press Enter (current directory)
- **Want to modify these settings before deploying?** → Type `n`

### Step 4: Configure Environment Variables (Optional)

If you want to configure environment variables in Vercel:

```bash
vercel env add SHOPIFY_STORE
# Paste: bys-store-2893582-948316
vercel env add SHOPIFY_TOKEN
# Press Enter (empty - not required)
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

This creates a production deployment at your custom domain (after DNS configuration).

### Verification

After deployment:
1. Your site is available at: `https://lumire-site.vercel.app`
2. Check the Vercel dashboard for your project URL
3. Open in browser and verify products load

---

## Option 2: Deploy via GitHub (if you have GitHub credentials)

### Step 1: Push to GitHub

If you have GitHub configured:

```bash
cd "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"
git remote add origin https://github.com/YOUR_USERNAME/lumire-site.git
git push -u origin main
```

Or use the automated script:

```bash
python3 github_push.py
```

### Step 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Select your `lumire-site` repository
5. Framework: "Other" (Static)
6. Click "Deploy"

---

## Configuring Custom Domain

After deployment, configure the domain:

### Via Vercel Dashboard

1. Go to Vercel Dashboard
2. Select "lumire-site" project
3. Settings → Domains
4. Add Domain: `beautylumire.com`

### Option A: Buy Domain via Vercel
- Click "Buy Domain"
- Complete purchase
- Vercel handles DNS automatically

### Option B: Use External Domain
1. Add domain in Vercel
2. Copy DNS records
3. Login to your domain registrar
4. Update DNS records
5. Wait 24-48 hours for propagation

### Verify Domain Configuration

After DNS propagation:
```bash
# Check DNS propagation
nslookup beautylumire.com

# Check site works at custom domain
curl https://beautylumire.com
```

---

## Adding Products to Shopify

After deployment, add the 4 required products:

### Quick Links
- Shopify Admin: https://admin.shopify.com/store/bys-store-2893582-948316
- Product Details: See PRODUCT_CHECKLIST.md

### Process
1. Log into Shopify Admin
2. Products → Add Product
3. Add each of 4 products (see PRODUCT_CHECKLIST.md):
   - LED Face Mask (CHF 89)
   - Ice Globes (CHF 34)
   - Electric Gua Sha (CHF 59)
   - Snail Mucin Serum (CHF 45)
4. For each: Add details, images, price, SKU, stock
5. Publish each product
6. Verify on deployed site

---

## Troubleshooting

### Vercel CLI Issues

```bash
# Clear npm cache if installation fails
npm cache clean --force

# Update npm/node
npm install -g npm@latest

# Check installed version
vercel --version
```

### Domain Configuration Issues

```bash
# Check DNS records
dig beautylumire.com

# Test DNS propagation
https://www.whatsmydns.net
```

### Site Not Loading

1. Clear cache: `Ctrl+Shift+Del`
2. Hard refresh: `Ctrl+Shift+R`
3. Check Vercel deployment logs in dashboard
4. Check F12 Console for errors

---

## Useful Commands

```bash
# Check Vercel status
vercel status

# View deployment logs
vercel logs

# Remove deployment
vercel remove

# List all deployments
vercel ls

# View project settings
vercel env ls
```

---

## Estimated Timeline

- CLI Installation: 2 minutes
- Vercel Login: 1 minute
- First Deploy: 3-5 minutes
- Domain Configuration: 30 minutes (+ 24-48h DNS)
- Add 4 Products: 1-2 hours

**Total: 2-3 hours + 24-48h for DNS**

---

## Success Checklist

- [ ] Vercel CLI installed
- [ ] Authenticated with Vercel
- [ ] Site deployed to vercel.app URL
- [ ] Site accessible and loading products
- [ ] Domain added to Vercel
- [ ] DNS records configured
- [ ] Domain resolves to site (after 24-48h)
- [ ] 4 products added to Shopify
- [ ] Products visible on live site
- [ ] Cart functionality verified
- [ ] Checkout flow working

---

**Start Here**: Install Vercel CLI and run `vercel deploy`
