# LUMIRÉ - Automated Deployment Script (PowerShell)
# This script handles GitHub push and Vercel deployment

param(
    [string]$GitHubToken = "",
    [string]$VercelToken = "",
    [string]$RepoName = "lumire-site"
)

# Colors for output
$colors = @{
    Success = "Green"
    Error   = "Red"
    Warning = "Yellow"
    Info    = "Cyan"
}

function Write-Status {
    param([string]$Message, [string]$Status = "Info")
    $color = $colors[$Status]
    Write-Host "[$Status] $Message" -ForegroundColor $color
}

function Test-GitInstalled {
    try {
        git --version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Confirm-Choice {
    param([string]$Message)
    $response = Read-Host "$Message (y/n)"
    return $response -eq 'y' -or $response -eq 'yes'
}

$projectDir = "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"

Write-Host "=" * 60
Write-Host "LUMIRÉ - Deployment Automation"
Write-Host "=" * 60

# Check Git
if (-not (Test-GitInstalled)) {
    Write-Status "Git not found. Please install Git from https://git-scm.com/" Error
    exit 1
}

Write-Status "Git is installed" Success

# Check if we're in the right directory
if (-not (Test-Path "$projectDir\.git")) {
    Write-Status "Not in git repository. Changing directory..." Info
    Set-Location $projectDir
}

# Show current git status
Write-Status "Current git status:" Info
git status --short

# Check if origin is already configured
$hasOrigin = git remote -v | Select-String "origin" -ErrorAction SilentlyContinue
if ($hasOrigin) {
    Write-Status "Git remote 'origin' already configured" Success
    Write-Host "$hasOrigin"

    if (Confirm-Choice "Push to existing remote?") {
        Write-Status "Pushing code to GitHub..." Info
        git push -u origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Code pushed successfully!" Success
        }
        else {
            Write-Status "Failed to push code" Error
            exit 1
        }
    }
}
else {
    # Need GitHub token to create repo
    if (-not $GitHubToken) {
        Write-Status "GitHub Personal Access Token required" Warning
        Write-Host @"

To create a GitHub repository, you need a Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click 'Generate new token'
3. Select scope: 'repo' (Full control of private repositories)
4. Copy the token

"@
        $GitHubToken = Read-Host "Enter your GitHub Personal Access Token (or press Enter to skip)" -AsSecureString
        if ($GitHubToken.Length -eq 0) {
            Write-Status "No token provided. Skipping GitHub setup." Warning
            Write-Status "You can manually push later with: git push -u origin main" Info
        }
    }

    if ($GitHubToken) {
        # Create GitHub repo (simplified - assumes GitHub username can be auto-detected)
        Write-Status "Creating GitHub repository '$RepoName'..." Info

        # Get GitHub username
        $username = Read-Host "Enter your GitHub username"

        $headers = @{
            "Authorization" = "token $GitHubToken"
            "Accept"        = "application/vnd.github.v3+json"
        }

        $body = @{
            name        = $RepoName
            description = "LUMIRÉ - Headless e-commerce site powered by Shopify"
            private     = $false
        } | ConvertTo-Json

        try {
            $response = Invoke-WebRequest -Uri "https://api.github.com/user/repos" `
                -Method Post `
                -Headers $headers `
                -Body $body `
                -ErrorAction Stop

            Write-Status "Repository created successfully!" Success

            $cloneUrl = ($response.Content | ConvertFrom-Json).clone_url
            Write-Host "Repository: $cloneUrl"

            # Add remote and push
            Write-Status "Adding git remote and pushing code..." Info
            git remote add origin $cloneUrl
            git branch -M main
            git push -u origin main

            Write-Status "Code pushed to GitHub!" Success
            Write-Host "GitHub: https://github.com/$username/$RepoName"
        }
        catch {
            $errorContent = $_.Exception.Response.Content.ReadAsStringAsync().Result
            if ($errorContent -like "*already exists*") {
                Write-Status "Repository already exists" Warning
                Write-Status "You can manually add remote: git remote add origin https://github.com/$username/$RepoName.git" Info
            }
            else {
                Write-Status "Failed to create repository: $errorContent" Error
            }
        }
    }
}

Write-Host ""
Write-Host "=" * 60
Write-Host "NEXT STEPS"
Write-Host "=" * 60

Write-Host @"
1. Install Vercel CLI:
   npm install -g vercel

   (If npm not installed, download Node.js from https://nodejs.org/)

2. Deploy to Vercel:
   cd "$projectDir"
   vercel

   Follow prompts:
   - Set up and deploy? → y
   - Framework? → Other (static)

3. Configure domain beautylumire.com in Vercel dashboard

4. Add 4 products to Shopify (see PRODUCT_CHECKLIST.md)

For detailed instructions, see: DEPLOY_VERCEL.md

Status: READY FOR VERCEL DEPLOYMENT
"@

Write-Host "=" * 60
