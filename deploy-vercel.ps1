# LUMIRÉ - Vercel Deployment Script
# Deploys lumire-site to Vercel production

param(
    [string]$VercelToken = "",
    [switch]$SkipNpmInstall = $false
)

$projectDir = "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"
$ErrorActionPreference = "Stop"

Write-Host "=" * 70
Write-Host "LUMIRÉ - VERCEL DEPLOYMENT"
Write-Host "=" * 70
Write-Host ""

# Change to project directory
Set-Location $projectDir
Write-Host "[INFO] Working directory: $(Get-Location)"
Write-Host ""

# Step 1: Verify Node.js and npm are installed
Write-Host "[STEP 1] Checking Node.js and npm..."
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "[SUCCESS] Node.js version: $nodeVersion"
    Write-Host "[SUCCESS] npm version: $npmVersion"
}
catch {
    Write-Host "[ERROR] Node.js or npm not found!"
    Write-Host "[INFO] Please install Node.js from https://nodejs.org/"
    exit 1
}
Write-Host ""

# Step 2: Check if Vercel CLI is installed globally
Write-Host "[STEP 2] Checking Vercel CLI..."
$vercelPath = npm list -g vercel 2>$null | Select-String "vercel@" -ErrorAction SilentlyContinue
if ($vercelPath) {
    Write-Host "[SUCCESS] Vercel CLI already installed"
    Write-Host "$vercelPath"
}
else {
    Write-Host "[INFO] Installing Vercel CLI globally..."
    npm install -g vercel
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Vercel CLI installed successfully"
    }
    else {
        Write-Host "[ERROR] Failed to install Vercel CLI"
        exit 1
    }
}
Write-Host ""

# Step 3: Verify project files
Write-Host "[STEP 3] Verifying project files..."
$requiredFiles = @("index.html", "package.json", "vercel.json")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "[SUCCESS] Found: $file"
    }
    else {
        Write-Host "[WARNING] Missing: $file"
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "[ERROR] Required files are missing: $($missingFiles -join ', ')"
    exit 1
}
Write-Host ""

# Step 4: Check Git status
Write-Host "[STEP 4] Checking Git status..."
try {
    $status = git status --porcelain
    $lastCommit = git log -1 --oneline
    Write-Host "[INFO] Latest commit: $lastCommit"

    if ($status) {
        Write-Host "[WARNING] Uncommitted changes detected:"
        Write-Host $status
    }
    else {
        Write-Host "[SUCCESS] No uncommitted changes"
    }
}
catch {
    Write-Host "[WARNING] Git not available or not in repo"
}
Write-Host ""

# Step 5: Deploy to Vercel
Write-Host "[STEP 5] Deploying to Vercel production..."
Write-Host ""

# Check if vercel.json exists and configure if needed
if (Test-Path "vercel.json") {
    Write-Host "[INFO] Using existing vercel.json configuration"
    Get-Content vercel.json | Write-Host
}
else {
    Write-Host "[WARNING] vercel.json not found"
}

Write-Host ""
Write-Host "Executing: vercel --prod"
Write-Host "This will deploy to production at https://lumire-site.vercel.app"
Write-Host ""

# Run Vercel deployment
$vercelOutput = vercel --prod 2>&1
$deploymentResult = $LASTEXITCODE

Write-Host $vercelOutput

if ($deploymentResult -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] Deployment completed successfully!"

    # Extract deployment URL from output
    $urlMatch = $vercelOutput | Select-String "https://lumire-site\.vercel\.app" | Select-Object -First 1
    if ($urlMatch) {
        $deploymentUrl = $urlMatch.Matches[0].Value
        Write-Host "[SUCCESS] Deployment URL: $deploymentUrl"
    }
}
else {
    Write-Host ""
    Write-Host "[ERROR] Deployment failed with exit code: $deploymentResult"
    exit 1
}

Write-Host ""
Write-Host "=" * 70
Write-Host "DEPLOYMENT SUMMARY"
Write-Host "=" * 70
Write-Host ""
Write-Host "Project:          LUMIRÉ"
Write-Host "Deployment Type:  Production"
Write-Host "Platform:         Vercel"
Write-Host "Status:           SUCCESSFUL"
Write-Host ""

if ($deploymentUrl) {
    Write-Host "Production URL:   $deploymentUrl"
}

Write-Host ""
Write-Host "Next Steps:"
Write-Host "1. Open the production URL in your browser to verify deployment"
Write-Host "2. Configure custom domain in Vercel dashboard (if needed)"
Write-Host "3. Monitor deployment logs in Vercel dashboard"
Write-Host ""
Write-Host "=" * 70
