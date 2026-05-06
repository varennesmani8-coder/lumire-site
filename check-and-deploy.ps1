# Simple script to check Git status and deploy to Vercel
$projectDir = "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"

Write-Host "======================================================================"
Write-Host "LUMIRÉ - PRE-DEPLOYMENT CHECK"
Write-Host "======================================================================"
Write-Host ""

# Navigate to project
Set-Location $projectDir

# Check Git remote
Write-Host "[1] Checking Git remote configuration..."
$remoteOutput = & git remote -v 2>&1
if ($remoteOutput -like "*origin*") {
    Write-Host "[OK] Git remote 'origin' is configured"
    Write-Host $remoteOutput
    $gitConfigured = $true
} else {
    Write-Host "[WARNING] Git remote 'origin' not found"
    Write-Host "You may need to push to GitHub first"
    $gitConfigured = $false
}

Write-Host ""
Write-Host "[2] Checking latest commit..."
$lastCommit = & git log -1 --oneline 2>&1
Write-Host $lastCommit

Write-Host ""
Write-Host "[3] Checking uncommitted changes..."
$status = & git status --porcelain 2>&1
if ($status) {
    Write-Host "[WARNING] Uncommitted changes:"
    Write-Host $status
} else {
    Write-Host "[OK] No uncommitted changes"
}

Write-Host ""
Write-Host "======================================================================"
Write-Host "VERCEL DEPLOYMENT CHECK"
Write-Host "======================================================================"
Write-Host ""

# Check if Node.js is installed
Write-Host "[1] Checking Node.js..."
try {
    $nodeVersion = & node --version 2>&1
    Write-Host "[OK] Node.js: $nodeVersion"
} catch {
    Write-Host "[ERROR] Node.js not found"
    exit 1
}

# Check if npm is installed
Write-Host "[2] Checking npm..."
try {
    $npmVersion = & npm --version 2>&1
    Write-Host "[OK] npm: $npmVersion"
} catch {
    Write-Host "[ERROR] npm not found"
    exit 1
}

# Check if Vercel CLI is installed
Write-Host "[3] Checking Vercel CLI..."
$vercelCheck = & npm list -g vercel 2>&1
if ($vercelCheck -like "*vercel@*") {
    Write-Host "[OK] Vercel CLI is installed"
    # Get version
    $vercelVersion = $vercelCheck | Select-String "vercel@" | Select-Object -First 1
    Write-Host $vercelVersion
} else {
    Write-Host "[INSTALLING] Installing Vercel CLI..."
    & npm install -g vercel
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Vercel CLI installed"
    } else {
        Write-Host "[ERROR] Failed to install Vercel CLI"
        exit 1
    }
}

Write-Host ""
Write-Host "[4] Checking required project files..."
$files = @("index.html", "package.json", "vercel.json")
$allFound = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "[OK] $file"
    } else {
        Write-Host "[ERROR] $file not found"
        $allFound = $false
    }
}

Write-Host ""
Write-Host "======================================================================"
Write-Host "READY FOR DEPLOYMENT"
Write-Host "======================================================================"
Write-Host ""
Write-Host "Deploying LUMIRÉ to Vercel production..."
Write-Host "Target URL: https://lumire-site.vercel.app"
Write-Host ""
Write-Host "Starting deployment in 3 seconds..."
Start-Sleep -Seconds 3

Write-Host ""
& vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "======================================================================"
    Write-Host "DEPLOYMENT SUCCESSFUL!"
    Write-Host "======================================================================"
    Write-Host ""
    Write-Host "Site is now live at: https://lumire-site.vercel.app"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "======================================================================"
    Write-Host "DEPLOYMENT FAILED"
    Write-Host "======================================================================"
    Write-Host "Please check the error messages above."
    Write-Host ""
}
